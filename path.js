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
  // Grammar Gym unit from T.grammar (14 points -> nodes of ~3)
  const gpts = T.grammar || [];
  if (gpts.length) {
    const gu = { id: "gram", title: "语法 Grammar Gym", emoji: "🧩", host: "hachiware" };
    const gnodes = chunkBalanced(gpts, 3).map((pts, i) => ({
      id: `gram-g${i}`, kind: "grammar", points: pts, host: gu.host,
      title: pts.map(x => x.title.split(" ")[0]).join(" · "), label: "语",
    }));
    gnodes.push({ id: "gram-exam", kind: "exam", unit: { grammar: gpts, words: [], phrases: [] }, host: gu.host, title: gu.title + " · exam", label: "试" });
    units.push({ ...gu, words: [], phrases: [], nodes: gnodes, grammar: gpts });
  }

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
  // HSK 2 expansion units (hsk2.js)
  const H2 = window.QIAQIA_HSK2 || [];
  if (H2.length) {
    H2.forEach((v, i) => v.id = "h" + i);
    const by2 = {};
    H2.forEach(v => (by2[v.cat] = by2[v.cat] || []).push(v));
    const H2_SPEC = [
      ["h-people", "人 More People", "👥", "chiikawa", ["people"]],
      ["h-body", "身体 Body & Health", "🫶", "momonga", ["body"]],
      ["h-time", "时间 More Time", "⏰", "kani", ["time"]],
      ["h-food", "吃喝 More Food", "🥟", "kurimanju", ["food"]],
      ["h-places", "地方 More Places", "🏫", "shisa", ["places", "travel"]],
      ["h-things", "东西 More Things", "📦", "chimera", ["objects", "colors"]],
      ["h-verbs", "动词 More Verbs", "🏃", "rakko", ["verbs", "activities"]],
      ["h-adj", "形容 More Describing", "🌦️", "usagi", ["adjectives", "weather"]],
      ["h-glue", "语法 More Glue", "🧩", "yoroi", ["grammar", "question", "numbers", "measure"]],
    ];
    const used2 = new Set();
    H2_SPEC.forEach(([id, title, emoji, host, cats]) => {
      const words = cats.flatMap(c => by2[c] || []);
      words.forEach(w => used2.add(w.id));
      if (!words.length) return;
      const nodes = [];
      chunkBalanced(words, 5).forEach((chunk, i) => nodes.push({
        id: `${id}-w${i}`, kind: "words", words: chunk, unitWords: words, host,
        title, label: chunk[0].hanzi,
      }));
      nodes.push({ id: `${id}-exam`, kind: "exam", unit: { words, phrases: [] }, host, title: title + " · exam", label: "试" });
      units.push({ id, title: "HSK2 · " + title, emoji, host, words, phrases: [], nodes, lvl: 2 });
    });
    const leftovers = H2.filter(w => !used2.has(w.id));
    if (leftovers.length) {
      const nodes = chunkBalanced(leftovers, 5).map((chunk, i) => ({
        id: `h-misc-w${i}`, kind: "words", words: chunk, unitWords: leftovers, host: "momonga", title: "杂货 Odds & Ends", label: chunk[0].hanzi,
      }));
      nodes.push({ id: "h-misc-exam", kind: "exam", unit: { words: leftovers, phrases: [] }, host: "momonga", title: "杂货 · exam", label: "试" });
      units.push({ id: "h-misc", title: "HSK2 · 杂货 Odds & Ends", emoji: "🎁", host: "momonga", words: leftovers, phrases: [], nodes, lvl: 2 });
    }
  }

  return units;
})();
function activeUnits() { return UNITS.filter(u => u.lvl !== 2 || S.hsk2Open); }
function allNodes() { return activeUnits().flatMap(u => u.nodes.map(n => ({ ...n, unitRef: u }))); }
// live getter keeps external references (tests, console) working
Object.defineProperty(window, "ALL_NODES", { get: allNodes });

