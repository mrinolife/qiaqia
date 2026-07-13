/* QiaQia engine — Super-Chinese-style lesson sessions.
   Task types: intro, mc (meaning/pinyin/reverse/listen), pairs, tone,
   build (word-bank sentence), pintro/plisten/speak (phrases), story line-outs.
   Wrong answers requeue once; first-try accuracy → 1-3 stars.
   Plain script, shares globals with app.js (must load after it). */

/* ---------- tiny sfx (WebAudio, no assets) ---------- */
const SFX = (() => {
  let ctx = null;
  const ac = () => {
    ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
  };
  const blip = (freqs, dur, type, gain) => {
    try {
      const c = ac(), t0 = c.currentTime;
      freqs.forEach((f, i) => {
        const o = c.createOscillator(), g = c.createGain();
        o.type = type || "sine"; o.frequency.value = f;
        g.gain.setValueAtTime(0, t0 + i * dur);
        g.gain.linearRampToValueAtTime(gain || 0.12, t0 + i * dur + 0.02);
        g.gain.exponentialRampToValueAtTime(0.001, t0 + (i + 1) * dur + 0.05);
        o.connect(g); g.connect(c.destination);
        o.start(t0 + i * dur); o.stop(t0 + (i + 1) * dur + 0.1);
      });
    } catch { /* audio blocked — fine */ }
  };
  return {
    right: () => blip([660, 880], 0.09),
    wrong: () => blip([330, 262], 0.13, "triangle", 0.09),
    tap:   () => blip([520], 0.05, "sine", 0.05),
    star:  () => blip([523, 659, 784, 1047], 0.11),
    fanfare: () => blip([523, 659, 784, 659, 784, 1047], 0.12),
  };
})();

/* ---------- art helper: agent pack first, legacy fallback ---------- */
function art(kind, mood, size) {
  const s = size || 64;
  // official art (local chars/*.png) only for authenticity; motion classes carry the mood
  if (typeof LOCAL_ART !== "undefined" && LOCAL_ART[kind])
    return `<img src="${LOCAL_ART[kind]}" width="${s}" height="${s}" style="object-fit:contain" alt="">`;
  return "";
}
/* show clips: chars/anim/manifest.json maps moods -> gif files */
let QQ_ANIM = null;
fetch("chars/anim/manifest.json").then(r => r.ok ? r.json() : null).then(j => { QQ_ANIM = j; }).catch(() => {});
function animGIF(mood, h) {
  const list = QQ_ANIM && QQ_ANIM[mood];
  if (!list || !list.length) return "";
  const f = list[Math.floor(Math.random() * list.length)];
  return `<img class="animclip" src="chars/anim/${f}" style="max-height:${h || 150}px" alt="">`;
}

function deco(name, size) {
  return "";
}

/* ---------- SRS (per word id) ---------- */
const SRS_STEPS = [10 * 60e3, 16 * 3600e3, 24 * 3600e3, 2 * 86400e3, 4 * 86400e3, 8 * 86400e3, 16 * 86400e3, 32 * 86400e3];
function srsTouch(id, right) {
  S.srs = S.srs || {};
  const c = S.srs[id] || { box: 0, due: 0 };
  c.box = right ? Math.min(SRS_STEPS.length - 1, (c.box || 0) + 1) : 1;
  c.due = Date.now() + SRS_STEPS[c.box];
  S.srs[id] = c; save();
}
function srsAdd(id) {
  S.srs = S.srs || {};
  if (!S.srs[id]) { S.srs[id] = { box: 1, due: Date.now() + SRS_STEPS[1] }; save(); }
}

/* ---------- tokenizer for sentence-build (greedy longest vocab match) ---------- */
const PUNCT_RE = /[。，？！、,.?! ]/g;
function tokenize(hanzi) {
  const clean = hanzi.replace(PUNCT_RE, "");
  const dict = window.__tokDict || (window.__tokDict = (() => {
    const set = new Set();
    D.vocab.forEach(v => set.add(v.hanzi));
    return set;
  })());
  const toks = [];
  let i = 0;
  while (i < clean.length) {
    let hit = null;
    for (let len = Math.min(4, clean.length - i); len >= 2; len--) {
      const cand = clean.slice(i, i + len);
      if (dict.has(cand)) { hit = cand; break; }
    }
    if (!hit) hit = clean[i];
    toks.push(hit); i += hit.length;
  }
  return toks;
}

