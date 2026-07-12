/* QiaQia path — Super-Chinese-style unit/lesson map over the HSK1 + Taiwan content.
   Loads last; owns boot. Plain script, shares globals with app.js/engine.js. */

/* ---------- build units ---------- */
function chunkBalanced(arr, max) {
  const k = Math.max(1, Math.ceil(arr.length / max));
  const size = Math.ceil(arr.length / k), out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}
const UNITS = (() => {
  const byCat = {};
  D.vocab.forEach(v => (byCat[v.cat] = byCat[v.cat] || []).push(v));
  const phr = sc => D.phrases.filter(p => p.scenario === sc);
  const dlg = title => D.dialogues.find(d => d.title.toLowerCase().includes(title));
  const spec = [
    { id: "u1",  title: "打招呼 Greetings",   emoji: "👋", host: "chiikawa",  cats: ["greetings"], scen: ["greetings"] },
    { id: "u2",  title: "数字 Numbers",       emoji: "🔢", host: "hachiware", cats: ["numbers"],   scen: ["money"] },
    { id: "u3",  title: "你和我 People",      emoji: "👪", host: "usagi",     cats: ["people"],    scen: ["smalltalk"], dlg: dlg("introduc") || dlg("meeting") },
    { id: "u4",  title: "问问题 Questions",   emoji: "❓", host: "momonga",   cats: ["question"] },
    { id: "u5",  title: "时间 Time",          emoji: "🕐", host: "kani",      cats: ["time"] },
    { id: "u6",  title: "吃和喝 Food & Drink", emoji: "🍜", host: "kurimanju", cats: ["food"],     scen: ["restaurant"], dlg: dlg("ordering") },
    { id: "u7",  title: "地方 Places",        emoji: "🗺️", host: "shisa",     cats: ["places"],    scen: ["directions"] },
    { id: "u8",  title: "东西 Things",        emoji: "🎒", host: "chimera",   cats: ["objects"],   scen: ["shopping"] },
    { id: "u9",  title: "动词 Doing Words I",  emoji: "🏃", host: "rakko",    catsSlice: ["verbs", 0, 15] },
    { id: "u10", title: "动词 Doing Words II", emoji: "💪", host: "rakko",    catsSlice: ["verbs", 15, 99] },
    { id: "u11", title: "形容 Describing",    emoji: "✨", host: "momonga",   cats: ["adjectives"] },
    { id: "u12", title: "语法胶水 Glue Words", emoji: "🧩", host: "yoroi",     cats: ["grammar"],   scen: ["transport"] },
    { id: "u13", title: "旅行 Getting Around", emoji: "✈️", host: "hachiware", cats: ["travel"],   scen: ["airport", "hotel", "emergency"] },
  ];
  const units = spec.map(u => {
    let words = [];
    if (u.cats) u.cats.forEach(c => words.push(...(byCat[c] || [])));
    if (u.catsSlice) words = (byCat[u.catsSlice[0]] || []).slice(u.catsSlice[1], u.catsSlice[2]);
    const phrases = (u.scen || []).flatMap(phr);
    const nodes = [];
    chunkBalanced(words, 5).forEach((chunk, i) => nodes.push({
      id: `${u.id}-w${i}`, kind: "words", words: chunk, unitWords: words, host: u.host,
      title: u.title, label: chunk[0].hanzi,
    }));
    (u.scen || []).forEach((sc, i) => {
      const ps = phr(sc);
      if (ps.length) nodes.push({ id: `${u.id}-p${i}`, kind: "phrases", phrases: ps, host: u.host, title: u.title, label: "💬" });
    });
    if (u.dlg) nodes.push({ id: `${u.id}-story`, kind: "story", dialogue: u.dlg, host: u.host, title: u.dlg.title, label: "📖" });
    nodes.push({ id: `${u.id}-exam`, kind: "exam", unit: { words, phrases }, host: u.host, title: u.title + " · exam", label: "试" });
    return { ...u, words, phrases, nodes };
  });
  // Taiwan-real units from T.scenarios, 4 per unit
  const tScen = T.scenarios || [];
  chunkBalanced(tScen, 4).forEach((group, gi) => {
    const u = { id: "tw" + gi, title: gi === 0 ? "台湾 Taiwan Real Talk I" : "台湾 Taiwan Real Talk II", emoji: "🇹🇼", host: gi === 0 ? "usagi" : "shisa" };
    const nodes = group.map((sc, i) => ({
      id: `${u.id}-s${i}`, kind: "phrases", phrases: sc.phrases, host: u.host,
      title: sc.title, label: sc.emoji || "💬",
    }));
    const allP = group.flatMap(sc => sc.phrases);
    (T.dialogues || []).slice(gi * 3, gi * 3 + 3).forEach((d, i) =>
      nodes.push({ id: `${u.id}-d${i}`, kind: "story", dialogue: d, host: u.host, title: d.title, label: "📖" }));
    nodes.push({ id: `${u.id}-exam`, kind: "exam", unit: { words: [], phrases: allP.slice(0, 14) }, host: u.host, title: u.title + " · exam", label: "试" });
    units.push({ ...u, words: [], phrases: allP, nodes });
  });
  return units;
})();
const ALL_NODES = UNITS.flatMap(u => u.nodes.map(n => ({ ...n, unitRef: u })));

