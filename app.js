/* QiaQia 恰恰 — HSK1 + Taiwan-survival Chinese, chiikawa-style.
   All five skills: reading (cards/lessons), listening (audio quizzes, dialogues),
   speaking (mic check + shadowing), writing (stroke order), grammar (patterns + scrambles).
   Progress lives in localStorage. Content: data.js (HSK1 core) + taiwan.js (realism pack). */

"use strict";

/* ================= state ================= */
const LS_KEY = "qq_state_v1";
const DEFAULT_TRIP = "2026-08-31";

function loadState() {
  try { return Object.assign(blankState(), JSON.parse(localStorage.getItem(LS_KEY) || "{}")); }
  catch { return blankState(); }
}
function blankState() {
  return { doneLessons: {}, srs: {}, xp: 0, streak: { last: "", count: 0 }, tripDate: DEFAULT_TRIP,
           stats: { quiz: 0, correct: 0, spoken: 0, written: 0 } };
}
const S = loadState();
function save() { localStorage.setItem(LS_KEY, JSON.stringify(S)); }
function today() { return new Date().toISOString().slice(0, 10); }
function bumpStreak() {
  const t = today();
  if (S.streak.last === t) return;
  const y = new Date(Date.now() - 864e5).toISOString().slice(0, 10);
  S.streak.count = (S.streak.last === y) ? S.streak.count + 1 : 1;
  S.streak.last = t; save(); renderStreak();
}
function addXP(n) { S.xp += n; save(); }

/* ================= data ================= */
const D = window.QIAQIA_DATA || { vocab: [], phrases: [], dialogues: [], tones: [] };
const T = window.QIAQIA_TAIWAN || { grammar: [], scenarios: [], dialogues: [], culture: [] };
D.vocab.forEach((v, i) => v.id = "v" + i);

/* lesson path: vocab chunks interleaved with grammar + travel scenario packs */
const LESSONS = buildLessons();
function buildLessons() {
  const out = [];
  const chunk = 8;
  const vocabChunks = [];
  for (let i = 0; i < D.vocab.length; i += chunk) vocabChunks.push(D.vocab.slice(i, i + chunk));
  const gr = T.grammar.slice(), sc = T.scenarios.slice();
  let gi = 0, si = 0;
  vocabChunks.forEach((words, i) => {
    out.push({ id: "L-v" + i, type: "vocab", title: "Words " + (i + 1), emoji: "🌱",
               sub: words.map(w => w.hanzi).slice(0, 4).join(" ") + "…", words });
    if (i % 3 === 1 && gi < gr.length) {
      const g = gr[gi++];
      out.push({ id: "L-g" + g.id, type: "grammar", title: g.title, emoji: "🧩", sub: g.pattern, grammar: g });
    }
    if (i % 3 === 2 && si < sc.length) {
      const s = sc[si++];
      out.push({ id: "L-s" + s.id, type: "scenario", title: s.title, emoji: s.emoji, sub: "travel pack", scenario: s });
    }
  });
  while (gi < gr.length) { const g = gr[gi++]; out.push({ id: "L-g" + g.id, type: "grammar", title: g.title, emoji: "🧩", sub: g.pattern, grammar: g }); }
  while (si < sc.length) { const s = sc[si++]; out.push({ id: "L-s" + s.id, type: "scenario", title: s.title, emoji: s.emoji, sub: "travel pack", scenario: s }); }
  return out;
}
function doneCount() { return LESSONS.filter(l => S.doneLessons[l.id]).length; }
function learnedWords() {
  const ws = [];
  LESSONS.forEach(l => { if (l.type === "vocab" && S.doneLessons[l.id]) ws.push(...l.words); });
  return ws;
}
function quizPool() { const w = learnedWords(); return w.length >= 8 ? w : D.vocab.slice(0, 30); }

/* ================= tts / speech ================= */
let VOICE = null;
function pickVoice() {
  const vs = speechSynthesis.getVoices().filter(v => /^zh([-_]|$)/i.test(v.lang));
  VOICE = vs.find(v => /xiaoxiao|ting|huihui|yaoyao|google/i.test(v.name)) || vs[0] || null;
}
if ("speechSynthesis" in window) {
  pickVoice();
  speechSynthesis.onvoiceschanged = pickVoice;
}
function speak(text, rate, onend) {
  if (!("speechSynthesis" in window)) return;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "zh-CN"; if (VOICE) u.voice = VOICE;
  u.rate = rate || 0.85;
  if (onend) u.onend = onend;
  speechSynthesis.speak(u);
}
const SR = window.SpeechRecognition || window.webkitSpeechRecognition || null;