/* ---------- task builders ---------- */
function mcTask(w, sub, pool) { return { t: "mc", w, sub, pool }; }
function wordTasks(words, allPool) {
  // intro→check per word, then a shuffled consolidation block
  const tasks = [];
  words.forEach(w => { tasks.push({ t: "intro", w }); tasks.push(mcTask(w, "meaning", words)); });
  const block = [];
  words.forEach(w => {
    block.push(mcTask(w, "listen", allPool));
    block.push(mcTask(w, Math.random() < 0.5 ? "reverse" : "pinyin", allPool));
    if (w.hanzi.length === 1 && toneNumOf(w.pinyin) <= 4) block.push({ t: "tone", w });
  });
  tasks.push(...shuffle(block).slice(0, Math.max(6, words.length * 2)));
  tasks.push({ t: "pairs", words: words.slice(0, 5) });
  return tasks;
}
function phraseTasks(phrases) {
  const tasks = [];
  phrases.forEach(p => tasks.push({ t: "pintro", p }));
  const block = [];
  phrases.forEach(p => {
    block.push({ t: "plisten", p, pool: phrases });
    if (tokenize(p.hanzi).length >= 3) block.push({ t: "build", p });
  });
  tasks.push(...shuffle(block));
  // 2 speaking reps at the end (short ones)
  shuffle(phrases.slice()).sort((a, b) => a.hanzi.length - b.hanzi.length).slice(0, 2)
    .forEach(p => tasks.push({ t: "speak", p }));
  return tasks;
}
function examTasks(unit) {
  const words = unit.words || [];
  const phrases = unit.phrases || [];
  const qs = [];
  words.forEach(w => {
    qs.push(mcTask(w, ["meaning", "reverse", "listen", "pinyin"][Math.floor(Math.random() * 4)], words.length >= 4 ? words : D.vocab));
    if (w.hanzi.length === 1 && toneNumOf(w.pinyin) <= 4 && Math.random() < 0.3) qs.push({ t: "tone", w });
  });
  phrases.forEach(p => { if (tokenize(p.hanzi).length >= 3) qs.push({ t: "build", p }); else qs.push({ t: "plisten", p, pool: phrases }); });
  return shuffle(qs).slice(0, 12);
}

