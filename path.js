/* YaHa path — Super-Chinese-style unit/lesson map over the HSK1 + Taiwan content.
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
    { id: "u1",  title: "打招呼 Greetings",   emoji: "👋", host: "usagi",     cats: ["greetings"], scen: ["greetings"] },
    { id: "u2",  title: "数字 Numbers",       emoji: "🔢", host: "hachiware", cats: ["numbers"],   scen: ["money"] },
    { id: "u3",  title: "你和我 People",      emoji: "👪", host: "usagi",     cats: ["people"],    scen: ["smalltalk"], dlg: dlg("introduc") || dlg("meeting") },
    { id: "u4",  title: "问问题 Questions",   emoji: "❓", host: "usagi",     cats: ["question"] },
    { id: "u5",  title: "时间 Time",          emoji: "🕐", host: "kani",      cats: ["time"] },
    { id: "u6",  title: "吃和喝 Food & Drink", emoji: "🍜", host: "kurimanju", cats: ["food"],     scen: ["restaurant"], dlg: dlg("ordering") },
    { id: "u7",  title: "地方 Places",        emoji: "🗺️", host: "shisa",     cats: ["places"],    scen: ["directions"] },
    { id: "u8",  title: "东西 Things",        emoji: "🎒", host: "usagi",     cats: ["objects"],   scen: ["shopping"] },
    { id: "u9",  title: "动词 Doing Words I",  emoji: "🏃", host: "rakko",    catsSlice: ["verbs", 0, 15] },
    { id: "u10", title: "动词 Doing Words II", emoji: "💪", host: "rakko",    catsSlice: ["verbs", 15, 99] },
    { id: "u11", title: "形容 Describing",    emoji: "✨", host: "usagi",     cats: ["adjectives"] },
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
    const gu = { id: "gram", title: "语法 Grammar Gym", emoji: "🧩", host: "usagi" };
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
  const H2 = window.YAHA_HSK2 || [];
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
  if (S.fullAccess) return true;
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
  // usagi is the namesake mascot — she headlines the path most of the time
  const hero = (Math.random() < 0.62 ? activeCast().find(c => c.id === "usagi") : shuffle(unlockedCast())[0]) || activeCast()[0];
  const line = hero.lines[Math.floor(Math.random() * hero.lines.length)];
  const learned = learnedWordCount();
  const due = dueCards().length;

  // Doraemon world: Take-copter (タケコプター) spins on the hero mascot's head
  // when the on-path "Doraemon" character (hachiware in the chiikawa cast) is
  // headlining, and the "start lesson" button becomes an Anywhere Door (どこでも
  // ドア) instead of the paw print — both purely decorative, doraemon-gated.
  const isDoraemon = S.theme === "doraemon";
  const copter = isDoraemon && hero.id === "hachiware" ? " copter" : "";
  const startIcon = isDoraemon ? "🚪" : "🐾";
  view.append(el(`<div class="path-hero wob">
      <div class="hero-mascot bob${copter}">${art(hero.id, "happy", 74)}</div>
      <div class="hero-bubble wob">${esc(line)}</div>
      <div class="hero-chips">
        <span class="chip">🏅 LV${levelInfo(S.xp).lv}</span>
        <span class="chip ${todayXP() >= DAY_GOAL ? "chip-done" : ""}">🌟 ${Math.min(todayXP(), DAY_GOAL)}/${DAY_GOAL} today</span>
        <span class="chip">✈️ ${tripDays()}d to Taiwan</span>
        <span class="chip">📖 ${learned}/${D.vocab.length + (S.hsk2Open ? (window.YAHA_HSK2 || []).length : 0)} words</span>
        ${due ? `<button class="chip chip-due" id="heroDue">🎴 ${due} due</button>` : ""}
      </div>
      <button class="btn big pink" id="heroGo">${startIcon} ${nodeStars(cur.id) ? "keep going" : curIdx === 0 ? "start your journey!" : "continue"} · ${esc(cur.unitRef.emoji)} ${esc(cur.unitRef.title.split(" ").slice(1).join(" ") || cur.unitRef.title)}</button>
    </div>`));
  document.getElementById("heroGo").onclick = () => startNode(cur, renderPath);
  const hd = document.getElementById("heroDue");
  if (hd) hd.onclick = () => startReview(renderPath);

  const map = el(`<div class="path-map"></div>`);
  // Doraemon world: ambient sprites reskin from Chiikawa meadow flavor (sakura/
  // bubble tea/dumplings) to Doraemon-world icons — distinct from DORAEMON_CONFETTI
  // (app.js) so level-up confetti doesn't feel repeated here.
  const isDoraemonAmb = S.theme === "doraemon";
  map.append(el(isDoraemonAmb ? `<div class="path-ambient">
      <span class="amb a1">💠</span><span class="amb a2">🌟</span><span class="amb a3">🍡</span>
      <span class="amb a4">🧭</span><span class="amb a5">💠</span><span class="amb a6">🚁</span>
      <span class="amb a7">🎐</span><span class="amb a8">🌟</span><span class="amb a9">⏳</span></div>` : `<div class="path-ambient">
      <span class="amb a1">🌸</span><span class="amb a2">✨</span><span class="amb a3">🍃</span>
      <span class="amb a4">⭐</span><span class="amb a5">🌸</span><span class="amb a6">🧋</span>
      <span class="amb a7">🌼</span><span class="amb a8">✨</span><span class="amb a9">🍡</span></div>`));
  let gIdx = 0;
  const OFFS = [0, -1, 0, 1]; // winding pattern
  const BIOMES = ["meadow", "forest", "town", "market"];
  // trailside decor: REAL art only (official character/food PNGs) + emoji nature bits
  const SIDE_CAST = ["chiikawa", "hachiware", "usagi", "momonga", "kani", "shisa", "rakko", "kurimanju", "yoroi", "chimera"];
  const SIDE_FOOD = ["ramen", "hamburg", "parfait", "pancake", "mangoice", "jipai", "beer"];
  const BIOME_BITS = {
    meadow: ["🌸", "🌼", "🍀", "🌷", "✨"],
    forest: ["🍄", "🍃", "🌰", "🐿️", "✨"],
    town:   ["🏮", "⭐", "🎏", "🧋", "✨"],
    market: ["🍡", "🧋", "🍜", "🛍️", "✨"],
  };
  // curated per-unit decor: fixed %-based spots inside the meadow (never clipped,
  // never on the footpath), one character + one snack + nature bits per unit
  const DECO_SPOTS = [
    [{ x: 6, y: 36 }, { x: 94, y: 30 }, { x: 7, y: 74 }, { x: 93, y: 64 }],
    [{ x: 94, y: 40 }, { x: 6, y: 30 }, { x: 93, y: 78 }, { x: 7, y: 62 }],
    [{ x: 6, y: 44 }, { x: 94, y: 34 }, { x: 7, y: 68 }, { x: 93, y: 82 }],
  ];
  const groupDecor = (uidx, biome) => {
    const spots = DECO_SPOTS[uidx % DECO_SPOTS.length];
    const bits = BIOME_BITS[biome];
    const who = SIDE_CAST[(uidx * 7 + 3) % SIDE_CAST.length];
    const food = SIDE_FOOD[(uidx * 5 + 1) % SIDE_FOOD.length];
    const mk = (s, inner) => `<span class="gdeco" style="--gx:${s.x}%;--gy:${s.y}%"><span class="gfloat">${inner}</span></span>`;
    return mk(spots[0], art(who, "idle", 44))
      + mk(spots[1], `<span class="gbit">${bits[uidx % bits.length]}</span>`)
      + mk(spots[2], `<img src="chars/food/${food}.png" width="36" height="36" style="object-fit:contain" alt="">`)
      + mk(spots[3], `<span class="gbit">${bits[(uidx + 2) % bits.length]}</span>`);
  };
  activeUnits().forEach((u, uidx) => {
    const biome = BIOMES[uidx % BIOMES.length];
    const uStars = u.nodes.reduce((a, n) => a + nodeStars(n.id), 0);
    const uDone = u.nodes.filter(n => nodeStars(n.id)).length;
    const group = el(`<div class="unit-group biome-${biome}"></div>`);
    group.insertAdjacentHTML("beforeend", groupDecor(uidx, biome));
    group.append(el(`<div class="unit-banner card">
        <div class="unit-overlay">
          <span class="unit-host">${art(u.host, uDone === u.nodes.length ? "cheer" : "idle", 46)}</span>
          <span class="unit-name">${u.emoji} <b>${esc(u.title)}</b><br>
          <span class="muted">${uDone}/${u.nodes.length} · ${"★".repeat(Math.min(3, Math.round(uStars / Math.max(1, u.nodes.length))))||"☆"}</span></span>
        </div>
      </div>`));
    u.nodes.forEach(n => {
      const idx = gIdx++;
      const stars = nodeStars(n.id);
      const unlocked = nodeUnlocked(NODES, idx);
      const isCur = idx === curIdx;
      const off = OFFS[idx % 4];
      const row = el(`<div class="path-row" style="--off:${off}">
          <button class="path-node ${n.kind} ${stars ? "done" : ""} ${!unlocked ? "locked" : ""} ${isCur ? "cur" : ""}" data-i="${idx}">
            <span class="node-face${[...(n.label || "")].length > 1 && n.kind !== "exam" ? " small" : ""}">${n.kind === "exam" ? "试" : esc(n.label)}</span>
            ${!unlocked ? `<span class="node-lock">🔒</span>` : ""}
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
      group.append(row);
    });
    map.append(group);
  });
  if ((window.YAHA_HSK2 || []).length && !S.hsk2Open) {
    const gate = el(`<div class="unit-banner wob" style="background:var(--yellow)">
        <span class="unit-host">${art("rakko", "think", 46)}</span>
        <span class="unit-name">🔓 <b>HSK 2 · the next level</b><br>
        <span class="muted">${(window.YAHA_HSK2 || []).length} more words, whole new units — open it when you're ready!</span></span>
        <button class="btn small pink" id="hsk2Go">open</button></div>`);
    gate.querySelector("#hsk2Go").onclick = () => { S.hsk2Open = true; save(); confetti(); SFX.fanfare(); toast("HSK 2 unlocked!! 加油!! 🎉"); renderPath(); };
    map.append(gate);
  } else if (S.hsk2Open) {
    const off = el(`<button class="btn small ghost" style="margin:6px auto;display:block;position:relative;z-index:1">fold HSK 2 away for now</button>`);
    off.onclick = () => { S.hsk2Open = false; save(); renderPath(); };
    map.append(off);
  }
  map.append(el(`<div class="path-end">
      <div class="bob">${art("chiikawa", "cheer", 54)}${art("usagi", "cheer", 76)}${art("hachiware", "cheer", 54)}</div>
      <div class="muted">台湾见! see you in Taiwan! 🇹🇼</div></div>`));
  view.append(map);

  // scroll the current node into view (below the hero card)
  requestAnimationFrame(() => {
    // decor must never touch a node, banner, or the start badge — measure and cull
    const solids = [...map.querySelectorAll(".path-node,.unit-banner,.node-start,.node-buddy")].map(e => e.getBoundingClientRect());
    map.querySelectorAll(".gdeco").forEach(g => {
      const r = g.getBoundingClientRect(), pad = 8;
      if (solids.some(s => r.left < s.right + pad && r.right > s.left - pad && r.top < s.bottom + pad && r.bottom > s.top - pad))
        g.style.display = "none";
    });
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
  const shclip = node.kind === "exam" && typeof animGIF === "function" ? animGIF("study", 110) : "";
  // Doraemon world: the lesson-entry mascot slot frames itself as an Anywhere
  // Door (どこでもドア) — CSS-only door shape behind the mascot, doraemon-gated.
  const doorClass = S.theme === "doraemon" ? " anywhere-door" : "";
  const startLabel = S.theme === "doraemon" ? "🚪 open the door!" : "start! →";
  const ov = el(`<div class="unlock-pop sheet-pop"><div class="sheet wob">
      <div class="sheet-mascot${doorClass}">${shclip || art(node.host, node.kind === "exam" ? "think" : "happy", 84)}</div>
      <div class="task-ask">${kindLabel}</div>
      <h3>${esc(node.title)}</h3>
      ${(typeof activeCastSpeak === "function" && activeCastSpeak()[node.host]) ? `<div class="muted small">${esc(shuffle(activeCastSpeak()[node.host])[0])}</div>` : ""}
      <div class="sheet-preview">${preview}</div>
      <div class="done-stars small">${[1, 2, 3].map(n => `<span class="star ${n <= stars ? "on" : ""}">★</span>`).join("")}</div>
      <button class="btn big pink" id="shGo">${stars ? (stars < 3 ? "replay for ★★★" : "replay ✨") : node.kind === "exam" ? "⚔️ take the exam!" : startLabel}</button>
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
      <div class="mascot-inline ${due.length ? "bob" : ""}">${(!due.length && typeof animGIF === "function" && animGIF("sleep", 130)) || art("hachiware", due.length ? "cheer" : "sleep", 84)}</div>
      <h3>${due.length ? due.length + " words due!" : "all caught up ✨"}</h3>
      <div class="muted">${deck} words in your deck</div>
      ${due.length ? `<button class="btn big pink" id="rvStart">🎴 review now</button>` : `<div class="muted" style="margin-top:6px">哈~ ${art("kurimanju", "sleep", 0) ? "" : ""}come back later — resting makes memory stick!</div>`}
      ${S.theme === "doraemon" && due.length ? `<div class="muted small" style="margin-top:6px">⏰🌀 time machine says: hop back before these fade!</div>` : ""}
    </div>`));
  const rs = document.getElementById("rvStart");
  if (rs) rs.onclick = () => startReview(renderReview);
  if (weak.length) {
    const wk = el(`<div class="card yellow wob"><h3>🔥 Tricky words</h3>
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
  const all = D.vocab.concat(window.YAHA_HSK2 || []);
  const learned = w => (S.srs || {})[w.id];
  const weakSet = new Set(weakWords().map(w => w.hanzi));
  const nL = all.filter(learned).length;
  view.append(el(`<div class="backrow"><button class="iconbtn" id="wbBk">←</button>
    <h3 style="margin:0;display:flex;align-items:center;gap:6px">📖 Wordbook <span class="muted">${nL}/${all.length} learned</span></h3></div>`));
  const groups = [["HSK 1", D.vocab]];
  if ((window.YAHA_HSK2 || []).length) groups.push(["HSK 2", window.YAHA_HSK2]);
  groups.forEach(([lvl, words]) => {
    const byCat = {};
    words.forEach(w => (byCat[w.cat] = byCat[w.cat] || []).push(w));
    view.append(el(`<h2 class="page-title">${lvl} <span class="muted">${words.filter(learned).length}/${words.length}</span></h2>`));
    Object.entries(byCat).forEach(([cat, ws]) => {
      const box = el(`<div class="card wob" style="padding:10px">
        <div class="wb-cat">${esc(cat)} <span class="muted">${ws.filter(learned).length}/${ws.length}</span></div>
        <div class="wb-rows">${ws.map(w => `<button class="wb-row" data-h="${esc(w.hanzi)}">
          <span class="wb-st">${weakSet.has(w.hanzi) ? "🔥" : learned(w) ? "✅" : "🌱"}</span>
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

/* ---------- food gallery: showcase every real show-art food image large,
   whether or not it's been won yet from the snack shelf ---------- */