/* ---------- progress helpers ---------- */
function nodeStars(id) { return (S.stars || {})[id] || 0; }
function nodeUnlocked(idx) {
  if (idx === 0) return true;
  return nodeStars(ALL_NODES[idx - 1].id) > 0;
}
function currentNodeIdx() {
  const i = ALL_NODES.findIndex(n => !nodeStars(n.id));
  return i === -1 ? ALL_NODES.length - 1 : i;
}
function learnedWordCount() {
  const ids = new Set();
  UNITS.forEach(u => u.nodes.forEach(n => {
    if (n.kind === "words" && nodeStars(n.id)) n.words.forEach(w => ids.add(w.id));
  }));
  return ids.size;
}

/* ---------- trip countdown ---------- */
function tripDays() {
  const d = S.tripDate || DEFAULT_TRIP;
  return Math.max(0, Math.ceil((new Date(d + "T00:00:00") - new Date()) / 86400e3));
}

/* ---------- the path screen ---------- */
function renderPath() {
  view.innerHTML = "";
  const curIdx = currentNodeIdx();
  const cur = ALL_NODES[curIdx];
  const hero = shuffle(unlockedCast())[0] || CAST[0];
  const line = hero.lines[Math.floor(Math.random() * hero.lines.length)];
  const learned = learnedWordCount();
  const due = dueCards().length;

  view.append(el(`<div class="path-hero wob">
      <div class="hero-mascot bob">${art(hero.id, "happy", 74)}</div>
      <div class="hero-bubble wob">${esc(line)}</div>
      <div class="hero-chips">
        <span class="chip">✈️ ${tripDays()}d to Taiwan</span>
        <span class="chip">📖 ${learned}/${D.vocab.length} words</span>
        ${due ? `<button class="chip chip-due" id="heroDue">🎴 ${due} due</button>` : ""}
      </div>
      <button class="btn big pink" id="heroGo">▶ ${nodeStars(cur.id) ? "keep going" : curIdx === 0 ? "start your journey!" : "continue"} · ${esc(cur.unitRef.emoji)} ${esc(cur.unitRef.title.split(" ").slice(1).join(" ") || cur.unitRef.title)}</button>
    </div>`));
  document.getElementById("heroGo").onclick = () => startNode(cur, renderPath);
  const hd = document.getElementById("heroDue");
  if (hd) hd.onclick = () => startReview(renderPath);

  const map = el(`<div class="path-map"></div>`);
  let gIdx = 0;
  const OFFS = [0, -1, 0, 1]; // winding pattern
  UNITS.forEach(u => {
    const uStars = u.nodes.reduce((a, n) => a + nodeStars(n.id), 0);
    const uDone = u.nodes.filter(n => nodeStars(n.id)).length;
    map.append(el(`<div class="unit-banner wob">
        <span class="unit-host">${art(u.host, uDone === u.nodes.length ? "cheer" : "idle", 46)}</span>
        <span class="unit-name">${u.emoji} <b>${esc(u.title)}</b><br>
        <span class="muted">${uDone}/${u.nodes.length} · ${"★".repeat(Math.min(3, Math.round(uStars / Math.max(1, u.nodes.length))))||"☆"}</span></span>
      </div>`));
    u.nodes.forEach(n => {
      const idx = gIdx++;
      const stars = nodeStars(n.id);
      const unlocked = nodeUnlocked(idx);
      const isCur = idx === currentNodeIdx();
      const off = OFFS[idx % 4];
      const row = el(`<div class="path-row" style="--off:${off}">
          ${deco(["grass", "flower", "sparkle", "grass", "tree", "weed"][idx % 6], 22) ? `<span class="path-deco ${off === 1 ? "left" : "right"}">${deco(["grass", "flower", "sparkle", "grass", "tree", "weed"][idx % 6], 26)}</span>` : ""}
          <button class="path-node ${n.kind} ${stars ? "done" : ""} ${!unlocked ? "locked" : ""} ${isCur ? "cur" : ""}" data-i="${idx}">
            <span class="node-face">${!unlocked ? "🔒" : n.kind === "exam" ? "试" : esc(n.label)}</span>
            ${stars ? `<span class="node-stars">${"★".repeat(stars)}</span>` : ""}
          </button>
          ${isCur ? `<span class="node-buddy bob">${art(n.host, "idle", 52)}</span><span class="node-start">开始!</span>` : ""}
        </div>`);
      const btn = row.querySelector(".path-node");
      btn.onclick = () => {
        if (!unlocked) { SFX.wrong(); toast("finish the node before this one first! 🔒"); return; }
        SFX.tap();
        nodeSheet(ALL_NODES[idx]);
      };
      map.append(row);
    });
  });
  map.append(el(`<div class="path-end">
      <div class="bob">${art("chiikawa", "cheer", 60)}${art("hachiware", "cheer", 60)}${art("usagi", "cheer", 60)}</div>
      <div class="muted">台湾见! see you in Taiwan! 🇹🇼</div></div>`));
  view.append(map);

  // scroll the current node into view (below the hero card)
  requestAnimationFrame(() => {
    const c = map.querySelector(".path-node.cur");
    if (c && currentNodeIdx() > 2) c.scrollIntoView({ block: "center" });
  });
}