/* ---------- the session runner ---------- */
function runSession(opts) {
  // opts: { title, tasks, nodeId, kind: "lesson"|"exam"|"review", host, onDone(stars, acc), backTo }
  const Q = opts.tasks.slice();
  const total0 = Q.length;
  let done = 0, firstTryRight = 0, firstTryTotal = 0, combo = 0, bestCombo = 0;
  const requeued = new Set();
  const host = opts.host || "usagi";
  let alive = true;  // killed on quit so pending timeouts can't render into a dead screen
  speechSynthesis && speechSynthesis.cancel();

  view.innerHTML = "";
  const bar = el(`<div class="sess-top">
      <button class="iconbtn sess-quit" id="sQuit">✕</button>
      <div class="sess-bar"><div class="sess-fill" id="sFill"></div></div>
      <div class="sess-combo" id="sCombo"></div>
    </div>`);
  const body = el(`<div class="sess-body" id="sBody"></div>`);
  const foot = el(`<div class="sess-foot" id="sFoot"></div>`);
  view.append(bar, body, foot);
  bar.querySelector("#sQuit").onclick = () => {
    alive = false;
    speechSynthesis && speechSynthesis.cancel();
    (opts.backTo || renderPath)();
  };
  const setBar = () => {
    bar.querySelector("#sFill").style.width = Math.round(done / Math.max(1, total0 + (Q.length + done - total0)) * 100) + "%";
    const c = bar.querySelector("#sCombo");
    c.innerHTML = combo >= 3 ? `🔥 ${combo}` : "";
    if (combo >= 3) { c.classList.remove("pop"); void c.offsetWidth; c.classList.add("pop"); }
  };

  const feedback = (right, correctHtml, wForSrs, then) => {
    firstTryTotal++;
    const first = true;
    if (right) { combo++; bestCombo = Math.max(bestCombo, combo); firstTryRight++; addXP(combo >= 3 ? 2 : 1); SFX.right(); }
    else { combo = 0; SFX.wrong(); }
    if (wForSrs && wForSrs.id) { right ? noteRight(wForSrs.id) : noteWrong(wForSrs.id); if (opts.kind === "review") srsTouch(wForSrs.id, right); }
    S.stats.quiz++; if (right) S.stats.correct++; save();
    setBar();
    foot.innerHTML = "";
    const mood = right ? (combo >= 4 ? "cheer" : "happy") : "sad";
    const lines = right
      ? (combo >= 4 ? ["ワァ!! " + combo + " in a row!!", "太棒了!! on fire!!", "呀哈!! unstoppable!!"] : ["对了! 🌸", "太好了!", "没错!", "哇, nice!"])
      : ["呜呜… almost!", "うぅ… not quite!", "没关系, look:"];
    const f = el(`<div class="sess-react ${right ? "good" : "bad"}">
        <span class="react-mascot ${right ? "bounce" : "droop"}">${art(host, mood, 56)}</span>
        <div class="react-text"><b>${lines[Math.floor(Math.random() * lines.length)]}</b>
        ${right ? "" : `<div class="react-fix">${correctHtml}</div>`}</div>
        ${right ? "" : `<button class="btn small pink" id="sGo">continue →</button>`}</div>`);
    foot.appendChild(f);
    const safeThen = () => { if (alive) then(); };
    if (right) setTimeout(safeThen, 850);
    else f.querySelector("#sGo").onclick = safeThen;
  };

  const next = () => {
    if (!alive) return;
    foot.innerHTML = "";
    if (!Q.length) return finish();
    const task = Q.shift();
    done++;
    setBar();
    body.innerHTML = "";
    const miss = correctHtml => feedback(false, correctHtml, task.w || (task.p ? null : null), () => {
      // requeue a fresh copy once so she retries it before the end
      const key = JSON.stringify([task.t, (task.w || task.p || {}).hanzi, task.sub]);
      if (!requeued.has(key) && opts.kind !== "exam") { requeued.add(key); Q.push({ ...task, retry: true }); }
      next();
    });
    const hit = w => feedback(true, "", w, next);
    TASK_UI[task.t](task, { hit, miss, feedback, next, host });
  };

  const finish = () => {
    alive = false;
    speechSynthesis && speechSynthesis.cancel();
    const acc = firstTryTotal ? firstTryRight / firstTryTotal : 1;
    const pass = opts.kind !== "exam" || acc >= 0.6;
    const stars = !pass ? 0 : acc >= 0.9 ? 3 : acc >= 0.7 ? 2 : 1;
    if (pass) {
      bumpStreak(); confetti(); SFX.fanfare();
      addXP(opts.kind === "exam" ? 20 : 10);
      if (stars === 3) { addXP(5); awardSnack(); }
      if (opts.nodeId) {
        S.stars = S.stars || {};
        if (stars > (S.stars[opts.nodeId] || 0)) S.stars[opts.nodeId] = stars;
        save();
      }
      if (opts.onDone) opts.onDone(stars, acc);
    } else SFX.wrong();
    const mood = pass ? "cheer" : "sad";
    const msg = opts.kind === "exam"
      ? (pass ? "討伐完了!! unit cleared!! ⚔️🎀" : "the exam got away… 加油, try again!")
      : "lesson clear! ✨";
    view.innerHTML = "";
    // success clips: usual usagi/celebrate rotation carries ~70% of the weight;
    // spice in ramen/market/group scene-callbacks the other ~30% for variety
    const successMood = Math.random() < 0.3
      ? ["ramen", "market", "group"][Math.floor(Math.random() * 3)]
      : (Math.random() < 0.55 ? "usagi" : "celebrate");
    const clip = animGIF(!pass ? "cry" : successMood, 160) || animGIF(pass ? "celebrate" : "cry", 160);
    view.append(el(`<div class="sess-done">
        ${clip ? `<div class="done-clip">${clip}</div>` : ""}
        <div class="done-mascot ${pass ? "bounce" : "droop"}" ${clip ? 'style="display:none"' : ""}>${art(host, mood, 110)}</div>
        <div class="done-stars">${[1, 2, 3].map(n => `<span class="star ${n <= stars ? "on" : ""}" style="animation-delay:${n * 0.18}s">★</span>`).join("")}</div>
        <h2>${msg}</h2>
        <div class="done-statline">${Math.round(acc * 100)}% · best combo 🔥${bestCombo} · +${(pass ? (opts.kind === "exam" ? 20 : 10) : 0) + firstTryRight} ✨xp</div>
        ${pass && stars === 3 ? `<div class="done-snack">3 stars — snack time! 🍙</div>` : ""}
        <div class="cardrow" style="justify-content:center">
          ${!pass || stars < 3 ? `<button class="btn pink" id="dAgain">${pass ? "try for ★★★" : "retry"}</button>` : ""}
          <button class="btn yellow" id="dOn">${pass ? "continue →" : "back"}</button>
        </div></div>`));
    const ag = document.getElementById("dAgain");
    if (ag) ag.onclick = () => runSession(opts);
    document.getElementById("dOn").onclick = () => { speechSynthesis && speechSynthesis.cancel(); (opts.backTo || renderPath)(); };
    [1, 2, 3].forEach(n => { if (n <= stars) setTimeout(SFX.star, 300 + n * 180); });
  };

  next();
}