/* ---------- song jukebox: official themes + fan favorites, played via YouTube
   embeds (nothing re-hosted — videos stream from their owners' uploads) ---------- */
const QQ_SONGS = [
  { id: "8SoWzkMO1YQ", emoji: "💙", title: "ひとりごつ — the original (2022)", sub: "the first recording, back when Hachiware's voice was little" },
  { id: "G3hW_k2lOzg", emoji: "🎤", title: "ひとりごつ Hitorigotsu", sub: "the ending theme Hachiware sings — with lyrics to sing along" },
  { id: "0fgXx_-XjPk", emoji: "🥹", title: "Hachiware's voice growing up", sub: "then-vs-now comparison — 声の変化が尊い" },
  { id: "9cEMsmJKvDQ", emoji: "🎼", title: "Opening theme 蛤?", sub: "the show's opening music" },
  { id: "T8C3FbUowUY", emoji: "🐰", title: "Usagi's theme", sub: "呀哈!! energy in song form" },
  { id: "X-EGAILdOG8", emoji: "🎬", title: "ひとりごつ MV (fan MAD)", sub: "fan-made music video of the ending song" },
  { id: "CcUjUp_Ft80", emoji: "🎹", title: "ひとりごつ cover", sub: "a lovely fan cover" },
  { id: "oSlaD3GcM9k", emoji: "😂", title: "Usagi moments", sub: "the funniest usagi clips in one video" },
  { id: "PNaW83w8spQ", emoji: "🗯️", title: "蛤?/哈? — 250 episodes of Usagi yelling", sub: "the legendary scream compilation" },
];
const QQ_SONGS_DORAEMON = [
  { id: "T9R-NPhRi1M", emoji: "🌈", title: "夢をかなえてドラえもん — the 12-year OP (2007–2019)", sub: "mao's opening ran so long it basically raised a generation" },
  { id: "bJNk3yMvHmw", emoji: "📼", title: "ドラえもんのうた — the ORIGINAL (1979)", sub: "the very first OP, decades before Chiikawa existed — this is ancient history" },
  { id: "0SNOvS_1M9w", emoji: "🎁", title: "THE GIFT — 平井大", sub: "the movie theme for のび太の月面探査記, warm falsetto included" },
  { id: "NCOy7Z2TnOY", emoji: "🎤", title: "ジャイアンのリサイタル", sub: "Gian's theme in song form — a concert nobody asked to attend" },
  { id: "jVPWZwY-Aks", emoji: "🌙", title: "ぼくドラえもん2112", sub: "the ending theme that closed out the whole Ōyama era (1995–2002)" },
  { id: "Dy-c6mxIe-w", emoji: "🎹", title: "夢をかなえてドラえもん — piano cover", sub: "CANACANA's lovely fan piano arrangement, sheet music and all" },
  { id: "3CEjncTfaOA", emoji: "😂", title: "ジャイアンはどれだけ音痴なのか？", sub: "an entirely too-serious investigation into exactly how bad that singing voice is" },
  { id: "JWVaQNXOqcI", emoji: "🕰️", title: "大山ドラ VS わさドラ — voice compared", sub: "Ōyama-era vs Mizuta-era, side by side — 45+ years, same blue robot" },
  { id: "9UdbUXH-J4Q", emoji: "😭", title: "感動シーン総集編 (fan MAD)", sub: "fan-cut emotional scenes with dialogue — bring tissues, 神回 warning" },
];
function renderSongs() {
  view.innerHTML = "";
  const isDoraemon = S.theme === "doraemon";
  const list = isDoraemon ? QQ_SONGS_DORAEMON : QQ_SONGS;
  view.append(el(isDoraemon
    ? `<div class="backrow"><button class="iconbtn" id="sgBk">←</button>
    <h3 style="margin:0">🔔 Doraemon Songbook <span class="muted">decades of theme songs</span></h3></div>`
    : `<div class="backrow"><button class="iconbtn" id="sgBk">←</button>
    <h3 style="margin:0">🎵 Song corner <span class="muted">themes & fan bangers</span></h3></div>`));
  view.append(el(isDoraemon
    ? `<div class="muted" style="margin:0 4px 12px">the real theme songs, from the 1979 original all the way to the modern OPs —
    they play right here through YouTube. tap a card to load the player. 🔵</div>`
    : `<div class="muted" style="margin:0 4px 12px">the real theme songs plus the fan songs everyone memes —
    they play right here through YouTube. tap a card to load the player. 🧋</div>`));
  list.forEach(s => {
    const card = el(`<div class="card wob" style="margin-bottom:12px;overflow:hidden">
        <button class="songrow" style="display:flex;align-items:center;gap:10px;width:100%;text-align:left;background:none;border:none;padding:2px">
          <span style="font-size:1.5rem">${s.emoji}</span>
          <span><b>${esc(s.title)}</b><br><span class="muted" style="font-size:.78rem">${esc(s.sub)}</span></span>
          <span style="margin-left:auto;font-size:1.2rem">▾</span>
        </button>
        <div class="songplayer" style="display:none;margin-top:10px"></div>
      </div>`);
    card.querySelector(".songrow").onclick = () => {
      const box = card.querySelector(".songplayer");
      if (box.style.display === "none") {
        if (!box.firstChild) box.innerHTML =
          `<iframe width="100%" height="220" style="border:0;border-radius:14px"
             src="https://www.youtube-nocookie.com/embed/${s.id}" title="${esc(s.title)}"
             allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
             allowfullscreen loading="lazy"></iframe>`;
        box.style.display = "block";
        // extra mascot moment: opening the flagship theme song earns a random line + a bigger bounce
        if (isDoraemon) {
          if (/夢をかなえてドラえもん/.test(s.title) && !/cover/i.test(s.title)) {
            const hachiwareLines = activeCastSpeak().hachiware || [];
            const l = hachiwareLines[Math.floor(Math.random() * hachiwareLines.length)];
            if (l) speakAs(l, "hachiware");
            card.classList.remove("bounce"); void card.offsetWidth; card.classList.add("bounce");
          }
        } else if (/usagi/i.test(s.title)) {
          const usagiLines = activeCastSpeak().usagi || [];
          const l = usagiLines[Math.floor(Math.random() * usagiLines.length)];
          if (l) speakAs(l, "usagi");
          card.classList.remove("bounce"); void card.offsetWidth; card.classList.add("bounce");
        }
      } else box.style.display = "none";
      SFX.tap();
    };
    view.append(card);
  });
  document.getElementById("sgBk").onclick = renderProfile;
}