/* node preview sheet (Super-Chinese style tap-then-start) */
function nodeSheet(node) {
  const stars = nodeStars(node.id);
  const kindLabel = { words: "words lesson 🌱", phrases: "phrases 💬", story: "story 📖", exam: "unit exam ⚔️" }[node.kind];
  const preview = node.kind === "words"
    ? node.words.map(w => `<span class="pv-word">${esc(w.hanzi)}</span>`).join("")
    : node.kind === "phrases" ? node.phrases.slice(0, 3).map(p => `<span class="pv-phrase">${esc(p.hanzi)}</span>`).join("") + (node.phrases.length > 3 ? `<span class="muted"> +${node.phrases.length - 3}</span>` : "")
    : node.kind === "story" ? `<span class="muted">${esc(node.dialogue.title)} · ${node.dialogue.turns.length} lines</span>`
    : `<span class="muted">${(node.unit.words.length ? node.unit.words.length + " words" : "")}${node.unit.words.length && node.unit.phrases.length ? " + " : ""}${node.unit.phrases.length ? node.unit.phrases.length + " phrases" : ""} · pass 60%+</span>`;
  const ov = el(`<div class="unlock-pop sheet-pop"><div class="sheet wob">
      <div class="sheet-mascot">${art(node.host, node.kind === "exam" ? "think" : "happy", 84)}</div>
      <div class="task-ask">${kindLabel}</div>
      <h3>${esc(node.title)}</h3>
      <div class="sheet-preview">${preview}</div>
      <div class="done-stars small">${[1, 2, 3].map(n => `<span class="star ${n <= stars ? "on" : ""}">★</span>`).join("")}</div>
      <button class="btn big pink" id="shGo">${stars ? (stars < 3 ? "replay for ★★★" : "replay ✨") : node.kind === "exam" ? "⚔️ take the exam!" : "start! →"}</button>
      <button class="btn small ghost" id="shX">not now</button>
    </div></div>`);
  ov.addEventListener("click", e => { if (e.target === ov) ov.remove(); });
  ov.querySelector("#shX").onclick = () => ov.remove();
  ov.querySelector("#shGo").onclick = () => { ov.remove(); startNode(node, renderPath); };
  document.body.appendChild(ov);
}

/* ---------- review tab ---------- */
function renderReview() {
  view.innerHTML = "";
  const due = dueCards();
  const deck = Object.keys(S.srs || {}).length;
  const weak = weakWords();
  view.append(el(`<h2 class="page-title">🎴 Review</h2>`));
  if (!deck) {
    view.append(el(`<div class="card wob center"><div class="mascot-inline">${art("chiikawa", "think", 80)}</div>
      <p>no cards yet — clear a lesson on the path and words land here for review!</p>
      <button class="btn pink" id="rvGo">to the path 🗺️</button></div>`));
    document.getElementById("rvGo").onclick = () => go("home");
    return;
  }
  view.append(el(`<div class="card wob center">
      <div class="mascot-inline ${due.length ? "bob" : ""}">${art("hachiware", due.length ? "cheer" : "sleep", 84)}</div>
      <h3>${due.length ? due.length + " words due!" : "all caught up ✨"}</h3>
      <div class="muted">${deck} words in your deck</div>
      ${due.length ? `<button class="btn big pink" id="rvStart">▶ review now</button>` : `<div class="muted" style="margin-top:6px">哈~ ${art("kurimanju", "sleep", 0) ? "" : ""}come back later — resting makes memory stick!</div>`}
    </div>`));
  const rs = document.getElementById("rvStart");
  if (rs) rs.onclick = () => startReview(renderReview);
  if (weak.length) {
    const wk = el(`<div class="card yellow wob"><h3>🔥 tricky words</h3>
      <div class="bank" style="justify-content:flex-start">${weak.slice(0, 10).map(w => `<button class="tile" data-h="${esc(w.hanzi)}">${esc(w.hanzi)}</button>`).join("")}</div>
      <button class="btn small blue" id="wkDrill" style="margin-top:8px">drill these 💪</button></div>`);
    wk.querySelectorAll(".tile").forEach(t => t.onclick = () => {
      const w = LEX.find(x => x.hanzi === t.dataset.h) || weak.find(x => x.hanzi === t.dataset.h);
      if (w) wordPopup(w);
    });
    wk.querySelector("#wkDrill").onclick = () => {
      const tasks = shuffle(weak.slice(0, 8).flatMap(w => [mcTask(w, "meaning", D.vocab), mcTask(w, "listen", D.vocab)])).slice(0, 12);
      runSession({ title: "weak words", tasks, kind: "review", host: "rakko", backTo: renderReview });
    };
    view.append(wk);
  }
  // upcoming forecast
  const now = Date.now();
  const soon = Object.values(S.srs || {}).filter(c => c.due > now && c.due < now + 86400e3).length;
  view.append(el(`<div class="card muted center">${soon} more due within 24h · reviews use spaced repetition — a little every day beats a lot at once 🌱</div>`));
}