/* ---------- task UIs ---------- */
const TASK_UI = {

  intro(task, s) {
    const w = task.w;
    const ex = D.phrases.find(p => p.hanzi.includes(w.hanzi)) || null;
    document.getElementById("sBody").append(el(`<div class="task">
      <div class="task-ask">new word ✨</div>
      <div class="introcard wob">
        <div class="hanzi-xl tappable" id="iHz">${esc(w.hanzi)}</div>${tradChip(w.hanzi)}
        <div class="pinyin big">${esc(w.pinyin)}</div>
        <div class="en">${esc(w.en)}</div>
        <div class="cardrow" style="justify-content:center"><button class="iconbtn" id="iS">🔊</button><button class="iconbtn" id="iSl">🐢</button></div>
        ${ex ? `<div class="intro-ex">${esc(ex.hanzi)}<br><span class="muted">${esc(ex.pinyin)} · ${esc(ex.en)}</span></div>` : ""}
      </div>
      <button class="btn big yellow" id="iGo">got it! →</button></div>`));
    speak(w.hanzi);
    document.getElementById("iHz").onclick = () => speak(w.hanzi);
    document.getElementById("iS").onclick = () => speak(w.hanzi);
    document.getElementById("iSl").onclick = () => speak(w.hanzi, 0.5);
    document.getElementById("iGo").onclick = () => { SFX.tap(); srsAdd(w.id); s.next(); };
  },

  mc(task, s) {
    const w = task.w, sub = task.sub;
    const pool = (task.pool && task.pool.length >= 4 ? task.pool : D.vocab);
    const labelOf = o => sub === "pinyin" ? stripTones(o.pinyin) : (sub === "listen" || sub === "reverse") ? o.hanzi : o.en.toLowerCase();
    const others = [];
    for (const v of shuffle(pool.concat(pool.length < 6 ? D.vocab : []))) {
      if (others.length === 3) break;
      if (v.hanzi !== w.hanzi && labelOf(v) !== labelOf(w) && !others.some(o => labelOf(o) === labelOf(v))) others.push(v);
    }
    const opts = shuffle([w, ...others]);
    const ask = { meaning: "what does it mean?", pinyin: "how is it read?", reverse: "which one is “" + w.en + "”?", listen: "what do you hear? 👂" }[sub];
    const big = sub === "listen"
      ? `<div class="listenbtns"><button class="iconbtn xl" id="qS">🔊</button><button class="iconbtn" id="qSl">🐢</button></div>`
      : sub === "reverse" ? `<div class="task-en">${esc(w.en)}</div>`
      : `<div class="hanzi-xl tappable" id="qHz">${esc(w.hanzi)}</div>`;
    const label = o => sub === "pinyin" ? o.pinyin : sub === "reverse" ? o.hanzi + '<span class="ch-pin">' + esc(o.pinyin) + "</span>" : sub === "listen" ? o.hanzi + '<span class="ch-pin">' + esc(o.en) + "</span>" : o.en;
    document.getElementById("sBody").append(el(`<div class="task">
      <div class="task-ask">${ask}</div>${big}
      <div class="choices">${opts.map((o, i) => `<button class="choice ${sub === "reverse" || sub === "listen" ? "hz" : ""}" data-i="${i}">${label(o)}</button>`).join("")}</div></div>`));
    if (sub === "listen") {
      document.getElementById("qS").onclick = () => speak(w.hanzi);
      document.getElementById("qSl").onclick = () => speak(w.hanzi, 0.5);
      speak(w.hanzi);
    }
    const hz = document.getElementById("qHz");
    if (hz) hz.onclick = () => speak(w.hanzi);
    document.querySelectorAll("#sBody .choice").forEach(b => b.onclick = () => {
      const o = opts[+b.dataset.i], right = o.hanzi === w.hanzi;
      b.classList.add(right ? "right" : "wrong");
      if (!right) document.querySelectorAll("#sBody .choice")[opts.indexOf(w)].classList.add("right");
      document.querySelectorAll("#sBody .choice").forEach(x => x.disabled = true);
      if (sub !== "listen") speak(w.hanzi);
      right ? s.hit(w) : s.miss(`<b>${esc(w.hanzi)}</b> ${esc(w.pinyin)} = ${esc(w.en)}`);
    });
  },

  tone(task, s) {
    const w = task.w, answer = toneNumOf(w.pinyin);
    document.getElementById("sBody").append(el(`<div class="task">
      <div class="task-ask">which tone do you hear? 🎵</div>
      <div class="listenbtns"><button class="iconbtn xl" id="tS">🔊</button></div>
      <div class="choices">${[["1 ā high & flat", 1], ["2 á rising", 2], ["3 ǎ dip down-up", 3], ["4 à falling", 4]]
        .map(([txt, n]) => `<button class="choice" data-n="${n}">${txt}</button>`).join("")}</div></div>`));
    document.getElementById("tS").onclick = () => speak(w.hanzi, 0.55);
    speak(w.hanzi, 0.55);
    document.querySelectorAll("#sBody .choice").forEach(b => b.onclick = () => {
      const right = +b.dataset.n === answer;
      b.classList.add(right ? "right" : "wrong");
      if (!right) document.querySelector(`#sBody .choice[data-n="${answer}"]`).classList.add("right");
      document.querySelectorAll("#sBody .choice").forEach(x => x.disabled = true);
      right ? s.hit(w) : s.miss(`${esc(w.hanzi)} (${esc(w.pinyin)}) is tone <b>${answer}</b>`);
    });
  },

  pairs(task, s) {
    const words = task.words.slice(0, 5);
    const left = shuffle(words), right = shuffle(words);
    let sel = null, matched = 0, misses = 0;
    document.getElementById("sBody").append(el(`<div class="task">
      <div class="task-ask">match the pairs! 🎴</div>
      <div class="pairs">
        <div class="paircol">${left.map(w => `<button class="pairbtn hzp" data-h="${esc(w.hanzi)}">${esc(w.hanzi)}</button>`).join("")}</div>
        <div class="paircol">${right.map(w => `<button class="pairbtn" data-h="${esc(w.hanzi)}">${esc(w.en)}</button>`).join("")}</div>
      </div></div>`));
    document.querySelectorAll("#sBody .pairbtn").forEach(b => b.onclick = () => {
      if (b.classList.contains("gone")) return;
      SFX.tap();
      const isHz = b.classList.contains("hzp");
      if (isHz) speak(b.dataset.h);
      if (!sel) { sel = b; b.classList.add("sel"); return; }
      if (sel === b) { b.classList.remove("sel"); sel = null; return; }
      const sameSide = sel.classList.contains("hzp") === isHz;
      if (sameSide) { sel.classList.remove("sel"); sel = b; b.classList.add("sel"); return; }
      if (sel.dataset.h === b.dataset.h) {
        [sel, b].forEach(x => { x.classList.remove("sel"); x.classList.add("gone"); });
        matched++; SFX.right();
        if (matched === words.length) {
          misses === 0 ? s.hit(null) : s.feedback(misses <= 1, misses <= 1 ? "" : "all matched — a bit wobbly, let's see them again", null, s.next);
        }
      } else {
        misses++; SFX.wrong();
        [sel, b].forEach(x => { x.classList.add("shake"); setTimeout(() => x.classList.remove("shake", "sel"), 400); });
      }
      sel = null;
    });
  },

  pintro(task, s) {
    const p = task.p;
    document.getElementById("sBody").append(el(`<div class="task">
      <div class="task-ask">new phrase 💬</div>
      <div class="introcard wob">
        <div class="hanzi-lg tappable" id="pHz">${esc(p.hanzi)}</div>${tradChip(p.hanzi)}
        <div class="pinyin big">${esc(p.pinyin)}</div>
        <div class="en">${esc(p.en)}</div>
        ${p.note ? `<div class="note">💡 ${esc(p.note)}</div>` : ""}
        <div class="cardrow" style="justify-content:center"><button class="iconbtn" id="pS">🔊</button><button class="iconbtn" id="pSl">🐢</button></div>
      </div>
      <button class="btn big yellow" id="pGo">got it! →</button></div>`));
    speak(p.hanzi);
    document.getElementById("pHz").onclick = () => speak(p.hanzi);
    document.getElementById("pS").onclick = () => speak(p.hanzi);
    document.getElementById("pSl").onclick = () => speak(p.hanzi, 0.5);
    document.getElementById("pGo").onclick = () => { SFX.tap(); s.next(); };
  },

  plisten(task, s) {
    const p = task.p;
    const pool = (task.pool || []).filter(x => x.hanzi !== p.hanzi && x.en !== p.en);
    const others = shuffle(pool.length >= 3 ? pool : pool.concat(D.phrases.filter(x => x.hanzi !== p.hanzi))).slice(0, 3);
    const opts = shuffle([p, ...others]);
    document.getElementById("sBody").append(el(`<div class="task">
      <div class="task-ask">listen — what does it mean? 👂</div>
      <div class="listenbtns"><button class="iconbtn xl" id="plS">🔊</button><button class="iconbtn" id="plSl">🐢</button></div>
      <div class="choices">${opts.map((o, i) => `<button class="choice" data-i="${i}">${esc(o.en)}</button>`).join("")}</div></div>`));
    document.getElementById("plS").onclick = () => speak(p.hanzi);
    document.getElementById("plSl").onclick = () => speak(p.hanzi, 0.5);
    speak(p.hanzi, 0.85);
    document.querySelectorAll("#sBody .choice").forEach(b => b.onclick = () => {
      const right = opts[+b.dataset.i].hanzi === p.hanzi;
      b.classList.add(right ? "right" : "wrong");
      if (!right) document.querySelectorAll("#sBody .choice")[opts.indexOf(p)].classList.add("right");
      document.querySelectorAll("#sBody .choice").forEach(x => x.disabled = true);
      right ? s.hit(null) : s.miss(`<b>${esc(p.hanzi)}</b> = ${esc(p.en)}`);
    });
  },

  build(task, s) {
    const p = task.p;
    const toks = tokenize(p.hanzi);
    const distract = shuffle(D.vocab.filter(v => v.hanzi.length <= 2 && !toks.includes(v.hanzi))).slice(0, Math.min(3, 2 + (toks.length > 4 ? 1 : 0))).map(v => v.hanzi);
    const bank = shuffle(toks.concat(distract));
    const chosen = [];
    document.getElementById("sBody").append(el(`<div class="task">
      <div class="task-ask">build the sentence! 🧩</div>
      <div class="task-en">“${esc(p.en)}”</div>
      <div class="listenbtns"><button class="iconbtn" id="bS">🔊</button></div>
      <div class="buildline wob" id="bLine"><span class="build-hint">tap the tiles ↓</span></div>
      <div class="bank" id="bBank">${bank.map((t, i) => `<button class="tile" data-i="${i}">${esc(t)}</button>`).join("")}</div>
      <button class="btn big blue" id="bCheck" disabled>check ✓</button></div>`));
    document.getElementById("bS").onclick = () => speak(p.hanzi, 0.75);
    const line = document.getElementById("bLine"), check = document.getElementById("bCheck");
    const redraw = () => {
      line.innerHTML = chosen.length ? chosen.map((c, i) => `<button class="tile picked" data-p="${i}">${esc(c.t)}</button>`).join("") : `<span class="build-hint">tap the tiles ↓</span>`;
      check.disabled = !chosen.length;
      line.querySelectorAll(".tile").forEach(b => b.onclick = () => {
        SFX.tap();
        const c = chosen.splice(+b.dataset.p, 1)[0];
        document.querySelector(`#bBank .tile[data-i="${c.i}"]`).classList.remove("used");
        redraw();
      });
    };
    document.querySelectorAll("#bBank .tile").forEach(b => b.onclick = () => {
      if (b.classList.contains("used")) return;
      SFX.tap(); speak(bank[+b.dataset.i]);
      b.classList.add("used");
      chosen.push({ t: bank[+b.dataset.i], i: +b.dataset.i });
      redraw();
    });
    check.onclick = () => {
      const got = chosen.map(c => c.t).join("");
      const want = p.hanzi.replace(PUNCT_RE, "");
      const right = got === want;
      speak(p.hanzi, 0.8);
      right ? s.hit(null) : s.miss(`<b>${esc(p.hanzi)}</b><br>${esc(p.pinyin)}`);
    };
  },

  speak(task, s) {
    const p = task.p;
    document.getElementById("sBody").append(el(`<div class="task">
      <div class="task-ask">your turn — say it! 🎤</div>
      <div class="introcard wob">
        <div class="hanzi-lg tappable" id="skHz">${esc(p.hanzi)}</div>
        <div class="pinyin big">${esc(p.pinyin)}</div>
        <div class="en muted">${esc(p.en)}</div>
        <div class="cardrow" style="justify-content:center"><button class="iconbtn" id="skS">🔊</button><button class="iconbtn" id="skSl">🐢</button></div>
      </div>
      <div id="skZone" class="center"></div>
      <button class="btn small ghost" id="skSkip">skip this one</button></div>`));
    speak(p.hanzi, 0.8);
    document.getElementById("skHz").onclick = () => speak(p.hanzi);
    document.getElementById("skS").onclick = () => speak(p.hanzi);
    document.getElementById("skSl").onclick = () => speak(p.hanzi, 0.5);
    document.getElementById("skSkip").onclick = () => s.next();
    const zone = document.getElementById("skZone");
    if (SR && window.isSecureContext && S.speakingOn !== false) {
      zone.append(el(`<div class="miczone"><button class="mic" id="skMic">🎤</button><div class="heard" id="skHeard"></div>
        <button class="btn small ghost" id="skNoSpeak" style="margin-top:8px">🙊 not right now — skip speaking</button></div>`));
      const mic = document.getElementById("skMic"), heard = document.getElementById("skHeard");
      document.getElementById("skNoSpeak").onclick = () => { S.speakingOn = false; save(); shadowFallback(); };
      mic.onclick = async () => {
        try { const st = await navigator.mediaDevices.getUserMedia({ audio: true }); st.getTracks().forEach(t => t.stop()); }
        catch { toast("🎤 mic is blocked — tap the icon in the address bar and allow it"); return; }
        const r = new SR(); r.lang = "zh-CN"; r.maxAlternatives = 3;
        let got = false;
        mic.classList.add("listening"); heard.textContent = "listening — say it now!";
        const watchdog = setTimeout(() => {
          if (got) return;
          got = true;
          try { r.abort(); } catch {}
          mic.classList.remove("listening"); heard.textContent = "";
          toast("mic check timed out — try again, or skip this one");
        }, 8000);
        r.onresult = e => {
          if (got) return;
          got = true; clearTimeout(watchdog);
          const alts = [...e.results[0]].map(a => a.transcript.replace(PUNCT_RE, ""));
          const target = p.hanzi.replace(PUNCT_RE, "");
          const hit = alts.some(a => a === target || a.includes(target) || (target.includes(a) && a.length >= Math.ceil(target.length * 0.6)));
          heard.textContent = "heard: " + alts[0];
          S.stats.spoken++; save();
          hit ? s.hit(null) : s.feedback(false, `listen 🐢 and try once more — or skip, no pressure!`, null, () => {});
        };
        r.onerror = () => { if (got) return; got = true; clearTimeout(watchdog); heard.textContent = ""; toast("mic hiccup — 🐢 shadow it out loud and tap 'said it'"); shadowFallback(); };
        r.onend = () => { clearTimeout(watchdog); mic.classList.remove("listening"); if (!got) { got = true; toast("didn't catch that — try again or skip"); } };
        try { r.start(); } catch { toast("mic is busy — try again in a second"); }
      };
    } else shadowFallback();
    function shadowFallback() {
      if (document.getElementById("skSaid")) return;
      zone.innerHTML = "";
      zone.append(el(`<div class="miczone"><div class="muted" style="margin:6px 0">no mic check here — play 🐢, repeat out loud 2×${S.speakingOn === false ? "<br>(speaking practice is off — switch it back on any time from your profile)" : ""}</div>
        <button class="btn pink" id="skSaid">said it! 🌸</button></div>`));
      document.getElementById("skSaid").onclick = () => { S.stats.spoken++; save(); s.hit(null); };
    }
  },

  gintro(task, s) {
    const g = task.g;
    document.getElementById("sBody").append(el(`<div class="task">
      <div class="task-ask">grammar point 🧩</div>
      <div class="introcard wob" style="text-align:left">
        <h3 style="margin:0 0 4px">${esc(g.title)}</h3>
        <div class="gpattern">${esc(g.pattern)}</div>
        <div style="margin:8px 0">${esc(g.explain)}</div>
        ${g.examples.map((x, i) => `<button class="gex" data-i="${i}">
          <span class="hz">${esc(x.hanzi)}</span> <span class="pinyin">${esc(x.pinyin)}</span><br>
          <span class="muted">${esc(x.en)}</span></button>`).join("")}
      </div>
      <button class="btn big yellow" id="gGo">got it! →</button></div>`));
    document.querySelectorAll("#sBody .gex").forEach(b => b.onclick = () => speak(g.examples[+b.dataset.i].hanzi, 0.8));
    speak(g.examples[0].hanzi, 0.85);
    document.getElementById("gGo").onclick = () => { SFX.tap(); s.next(); };
  },

  gbuild(task, s) {
    const x = task.x; // {words, answer, en}
    const distract = shuffle(D.vocab.filter(v => v.hanzi.length <= 2 && !x.words.includes(v.hanzi))).slice(0, 2).map(v => v.hanzi);
    const bank = shuffle(x.words.concat(distract));
    const chosen = [];
    document.getElementById("sBody").append(el(`<div class="task">
      <div class="task-ask">${task.hint ? esc(task.hint) + " · " : ""}build it! 🧩</div>
      <div class="task-en">“${esc(x.en)}”</div>
      <div class="buildline wob" id="gLine"><span class="build-hint">tap the tiles ↓</span></div>
      <div class="bank" id="gBank">${bank.map((t, i) => `<button class="tile" data-i="${i}">${esc(t)}</button>`).join("")}</div>
      <button class="btn big blue" id="gCheck" disabled>check ✓</button></div>`));
    const line = document.getElementById("gLine"), check = document.getElementById("gCheck");
    const redraw = () => {
      line.innerHTML = chosen.length ? chosen.map((c, i) => `<button class="tile picked" data-p="${i}">${esc(c.t)}</button>`).join("") : `<span class="build-hint">tap the tiles ↓</span>`;
      check.disabled = !chosen.length;
      line.querySelectorAll(".tile").forEach(b => b.onclick = () => {
        SFX.tap();
        const c = chosen.splice(+b.dataset.p, 1)[0];
        document.querySelector(`#gBank .tile[data-i="${c.i}"]`).classList.remove("used");
        redraw();
      });
    };
    document.querySelectorAll("#gBank .tile").forEach(b => b.onclick = () => {
      if (b.classList.contains("used")) return;
      SFX.tap(); speak(bank[+b.dataset.i]);
      b.classList.add("used");
      chosen.push({ t: bank[+b.dataset.i], i: +b.dataset.i });
      redraw();
    });
    check.onclick = () => {
      const got = chosen.map(c => c.t).join("");
      const right = got === x.answer.replace(PUNCT_RE, "");
      speak(x.answer, 0.85);
      right ? s.hit(null) : s.miss(`<b>${esc(x.answer)}</b> — ${esc(x.en)}`);
    };
  },
};