function renderFoodGallery() {
  view.innerHTML = "";
  view.append(el(`<div class="backrow"><button class="iconbtn" id="fgBk">←</button>
    <h3 style="margin:0">🍜 Food Gallery <span class="muted">real art from the show</span></h3></div>`));
  view.append(el(`<div class="muted" style="margin:0 4px 12px">every real Chiikawa food image we've tracked down, all in one place —
    tap any dish to hear it said out loud. 🔒 just means you haven't won it from a quiz yet, but it's still yours to enjoy!</div>`));
  const items = SNACKS.filter(sn => LOCAL_FOOD[sn.id]);
  if (!items.length) {
    view.append(el(`<div class="card wob center muted">no real food art installed yet — check back later!</div>`));
  } else {
    const grid = el(`<div class="foodgrid"></div>`);
    items.forEach(sn => {
      const n = (S.snacks || {})[sn.id] || 0;
      const cell = el(`<button class="card foodcell ${n ? "" : "locked"}">
          <img src="${LOCAL_FOOD[sn.id]}" alt="${esc(sn.en)}">
          ${n ? "" : `<span class="lockbadge">🔒 unlock via quizzes</span>`}
          <div class="fname">${esc(sn.hanzi)}</div>
          <div class="pinyin">${esc(sn.pinyin)}</div>
          <div class="muted" style="font-size:.78rem">${esc(sn.en)}</div>
        </button>`);
      cell.onclick = () => snackDetailPopup(sn);
      grid.appendChild(cell);
    });
    view.append(grid);
  }
  document.getElementById("fgBk").onclick = () => renderProfile();
}

