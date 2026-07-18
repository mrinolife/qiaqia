
window.addEventListener("load", () => setTimeout(() => {
  const out = [];
  const ok = (c, m) => out.push((c ? "PASS " : "FAIL ") + m);
  try {
    const N = window.ALL_NODES;
    const l2units = UNITS.filter(u => u.lvl === 2);
    ok(l2units.length >= 10, "lvl2 units built: " + l2units.length);
    ok(l2units.filter(u => u.nodes.some(n => n.kind === "phrases")).length === 9, "9 HSK2 units have phrase nodes");
    ok(l2units.filter(u => u.nodes.some(n => n.kind === "story")).length === 4, "4 HSK2 units have story nodes");
    const gym = UNITS.find(u => u.id === "h-gram");
    ok(!!gym && gym.nodes.filter(n => n.kind === "grammar").length === 4 && gym.nodes[gym.nodes.length-1].kind === "exam", "grammar gym II: 4 lessons + exam");
    ok(N.some(n => n.id === "h-body-story"), "doctor story node in path");
    // render path + DOM checks
    if (typeof renderPath === "function") renderPath(false);
    ok(!!document.querySelector(".l2-gate"), "L2 gate rendered");
    ok(!!document.querySelector(".biome-lantern"), "lantern biome rendered");
    ok(!!document.querySelector(".biome-star"), "star biome rendered");
    ok(document.querySelectorAll(".unit-group").length === UNITS.length, "all unit groups rendered: " + document.querySelectorAll(".unit-group").length);
    // exercise an HSK2 phrases node + grammar node + story end-to-end entry
    const pn = N.find(n => n.id === "h-people-p0");
    ok(!!pn, "h-people phrases node exists");
    startNode(pn, () => {});
    ok(!!document.querySelector(".sess-top") || !!document.getElementById("sBody"), "phrase session started");
    const gn = N.find(n => n.id === "h-gram-g0");
    startNode(gn, () => {});
    ok(document.body.innerHTML.includes("比"), "grammar lesson shows 比 point");
    const sn = N.find(n => n.id === "h-things-story");
    startNode(sn, () => {});
    ok(document.body.innerHTML.includes("Bargain hunting"), "story session shows Bargain hunting");
    // tokenizer upgrade: HSK2 word stays whole
    ok(JSON.stringify(tokenize("我们一起去游泳吧")).includes("游泳"), "tokenize keeps 游泳 whole");
    // completed-unit trophy state
    UNITS[0].nodes.forEach(n => { S.stars = S.stars || {}; S.stars[n.id] = 3; });
    renderPath(false);
    ok(!!document.querySelector(".unit-banner.complete .unit-trophy") || !!document.querySelector(".unit-trophy"), "trophy shows on completed unit");
    // doraemon theme parity render
    S.theme = "doraemon"; renderPath(false);
    ok(!!document.querySelector(".l2-gate.doraemon"), "doraemon L2 gate variant renders");
  } catch (e) { out.push("FAIL exception: " + (e.stack || e)); }
  const pre = document.createElement("pre"); pre.id = "smokeout";
  pre.textContent = out.join("\n") + "\nSMOKE " + (out.some(l => l.startsWith("FAIL")) ? "FAILED" : "PASSED");
  document.body.appendChild(pre);
}, 800));

/* visual mode for screenshots: ?gate scrolls the L2 gate into view (chiikawa theme) */
if (location.search.includes("gate")) window.addEventListener("load", () => setTimeout(() => {
  S.theme = location.search.includes("dora") ? "doraemon" : "chiikawa";
  renderPath(false);
  setTimeout(() => { const g = document.querySelector(".l2-gate"); if (g) g.scrollIntoView({ block: "start" }); window.scrollBy(0, -80); }, 300);
}, 1200));