/* ---------- session entry points ---------- */
function startNode(node, backTo) {
  const host = node.host || "chiikawa";
  if (node.kind === "words") {
    runSession({ title: node.title, tasks: wordTasks(node.words, node.unitWords || node.words), nodeId: node.id, kind: "lesson", host, backTo });
  } else if (node.kind === "phrases") {
    runSession({ title: node.title, tasks: phraseTasks(node.phrases), nodeId: node.id, kind: "lesson", host, backTo });
  } else if (node.kind === "story") {
    runStory(node, backTo);
  } else if (node.kind === "grammar") {
    const tasks = [];
    node.points.forEach(g => {
      tasks.push({ t: "gintro", g });
      shuffle(g.exercises || []).slice(0, 2).forEach(x => tasks.push({ t: "gbuild", x, hint: g.title }));
    });
    runSession({ title: node.title, tasks, nodeId: node.id, kind: "lesson", host, backTo });
  } else if (node.kind === "exam") {
    const tasks = node.unit.grammar
      ? shuffle(node.unit.grammar.flatMap(g => (g.exercises || []).map(x => ({ t: "gbuild", x })))).slice(0, 12)
      : examTasks(node.unit);
    runSession({ title: node.title, tasks, nodeId: node.id, kind: "exam", host, backTo });
  }
}