/* ---------- profile (friends, snacks, stats, settings) ---------- */
function renderProfile() {
  view.innerHTML = "";
  const learned = learnedWordCount();
  const starSum = Object.values(S.stars || {}).reduce((a, b) => a + b, 0);
  view.append(el(`<h2 class="page-title">🌸 Rachel's page</h2>`));
  view.append(el(`<div class="card wob">
      <div class="cardrow" style="justify-content:space-around;text-align:center">
        <span>🔥<br><b>${S.streak.count}</b><br><span class="muted">streak</span></span>
        <span>✨<br><b>${S.xp}</b><br><span class="muted">xp</span></span>
        <span>⭐<br><b>${starSum}</b><br><span class="muted">stars</span></span>
        <span>📖<br><b>${learned}</b><br><span class="muted">words</span></span>
      </div>
      <div class="hskbar"><div class="hskfill" style="width:${Math.round(learned / D.vocab.length * 100)}%"></div></div>
      <div class="muted center">${Math.round(learned / D.vocab.length * 100)}% of HSK 1</div></div>`));
  const trip = el(`<div class="card yellow wob"><h3>✈️ Taiwan trip</h3>
      <div class="cardrow" style="align-items:center"><b style="font-size:1.6rem">${tripDays()}</b> days to go ·
      <input type="date" id="tripD" value="${esc(S.tripDate || DEFAULT_TRIP)}" style="font-family:inherit;padding:6px;border:2px solid var(--line);border-radius:10px;background:var(--card)"></div></div>`);
  trip.querySelector("#tripD").onchange = e => { S.tripDate = e.target.value; save(); renderProfile(); };
  view.append(trip);
  renderFriendsInto(view);
  const st = S.stats;
  view.append(el(`<div class="card muted center">answered ${st.quiz} · ${st.quiz ? Math.round(st.correct / st.quiz * 100) : 0}% right · 🎤 ${st.spoken} spoken · ✍️ ${st.written} written</div>`));
  const pin = el(`<div class="card wob"><h3>拼 Pinyin</h3>
      <div class="muted">hide pinyin to practice reading real characters — tap any blurred pinyin to peek</div>
      <button class="btn small ${S.showPinyin === false ? "pink" : "mint"}" id="pinToggle" style="margin-top:8px">${S.showPinyin === false ? "hidden — show it" : "shown — hide it"}</button></div>`);
  pin.querySelector("#pinToggle").onclick = () => { togglePinyin(); renderProfile(); };
  view.append(pin);
  const vc = el(`<button class="btn small ghost" style="margin:4px auto;display:block">🩺 voice & mic check</button>`);
  vc.onclick = voiceCheck;
  view.append(vc);
}

/* ---------- boot ---------- */
if (!D.vocab.length) {
  view.innerHTML = "";
  view.append(el(`<div class="card yellow center"><div class="mascot-inline">${art("chiikawa", "sad", 72)}</div>
    <h3>content pack missing!</h3><div class="muted">data.js didn't load — refresh once online.</div></div>`));
} else {
  renderStreak();
  go("home");
}
if ("serviceWorker" in navigator) {
  // when a new sw takes over an already-controlled page, reload once so a
  // deploy lands on the FIRST open instead of the second
  const hadController = !!navigator.serviceWorker.controller;
  let swReloaded = false;
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (hadController && !swReloaded) { swReloaded = true; location.reload(); }
  });
  navigator.serviceWorker.register("sw.js").catch(() => {});
}