/* ================= tiny ui helpers ================= */
const view = document.getElementById("view");
function el(html) { const t = document.createElement("template"); t.innerHTML = html.trim(); return t.content.firstChild; }
function esc(s) { return String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c])); }
function toast(msg) {
  const t = document.getElementById("toast");
  t.textContent = msg; t.classList.add("show");
  clearTimeout(t._h); t._h = setTimeout(() => t.classList.remove("show"), 2200);
}
function confetti() {
  const box = document.getElementById("confetti");
  const em = ["🌸", "⭐", "💮", "✨", "🎀", "🍡"];
  for (let i = 0; i < 18; i++) {
    const c = el(`<div class="confetto">${em[i % em.length]}</div>`);
    c.style.left = Math.random() * 100 + "vw";
    c.style.animationDelay = (Math.random() * .5) + "s";
    box.appendChild(c); setTimeout(() => c.remove(), 2400);
  }
}
function shuffle(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
function sample(a, n, notIdx) { const pool = a.filter((_, i) => i !== notIdx); return shuffle(pool).slice(0, n); }

/* the trio — fan-art SVG renditions of Chiikawa, Hachiware and Usagi
   (personal, non-commercial app; characters © Nagano) */
const MASCOT_NAMES = { chiikawa: "ちいかわ Chiikawa", hachiware: "ハチワレ Hachiware", usagi: "うさぎ Usagi" };
function mascotSVG(kind, size) {
  const s = size || 96;
  const ink = "#4a3b30";
  const blush = `<circle cx="19" cy="38" r="3.6" fill="#ffc4d0" opacity=".85"/><circle cx="45" cy="38" r="3.6" fill="#ffc4d0" opacity=".85"/>`;
  let body = "";
  if (kind === "chiikawa") {
    // small white bear-hamster: round ears on a round head, wide-set dot eyes, tiny ω mouth
    body = `
      <circle cx="17" cy="14" r="6.5" fill="#fff" stroke="${ink}" stroke-width="2"/>
      <circle cx="47" cy="14" r="6.5" fill="#fff" stroke="${ink}" stroke-width="2"/>
      <circle cx="17" cy="14" r="3" fill="#ffe3ec"/><circle cx="47" cy="14" r="3" fill="#ffe3ec"/>
      <path d="M10 32 a22 21 0 1 0 44 0 a22 21 0 1 0 -44 0" fill="#fff" stroke="${ink}" stroke-width="2.4"/>
      <ellipse cx="32" cy="56" rx="12" ry="7" fill="#fff" stroke="${ink}" stroke-width="2.2"/>
      <circle cx="14" cy="50" r="4" fill="#fff" stroke="${ink}" stroke-width="2"/>
      <circle cx="50" cy="50" r="4" fill="#fff" stroke="${ink}" stroke-width="2"/>
      <circle cx="23" cy="31" r="2.5" fill="${ink}"/><circle cx="41" cy="31" r="2.5" fill="${ink}"/>
      ${blush}
      <path d="M29 38.5 q1.5 2 3 0 q1.5 2 3 0" stroke="${ink}" stroke-width="1.8" fill="none" stroke-linecap="round"/>`;
  } else if (kind === "hachiware") {
    // white cat, blue-grey cap split by a white blaze down the forehead, big happy open smile, tail
    body = `
      <path d="M46 52 q10 2 8 -8" stroke="${ink}" stroke-width="2.2" fill="none" stroke-linecap="round"/>
      <path d="M12 24 L14 7 L26 15 Z" fill="#6c92b4" stroke="${ink}" stroke-width="2" stroke-linejoin="round"/>
      <path d="M52 24 L50 7 L38 15 Z" fill="#6c92b4" stroke="${ink}" stroke-width="2" stroke-linejoin="round"/>
      <path d="M10 32 a22 21 0 1 0 44 0 a22 21 0 1 0 -44 0" fill="#fff" stroke="${ink}" stroke-width="2.4"/>
      <path d="M10.5 30 Q13 13 32 11.5 Q51 13 53.5 30 Q44 26.5 37.5 27.5 Q33.5 28 32 30.5 Q30.5 28 26.5 27.5 Q20 26.5 10.5 30 Z" fill="#6c92b4" stroke="none"/>
      <path d="M32 28 L28.8 12.2 Q32 11.6 35.2 12.2 Z" fill="#fff" stroke="none"/>
      <path d="M10 32 a22 21 0 1 0 44 0 a22 21 0 1 0 -44 0" fill="none" stroke="${ink}" stroke-width="2.4"/>
      <ellipse cx="32" cy="56" rx="12" ry="7" fill="#fff" stroke="${ink}" stroke-width="2.2"/>
      <circle cx="14" cy="50" r="4" fill="#fff" stroke="${ink}" stroke-width="2"/>
      <circle cx="50" cy="50" r="4" fill="#fff" stroke="${ink}" stroke-width="2"/>
      <circle cx="23" cy="32" r="2.5" fill="${ink}"/><circle cx="41" cy="32" r="2.5" fill="${ink}"/>
      ${blush}
      <path d="M26 38 q6 6.5 12 0 z" fill="#e0526e" stroke="${ink}" stroke-width="1.8" stroke-linejoin="round"/>`;
  } else { // usagi
    // pale-yellow rabbit: very long upright ears, round wide eyes, big open ヤハ mouth
    body = `
      <ellipse cx="23" cy="8" rx="4.6" ry="13" fill="#f6ecc0" stroke="${ink}" stroke-width="2"/>
      <ellipse cx="41" cy="8" rx="4.6" ry="13" fill="#f6ecc0" stroke="${ink}" stroke-width="2"/>
      <ellipse cx="23" cy="9" rx="2" ry="8" fill="#ffe3ec"/><ellipse cx="41" cy="9" rx="2" ry="8" fill="#ffe3ec"/>
      <path d="M10 33 a22 20 0 1 0 44 0 a22 20 0 1 0 -44 0" fill="#f6ecc0" stroke="${ink}" stroke-width="2.4"/>
      <ellipse cx="32" cy="56" rx="12" ry="7" fill="#f6ecc0" stroke="${ink}" stroke-width="2.2"/>
      <circle cx="13" cy="48" r="4" fill="#f6ecc0" stroke="${ink}" stroke-width="2"/>
      <circle cx="51" cy="48" r="4" fill="#f6ecc0" stroke="${ink}" stroke-width="2"/>
      <circle cx="23" cy="31" r="3" fill="${ink}"/><circle cx="41" cy="31" r="3" fill="${ink}"/>
      <circle cx="24" cy="30" r="1" fill="#fff"/><circle cx="42" cy="30" r="1" fill="#fff"/>
      ${blush}
      <ellipse cx="32" cy="40" rx="4.5" ry="5" fill="#e0526e" stroke="${ink}" stroke-width="1.8"/>`;
  }
  return `<svg viewBox="0 0 64 64" width="${s}" height="${s}" aria-hidden="true">${body}</svg>`;
}
document.getElementById("brandMascot").innerHTML = mascotSVG("chiikawa", 38);

/* ================= router ================= */
const tabs = document.querySelectorAll(".tab");
tabs.forEach(b => b.addEventListener("click", () => go(b.dataset.tab)));
function go(tab) {
  tabs.forEach(b => b.classList.toggle("active", b.dataset.tab === tab));
  speechSynthesis && speechSynthesis.cancel();
  ({ home: renderHome, learn: renderLearn, cards: renderCards, quiz: renderPractice,
     phrases: renderTravel, talk: renderTalk }[tab] || renderHome)();
  window.scrollTo(0, 0);
}
function renderStreak() { document.getElementById("streakN").textContent = S.streak.count; }

/* ================= home ================= */
function renderHome() {
  const days = Math.max(0, Math.ceil((new Date(S.tripDate + "T00:00") - new Date()) / 864e5));
  const learned = learnedWords().length;
  const due = dueCards().length;
  const next = LESSONS.find(l => !S.doneLessons[l.id]);
  const cast = {
    chiikawa: ["今天也加油! (jiāyóu — you got this!)", "小小的努力也是努力! tiny effort still counts!", "呜呜…学中文我们一起吧 — let's learn together!"],
    hachiware: ["太好了! ready for a tiny lesson?", "没关系, 慢慢来~ no rush, we'll get there!", "能学会的! we can totally do this!"],
    usagi: ["呀哈——!! LESSON TIME!!", "乌拉!! 台湾!! 珍珠奶茶!!", "呀哈! quiz? QUIZ!!"],
  };
  const who = shuffle(Object.keys(cast))[0];
  const lines = cast[who];
  view.innerHTML = "";
  view.append(
    el(`<div class="card pink hero">
          <div class="mascot wobble">${mascotSVG(who)}<div class="muted center" style="font-size:.68rem">${esc(MASCOT_NAMES[who])}</div></div>
          <div class="speech">${esc(lines[Math.floor(Math.random() * lines.length)])}</div>
        </div>`),
    el(`<div class="card yellow center">
          <div class="muted">✈️ Taiwan trip in</div>
          <div class="countdown-num">${days}</div>
          <div class="muted">days · <input type="date" id="tripDate" value="${esc(S.tripDate)}"></div>
        </div>`),
    el(`<div class="statrow">
          <div class="card"><div class="stat-big">${learned}<span class="muted">/${D.vocab.length || 150}</span></div><div class="muted">words</div></div>
          <div class="card"><div class="stat-big">${doneCount()}<span class="muted">/${LESSONS.length}</span></div><div class="muted">lessons</div></div>
          <div class="card"><div class="stat-big">${S.xp}</div><div class="muted">✨ xp</div></div>
        </div>`),
    el(`<div class="card">
          <h3>Today's plan 🍡</h3>
          <div class="muted" style="margin-bottom:10px">${next ? "Next lesson: <b>" + esc(next.emoji + " " + next.title) + "</b>" : "All lessons done — 哇!!"}
            ${due ? " · <b>" + due + "</b> cards to review" : ""}</div>
          <div class="cardrow" style="justify-content:flex-start">
            ${next ? `<button class="btn pink" id="goNext">Start lesson</button>` : ""}
            <button class="btn blue" id="goReview">Review cards${due ? " (" + due + ")" : ""}</button>
          </div>
        </div>`),
    el(`<div class="card mint">
          <h3>Skills 🎯</h3>
          <div class="cardrow" style="justify-content:flex-start">
            <button class="btn small ghost" data-go="quiz">⭐ Quiz</button>
            <button class="btn small ghost" data-go="listen">👂 Listening</button>
            <button class="btn small ghost" data-go="speak">🎤 Speaking</button>
            <button class="btn small ghost" data-go="write">✍️ Writing</button>
            <button class="btn small ghost" data-go="tones">🎵 Tones</button>
          </div>
        </div>`)
  );
  const progress = el(`<div class="card"><h3>HSK 1 progress 🌸</h3>
    <div class="progress-track"><div class="progress-fill" style="width:${Math.round(learned / Math.max(1, D.vocab.length) * 100)}%"></div></div>
    <div class="muted" style="margin-top:6px">${Math.round(learned / Math.max(1, D.vocab.length) * 100)}% of HSK 1 words learned</div></div>`);
  view.append(progress);
  document.getElementById("tripDate").onchange = e => { S.tripDate = e.target.value; save(); renderHome(); };
  const gn = document.getElementById("goNext"); if (gn) gn.onclick = () => runLesson(next);
  document.getElementById("goReview").onclick = () => go("cards");
  view.querySelectorAll("[data-go]").forEach(b => b.onclick = () => {
    if (b.dataset.go === "quiz") go("quiz");
    else { go("quiz"); startPractice(b.dataset.go); }
  });
}

/* ================= learn path ================= */
function renderLearn() {
  view.innerHTML = "";
  view.append(el(`<h2>Lesson path 🌱 <span class="muted">(${doneCount()}/${LESSONS.length})</span></h2>`));
  const path = el(`<div class="path"></div>`);
  const unlocked = doneCount(); // linear unlock: can open anything up to first-not-done
  LESSONS.forEach((l, i) => {
    const done = !!S.doneLessons[l.id];
    const locked = i > unlocked;
    const b = el(`<button class="lesson ${done ? "done" : ""} ${locked ? "locked" : ""}">
        <span class="lemoji">${l.emoji}</span>
        <span class="linfo"><span class="ltitle">${esc(l.title)}</span>${l.type === "grammar" ? '<span class="badge">grammar</span>' : ""}${l.type === "scenario" ? '<span class="badge">travel</span>' : ""}
        <br><span class="lsub">${esc(l.sub)}</span></span>
        <span class="lstate">${done ? "✅" : locked ? "🔒" : "🌟"}</span></button>`);
    b.onclick = () => { if (locked) { toast("finish the lessons before it first! 加油!"); return; } runLesson(l); };
    path.appendChild(b);
  });
  view.append(path);
}

function finishLesson(l, backTo) {
  if (!S.doneLessons[l.id]) {
    S.doneLessons[l.id] = today();
    if (l.type === "vocab") l.words.forEach(w => { if (!S.srs[w.id]) S.srs[w.id] = { iv: 0, due: Date.now(), reps: 0 }; });
    addXP(20);
  }
  bumpStreak(); save(); confetti(); toast("哇!! lesson done! +20 xp");
  go(backTo || "learn");
}

function runLesson(l) {
  if (l.type === "vocab") return runVocabLesson(l);
  if (l.type === "grammar") return runGrammarLesson(l);
  if (l.type === "scenario") return runScenarioLesson(l);
}

/* --- vocab lesson: teach cards, then 5-question check --- */
function runVocabLesson(l) {
  let i = 0;
  const show = () => {
    if (i >= l.words.length) return vocabCheck(l, 0, 0);
    const w = l.words[i];
    view.innerHTML = "";
    view.append(
      el(`<div class="backrow"><button class="iconbtn" id="bk">←</button><h3 style="margin:0">${l.emoji} ${esc(l.title)}</h3><span class="spacer"></span><span class="muted">${i + 1}/${l.words.length}</span></div>`),
      el(`<div class="card bigcard">
            <div class="hanzi-xl">${esc(w.hanzi)}</div>
            <div class="pinyin">${esc(w.pinyin)}</div>
            <div class="en">${esc(w.en)} <span class="muted">(${esc(w.pos)})</span></div>
            <div class="cardrow">
              <button class="iconbtn" id="sp">🔊</button>
              <button class="iconbtn" id="sl" title="slow">🐢</button>
            </div>
          </div>`),
      el(`<button class="btn big pink" id="nx">Got it! →</button>`)
    );
    document.getElementById("bk").onclick = () => go("learn");
    document.getElementById("sp").onclick = () => speak(w.hanzi);
    document.getElementById("sl").onclick = () => speak(w.hanzi, 0.5);
    document.getElementById("nx").onclick = () => { i++; show(); };
    speak(w.hanzi);
  };
  show();
}
function vocabCheck(l, qi, score) {
  const qs = Math.min(5, l.words.length);
  if (qi >= qs) {
    view.innerHTML = "";
    view.append(el(`<div class="card mint bigcard"><div class="mascot-inline">${mascotSVG("usagi", 72)}</div>
      <h3>Check done! ${score}/${qs} 🌸</h3><button class="btn big yellow" id="fin">Finish lesson ✨</button></div>`));
    document.getElementById("fin").onclick = () => finishLesson(l);
    return;
  }
  const w = shuffle(l.words)[0];
  const others = sample(D.vocab.filter(v => v.hanzi !== w.hanzi), 3);
  const opts = shuffle([w, ...others]);
  view.innerHTML = "";
  view.append(
    el(`<div class="qmeta"><span class="muted">quick check ${qi + 1}/${qs}</span><span class="muted">⭐ ${score}</span></div>`),
    el(`<div class="card bigcard"><div class="hanzi-xl">${esc(w.hanzi)}</div>
        <button class="iconbtn" id="sp" style="margin-top:8px">🔊</button></div>`)
  );
  const ch = el(`<div class="choices"></div>`);
  opts.forEach(o => {
    const b = el(`<button class="choice">${esc(o.en)}</button>`);
    b.onclick = () => {
      const right = o.hanzi === w.hanzi;
      b.classList.add(right ? "right" : "wrong");
      if (!right) [...ch.children].find(c => c.textContent === w.en)?.classList.add("right");
      setTimeout(() => vocabCheck(l, qi + 1, score + (right ? 1 : 0)), 700);
    };
    ch.appendChild(b);
  });
  view.append(ch);
  document.getElementById("sp").onclick = () => speak(w.hanzi);
  speak(w.hanzi);
}

/* --- grammar lesson: explain → examples → scrambles --- */
function runGrammarLesson(l) {
  const g = l.grammar;
  view.innerHTML = "";
  view.append(
    el(`<div class="backrow"><button class="iconbtn" id="bk">←</button><h3 style="margin:0">🧩 ${esc(g.title)}</h3></div>`),
    el(`<div class="card yellow"><h3>${esc(g.pattern)}</h3><div>${esc(g.explain)}</div></div>`)
  );
  g.examples.forEach(ex => {
    const c = el(`<div class="card phrase"><div class="ptext"><div class="hz">${esc(ex.hanzi)}</div>
      <div class="pinyin">${esc(ex.pinyin)}</div><div class="en muted">${esc(ex.en)}</div></div>
      <button class="iconbtn">🔊</button></div>`);
    c.querySelector("button").onclick = () => speak(ex.hanzi);
    view.append(c);
  });
  const start = el(`<button class="btn big pink">Try it! 🧩 →</button>`);
  start.onclick = () => grammarExercise(l, 0, 0);
  view.append(start);
  document.getElementById("bk").onclick = () => go("learn");
}
function grammarExercise(l, i, score) {
  const exs = l.grammar.exercises;
  if (i >= exs.length) {
    view.innerHTML = "";
    view.append(el(`<div class="card mint bigcard"><div class="mascot-inline">${mascotSVG("hachiware", 72)}</div>
      <h3>${score}/${exs.length} sentences built! 🎀</h3><button class="btn big yellow" id="fin">Finish lesson ✨</button></div>`));
    document.getElementById("fin").onclick = () => finishLesson(l);
    return;
  }
  const ex = exs[i];
  scrambleUI({
    title: `🧩 build the sentence (${i + 1}/${exs.length})`,
    en: ex.en, words: ex.words, answer: ex.answer,
    onDone: ok => setTimeout(() => grammarExercise(l, i + 1, score + (ok ? 1 : 0)), 900),
    onBack: () => runGrammarLesson(l),
  });
}
function scrambleUI({ title, en, words, answer, onDone, onBack }) {
  view.innerHTML = "";
  view.append(
    el(`<div class="backrow"><button class="iconbtn" id="bk">←</button><h3 style="margin:0">${esc(title)}</h3></div>`),
    el(`<div class="card blue center"><div class="en"><b>${esc(en)}</b></div><div class="muted">tap the tiles in order</div></div>`)
  );
  const strip = el(`<div class="answer-strip"></div>`);
  const tiles = el(`<div class="tiles"></div>`);
  const picked = [];
  shuffle(words.map((w, idx) => ({ w, idx }))).forEach(({ w, idx }) => {
    const t = el(`<button class="tile">${esc(w)}</button>`);
    t.onclick = () => {
      if (t.classList.contains("used")) return;
      t.classList.add("used"); picked.push({ w, t });
      const st = el(`<button class="tile">${esc(w)}</button>`);
      st.onclick = () => { st.remove(); t.classList.remove("used"); picked.splice(picked.findIndex(p => p.t === t), 1); };
      strip.appendChild(st);
      if (picked.length === words.length) {
        const got = picked.map(p => p.w).join("");
        const ok = got === answer;
        toast(ok ? "对了! correct! 🌸" : "almost! it's " + answer);
        speak(answer);
        if (ok) addXP(5);
        onDone(ok);
      }
    };
    tiles.appendChild(t);
  });
  view.append(strip, tiles);
  document.getElementById("bk").onclick = onBack;
}

/* --- scenario lesson: browse pack, mark done --- */
function runScenarioLesson(l) {
  const s = l.scenario;
  view.innerHTML = "";
  view.append(
    el(`<div class="backrow"><button class="iconbtn" id="bk">←</button><h3 style="margin:0">${s.emoji} ${esc(s.title)}</h3></div>`),
    el(`<div class="card pink">${esc(s.intro)}</div>`)
  );
  s.phrases.forEach(p => view.append(phraseCard(p)));
  const fin = el(`<button class="btn big yellow">Done — I read them all ✨</button>`);
  fin.onclick = () => finishLesson(l);
  view.append(fin);
  document.getElementById("bk").onclick = () => go("learn");
}
function phraseCard(p) {
  const c = el(`<div class="card phrase"><div class="ptext">
      <div class="hz">${esc(p.hanzi)}</div><div class="pinyin">${esc(p.pinyin)}</div>
      <div class="en muted">${esc(p.en)}</div>${p.note ? `<div class="note">💡 ${esc(p.note)}</div>` : ""}</div>
      <div style="display:flex;flex-direction:column;gap:6px">
        <button class="iconbtn sp">🔊</button><button class="iconbtn sl">🐢</button>
      </div></div>`);
  c.querySelector(".sp").onclick = () => speak(p.hanzi);
  c.querySelector(".sl").onclick = () => speak(p.hanzi, 0.5);
  return c;
}

/* ================= flashcards (SRS) ================= */
function dueCards() {
  const now = Date.now();
  return Object.entries(S.srs).filter(([, c]) => c.due <= now)
    .map(([id]) => D.vocab.find(v => v.id === id)).filter(Boolean);
}
function renderCards() {
  const due = shuffle(dueCards());
  view.innerHTML = "";
  view.append(el(`<h2>Flashcards 🎴 <span class="muted">${Object.keys(S.srs).length} in deck</span></h2>`));
  if (!Object.keys(S.srs).length) {
    view.append(el(`<div class="card center"><div class="mascot-inline">${mascotSVG("chiikawa", 72)}</div>
      <p>Finish a words lesson first — cards appear here for review!</p>
      <button class="btn pink" id="gl">Go learn 🌱</button></div>`));
    document.getElementById("gl").onclick = () => go("learn");
    return;
  }
  if (!due.length) {
    view.append(el(`<div class="card mint center"><div class="mascot-inline">${mascotSVG("usagi", 72)}</div>
      <p>All reviews done for now — 哇!! come back later 🌸</p></div>`));
    return;
  }
  flashCard(due, 0);
}
function flashCard(due, i) {
  if (i >= due.length) {
    bumpStreak(); confetti();
    view.innerHTML = "";
    view.append(el(`<div class="card mint bigcard"><div class="mascot-inline">${mascotSVG("hachiware", 72)}</div>
      <h3>Deck cleared! +${due.length * 2} xp ✨</h3></div>`));
    addXP(due.length * 2);
    return;
  }
  const w = due[i];
  let flipped = false;
  view.innerHTML = "";
  view.append(
    el(`<div class="qmeta"><span class="muted">🎴 ${i + 1}/${due.length}</span><span class="muted">tap card to flip</span></div>`)
  );
  const card = el(`<div class="card bigcard" id="fc">
      <div class="hanzi-xl">${esc(w.hanzi)}</div>
      <div id="back" style="display:none"><div class="pinyin">${esc(w.pinyin)}</div><div class="en">${esc(w.en)}</div></div>
      <div class="flip-hint">🔊 auto · tap to flip</div></div>`);
  card.onclick = () => { flipped = true; card.querySelector("#back").style.display = "block"; grades.style.display = "flex"; };
  const grades = el(`<div class="cardrow" style="display:none">
      <button class="btn pink">again 😵</button>
      <button class="btn blue">good 🙂</button>
      <button class="btn mint">easy 😎</button></div>`);
  const [ag, gd, ez] = grades.querySelectorAll("button");
  const grade = mult => {
    const c = S.srs[w.id];
    c.reps++;
    if (mult === 0) { c.iv = 0; c.due = Date.now() + 10 * 60e3; }
    else { c.iv = Math.max(1, Math.round((c.iv || 0.5) * mult * 2)); c.due = Date.now() + c.iv * 864e5; }
    save(); flashCard(due, i + 1);
  };
  ag.onclick = () => grade(0); gd.onclick = () => grade(1); ez.onclick = () => grade(1.8);
  view.append(card, grades);
  speak(w.hanzi);
}

/* ================= practice hub (quiz/listen/speak/write/tones) ================= */
function renderPractice() {
  view.innerHTML = "";
  view.append(el(`<h2>Practice ⭐</h2>`));
  const modes = [
    ["quiz", "⭐ Quiz", "hanzi → meaning & pinyin", "pink"],
    ["listen", "👂 Listening", "hear it, pick the hanzi", "blue"],
    ["speak", "🎤 Speaking", "say it, mic checks you", "mint"],
    ["write", "✍️ Writing", "stroke order practice", "yellow"],
    ["tones", "🎵 Tones", "the 4 tones + quiz", ""],
  ];
  modes.forEach(([id, title, sub, color]) => {
    const c = el(`<button class="lesson"><span class="lemoji" style="background:var(--${color || "card"},#fff)">${title.split(" ")[0]}</span>
      <span class="linfo"><span class="ltitle">${title.slice(title.indexOf(" ") + 1)}</span><br><span class="lsub">${sub}</span></span><span class="lstate">→</span></button>`);
    c.onclick = () => startPractice(id);
    view.append(c);
  });
  const st = S.stats;
  view.append(el(`<div class="card muted center">answered ${st.quiz} · ${st.quiz ? Math.round(st.correct / st.quiz * 100) : 0}% right · 🎤 ${st.spoken} spoken · ✍️ ${st.written} written</div>`));
}
function startPractice(mode) {
  ({ quiz: () => mcRound("mixed"), listen: () => mcRound("listen"), speak: speakPractice,
     write: writePractice, tones: tonesPractice }[mode])();
}

/* multiple-choice round: 8 questions, modes mixed(meaning/pinyin) or listen */
function mcRound(kind) {
  const pool = quizPool();
  const qs = shuffle(pool).slice(0, 8);
  let i = 0, score = 0;
  const ask = () => {
    if (i >= qs.length) {
      bumpStreak(); confetti(); addXP(score * 3);
      view.innerHTML = "";
      view.append(el(`<div class="card mint bigcard"><div class="mascot-inline">${mascotSVG("usagi", 72)}</div>
        <h3>${score}/${qs.length} — ${score >= 6 ? "哇!! amazing!" : "加油! keep going!"}</h3>
        <div class="cardrow"><button class="btn pink" id="ag">again</button><button class="btn ghost" id="bk">back</button></div></div>`));
      document.getElementById("ag").onclick = () => mcRound(kind);
      document.getElementById("bk").onclick = renderPractice;
      return;
    }
    const w = qs[i];
    const sub = kind === "listen" ? "listen" : (Math.random() < 0.5 ? "meaning" : "pinyin");
    const others = sample(pool.filter(v => v.hanzi !== w.hanzi), 3);
    const opts = shuffle([w, ...others]);
    view.innerHTML = "";
    view.append(el(`<div class="qmeta"><button class="iconbtn" id="bk">←</button><span class="muted">${i + 1}/${qs.length} · ⭐ ${score}</span></div>`));
    if (sub === "listen") {
      view.append(el(`<div class="card blue bigcard"><div class="muted">what do you hear?</div>
        <div class="cardrow"><button class="iconbtn" id="sp" style="width:64px;height:64px;font-size:1.6rem">🔊</button>
        <button class="iconbtn" id="sl">🐢</button></div></div>`));
      document.getElementById("sp").onclick = () => speak(w.hanzi);
      document.getElementById("sl").onclick = () => speak(w.hanzi, 0.5);
      speak(w.hanzi);
    } else {
      view.append(el(`<div class="card bigcard"><div class="hanzi-xl">${esc(w.hanzi)}</div>
        <div class="muted">${sub === "meaning" ? "what does it mean?" : "how is it read?"}</div></div>`));
    }
    const ch = el(`<div class="choices"></div>`);
    const label = o => sub === "pinyin" ? o.pinyin : sub === "listen" ? o.hanzi + "  ·  " + o.en : o.en;
    opts.forEach(o => {
      const b = el(`<button class="choice">${esc(label(o))}</button>`);
      b.onclick = () => {
        const right = o.hanzi === w.hanzi;
        S.stats.quiz++; if (right) { S.stats.correct++; score++; } save();
        b.classList.add(right ? "right" : "wrong");
        if (!right) [...ch.children].find(c => c.textContent === label(w))?.classList.add("right");
        if (sub !== "listen") speak(w.hanzi);
        setTimeout(() => { i++; ask(); }, 750);
      };
      ch.appendChild(b);
    });
    view.append(ch);
    document.getElementById("bk").onclick = renderPractice;
  };
  ask();
}

/* speaking practice: shadow + mic check */
function speakPractice() {
  const items = shuffle([...T.scenarios.flatMap(s => s.phrases), ...D.phrases]).slice(0, 10);
  if (!items.length) { toast("content still loading"); return; }
  let i = 0;
  const show = () => {
    if (i >= items.length) { bumpStreak(); confetti(); renderPractice(); return; }
    const p = items[i];
    view.innerHTML = "";
    view.append(
      el(`<div class="qmeta"><button class="iconbtn" id="bk">←</button><span class="muted">🎤 ${i + 1}/${items.length}</span></div>`),
      el(`<div class="card bigcard"><div class="hanzi-lg">${esc(p.hanzi)}</div>
          <div class="pinyin">${esc(p.pinyin)}</div><div class="en muted">${esc(p.en)}</div>
          <div class="cardrow"><button class="iconbtn" id="sp">🔊</button><button class="iconbtn" id="sl">🐢</button></div></div>`)
    );
    if (SR) {
      view.append(
        el(`<div class="card pink center"><div class="muted">listen 🐢 first, then hold nothing — just tap & speak!</div>
            <button class="mic" id="mic">🎤</button><div class="heard" id="heard"></div></div>`)
      );
      const mic = document.getElementById("mic"), heard = document.getElementById("heard");
      mic.onclick = () => {
        const r = new SR();
        r.lang = "zh-CN"; r.interimResults = false; r.maxAlternatives = 3;
        mic.classList.add("listening"); heard.textContent = "listening…";
        r.onresult = e => {
          const alts = [...e.results[0]].map(a => a.transcript.replace(/[。，？！\s]/g, ""));
          const target = p.hanzi.replace(/[。，？！\s]/g, "");
          const hit = alts.some(a => a === target || a.includes(target) || target.includes(a) && a.length >= Math.ceil(target.length * 0.6));
          heard.textContent = "heard: " + alts[0];
          S.stats.spoken++; save();
          if (hit) { addXP(4); confetti(); toast("哇!! sounded great! 🌸"); }
          else toast("close! listen 🐢 and try again~");
        };
        r.onerror = () => { heard.textContent = ""; toast("mic didn't catch that — try again"); };
        r.onend = () => mic.classList.remove("listening");
        r.start();
      };
    } else {
      view.append(el(`<div class="card yellow"><b>Shadow mode:</b> this browser has no speech recognition —
        play 🐢 slow audio and repeat out loud 3×, then move on. (Chrome has the mic check!)</div>`));
    }
    view.append(el(`<button class="btn big blue" id="nx">next →</button>`));
    document.getElementById("sp").onclick = () => speak(p.hanzi);
    document.getElementById("sl").onclick = () => speak(p.hanzi, 0.5);
    document.getElementById("nx").onclick = () => { i++; show(); };
    document.getElementById("bk").onclick = renderPractice;
    speak(p.hanzi);
  };
  show();
}

/* writing practice: stroke order via HanziWriter */
function writePractice() {
  const chars = [];
  learnedWords().concat(D.vocab.slice(0, 20)).forEach(w => [...w.hanzi].forEach(c => {
    if (/[一-鿿]/.test(c) && !chars.includes(c)) chars.push(c);
  }));
  const usable = chars.filter(c => window.QIAQIA_STROKES && window.QIAQIA_STROKES[c]);
  if (!window.HanziWriter || !usable.length) {
    view.innerHTML = "";
    view.append(el(`<div class="card yellow"><b>Writing pack missing.</b> stroke data not loaded — reload the app once online.</div>`));
    return;
  }
  let i = 0, writer = null;
  const show = () => {
    const c = usable[i % usable.length];
    const w = D.vocab.find(v => v.hanzi.includes(c));
    view.innerHTML = "";
    view.append(
      el(`<div class="qmeta"><button class="iconbtn" id="bk">←</button><span class="muted">✍️ ${esc(c)}${w ? " · " + esc(w.pinyin) + " · " + esc(w.en) : ""}</span></div>`),
      el(`<div id="hwTarget"></div>`),
      el(`<div class="cardrow">
            <button class="btn small blue" id="anim">👀 watch</button>
            <button class="btn small pink" id="quiz">✍️ trace it</button>
            <button class="btn small ghost" id="sp">🔊</button>
            <button class="btn small ghost" id="nx">next →</button>
          </div>`),
      el(`<div class="card muted center" id="wmsg">watch the strokes, then trace them yourself!</div>`)
    );
    writer = HanziWriter.create("hwTarget", c, {
      width: 236, height: 236, padding: 12, showOutline: true,
      strokeColor: "#4a3b30", outlineColor: "#eadfd2", drawingColor: "#ff9ebb", drawingWidth: 22,
      charDataLoader: (ch, done) => done(window.QIAQIA_STROKES[ch]),
    });
    document.getElementById("anim").onclick = () => writer.animateCharacter();
    document.getElementById("quiz").onclick = () => {
      document.getElementById("wmsg").textContent = "trace each stroke in order — it nudges you if you slip!";
      writer.quiz({
        onComplete: () => {
          S.stats.written++; addXP(6); save(); confetti(); toast("哇!! beautiful writing! ✍️");
        },
      });
    };
    document.getElementById("sp").onclick = () => speak(c);
    document.getElementById("nx").onclick = () => { i++; show(); };
    document.getElementById("bk").onclick = renderPractice;
  };
  show();
}

/* tones: learn + minimal-pair quiz */
function tonesPractice() {
  view.innerHTML = "";
  view.append(el(`<div class="qmeta"><button class="iconbtn" id="bk">←</button><h3 style="margin:0">🎵 The four tones</h3></div>`));
  (D.tones || []).forEach(t => {
    const c = el(`<div class="card phrase"><div class="ptext">
      <div class="hz">tone ${t.tone} <b style="font-size:1.4rem">${esc(t.mark)}</b> — <span class="muted">${esc(t.desc)}</span></div>
      <div class="pinyin">${esc(t.example.hanzi)} ${esc(t.example.pinyin)} · ${esc(t.example.en)}</div></div>
      <button class="iconbtn">🔊</button></div>`);
    c.querySelector("button").onclick = () => speak(t.example.hanzi, 0.6);
    view.append(c);
  });
  const start = el(`<button class="btn big pink">tone quiz →</button>`);
  start.onclick = () => toneQuiz(0, 0);
  view.append(start);
  document.getElementById("bk").onclick = renderPractice;
}
function toneNumOf(pinyin) {
  const map = { "āēīōūǖ": 1, "áéíóúǘ": 2, "ǎěǐǒǔǚ": 3, "àèìòùǜ": 4 };
  for (const [chars, n] of Object.entries(map)) for (const ch of chars) if (pinyin.includes(ch)) return n;
  return 5;
}
function toneQuiz(i, score) {
  const N = 8;
  if (i >= N) {
    bumpStreak(); addXP(score * 3); confetti();
    view.innerHTML = "";
    view.append(el(`<div class="card mint bigcard"><h3>${score}/${N} tones! 🎵</h3>
      <div class="cardrow"><button class="btn pink" id="ag">again</button><button class="btn ghost" id="bk">back</button></div></div>`));
    document.getElementById("ag").onclick = () => toneQuiz(0, 0);
    document.getElementById("bk").onclick = renderPractice;
    return;
  }
  const singles = D.vocab.filter(v => v.hanzi.length === 1 && toneNumOf(v.pinyin) <= 4);
  const w = shuffle(singles)[0];
  const answer = toneNumOf(w.pinyin);
  view.innerHTML = "";
  view.append(
    el(`<div class="qmeta"><button class="iconbtn" id="bk">←</button><span class="muted">🎵 ${i + 1}/${N} · ⭐ ${score}</span></div>`),
    el(`<div class="card blue bigcard"><div class="muted">which tone do you hear?</div>
        <div class="cardrow"><button class="iconbtn" id="sp" style="width:64px;height:64px;font-size:1.6rem">🔊</button></div></div>`)
  );
  const ch = el(`<div class="choices"></div>`);
  [["1  ā  high & flat", 1], ["2  á  rising", 2], ["3  ǎ  dip down-up", 3], ["4  à  falling", 4]].forEach(([txt, n]) => {
    const b = el(`<button class="choice">${txt}</button>`);
    b.onclick = () => {
      const right = n === answer;
      b.classList.add(right ? "right" : "wrong");
      if (!right) ch.children[answer - 1].classList.add("right");
      toast(right ? "对了! 🌸" : `it was ${w.hanzi} (${w.pinyin}) — tone ${answer}`);
      setTimeout(() => toneQuiz(i + 1, score + (right ? 1 : 0)), 900);
    };
    ch.appendChild(b);
  });
  view.append(ch);
  document.getElementById("sp").onclick = () => speak(w.hanzi, 0.55);
  document.getElementById("bk").onclick = renderPractice;
  speak(w.hanzi, 0.55);
}

/* ================= travel (phrasebook + culture) ================= */
function renderTravel() {
  view.innerHTML = "";
  view.append(el(`<h2>Travel survival 🧳 <span class="muted">Taiwan-real</span></h2>`));
  const groups = [];
  T.scenarios.forEach(s => groups.push({ key: s.id, label: s.emoji + " " + s.title, phrases: s.phrases, intro: s.intro }));
  const bySc = {};
  D.phrases.forEach(p => { (bySc[p.scenario] = bySc[p.scenario] || []).push(p); });
  Object.entries(bySc).forEach(([sc, ps]) => {
    if (!groups.some(g => g.label.toLowerCase().includes(sc))) groups.push({ key: "d-" + sc, label: "📖 " + sc, phrases: ps });
  });
  groups.push({ key: "culture", label: "🏮 culture tips", culture: true });
  if (!groups.length) { view.append(el(`<div class="card">content loading…</div>`)); return; }
  const chips = el(`<div class="chips"></div>`);
  const body = el(`<div></div>`);
  let active = groups[0].key;
  const renderGroup = () => {
    body.innerHTML = "";
    const g = groups.find(x => x.key === active);
    if (g.culture) {
      T.culture.forEach(t => body.append(el(`<div class="card yellow"><h3>${t.emoji} ${esc(t.title)}</h3><div>${esc(t.tip)}</div></div>`)));
      return;
    }
    if (g.intro) body.append(el(`<div class="card pink">${esc(g.intro)}</div>`));
    g.phrases.forEach(p => body.append(phraseCard(p)));
  };
  groups.forEach(g => {
    const c = el(`<button class="scChip ${g.key === active ? "active" : ""}">${esc(g.label)}</button>`);
    c.onclick = () => { active = g.key; chips.querySelectorAll(".scChip").forEach(x => x.classList.remove("active")); c.classList.add("active"); renderGroup(); };
    chips.appendChild(c);
  });
  view.append(chips, body);
  renderGroup();
}

/* ================= talk (dialogues) ================= */
function renderTalk() {
  view.innerHTML = "";
  view.append(el(`<h2>Real conversations 💬</h2>`),
    el(`<div class="muted" style="margin:0 4px 8px">the messy real thing — clerk speed and all. B is you!</div>`));
  const all = [...T.dialogues.map(d => ({ ...d, tw: true })), ...D.dialogues];
  if (!all.length) { view.append(el(`<div class="card">content loading…</div>`)); return; }
  all.forEach(d => {
    const b = el(`<button class="lesson"><span class="lemoji">${d.emoji}</span>
      <span class="linfo"><span class="ltitle">${esc(d.title)}</span>${d.tw ? '<span class="badge">🇹🇼 real</span>' : ""}
      <br><span class="lsub">${esc(d.place || d.turns.length + " lines")}</span></span><span class="lstate">→</span></button>`);
    b.onclick = () => showDialogue(d);
    view.append(b);
  });
}
function showDialogue(d) {
  let hide = null; // null | "text" (listening drill) — plus per-line reveal
  view.innerHTML = "";
  view.append(el(`<div class="backrow"><button class="iconbtn" id="bk">←</button><h3 style="margin:0">${d.emoji} ${esc(d.title)}</h3></div>`));
  if (d.place) view.append(el(`<div class="muted" style="margin:0 4px 6px">📍 ${esc(d.place)}</div>`));
  view.append(el(`<div class="togglerow">
      <button class="btn small blue" id="playAll">▶ play all</button>
      <button class="btn small yellow" id="drill">👂 listening drill</button>
    </div>`));
  const wrap = el(`<div class="bubblewrap"></div>`);
  const bubbles = d.turns.map((t, i) => {
    const b = el(`<div class="bubble ${t.who}">
        <div class="hz">${esc(t.hanzi)}</div><div class="pinyin">${esc(t.pinyin)}</div>
        <div class="en">${esc(t.en)}</div>${t.note ? `<div class="note">💡 ${esc(t.note)}</div>` : ""}</div>`);
    b.onclick = () => {
      if (b.classList.contains("hidden-text")) { b.classList.remove("hidden-text"); return; }
      speak(t.hanzi, t.who === "A" ? 0.95 : 0.75);
    };
    wrap.appendChild(b);
    return b;
  });
  view.append(wrap);
  document.getElementById("bk").onclick = renderTalk;
  document.getElementById("playAll").onclick = () => {
    let i = 0;
    const next = () => {
      bubbles.forEach(b => b.classList.remove("speaking"));
      if (i >= d.turns.length) return;
      const t = d.turns[i]; bubbles[i].classList.add("speaking");
      bubbles[i].scrollIntoView({ block: "center", behavior: "smooth" });
      speak(t.hanzi, t.who === "A" ? 0.9 : 0.75, () => { i++; setTimeout(next, 350); });
    };
    next();
  };
  document.getElementById("drill").onclick = () => {
    bubbles.forEach(b => b.classList.add("hidden-text"));
    toast("listen first — tap a bubble to reveal it 👂");
  };
}

/* ================= boot ================= */
if (!D.vocab.length) {
  view.innerHTML = "";
  view.append(el(`<div class="card yellow center"><div class="mascot-inline">${mascotSVG("chiikawa", 72)}</div>
    <h3>content pack missing!</h3><div class="muted">data.js didn't load — refresh once it's generated.</div></div>`));
} else {
  renderStreak();
  go("home");
}
if ("serviceWorker" in navigator) navigator.serviceWorker.register("sw.js").catch(() => {});