/* ---------- progress helpers ---------- */
function nodeStars(id) { return (S.stars || {})[id] || 0; }
function nodeUnlocked(nodes, idx) {
  if (idx === 0) return true;
  return nodeStars(nodes[idx - 1].id) > 0;
}
function currentNodeIdx(nodes) {
  const i = nodes.findIndex(n => !nodeStars(n.id));
  return i === -1 ? nodes.length - 1 : i;
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
  const NODES = allNodes();
  const curIdx = currentNodeIdx(NODES);
  const cur = NODES[curIdx];
  const hero = shuffle(unlockedCast())[0] || CAST[0];
  const line = hero.lines[Math.floor(Math.random() * hero.lines.length)];
  const learned = learnedWordCount();
  const due = dueCards().length;

  view.append(el(`<div class="path-hero wob">
      <div class="hero-mascot bob">${art(hero.id, "happy", 74)}</div>
      <div class="hero-bubble wob">${esc(line)}</div>
      <div class="hero-chips">
        <span class="chip">🏅 LV${levelInfo(S.xp).lv}</span>
        <span class="chip ${todayXP() >= DAY_GOAL ? "chip-done" : ""}">🌟 ${Math.min(todayXP(), DAY_GOAL)}/${DAY_GOAL} today</span>
        <span class="chip">✈️ ${tripDays()}d to Taiwan</span>
        <span class="chip">📖 ${learned}/${D.vocab.length + (S.hsk2Open ? (window.QIAQIA_HSK2 || []).length : 0)} words</span>
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
  activeUnits().forEach(u => {
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
      const unlocked = nodeUnlocked(NODES, idx);
      const isCur = idx === curIdx;
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
        nodeSheet(NODES[idx]);
      };
      map.append(row);
    });
  });
  if ((window.QIAQIA_HSK2 || []).length && !S.hsk2Open) {
    const gate = el(`<div class="unit-banner wob" style="background:var(--yellow)">
        <span class="unit-host">${art("rakko", "think", 46)}</span>
        <span class="unit-name">🔓 <b>HSK 2 · the next level</b><br>
        <span class="muted">${(window.QIAQIA_HSK2 || []).length} more words, whole new units — open it when you're ready!</span></span>
        <button class="btn small pink" id="hsk2Go">open</button></div>`);
    gate.querySelector("#hsk2Go").onclick = () => { S.hsk2Open = true; save(); confetti(); SFX.fanfare(); toast("HSK 2 unlocked!! 加油!! 🎉"); renderPath(); };
    map.append(gate);
  } else if (S.hsk2Open) {
    const off = el(`<button class="btn small ghost" style="margin:6px auto;display:block;position:relative;z-index:1">fold HSK 2 away for now</button>`);
    off.onclick = () => { S.hsk2Open = false; save(); renderPath(); };
    map.append(off);
  }
  map.append(el(`<div class="path-end">
      <div class="bob">${art("chiikawa", "cheer", 60)}${art("hachiware", "cheer", 60)}${art("usagi", "cheer", 60)}</div>
      <div class="muted">台湾见! see you in Taiwan! 🇹🇼</div></div>`));
  view.append(map);

  // scroll the current node into view (below the hero card)
  requestAnimationFrame(() => {
    const c = map.querySelector(".path-node.cur");
    if (c && curIdx > 2) c.scrollIntoView({ block: "center" });
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
  ov.querySelectorAll(".pv-word, .pv-phrase").forEach(x => x.onclick = () => speak(x.textContent));
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
    const wb0 = el(`<button class="btn big blue">📖 wordbook — browse every word</button>`);
    wb0.onclick = renderWordbook;
    view.append(wb0);
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
  const wb = el(`<button class="btn big blue">📖 wordbook — browse every word</button>`);
  wb.onclick = renderWordbook;
  view.append(wb);
  // upcoming forecast
  const now = Date.now();
  const soon = Object.values(S.srs || {}).filter(c => c.due > now && c.due < now + 86400e3).length;
  view.append(el(`<div class="card muted center">${soon} more due within 24h · reviews use spaced repetition — a little every day beats a lot at once 🌱</div>`));
}

/* ---------- wordbook: every word, grouped, with learn status ---------- */
function renderWordbook() {
  view.innerHTML = "";
  const all = D.vocab.concat(window.QIAQIA_HSK2 || []);
  const learned = w => (S.srs || {})[w.id];
  const weakSet = new Set(weakWords().map(w => w.hanzi));
  const nL = all.filter(learned).length;
  view.append(el(`<div class="backrow"><button class="iconbtn" id="wbBk">←</button>
    <h3 style="margin:0">📖 Wordbook <span class="muted">${nL}/${all.length} learned</span></h3></div>`));
  const groups = [["HSK 1", D.vocab]];
  if ((window.QIAQIA_HSK2 || []).length) groups.push(["HSK 2", window.QIAQIA_HSK2]);
  groups.forEach(([lvl, words]) => {
    const byCat = {};
    words.forEach(w => (byCat[w.cat] = byCat[w.cat] || []).push(w));
    view.append(el(`<h2 class="page-title">${lvl} <span class="muted">${words.filter(learned).length}/${words.length}</span></h2>`));
    Object.entries(byCat).forEach(([cat, ws]) => {
      const box = el(`<div class="card wob" style="padding:10px">
        <div class="wb-cat">${esc(cat)} <span class="muted">${ws.filter(learned).length}/${ws.length}</span></div>
        <div class="wb-rows">${ws.map(w => `<button class="wb-row" data-h="${esc(w.hanzi)}">
          <span class="wb-st">${weakSet.has(w.hanzi) ? "🔥" : learned(w) ? "✅" : "▫️"}</span>
          <span class="wb-hz">${esc(w.hanzi)}</span>
          <span class="pinyin">${esc(w.pinyin)}</span>
          <span class="wb-en muted">${esc(w.en)}</span></button>`).join("")}</div></div>`);
      box.querySelectorAll(".wb-row").forEach(r => r.onclick = () => {
        const w = all.find(x => x.hanzi === r.dataset.h);
        if (w) wordPopup(w);
      });
      view.append(box);
    });
  });
  document.getElementById("wbBk").onclick = () => go("cards");
}

/* ---------- profile (friends, snacks, stats, settings) ---------- */
function renderProfile() {
  view.innerHTML = "";
  const learned = learnedWordCount();
  const starSum = Object.values(S.stars || {}).reduce((a, b) => a + b, 0);
  view.append(el(`<h2 class="page-title">🌸 Rachel's page</h2>`));
  const li = levelInfo(S.xp);
  const lic = el(`<div class="license wob">
      <div class="lic-head"><span class="lic-title">討伐ライセンス · HUNTER LICENSE</span><span class="lic-yaha">ヤハ!</span></div>
      <div class="lic-body">
        <div class="lic-photo bob">${art("usagi", "cheer", 92)}</div>
        <div class="lic-fields">
          <div class="lic-name">RACHEL <span class="lic-lv">LV${li.lv}</span></div>
          <div class="lic-rank">${esc(li.title)}<br><span class="muted">${esc(li.titleEn)}</span></div>
          <div class="lic-xpbar"><div class="lic-xpfill" style="width:${li.pct}%"></div></div>
          <div class="lic-xptext">✨ ${S.xp} xp${li.need ? ` · ${li.need} to LV${li.lv + 1}` : " · MAX RANK"}</div>
        </div>
        <div class="lic-stamp">合<br>格</div>
      </div>
      <div class="lic-foot"><span>恰恰学院 QIAQIA ACADEMY</span><span class="lic-barcode">${"▮▯▮▮▯▮▯▮▮▯▮▮▮▯▮▯▮▮▯▮▮▯▮▯▮"}</span><span>🇹🇼 valid: TAIWAN 2026</span></div>
    </div>`);
  lic.onclick = () => { speak("呀哈"); lic.classList.remove("bounce"); void lic.offsetWidth; lic.classList.add("bounce"); };
  view.append(lic);
  view.append(el(`<div class="card wob">
      <div class="cardrow" style="justify-content:space-around;text-align:center">
        <span>🔥<br><b>${S.streak.count}</b><br><span class="muted">streak</span></span>
        <span>🌟<br><b>${todayXP()}/${DAY_GOAL}</b><br><span class="muted">today</span></span>
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