/* ---------- profile (friends, snacks, stats, settings) ---------- */
function renderProfile() {
  view.innerHTML = "";
  const learned = learnedWordCount();
  const starSum = Object.values(S.stars || {}).reduce((a, b) => a + b, 0);
  const others = allProfileNames().filter(n => n !== activeProfileName());
  view.append(el(`<div class="profile-switch wob">
      <span>👤 <b>${esc(activeProfileName())}</b>${S.fullAccess ? ' <span class="badge">full access</span>' : ""}</span>
      ${others.map(n => `<button class="btn small ghost" data-switch="${esc(n)}">switch to ${esc(n)}</button>`).join("")}
    </div>`));
  view.querySelectorAll("[data-switch]").forEach(b => b.onclick = () => switchProfile(b.dataset.switch));
  view.append(el(`<h2 class="page-title">🌸 ${esc(activeProfileName())}'s page</h2>`));
  const li = levelInfo(S.xp);
  // Doraemon world: the license itself headlines Doraemon (not Gian) and reskins
  // into his in-universe gadget-order slip from the 22nd-century Future Department Store.
  const isDoraemon = S.theme === "doraemon";
  const heroId = isDoraemon ? "hachiware" : "usagi";
  const heroLines = activeCastSpeak()[heroId] || [];
  const licCopy = isDoraemon
    ? { title: "ひみつ道具 使用許可証 · GADGET LICENSE", stamp: "認<br>可", foot: "22世紀 未来デパート · ひみつ道具センター" }
    : { title: "討伐ライセンス · HUNTER LICENSE", stamp: "合<br>格", foot: "呀哈学院 YAHA ACADEMY" };
  const lic = el(`<div class="license wob">
      <div class="lic-head"><span class="lic-title">${licCopy.title}</span><span class="lic-yaha">ヤハ!</span></div>
      <div class="lic-body">
        <div class="lic-photo bob">${art(heroId, "cheer", 100)}</div>
        <div class="lic-fields">
          <div class="lic-name">${esc(activeProfileName().toUpperCase())} <span class="lic-lv">LV${li.lv}</span></div>
          <div class="lic-rank">${esc(li.title)}<br><span class="muted">${esc(li.titleEn)}</span></div>
          <div class="lic-xpbar"><div class="lic-xpfill" style="width:${li.pct}%"></div></div>
          <div class="lic-xptext">✨ ${S.xp} xp${li.need ? ` · ${li.need} to LV${li.lv + 1}` : " · MAX RANK"}</div>
        </div>
        <div class="lic-stamp">${licCopy.stamp}</div>
      </div>
      <div class="lic-foot"><span>${licCopy.foot}</span><span class="lic-barcode">${"▮▯▮▮▯▮▯▮▮▯▮▮▮▯▮▯▮▮▯▮▮▯▮▯▮"}</span><span>🇹🇼 valid: TAIWAN 2026</span></div>
    </div>`);
  lic.onclick = () => { const l = heroLines[Math.floor(Math.random() * heroLines.length)]; if (l) speakAs(l, heroId); lic.classList.remove("bounce"); void lic.offsetWidth; lic.classList.add("bounce"); };
  view.append(lic);
  // hero mascot welcomes on profile — random scream
  setTimeout(() => { const l = heroLines[Math.floor(Math.random() * heroLines.length)]; if (l) speakAs(l, heroId); }, 400);
  view.append(el(`<div class="card wob">
      <div class="cardrow" style="justify-content:space-around;text-align:center">
        <span>🔥<br><b>${S.streak.count}</b><br><span class="muted">streak</span></span>
        <span>🌟<br><b>${todayXP()}/${DAY_GOAL}</b><br><span class="muted">today</span></span>
        <span>⭐<br><b>${starSum}</b><br><span class="muted">stars</span></span>
        <span>📖<br><b>${learned}</b><br><span class="muted">words</span></span>
      </div>
      <div class="hskbar"><div class="hskfill" style="width:${Math.round(learned / D.vocab.length * 100)}%"></div></div>
      <div class="muted center">${Math.round(learned / D.vocab.length * 100)}% of HSK 1</div></div>`));
  const tripDate = new Date((S.tripDate || DEFAULT_TRIP) + "T00:00:00");
  const tripFmt = tripDate.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  const tripTitle = isDoraemon ? "🚪 Anywhere Door to Taiwan" : "✈️ Taiwan trip";
  const trip = el(`<div class="card yellow wob"><h3>${tripTitle}</h3>
      <div class="cardrow" style="align-items:center"><b style="font-size:1.6rem">${tripDays()}</b> days to go ·
      <span style="font-weight:800">${esc(tripFmt)}</span></div></div>`);
  trip.onclick = () => { const l = heroLines[Math.floor(Math.random() * heroLines.length)]; if (l) speakAs(l, heroId); trip.classList.remove("bounce"); void trip.offsetWidth; trip.classList.add("bounce"); };
  view.append(trip);
  if (isDoraemon) {
    // 4D Pocket "gadgets deployed today" flavor readout — reuses existing stats,
    // no new mechanic or persisted state, just Doraemon-flavored copy on real numbers.
    const gadgets = el(`<div class="card wob"><h3>🎒 4D Pocket — today's gadget log</h3>
        <div class="muted" style="font-size:.82rem;line-height:1.9">
          🌀 <b>Time Furoshiki</b> (タイムふろしき) wrapped <b>${S.streak.count}</b> day${S.streak.count === 1 ? "" : "s"} into today's streak<br>
          📺 <b>Dream TV</b> (ゆめテレビ) has catalogued <b>${starSum}</b> star${starSum === 1 ? "" : "s"} of gadgets so far<br>
          🥞 <b>If-Phone Booth</b> (もしもボックス) wished up <b>${learned}</b> dorayaki-worth of words learned
        </div></div>`);
    view.append(gadgets);
  }
  const fg = el(`<button class="btn big yellow" style="margin:10px auto;display:block">🍜 Food Gallery — see the real show art</button>`);
  fg.onclick = renderFoodGallery;
  view.append(fg);
  const sg = el(`<button class="btn big pink" style="margin:10px auto;display:block">🎵 Song corner — themes & fan bangers</button>`);
  sg.onclick = renderSongs;
  view.append(sg);
  renderFriendsInto(view);
  const st = S.stats;
  view.append(el(`<div class="card center">
      <h3 style="margin:0 0 8px">📊 Quiz record</h3>
      <div style="display:flex;flex-wrap:wrap;gap:6px;justify-content:center;align-items:center">
        <span style="background:#fff;border:2px solid #4a3f35;border-radius:14px;padding:3px 10px;font-weight:700;display:inline-flex;gap:4px;align-items:center">📝 ${st.quiz} answered</span>
        <span style="background:#fff;border:2px solid #4a3f35;border-radius:14px;padding:3px 10px;font-weight:700;display:inline-flex;gap:4px;align-items:center">✅ ${st.quiz ? Math.round(st.correct / st.quiz * 100) : 0}% right</span>
        <span style="background:#fff;border:2px solid #4a3f35;border-radius:14px;padding:3px 10px;font-weight:700;display:inline-flex;gap:4px;align-items:center">🎤 ${st.spoken} spoken</span>
        <span style="background:#fff;border:2px solid #4a3f35;border-radius:14px;padding:3px 10px;font-weight:700;display:inline-flex;gap:4px;align-items:center">✍️ ${st.written} written</span>
      </div></div>`));
  const pin = el(`<div class="card wob"><h3>拼 Pinyin</h3>
      <div class="muted">hide pinyin to practice reading real characters — tap any blurred pinyin to peek</div>
      <button class="btn small ${S.showPinyin === false ? "pink" : "mint"}" id="pinToggle" style="margin-top:8px">${S.showPinyin === false ? "hidden — show it" : "shown — hide it"}</button></div>`);
  pin.querySelector("#pinToggle").onclick = () => { togglePinyin(); renderProfile(); };
  view.append(pin);
  const spk = el(`<div class="card wob"><h3>🎤 Speaking practice</h3>
      <div class="muted">turn this off any time she'd rather not talk out loud — speaking tasks switch to listen-and-repeat instead, no mic needed</div>
      <button class="btn small ${S.speakingOn === false ? "pink" : "mint"}" id="spkToggle" style="margin-top:8px">${S.speakingOn === false ? "off — turn it back on" : "on — turn it off"}</button></div>`);
  spk.querySelector("#spkToggle").onclick = () => { S.speakingOn = S.speakingOn === false ? true : false; save(); renderProfile(); };
  view.append(spk);
  const backup = el(`<div class="card wob">
      <h3>📤 Backup &amp; progress code</h3>
      <div class="muted">Her progress lives only on this device's browser. Tap "get code" any time to
        back it up or move it to another device/browser — and it's the easiest way to show someone
        exactly what she's done.</div>
      <div class="cardrow" style="justify-content:flex-start;flex-wrap:wrap">
        <button class="btn small blue" id="bkGet">get progress code</button>
        <button class="btn small mint" id="bkShow">restore from a code</button>
      </div>
      <textarea id="bkArea" readonly rows="3" style="display:none;width:100%;margin-top:8px;font-size:.72rem;padding:8px;border:2px solid var(--ink);border-radius:10px;background:var(--paper2)"></textarea>
      <div id="bkMsg" class="muted" style="margin-top:6px"></div>
    </div>`);
  backup.querySelector("#bkGet").onclick = () => {
    const code = btoa(unescape(encodeURIComponent(JSON.stringify(S))));
    const ta = backup.querySelector("#bkArea");
    ta.value = code; ta.style.display = "block"; ta.select();
    navigator.clipboard?.writeText(code).then(
      () => { backup.querySelector("#bkMsg").textContent = "✅ copied to clipboard — paste it anywhere to save it (text, notes, email to yourself)"; },
      () => { backup.querySelector("#bkMsg").textContent = "selected below — copy it manually (clipboard blocked here)"; }
    );
  };
  backup.querySelector("#bkShow").onclick = () => {
    const ta = backup.querySelector("#bkArea");
    ta.readOnly = false; ta.value = ""; ta.placeholder = "paste a progress code here, then tap restore";
    ta.style.display = "block"; ta.focus();
    const btn = el(`<button class="btn small pink" style="margin-top:6px">restore this code</button>`);
    btn.onclick = () => {
      try {
        const parsed = JSON.parse(decodeURIComponent(escape(atob(ta.value.trim()))));
        parsed._v = (S._v || 0) + 1000; // an explicit restore always wins the freshness check
        for (const k of Object.keys(S)) delete S[k];
        Object.assign(S, blankState(), parsed);
        save();
        backup.querySelector("#bkMsg").textContent = "✅ restored! reloading…";
        setTimeout(() => location.reload(), 900);
      } catch { backup.querySelector("#bkMsg").textContent = "❌ that code didn't look right — check you copied the whole thing"; }
    };
    backup.append(btn);
  };
  view.append(backup);
  const statsView = el(`<div class="card wob">
      <h3>📊 What she's done — plain numbers</h3>
      <div class="muted" style="font-size:.82rem;line-height:1.7">
        Level ${levelInfo(S.xp).lv} (${esc(levelInfo(S.xp).title)}) · ${S.xp} total xp<br>
        ${learned}/${D.vocab.length + (S.hsk2Open ? (window.YAHA_HSK2 || []).length : 0)} words learned ·
        ${starSum} stars earned · ${S.streak.count} day streak<br>
        ${S.stats.quiz} quiz answers (${S.stats.quiz ? Math.round(S.stats.correct / S.stats.quiz * 100) : 0}% right) ·
        ${S.stats.spoken} spoken · ${S.stats.written} written<br>
        ${Object.keys(S.snacks || {}).length} snacks won · ${Object.keys(S.metFriends || {}).length + 3} friends met
      </div></div>`);
  view.append(statsView);
  const vc = el(`<button class="btn small ghost" style="margin:4px auto;display:block">🩺 sound & mic check</button>`);
  vc.onclick = voiceCheck;
  view.append(vc);
}

/* ---------- boot ---------- */
if (!D.vocab.length) {
  view.innerHTML = "";
  view.append(el(`<div class="card yellow center"><div class="mascot-inline">${art("chiikawa", "sad", 72)}</div>
    <h3>Content pack missing!</h3><div class="muted">data.js didn't load — refresh once online.</div></div>`));
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