/* story node: guided dialogue with comprehension checks */
function runStory(node, backTo) {
  const d = node.dialogue;
  speechSynthesis && speechSynthesis.cancel();
  view.innerHTML = "";
  view.append(el(`<div class="sess-top"><button class="iconbtn sess-quit" id="stQuit">✕</button>
    <div class="story-title">${d.emoji || "📖"} ${esc(d.title)}</div></div>`));
  const wrap = el(`<div class="bubblewrap storywrap"></div>`);
  const tray = el(`<div class="chattray"></div>`);
  view.append(wrap, tray);
  let alive = true;
  document.getElementById("stQuit").onclick = () => { alive = false; speechSynthesis && speechSynthesis.cancel(); (backTo || renderPath)(); };
  let i = 0, right = 0, asked = 0;
  const step = () => {
    if (!alive) return;
    tray.innerHTML = "";
    if (i >= d.turns.length) return finish();
    const t = d.turns[i++];
    const b = el(`<div class="bubble ${t.who} popin"><div class="hz">${esc(t.hanzi)}</div>
      <div class="pinyin">${esc(t.pinyin)}</div><div class="en">${esc(t.en)}</div></div>`);
    b.onclick = () => speak(t.hanzi, 0.85);
    wrap.appendChild(b);
    b.scrollIntoView({ block: "end", behavior: "smooth" });
    speak(t.hanzi, 0.85, () => {});
    // every ~3rd line, quick comprehension tap
    if (i % 3 === 0 && i < d.turns.length) {
      asked++;
      const opts = shuffle([t, ...shuffle(d.turns.filter(x => x.en !== t.en)).slice(0, 2)]);
      tray.append(el(`<div class="task-ask" style="margin-bottom:4px">what did that mean? 👀</div>`));
      opts.forEach(o => {
        const c = el(`<button class="choice">${esc(o.en)}</button>`);
        c.onclick = () => {
          tray.querySelectorAll(".choice").forEach(x => x.disabled = true);
          const ok = o.en === t.en;
          c.classList.add(ok ? "right" : "wrong");
          if (ok) { right++; SFX.right(); } else SFX.wrong();
          setTimeout(step, ok ? 500 : 1100);
        };
        tray.appendChild(c);
      });
    } else {
      const nx = el(`<button class="btn small blue" style="margin:4px auto;display:block">next →</button>`);
      nx.onclick = step;
      tray.appendChild(nx);
    }
  };
  const finish = () => {
    if (!alive) return;
    alive = false;
    const acc = asked ? right / asked : 1;
    const stars = acc >= 0.9 ? 3 : acc >= 0.6 ? 2 : 1;
    S.stars = S.stars || {};
    if (stars > (S.stars[node.id] || 0)) S.stars[node.id] = stars;
    addXP(10); bumpStreak(); save(); confetti(); SFX.fanfare();
    tray.innerHTML = "";
    const sclip = animGIF("cheer", 130) || animGIF("celebrate", 130);
    tray.append(el(`<div class="sess-done" style="padding:12px">
      ${sclip ? `<div class="done-clip">${sclip}</div>` : `<div class="done-mascot bounce">${art(node.host || "hachiware", "cheer", 90)}</div>`}
      <div class="done-stars">${[1, 2, 3].map(n => `<span class="star ${n <= stars ? "on" : ""}">★</span>`).join("")}</div>
      <h3>story done! 📖✨</h3>
      <button class="btn yellow" id="stOn">continue →</button></div>`));
    document.getElementById("stOn").onclick = () => { speechSynthesis && speechSynthesis.cancel(); (backTo || renderPath)(); };
  };
  step();
}

/* review session from due SRS words */
function startReview(backTo) {
  const due = shuffle(dueCards()).slice(0, 15);
  if (!due.length) { toast("nothing due — go learn something new! 🌱"); return; }
  const tasks = [];
  due.forEach(w => {
    tasks.push(mcTask(w, ["meaning", "listen", "reverse", "pinyin"][Math.floor(Math.random() * 4)], due.length >= 4 ? due : D.vocab));
  });
  for (let i = 0; i + 4 <= due.length && tasks.length < 22; i += 4) tasks.push({ t: "pairs", words: due.slice(i, i + 4) });
  runSession({ title: "review", tasks: shuffle(tasks), kind: "review", host: "usagi", backTo: backTo || renderReview });
}
