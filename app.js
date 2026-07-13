/* QiaQia 恰恰 — HSK1 + Taiwan-survival Chinese, chiikawa-style.
   All five skills: reading (cards/lessons), listening (audio quizzes, dialogues),
   speaking (mic check + shadowing), writing (stroke order), grammar (patterns + scrambles).
   Progress lives in localStorage. Content: data.js (HSK1 core) + taiwan.js (realism pack). */

"use strict";

/* ================= state ================= */
const QQ_BUILD = "b13-chibi-voices";
const LS_KEY = "qq_state_v1";
const PROFILES_KEY = "qq_profiles_v1";
const DEFAULT_TRIP = "2026-08-25";

/* real progress captured by actually playing unit 1's word + phrase lessons —
   not hand-authored — stopped right before the exam, matching where she really is. */
const RACHEL_SEED = {"doneLessons": {}, "srs": {"v42": {"box": 1, "due": 1783936774575}, "v105": {"box": 1, "due": 1783936775801}, "v106": {"box": 1, "due": 1783936777001}, "v107": {"box": 1, "due": 1783936778218}, "v108": {"box": 1, "due": 1783936790450}, "v109": {"box": 1, "due": 1783936791034}, "v110": {"box": 1, "due": 1783936791633}}, "xp": 48, "streak": {"last": "2026-07-12", "count": 1}, "tripDate": "2026-08-25", "stats": {"quiz": 51, "correct": 16, "spoken": 0, "written": 0}, "snacks": {}, "metFriends": {}, "activeDays": {"2026-07-12": 1}, "daily": {}, "name": "Rachel", "wrong": {"v107": 12, "v42": 2, "v105": 8, "v106": 1, "v108": 3, "v109": 8, "v110": 9}, "speakingOn": true, "dayXP": {"2026-07-12": 48}, "stars": {"u1-w0": 1, "u1-w1": 1, "u1-p0": 1}}
;
const JZN_SEED = { name: "jzn", fullAccess: true, hsk2Open: true };

function stateKey(name) { return LS_KEY + "::" + name; }
function loadProfiles() {
  let idx;
  try { idx = JSON.parse(localStorage.getItem(PROFILES_KEY)); } catch { idx = null; }
  if (idx && idx.names && idx.names.length) return idx;
  // first run under the profile system — migrate whatever's really on this device
  // (if anything) into Rachel's profile so nothing already saved is ever lost
  const legacy = localStorage.getItem(LS_KEY);
  localStorage.setItem(stateKey("Rachel"), legacy || JSON.stringify(RACHEL_SEED));
  localStorage.setItem(stateKey("jzn"), JSON.stringify(Object.assign(blankState(), JZN_SEED)));
  idx = { names: ["Rachel", "jzn"], active: "Rachel" };
  localStorage.setItem(PROFILES_KEY, JSON.stringify(idx));
  return idx;
}
function activeProfileName() { return loadProfiles().active; }
function allProfileNames() { return loadProfiles().names; }
function switchProfile(name) {
  const idx = loadProfiles();
  idx.active = name;
  localStorage.setItem(PROFILES_KEY, JSON.stringify(idx));
  location.reload();
}

function loadState() {
  try { return Object.assign(blankState(), JSON.parse(localStorage.getItem(stateKey(activeProfileName())) || "{}")); }
  catch { return blankState(); }
}
function blankState() {
  return { doneLessons: {}, srs: {}, xp: 0, streak: { last: "", count: 0 }, tripDate: DEFAULT_TRIP,
           stats: { quiz: 0, correct: 0, spoken: 0, written: 0 }, snacks: {}, metFriends: {},
           activeDays: {}, daily: {}, name: "Rachel", wrong: {}, speakingOn: true };
}
const S = loadState();
S.tripDate = "2026-08-25"; // set in stone — the date picker is gone, this can no longer drift
function save() { S._v = (S._v || 0) + 1; localStorage.setItem(stateKey(activeProfileName()), JSON.stringify(S)); }

/* resync guard: fixes progress "resetting" after backgrounding/resuming the app.
   S lives in memory for the whole page lifetime; iOS Safari (and any browser's
   bfcache) can resume a suspended tab WITHOUT re-running this script, leaving S
   stale. The next save() from that stale tab would silently overwrite anything
   saved elsewhere in the meantime. _v is a monotonic save counter — on resume we
   only adopt localStorage's copy if it's strictly newer, so neither side can ever
   clobber the other. */
function resyncFromStorage() {
  let fresh;
  try { fresh = JSON.parse(localStorage.getItem(stateKey(activeProfileName())) || "{}"); } catch { return; }
  if ((fresh._v || 0) <= (S._v || 0)) return;
  for (const k of Object.keys(S)) delete S[k];
  Object.assign(S, blankState(), fresh);
  if (typeof go === "function") {
    const active = document.querySelector("#tabs .tab.active, #sideNav .tab.active");
    go(active ? active.dataset.tab : "home");
  }
}
document.addEventListener("visibilitychange", () => { if (document.visibilityState === "visible") resyncFromStorage(); });
window.addEventListener("pageshow", e => { if (e.persisted) resyncFromStorage(); });
window.addEventListener("focus", resyncFromStorage);
window.addEventListener("storage", e => { if (e.key === LS_KEY) resyncFromStorage(); });
function today() { return new Date().toISOString().slice(0, 10); }
function bumpStreak() {
  const t = today();
  S.activeDays = S.activeDays || {};
  S.activeDays[t] = 1;
  if (S.streak.last === t) { save(); return; }
  const y = new Date(Date.now() - 864e5).toISOString().slice(0, 10);
  S.streak.count = (S.streak.last === y) ? S.streak.count + 1 : 1;
  S.streak.last = t; save(); renderStreak();
}
/* hunter-license levels — 草むしり to 討伐, like the manga certifications */
const LEVELS = [
  [0, "草むしり見習い", "weed-pulling trainee"],
  [30, "草むしり検定5級", "weeding cert · level 5"],
  [80, "草むしり検定3級", "weeding cert · level 3"],
  [150, "草むしり検定1級", "weeding cert · level 1"],
  [250, "討伐見習い", "monster-hunt trainee"],
  [380, "討伐5級", "hunter · rank 5"],
  [550, "討伐3級", "hunter · rank 3"],
  [750, "討伐1級", "hunter · rank 1"],
  [1000, "スーパーアルバイター", "super part-timer"],
  [1300, "ヤハ級ハンター", "YAHA-class hunter"],
];
function levelInfo(xp) {
  let lv = 1;
  for (let i = 0; i < LEVELS.length; i++) if (xp >= LEVELS[i][0]) lv = i + 1;
  const cur = LEVELS[lv - 1], next = LEVELS[lv] || null;
  const base = cur[0], top = next ? next[0] : cur[0] + 350;
  return { lv, title: cur[1], titleEn: cur[2], pct: Math.min(100, Math.round((xp - base) / (top - base) * 100)), need: next ? top - xp : 0 };
}
const DAY_GOAL = 20;
function addXP(n) {
  const before = levelInfo(S.xp).lv;
  S.xp += n;
  S.dayXP = S.dayXP || {};
  S.dayXP[today()] = (S.dayXP[today()] || 0) + n;
  save(); checkUnlocks();
  const li = levelInfo(S.xp);
  if (li.lv > before) {
    confetti();
    setTimeout(() => { toast(`呀哈!! LEVEL UP!! LV${li.lv} · ${li.title}`); speakAs("呀哈", "usagi"); }, 600);
  }
}
function todayXP() { return (S.dayXP || {})[today()] || 0; }

/* ================= data ================= */
const D = window.QIAQIA_DATA || { vocab: [], phrases: [], dialogues: [], tones: [] };
const T = window.QIAQIA_TAIWAN || { grammar: [], scenarios: [], dialogues: [], culture: [] };
const CHATS = window.QIAQIA_CHATS || [];
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
  // words she has actually met = everything the path engine put in the SRS deck
  return Object.keys(S.srs || {}).map(id => D.vocab.find(v => v.id === id)).filter(Boolean);
}
function quizPool() { const w = learnedWords(); return w.length >= 8 ? w : D.vocab.slice(0, 30); }

/* weak-word tracking: misses raise a word's heat, hits cool it down */
function noteWrong(id) { S.wrong = S.wrong || {}; S.wrong[id] = (S.wrong[id] || 0) + 2; save(); }
function noteRight(id) { S.wrong = S.wrong || {}; if (S.wrong[id]) { S.wrong[id] = Math.max(0, S.wrong[id] - 1); save(); } }
function weakWords() {
  return Object.entries(S.wrong || {}).filter(([, n]) => n >= 2)
    .map(([id, n]) => ({ w: D.vocab.find(v => v.id === id), n })).filter(x => x.w)
    .sort((a, b) => b.n - a.n).map(x => x.w);
}

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
/* real audio pack (neural TTS clips shipped in audio/) — plays everywhere,
   no OS voices needed; browser speechSynthesis is only the fallback */
let AUDIO_IDX = null;
fetch("audio/index.json").then(r => r.ok ? r.json() : null).then(j => { AUDIO_IDX = j; }).catch(() => {});
let qqPlayer = null;
function speak(text, rate, onend) {
  if (window.speechSynthesis) speechSynthesis.cancel();
  if (qqPlayer) { qqPlayer.onended = null; qqPlayer.pause(); qqPlayer = null; }
  if (AUDIO_IDX && AUDIO_IDX[text]) {
    const a = new Audio("audio/" + AUDIO_IDX[text]);
    // old TTS-rate semantics -> playbackRate: default ~1x, turtle ~0.62x
    a.playbackRate = !rate || rate >= 0.8 ? 1 : rate <= 0.55 ? 0.62 : 0.8;
    if (onend) a.onended = onend;
    qqPlayer = a;
    a.play().catch(err => {
      if (err && err.name === "NotAllowedError" && !window.__audioHinted) {
        window.__audioHinted = true;
        toast("🔇 the browser blocked sound — tap any 🔊 button once to enable it");
      }
      ttsSpeak(text, rate, onend);
    });
    return;
  }
  ttsSpeak(text, rate, onend);
}
let warnedNoVoice = false;
function ttsSpeak(text, rate, onend) {
  if (!("speechSynthesis" in window)) return;
  if (!VOICE) pickVoice(); // voices often load late on phones
  if (!VOICE && speechSynthesis.getVoices().length && !warnedNoVoice) {
    warnedNoVoice = true;
    toast("no Chinese voice on this device — run Voice check in Practice 🎤");
  }
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
const MASCOT_NAMES = { chiikawa: "ちいかわ Chiikawa", hachiware: "ハチワレ Hachiware", usagi: "うさぎ Usagi",
                       momonga: "モモンガ Momonga", kurimanju: "くりまんじゅう Kurimanju",
                       rakko: "ラッコ Rakko", shisa: "シーサー Shisa",
                       kani: "カニちゃん Kani-chan", yoroi: "ヨロイさん Yoroi-san", chimera: "あの子 Chimera" };
/* cast roster: 3 friends from the start, the rest unlock as she earns XP */
/* index-paired with CAST[].lines below — same order/length per character —
   so a random line index picks matching display text + spoken audio together */
const CAST_SPEAK = {
  chiikawa:  ["今天也加油!", "小小的努力也是努力!", "呜呜…我们一起学吧"],
  hachiware: ["太好了!", "没关系, 慢慢来~", "能学会的!"],
  usagi:     ["呀哈——!!", "乌拉!! 台湾!! 珍珠奶茶!!", "呀哈!", "呀哈", "呜哇哇哇!!", "呀哈!! 好耶!!"],
  momonga:   ["夸我!!", "看我看我!"],
  kani:      ["加油加油!", "好耶!"],
  kurimanju: ["哈~ 学完喝一杯奶茶吧", "慢慢学, 慢慢吃~"],
  chimera:   ["一起玩吧~", "嘿嘿, 你进步好快!"],
  rakko:     ["不错。", "台湾之前, 每天一课。"],
  yoroi:     ["你很努力, 真棒!", "劳动辛苦了!"],
  shisa:     ["嘿嘿! 今天也练习吧!", "台湾见!"],
};
let CAST_AUDIO_IDX = null;
fetch("audio/cast/index.json").then(r => r.ok ? r.json() : null).then(j => { CAST_AUDIO_IDX = j; }).catch(() => {});
let castPlayer = null;
/* speak a line "as" a specific cast member — plays that character's own
   voice clip if we generated one for this exact text, otherwise falls back
   to the default narrator voice so nothing ever stays silent */
function speakAs(text, castId, rate, onend) {
  const key = castId + "::" + text;
  if (CAST_AUDIO_IDX && CAST_AUDIO_IDX[key]) {
    if (window.speechSynthesis) speechSynthesis.cancel();
    if (castPlayer) { castPlayer.onended = null; castPlayer.pause(); castPlayer = null; }
    const a = new Audio("audio/cast/" + CAST_AUDIO_IDX[key]);
    if (rate) a.playbackRate = rate;
    if (onend) a.onended = onend;
    castPlayer = a;
    a.play().catch(() => speak(text, rate, onend));
    return;
  }
  speak(text, rate, onend);
}
const CAST = [
  { id: "chiikawa",  unlock: 0,    blurb: "small, brave, tries so hard 🥺", lines: ["今天也加油! (jiāyóu — you got this!)", "小小的努力也是努力! tiny effort still counts!", "呜呜…我们一起学吧 — let's learn together!"] },
  { id: "hachiware", unlock: 0,    blurb: "the optimist — 'we can do it!'", lines: ["太好了! ready for a tiny lesson?", "没关系, 慢慢来~ no rush, we'll get there!", "能学会的! we can totally do this!"] },
  { id: "usagi",     unlock: 0,    blurb: "pure chaos. pure joy. 呀哈!!", lines: ["呀哈——!! LESSON TIME!!", "乌拉!! 台湾!! 珍珠奶茶!!", "呀哈! quiz? QUIZ!!", "呀哈!! 好耶!!", "呜哇哇哇!! chaos mode!!", "乌拉!!"] },
  { id: "momonga",   unlock: 100,  blurb: "wants ALL the praise", lines: ["夸我!! praise me!! …and yourself too!", "看我看我! now look at your streak!!"] },
  { id: "kani",      unlock: 220,  blurb: "snip snip! your cheeriest senpai", lines: ["加油加油! ✂️ snip those flashcards!", "好耶! another lesson down!"] },
  { id: "kurimanju", unlock: 360,  blurb: "sleepy gourmet elder. 哈~", lines: ["哈~ 学完喝一杯奶茶吧 (milk tea after this)", "慢慢学, 慢慢吃~ learn slow, eat slow"] },
  { id: "chimera",   unlock: 520,  blurb: "mysterious lil winged friend", lines: ["一起玩吧~ let's play a round!", "嘿嘿, 你进步好快! you're getting fast!"] },
  { id: "rakko",     unlock: 700,  blurb: "the cool 討伐 pro senpai", lines: ["不错。 keep training.", "台湾之前, 每天一课。 one lesson a day."] },
  { id: "yoroi",     unlock: 900,  blurb: "kindest knight, biggest fan of effort", lines: ["你很努力, 真棒! so diligent!", "劳动辛苦了! good work today!"] },
  { id: "shisa",     unlock: 1100, blurb: "guardian of the trip! 一路平安", lines: ["嘿嘿! 今天也练习吧!", "台湾见! see you in Taiwan!"] },
];
function unlockedCast() { return CAST.filter(c => S.xp >= c.unlock); }

/* snack shelf: foods from the show + taiwan treats — each teaches its Chinese name.
   chats.js ships the full 30-food set with real order-phrases; this is the fallback. */
const SNACKS_FALLBACK = [
  { id: "ramen",    emoji: "🍜", name: "Ron-style ramen",   hanzi: "拉面",     pinyin: "lāmiàn",        en: "ramen" },
  { id: "hamburg",  emoji: "🍖", name: "reward hamburg steak", hanzi: "汉堡排", pinyin: "hànbǎopái",    en: "hamburg steak" },
  { id: "parfait",  emoji: "🍨", name: "celebration parfait", hanzi: "圣代",   pinyin: "shèngdài",      en: "parfait / sundae" },
  { id: "onigiri",  emoji: "🍙", name: "onigiri",           hanzi: "饭团",     pinyin: "fàntuán",       en: "rice ball" },
  { id: "pancake",  emoji: "🥞", name: "fluffy pancakes",   hanzi: "松饼",     pinyin: "sōngbǐng",      en: "pancakes" },
  { id: "beer",     emoji: "🍺", name: "kurimanju's usual", hanzi: "啤酒",     pinyin: "píjiǔ",         en: "beer" },
  { id: "edamame",  emoji: "🫛", name: "beer snack edamame", hanzi: "毛豆",    pinyin: "máodòu",        en: "edamame" },
  { id: "boba",     emoji: "🧋", name: "Taiwan boba",       hanzi: "珍珠奶茶", pinyin: "zhēnzhū nǎichá", en: "bubble milk tea" },
  { id: "xlb",      emoji: "🥟", name: "soup dumplings",    hanzi: "小笼包",   pinyin: "xiǎolóngbāo",   en: "soup dumplings" },
  { id: "jipai",    emoji: "🍗", name: "night-market chicken", hanzi: "鸡排",  pinyin: "jīpái",         en: "fried chicken cutlet" },
  { id: "mangoice", emoji: "🥭", name: "mango shaved ice",  hanzi: "芒果冰",   pinyin: "mángguǒbīng",   en: "mango ice" },
  { id: "sweetpotato", emoji: "🍠", name: "roasted sweet potato", hanzi: "烤地瓜", pinyin: "kǎo dìguā",  en: "roast sweet potato" },
];
const SNACKS = (window.QIAQIA_FOODS && window.QIAQIA_FOODS.length >= 12) ? window.QIAQIA_FOODS : SNACKS_FALLBACK;
function awardSnack() {
  S.snacks = S.snacks || {};
  const snack = shuffle(SNACKS)[0];
  S.snacks[snack.id] = (S.snacks[snack.id] || 0) + 1;
  save();
  setTimeout(() => { toast(`${snack.emoji} got a snack: ${snack.hanzi} ${snack.pinyin}!`); speak(snack.hanzi); }, 1200);
}
function checkUnlocks() {
  S.metFriends = S.metFriends || {};
  const fresh = unlockedCast().filter(c => !S.metFriends[c.id] && c.unlock > 0);
  fresh.forEach(c => S.metFriends[c.id] = true);
  save();
  if (fresh.length) {
    const c = fresh[0];
    confetti();
    const uclip = (typeof animGIF === "function" && animGIF("celebrate", 140)) || "";
    const ov = el(`<div class="unlock-pop"><div class="card pink bigcard">
        ${uclip ? `<div class="done-clip">${uclip}</div>` : ""}
        <div class="wobble" ${uclip ? 'style="display:none"' : ""}>${mascotSVG(c.id, 110)}</div>
        <h3>新朋友! new friend!</h3>
        <div><b>${esc(MASCOT_NAMES[c.id])}</b></div>
        <div class="muted">${esc(c.blurb)}</div>
        <button class="btn yellow" style="margin-top:10px">哇!!</button></div></div>`);
    ov.querySelector("button").onclick = () => ov.remove();
    document.body.appendChild(ov);
  }
}

/* local-only art overrides: drop chars/<id>.png next to the app (gitignored,
   never pushed) and that character uses the image instead of the drawn SVG */
const LOCAL_ART = {}, LOCAL_SCENES = {};
// local-art probe only where it can exist (jzn's machine) — keeps the public site's console clean
fetch("chars/manifest.json").then(r => r.ok ? r.json() : null).then(m => {
  if (!m) return;
  (m.chars || []).forEach(k => { LOCAL_ART[k] = `chars/${k}.png`; });
  Object.entries(m.scenes || {}).forEach(([k, f]) => { LOCAL_SCENES[k] = `chars/${f}`; });
  // wallpaper override removed — the path map needs the clean meadow background
  const brand = document.getElementById("brandMascot");
  if (brand) brand.innerHTML = mascotSVG("usagi", 38);
  if (document.querySelector(".path-hero")) renderPath();
}).catch(() => {});

// real show-art snack overrides: chars/food/<id>.png + manifest, shipped publicly —
// listed foods render their real fan-art image instead of the plain emoji.
const LOCAL_FOOD = {};
fetch("chars/food/manifest.json").then(r => r.ok ? r.json() : null).then(m => {
  if (!m) return;
  (m.foods || []).forEach(k => { LOCAL_FOOD[k] = `chars/food/${k}.png`; });
}).catch(() => {});
function snackArt(sn, size) {
  const s = size || 40;
  if (LOCAL_FOOD[sn.id]) return `<img src="${LOCAL_FOOD[sn.id]}" width="${s}" height="${s}" style="object-fit:cover;border-radius:10px" alt="">`;
  return null;
}

function mascotSVG(kind, size) {
  const s = size || 96;
  if (LOCAL_ART[kind]) return `<img src="${LOCAL_ART[kind]}" width="${s}" height="${s}" style="object-fit:contain" alt="">`;
  return "";
}
document.getElementById("brandMascot").innerHTML = mascotSVG("usagi", 38);

/* ================= router ================= */
const tabs = document.querySelectorAll("#tabs .tab, #sideNav .tab");
tabs.forEach(b => b.addEventListener("click", () => go(b.dataset.tab)));
function go(tab) {
  tabs.forEach(b => b.classList.toggle("active", b.dataset.tab === tab));
  speechSynthesis && speechSynthesis.cancel();
  ({ home: renderPath, learn: renderPath, cards: renderReview, quiz: renderPractice,
     phrases: renderTravel, talk: renderTalk, profile: renderProfile }[tab] || renderPath)();
  window.scrollTo(0, 0);
  maybePeek();
  renderSideStats();
}

/* desktop-only persistent status rail (≥900px; harmless no-op elsewhere) */
function renderSideStats() {
  const rail = document.getElementById("sideStats");
  if (!rail) return;
  rail.innerHTML = "";
  try {
    const xp = S.xp || 0;
    const li = levelInfo(xp);
    const due = dueCards();
    const learned = learnedWordCount();
    const total = (D.vocab && D.vocab.length) || 1;
    rail.append(el(`<div class="card wob sidebar-card">
        <div class="sidebar-id">
          <span class="sidebar-avatar">${art("usagi", "happy", 64)}</span>
          <div class="sidebar-idtext">
            <div class="lic-lv" style="margin-left:0">LV${li.lv}</div>
            <div class="lic-rank" style="margin:2px 0 0">${esc(li.title)}<br><span class="muted">${esc(li.titleEn)}</span></div>
          </div>
        </div>
        <div class="lic-xpbar sidebar-xpbar"><div class="lic-xpfill" style="width:${li.pct}%"></div></div>
        <div class="lic-xptext">✨ ${xp} xp${li.need ? ` · ${li.need} to LV${li.lv + 1}` : " · MAX RANK"}</div>
      </div>`));
    rail.append(el(`<div class="card wob sidebar-card sidebar-chips">
        <span class="chip">🔥 ${(S.streak && S.streak.count) || 0} day streak</span>
        <span class="chip ${todayXP() >= DAY_GOAL ? "chip-done" : ""}">🌟 ${Math.min(todayXP(), DAY_GOAL)}/${DAY_GOAL} today</span>
        <span class="chip">✈️ ${tripDays()} days to Taiwan</span>
        <span class="chip">📖 ${learned}/${total} words</span>
      </div>`));
    if (due.length > 0) {
      const btn = el(`<button class="btn small pink sidebar-review-btn">🎴 ${due.length} due — review now</button>`);
      btn.onclick = () => startReview(renderPath);
      rail.append(btn);
    }
  } catch (e) { /* defensive: never let the rail crash boot/render */ }
}
/* a friend occasionally peeks in to cheer */
function maybePeek() {
  if (Math.random() > 0.22 || document.querySelector(".peek")) return;
  // usagi is the favorite — she peeks in half the time
  const c = Math.random() < 0.5 ? CAST.find(x => x.id === "usagi") : shuffle(unlockedCast())[0];
  const idx = Math.floor(Math.random() * c.lines.length);
  const line = c.lines[idx];
  const pk = el(`<button class="peek">${mascotSVG(c.id, 64)}</button>`);
  pk.onclick = () => {
    toast(line);
    const spoken = (CAST_SPEAK[c.id] || [])[idx];
    if (spoken) speakAs(spoken, c.id);
    pk.remove();
  };
  document.body.appendChild(pk);
  setTimeout(() => pk.remove(), 6000);
}
function renderStreak() { document.getElementById("streakN").textContent = S.streak.count; }

function mixContinueBtn() { return null; }

/* ================= home ================= */
/* ================= dictionary ================= */
const LEX = (() => {
  const seen = new Set(), out = [];
  const push = (hanzi, pinyin, en, src) => {
    if (!hanzi || seen.has(hanzi)) return;
    seen.add(hanzi); out.push({ hanzi, pinyin, en, src });
  };
  D.vocab.forEach(v => push(v.hanzi, v.pinyin, v.en, "HSK1"));
  D.phrases.forEach(p => push(p.hanzi, p.pinyin, p.en, "phrase"));
  T.scenarios.forEach(s => s.phrases.forEach(p => push(p.hanzi, p.pinyin, p.en, "travel")));
  SNACKS.forEach(f => push(f.hanzi, f.pinyin, f.en, "food"));
  D.dialogues.concat(T.dialogues).forEach(d => d.turns.forEach(t => push(t.hanzi, t.pinyin, t.en, "line")));
  return out;
})();
const stripTones = s => (s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[\s'’-]/g, "").toLowerCase();

/* Taiwan writes traditional — show 繁體 alongside wherever she'll read signs/menus */
const TRAD = window.QIAQIA_TRAD || {}, TRAD_CHAR = window.QIAQIA_TRAD_CHAR || {};
function tradOf(s) {
  if (!s) return null;
  if (TRAD[s]) return TRAD[s];
  // piecewise over hanzi runs: phrase map first, then per-char fallback
  const out = s.replace(/[一-鿿]+/g, run =>
    TRAD[run] || [...run].map(c => TRAD_CHAR[c] || c).join(""));
  return out !== s ? out : null;
}
const tradChip = s => {
  const t = tradOf(s);
  return t ? `<div class="tradline">繁 ${esc(t)} <span class="muted" style="font-size:.68rem">(what Taiwan signs use)</span></div>` : "";
};

function wordPopup(w) {
  speak(w.hanzi);
  const chars = [...w.hanzi].filter(c => /[一-鿿]/.test(c));
  const ov = el(`<div class="unlock-pop"><div class="card bigcard" style="max-width:340px;width:100%">
      <div class="hanzi-lg">${esc(w.hanzi)}</div>${tradChip(w.hanzi)}
      <div class="pinyin">${esc(w.pinyin)}</div><div class="en">${esc(w.en)}</div>
      <div class="cardrow"><button class="iconbtn" id="wpS">🔊</button><button class="iconbtn" id="wpSlow">🐢</button></div>
      ${chars.length ? `<div class="muted" style="margin-top:8px">tap a character to see its strokes:</div>
      <div class="cardrow" id="wpChars">${chars.map(c => `<button class="tile" data-c="${esc(c)}">${esc(c)}</button>`).join("")}</div>
      <div id="wpWriter" style="display:none;margin:8px auto 0;width:170px;height:170px;background:var(--card);border:2px solid var(--line);border-radius:16px"></div>` : ""}
      <button class="btn small pink" id="wpX" style="margin-top:10px">close</button>
    </div></div>`);
  ov.querySelector("#wpS").onclick = () => speak(w.hanzi);
  ov.querySelector("#wpSlow").onclick = () => speak(w.hanzi, 0.5);
  ov.querySelector("#wpX").onclick = () => ov.remove();
  ov.addEventListener("click", e => { if (e.target === ov) ov.remove(); });
  ov.querySelectorAll("#wpChars .tile").forEach(t => t.onclick = () => {
    const c = t.dataset.c;
    const box = ov.querySelector("#wpWriter");
    box.style.display = "block"; box.innerHTML = "";
    speak(c);
    const single = LEX.find(x => x.hanzi === c);
    if (window.HanziWriter && window.QIAQIA_STROKES && window.QIAQIA_STROKES[c]) {
      HanziWriter.create(box, c, { width: 166, height: 166, padding: 8, showOutline: true,
        strokeColor: "#4a3b30", outlineColor: "#eadfd2",
        charDataLoader: (ch, done) => done(window.QIAQIA_STROKES[ch]) }).animateCharacter();
    } else box.textContent = c;
    if (single) toast(`${c} = ${single.pinyin} · ${single.en}`);
  });
  document.body.appendChild(ov);
}

function renderDict() {
  view.innerHTML = "";
  view.append(
    el(`<div class="backrow"><button class="iconbtn" id="bk">←</button><h3 style="margin:0">🔍 Dictionary <span class="muted">${LEX.length} entries</span></h3></div>`),
    el(`<input id="dictQ" type="search" placeholder="hanzi · pinyin (ni hao) · english" autocomplete="off"
        style="width:100%;padding:12px;border:2.5px solid var(--line);border-radius:16px;font-size:1rem;font-family:inherit;background:var(--card)">`)
  );
  const res = el(`<div></div>`);
  view.append(res);
  const show = q => {
    res.innerHTML = "";
    q = q.trim();
    const nq = stripTones(q);
    const hits = !q ? LEX.slice(0, 25)
      : LEX.filter(w => w.hanzi.includes(q) || stripTones(w.pinyin).includes(nq) || w.en.toLowerCase().replace(/\s/g, "").includes(nq)).slice(0, 40);
    if (!hits.length) { res.append(el(`<div class="card center muted">nothing found — try pinyin without tones, like "nihao"</div>`)); return; }
    hits.forEach(w => {
      const t = tradOf(w.hanzi);
      const row = el(`<button class="lesson"><span class="linfo"><span class="ltitle">${esc(w.hanzi)}${t ? ` <span class="muted" style="font-weight:400">繁 ${esc(t)}</span>` : ""} <span class="pinyin" style="font-size:.9rem">${esc(w.pinyin)}</span></span>
        <br><span class="lsub">${esc(w.en)}</span></span><span class="badge">${esc(w.src)}</span></button>`);
      row.onclick = () => wordPopup(w);
      res.append(row);
    });
  };
  const q = document.getElementById("dictQ");
  q.oninput = () => show(q.value);
  q.focus();
  show("");
  document.getElementById("bk").onclick = () => go("home");
}
document.getElementById("dictBtn").onclick = () => { speechSynthesis && speechSynthesis.cancel(); renderDict(); };
document.getElementById("profileBtn").onclick = () => { speechSynthesis && speechSynthesis.cancel(); renderProfile(); };

/* pinyin visibility: Rachel can hide pinyin to force real character reading.
   Hidden pinyin is blurred, and a tap on it peeks (recall first, verify after). */
function applyPinyinPref() {
  document.body.classList.toggle("hide-pinyin", S.showPinyin === false);
  const b = document.getElementById("pinBtn");
  if (b) b.classList.toggle("off", S.showPinyin === false);
}
function togglePinyin() {
  S.showPinyin = S.showPinyin === false ? true : false;
  save(); applyPinyinPref();
  toast(S.showPinyin === false ? "拼音 hidden — tap any blurred pinyin to peek 👀" : "拼音 shown");
}
document.getElementById("pinBtn").onclick = togglePinyin;
applyPinyinPref();
document.addEventListener("click", e => {
  if (S.showPinyin !== false) return;
  const p = e.target.closest(".pinyin, .ch-pin");
  if (p && !p.closest("button")) p.classList.toggle("reveal");
});

/* ================= friends & snacks ================= */
function renderFriendsInto(view) {
  view.append(el(`<h3 style="margin:16px 4px 4px">Friends 🧺 <span class="muted">${unlockedCast().length}/${CAST.length}</span></h3>`),
    el(`<div class="muted" style="margin:0 4px 8px">everyone from the meadow — keep learning to meet them all!</div>`));
  const grid = el(`<div class="friendgrid"></div>`);
  CAST.forEach(c => {
    const got = S.xp >= c.unlock;
    const cell = el(`<button class="card friendcell ${got ? "" : "locked"}">
        <span class="${got ? "" : "locked-mascot"}">${mascotSVG(c.id, 74)}</span>
        <div class="fname">${got ? esc(MASCOT_NAMES[c.id]) : "???"}</div>
        <div class="muted" style="font-size:.72rem">${got ? esc(c.blurb) : "unlocks at " + c.unlock + " ✨xp"}</div>
      </button>`);
    cell.onclick = () => {
      if (!got) { toast(`${c.unlock - S.xp} more ✨xp to meet this friend!`); return; }
      const idx = Math.floor(Math.random() * c.lines.length);
      toast(c.lines[idx]);
      const spoken = (CAST_SPEAK[c.id] || [])[idx];
      if (spoken) speakAs(spoken, c.id);
    };
    grid.appendChild(cell);
  });
  view.append(grid);
  view.append(el(`<h3 style="margin:16px 4px 4px">Snack shelf 🍱 <span class="muted">${Object.keys(S.snacks || {}).length}/${SNACKS.length}</span></h3>`),
    el(`<div class="muted" style="margin:0 4px 8px">win snacks from quizzes & reviews — tap one to learn its Chinese name!</div>`));
  const shelf = el(`<div class="friendgrid snacks"></div>`);
  SNACKS.forEach(sn => {
    const n = (S.snacks || {})[sn.id] || 0;
    const art = n ? snackArt(sn, 46) : null;
    const cell = el(`<button class="card friendcell ${n ? "" : "locked"}">
        ${art ? art : `<span style="font-size:2.2rem;filter:grayscale(1);opacity:.45">${sn.emoji}</span>`}
        <div class="fname">${n ? esc(sn.hanzi) : "???"}</div>
        <div class="muted" style="font-size:.72rem">${n ? esc(sn.pinyin) + (n > 1 ? " ×" + n : "") : esc(sn.name)}</div>
      </button>`);
    cell.onclick = () => {
      if (!n) { toast("win it from a quiz, review or chat! 加油!"); return; }
      snackDetailPopup(sn);
    };
    shelf.appendChild(cell);
  });
  view.append(shelf);
}

/* shared snack/food detail popup — used by the snack shelf (unlocked items only)
   and the Food Gallery showcase (every item with real art, unlocked or not) */
function snackDetailPopup(sn) {
  speak(sn.hanzi);
  // the food's own real photo always wins when we have one — a generic "eating" clip
  // for a DIFFERENT dish would show mismatched content, so it's never used here
  const foodArt = snackArt(sn, 96);
  const centerpiece = foodArt || `<span style="font-size:3rem">${sn.emoji}</span>`;
  const ov = el(`<div class="unlock-pop"><div class="card yellow bigcard" style="text-align:left">
      <div class="center">${centerpiece}</div>
      <h3 class="center">${esc(sn.hanzi)} <span class="pinyin">${esc(sn.pinyin)}</span></h3>
      <div class="center">${tradChip(sn.hanzi)}</div>
      <div class="center muted">${esc(sn.en)}</div>
      ${sn.order ? `<div class="note" style="margin-top:12px">🗣️ <b>how to order it:</b><br>
        <span class="hz" style="font-size:1.1rem">${esc(sn.order.hanzi)}</span><br>
        <span class="pinyin">${esc(sn.order.pinyin)}</span><br>
        <span class="muted">${esc(sn.order.en)}</span></div>` : ""}
      ${sn.tip ? `<div class="muted" style="margin-top:8px">💡 ${esc(sn.tip)}</div>` : ""}
      <div class="cardrow">${sn.order ? `<button class="btn small blue" id="sayOrder">🔊 say the order</button>` : ""}
        <button class="btn small pink" id="closeSnack">yum!</button></div>
    </div></div>`);
  ov.querySelector("#closeSnack").onclick = () => ov.remove();
  const so = ov.querySelector("#sayOrder");
  if (so) so.onclick = () => speak(sn.order.hanzi, 0.7);
  document.body.appendChild(ov);
}

/* scene backdrops from the meadow world (local official art can override via manifest "scenes") */
function sceneSVG(name) {
  if (LOCAL_SCENES[name]) return `<img src="${LOCAL_SCENES[name]}" style="width:100%;height:100%;object-fit:cover" alt="">`;
  const sky = `<rect width="200" height="60" fill="#c9e9fb"/>
    <circle cx="182" cy="12" r="9" fill="#ffe58a" stroke="#f2c94c" stroke-width="1.5"/>
    <ellipse cx="35" cy="14" rx="14" ry="6" fill="#fff"/><ellipse cx="150" cy="10" rx="18" ry="7" fill="#fff"/>
    <ellipse cx="95" cy="7" rx="10" ry="4.4" fill="#fff" opacity=".9"/>
    <path d="M20 8 l1.2 2.6 2.8.4 -2 2 .5 2.8 -2.5-1.3 -2.5 1.3 .5-2.8 -2-2 2.8-.4 Z" fill="#fff" opacity=".9"/>
    <path d="M120 20 l.9 2 2.1.3 -1.5 1.5 .4 2.1 -1.9-1 -1.9 1 .4-2.1 -1.5-1.5 2.1-.3 Z" fill="#fff" opacity=".7"/>`;
  const grass = `<path d="M0 38 Q50 28 100 36 Q150 42 200 34 L200 60 L0 60 Z" fill="#bfe3a8"/>
    <path d="M0 46 Q60 40 120 47 Q170 51 200 46 L200 60 L0 60 Z" fill="#a8d78e" opacity=".8"/>
    <circle cx="24" cy="34" r="7" fill="#8fca6f"/><rect x="22.5" y="38" width="3" height="6" fill="#a9724b"/>
    <circle cx="168" cy="32" r="8" fill="#8fca6f"/><rect x="166.5" y="37" width="3" height="7" fill="#a9724b"/>
    <path d="M14 44 l2 -6 l2 6 M40 46 l2 -6 l2 6 M148 44 l2 -6 l2 6" stroke="#7cb45e" stroke-width="1.6" fill="none"/>
    <circle cx="60" cy="46" r="2.2" fill="#ffb7c9"/><circle cx="61" cy="46" r=".8" fill="#ffd76e"/>
    <circle cx="130" cy="49" r="2.2" fill="#ffd76e"/><circle cx="90" cy="52" r="2.2" fill="#fff"/>
    <circle cx="108" cy="47" r="2.2" fill="#ffb7c9"/>`;
  if (name === "meadow") return `<svg viewBox="0 0 200 60" preserveAspectRatio="xMidYMid slice">${sky}${grass}
    <path d="M78 36 q0 -13 11 -13 q11 0 11 13 Z" fill="#f7e6b6" stroke="#4a3b30" stroke-width="1.4"/>
    <path d="M78 36 q11 -3 22 0" stroke="#4a3b30" stroke-width="1.2" fill="none"/>
    <rect x="85" y="28" width="8" height="9" rx="2" fill="#a9724b" stroke="#4a3b30" stroke-width="1.2"/>
    <circle cx="89" cy="20" r="1.5" fill="#4a3b30"/>
    <rect x="52" y="30" width="3" height="12" fill="#a9724b" stroke="#4a3b30" stroke-width="1"/>
    <rect x="44" y="24" width="19" height="9" rx="2.5" fill="#e8c98f" stroke="#4a3b30" stroke-width="1.3"/>
    <path d="M47 28.5 h13" stroke="#4a3b30" stroke-width="1.1"/></svg>`;
  if (name === "questboard") return `<svg viewBox="0 0 200 60" preserveAspectRatio="xMidYMid slice">${sky}${grass}
    <rect x="60" y="10" width="80" height="34" rx="4" fill="#c99e6a" stroke="#4a3b30" stroke-width="1.6"/>
    <rect x="66" y="16" width="20" height="14" fill="#fff" transform="rotate(-3 76 23)"/>
    <rect x="90" y="15" width="20" height="16" fill="#ffe9a8"/>
    <rect x="114" y="16" width="20" height="14" fill="#ffd9e3" transform="rotate(2 124 23)"/>
    <rect x="72" y="44" width="5" height="10" fill="#8a6742"/><rect x="123" y="44" width="5" height="10" fill="#8a6742"/>
    <text x="100" y="40" font-size="7" text-anchor="middle" fill="#4a3b30">草むしり · 讨伐 · 检定</text></svg>`;
  if (name === "room") return `<svg viewBox="0 0 200 60" preserveAspectRatio="xMidYMid slice">
    <rect width="200" height="60" fill="#fdf3dd"/>
    <rect x="20" y="8" width="34" height="26" rx="3" fill="#dff0fb" stroke="#4a3b30" stroke-width="1.6"/>
    <path d="M20 21 h34 M37 8 v26" stroke="#4a3b30" stroke-width="1.2"/>
    <rect x="130" y="30" width="52" height="18" rx="6" fill="#ffd9e3" stroke="#4a3b30" stroke-width="1.6"/>
    <rect x="136" y="24" width="14" height="10" rx="4" fill="#fff" stroke="#4a3b30" stroke-width="1.4"/>
    <rect x="70" y="36" width="40" height="14" rx="3" fill="#c99e6a" stroke="#4a3b30" stroke-width="1.4"/>
    <rect x="76" y="30" width="12" height="6" rx="1" fill="#8fd0f4" stroke="#4a3b30" stroke-width="1"/></svg>`;
  if (name === "arena") return `<svg viewBox="0 0 200 60" preserveAspectRatio="xMidYMid slice">${sky}
    <path d="M0 40 Q60 30 120 38 Q170 44 200 36 L200 60 L0 60 Z" fill="#d9d2b8"/>
    <ellipse cx="40" cy="46" rx="10" ry="4" fill="#b9c0a2"/><ellipse cx="160" cy="48" rx="12" ry="4" fill="#b9c0a2"/>
    <path d="M95 30 l6 -12 l6 12 Z" fill="#9aa387" stroke="#4a3b30" stroke-width="1.2"/>
    <text x="101" y="52" font-size="8" text-anchor="middle" fill="#4a3b30">讨伐!!</text></svg>`;
  if (name === "ramen") return `<svg viewBox="0 0 200 60" preserveAspectRatio="xMidYMid slice">
    <rect width="200" height="60" fill="#f6e7d3"/>
    <rect x="40" y="6" width="120" height="16" rx="3" fill="#c0392b" stroke="#4a3b30" stroke-width="1.6"/>
    <text x="100" y="18" font-size="10" text-anchor="middle" fill="#fff" font-weight="bold">郎 · 夜市小吃</text>
    <path d="M50 22 h100 v14 q-25 6 -50 6 q-25 0 -50 -6 Z" fill="#fff" opacity=".85"/>
    <circle cx="36" cy="34" r="7" fill="#e0526e" stroke="#4a3b30" stroke-width="1.4"/>
    <circle cx="164" cy="34" r="7" fill="#e0526e" stroke="#4a3b30" stroke-width="1.4"/>
    <path d="M80 48 a12 8 0 0 0 40 0 Z" fill="#fff" stroke="#4a3b30" stroke-width="1.6"/>
    <path d="M86 44 q4 -8 6 0 M96 42 q4 -8 6 0 M106 44 q4 -8 6 0" stroke="#f7c948" stroke-width="2" fill="none"/></svg>`;
  return `<svg viewBox="0 0 200 60" preserveAspectRatio="xMidYMid slice">
    <rect width="200" height="60" fill="#e8f4ff"/>
    <rect x="24" y="14" width="44" height="32" rx="4" fill="#fff" stroke="#4a3b30" stroke-width="1.6"/>
    <path d="M24 30 h44" stroke="#4a3b30" stroke-width="1.2"/>
    <path d="M120 40 a10 7 0 0 0 20 0 Z" fill="#fff" stroke="#4a3b30" stroke-width="1.6"/>
    <path d="M140 40 q6 -1 4 5" stroke="#4a3b30" stroke-width="1.6" fill="none"/>
    <path d="M126 34 q1 -4 3 0 M132 33 q1 -4 3 0" stroke="#b9c0c9" stroke-width="1.4" fill="none"/>
    <circle cx="160" cy="26" r="8" fill="#cfe8c2" stroke="#4a3b30" stroke-width="1.4"/>
    <rect x="157" y="34" width="6" height="10" fill="#c99e6a" stroke="#4a3b30" stroke-width="1.2"/></svg>`;
}


/* plain (non-illustrated) quiz progress: a small dot row, filled as you answer */
function progressDots(total, doneCount) {
  let s = "";
  for (let k = 0; k < total; k++) s += `<span class="pdot ${k < doneCount ? "on" : ""}"></span>`;
  return `<span class="pdots">${s}</span>`;
}

/* ================= flashcards (SRS) ================= */
function dueCards() {
  const now = Date.now();
  return Object.entries(S.srs).filter(([, c]) => c.due <= now)
    .map(([id]) => D.vocab.find(v => v.id === id)).filter(Boolean);
}
/* ================= practice hub (quiz/listen/speak/write/tones) ================= */
function renderPractice() {
  view.innerHTML = "";
  view.append(el(`<h2>Practice ⭐ <span class="muted">討伐 time!</span></h2>`));
  const modes = [
    ["quiz", "⭐ Quiz", "hanzi → meaning & pinyin", "pink"],
    ["listen", "👂 Listening", "hear it, pick the hanzi", "blue"],
    ["speak", "🎤 Speaking", "say it, mic checks you", "mint"],
    ["write", "✍️ Writing", "stroke order practice", "yellow"],
    ["tones", "🎵 Tones", "the 4 tones + quiz", ""],
    ["voice", "🩺 Voice check", "is audio & the mic working?", "blue"],
  ];
  const badgeChar = { quiz: "chiikawa", listen: "usagi", speak: "hachiware" };
  modes.forEach(([id, title, sub, color]) => {
    const badgeInner = badgeChar[id]
      ? `<img src="chars/${badgeChar[id]}.png" width="30" height="30" style="object-fit:contain" alt="">`
      : title.split(" ")[0];
    const c = el(`<button class="lesson"><span class="lemoji" style="background:var(--${color || "card"},#fff)">${badgeInner}</span>
      <span class="linfo"><span class="ltitle">${title.slice(title.indexOf(" ") + 1)}</span><br><span class="lsub">${sub}</span></span><span class="lstate">→</span></button>`);
    c.onclick = () => startPractice(id);
    view.append(c);
  });
  const st = S.stats;
  view.append(el(`<div class="card center" style="display:flex;flex-wrap:wrap;gap:6px;justify-content:center;align-items:center">
      <span style="background:#fff;border:2px solid #4a3f35;border-radius:14px;padding:3px 10px;font-weight:700;display:inline-flex;gap:4px;align-items:center">📝 ${st.quiz} answered</span>
      <span style="background:#fff;border:2px solid #4a3f35;border-radius:14px;padding:3px 10px;font-weight:700;display:inline-flex;gap:4px;align-items:center">✅ ${st.quiz ? Math.round(st.correct / st.quiz * 100) : 0}% right</span>
      <span style="background:#fff;border:2px solid #4a3f35;border-radius:14px;padding:3px 10px;font-weight:700;display:inline-flex;gap:4px;align-items:center">🎤 ${st.spoken} spoken</span>
      <span style="background:#fff;border:2px solid #4a3f35;border-radius:14px;padding:3px 10px;font-weight:700;display:inline-flex;gap:4px;align-items:center">✍️ ${st.written} written</span>
    </div>`));
}
function startPractice(mode) {
  ({ quiz: () => mcRound("mixed"), listen: () => mcRound("listen"), speak: speakPractice,
     write: writePractice, tones: tonesPractice, voice: voiceCheck }[mode])();
}

/* one-tap health check for both voice directions */
function voiceCheck() {
  pickVoice();
  const zh = speechSynthesis.getVoices().filter(v => /^zh([-_]|$)/i.test(v.lang));
  view.innerHTML = "";
  view.append(el(`<div class="qmeta"><button class="iconbtn" id="bk">←</button><h3 style="margin:0">🩺 Voice check</h3><span class="spacer"></span><span class="badge">build ${QQ_BUILD}</span></div>`));
  const nClips = AUDIO_IDX ? Object.keys(AUDIO_IDX).length : 0;
  view.append(el(`<div class="card ${nClips ? "mint" : "yellow"}">
      <h3>${nClips ? "✅" : "⚠️"} Real audio pack</h3>
      <div>${nClips
        ? `<b>${nClips}</b> voice clips loaded — this is the main sound path (no OS voices needed). Tap to test:`
        : `clip index didn't load (old cached build or offline first run) — refresh the page twice.`}</div>
      ${nClips ? `<div class="cardrow" style="justify-content:flex-start">
        <button class="btn small pink" id="clipTest">▶ play test clip (你好)</button>
        <button class="btn small ghost" id="clipTest2">🐢 slow</button></div>
      <div class="muted" id="clipState" style="margin-top:6px"></div>` : ""}</div>`));
  const ct = document.getElementById("clipTest");
  if (ct) {
    const st = document.getElementById("clipState");
    const runTest = rate => {
      st.textContent = "loading clip…";
      const f = AUDIO_IDX["你好"];
      if (!f) { st.textContent = "❌ 你好 missing from index (corrupt cache — refresh twice)"; return; }
      const au = new Audio("audio/" + f);
      if (rate) au.playbackRate = rate;
      au.onplaying = () => { st.textContent = "🔊 PLAYING now (" + f + ") — if you hear nothing, the browser tab or the app is muted in your system volume mixer"; };
      au.onended = () => { st.textContent += " · finished ✓"; };
      au.onerror = () => { st.textContent = "❌ clip failed to load: " + (au.error && au.error.message); };
      au.play().catch(e => { st.textContent = "❌ playback blocked: " + e.name + " — tap the button again"; });
    };
    ct.onclick = () => runTest();
    document.getElementById("clipTest2").onclick = () => runTest(0.62);
  }
  view.append(el(`<div class="card ${zh.length ? "mint" : "yellow"}">
      <h3>${zh.length ? "✅" : "⚠️"} Chinese audio (she hears)</h3>
      <div>${zh.length
        ? `voice found: <b>${esc((VOICE || zh[0]).name)}</b> — tap to hear a test:`
        : `no Chinese voice installed. iPhone: Settings → Accessibility → Spoken Content → Voices → Chinese. Android/Windows: install the Chinese (China) language/speech pack, or use Chrome.`}</div>
      <div class="cardrow" style="justify-content:flex-start">
        <button class="btn small blue" id="tts1">🔊 你好! 我是恰恰</button>
        <button class="btn small ghost" id="tts2">🐢 slow test</button>
      </div>
      <div class="muted" id="ttsState" style="margin-top:6px"></div></div>`));
  const srOK = !!SR, secure = window.isSecureContext;
  view.append(el(`<div class="card ${srOK && secure ? "mint" : "yellow"}">
      <h3>${srOK && secure ? "✅" : "⚠️"} Microphone (she speaks)</h3>
      <div>${!secure ? "needs the https site (use the mrinolife.github.io link)."
        : srOK ? "supported! tap, allow the mic, then say <b>你好</b>:"
        : "this browser has no speech recognition — use Chrome (Android/desktop). On iPhone Safari, speaking practice falls back to 🐢 shadow mode automatically."}</div>
      ${srOK && secure ? `<button class="mic" id="vcMic">🎤</button><div class="heard center" id="vcHeard"></div>` : ""}</div>`));
  document.getElementById("bk").onclick = renderPractice;
  document.getElementById("tts1").onclick = () => { document.getElementById("ttsState").textContent = zh.length ? "playing… (if silent, check media volume)" : "trying anyway — may be silent without a Chinese voice"; speak("你好! 我是恰恰!", 0.85); };
  document.getElementById("tts2").onclick = () => speak("你好! 我是恰恰!", 0.5);
  const m = document.getElementById("vcMic");
  if (m) m.onclick = async () => {
    const heard = document.getElementById("vcHeard");
    try { const s = await navigator.mediaDevices.getUserMedia({ audio: true }); s.getTracks().forEach(t => t.stop()); }
    catch { heard.textContent = "❌ mic blocked — allow it via the address-bar icon"; return; }
    const r = new SR(); r.lang = "zh-CN"; let got = false;
    m.classList.add("listening"); heard.textContent = "listening — say 你好!";
    r.onresult = e => { got = true; heard.textContent = "✅ heard: " + e.results[0][0].transcript; };
    r.onerror = e => { got = true; heard.textContent = "❌ " + (e.error === "network" ? "speech service unreachable (needs internet + Chrome)" : "error: " + e.error); };
    r.onend = () => { m.classList.remove("listening"); if (!got) heard.textContent = "❌ nothing came through — check mic permission"; };
    r.start();
  };
}

/* multiple-choice round: 8 questions, modes mixed(meaning/pinyin) or listen */
function mcRound(kind) {
  const pool = quizPool();
  const qs = shuffle(pool).slice(0, 8);
  let i = 0, score = 0;
  const ask = () => {
    if (i >= qs.length) {
      bumpStreak(); confetti(); addXP(score * 3);
      const beat = score >= 6;
      if (beat) awardSnack();
      const hero = shuffle(unlockedCast())[0];
      // on a clean beat, occasionally show a 討伐-hunt scene clip alongside the usual monster art
      const huntClip = beat && typeof animGIF === "function" && Math.random() < 0.4 ? animGIF("hunt", 130) : "";
      view.innerHTML = "";
      view.append(el(`<div class="card mint bigcard">
        ${huntClip ? `<div class="done-clip">${huntClip}</div>` : ""}
        <div class="cardrow" style="align-items:center"><span class="mascot-inline" style="font-size:2.4rem">${beat ? "🎉" : "💪"}</span><span class="mascot-inline wobble">${mascotSVG(hero.id, 72)}</span></div>
        <h3>${beat ? "討伐完了!! monster friend-ified! 🎀" : "it got away… 加油!"} ${score}/${qs.length}</h3>
        <div class="muted">${esc(MASCOT_NAMES[hero.id])} ${beat ? "is so proud of you!" : "says: one more try!"}</div>
        <div class="cardrow"><button class="btn pink" id="ag">again</button><button class="btn ghost" id="bk">back</button></div></div>`));
      document.getElementById("ag").onclick = () => mcRound(kind);
      document.getElementById("bk").onclick = renderPractice;
      const mx = mixContinueBtn(); if (mx) view.append(mx);
      return;
    }
    const w = qs[i];
    const sub = kind === "listen" ? "listen" : (Math.random() < 0.5 ? "meaning" : "pinyin");
    const labelOf = o => sub === "pinyin" ? stripTones(o.pinyin) : sub === "listen" ? o.hanzi : o.en.toLowerCase();
    // distractors must differ in the *displayed* label too (他/她 are both "tā")
    const others = [];
    for (const v of shuffle(pool)) {
      if (others.length === 3) break;
      if (v.hanzi !== w.hanzi && labelOf(v) !== labelOf(w) && !others.some(o => labelOf(o) === labelOf(v))) others.push(v);
    }
    const opts = shuffle([w, ...others]);
    view.innerHTML = "";
    view.append(el(`<div class="qmeta"><button class="iconbtn" id="bk">←</button>
      <span class="monsterbox">${progressDots(qs.length, i)}</span>
      <span class="muted">${i + 1}/${qs.length} · ⭐ ${score}</span></div>`));
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
        if (w.id) right ? noteRight(w.id) : noteWrong(w.id);
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
  // gentle ramp: short phrases first until she's spoken a while
  let items = shuffle([...T.scenarios.flatMap(s => s.phrases), ...D.phrases]);
  if ((S.stats.spoken || 0) < 25) items = items.sort((a, b) => a.hanzi.length - b.hanzi.length);
  items = items.slice(0, 10);
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
    if (SR && S.speakingOn !== false) {
      view.append(
        el(`<div class="card pink center"><div class="muted">listen 🐢 first, then hold nothing — just tap & speak!</div>
            <button class="mic" id="mic">🎤</button><div class="heard" id="heard"></div>
            <button class="btn small ghost" id="noSpeak" style="margin-top:8px">🙊 not right now — skip speaking</button></div>`)
      );
      const mic = document.getElementById("mic"), heard = document.getElementById("heard");
      document.getElementById("noSpeak").onclick = () => { S.speakingOn = false; save(); show(); };
      mic.onclick = async () => {
        // explicit permission first — otherwise recognition can end silently
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          stream.getTracks().forEach(t => t.stop());
        } catch {
          heard.textContent = "";
          toast("🎤 mic is blocked — tap the 🔒/mic icon in the address bar and allow it");
          return;
        }
        const r = new SR();
        r.lang = "zh-CN"; r.interimResults = false; r.maxAlternatives = 3;
        let got = false;
        mic.classList.add("listening"); heard.textContent = "listening… say it now!";
        // watchdog: some browsers' recognizer can hang with zero events firing at all —
        // don't leave her staring at "listening…" forever with no way forward
        const watchdog = setTimeout(() => {
          if (got) return;
          got = true;
          try { r.abort(); } catch {}
          mic.classList.remove("listening"); heard.textContent = "";
          toast("mic check timed out — try again, or use 🐢 shadow mode for now");
        }, 8000);
        r.onresult = e => {
          if (got) return;
          got = true; clearTimeout(watchdog);
          const alts = [...e.results[0]].map(a => a.transcript.replace(/[。，？！\s]/g, ""));
          const target = p.hanzi.replace(/[。，？！\s]/g, "");
          const hit = alts.some(a => a === target || a.includes(target) || target.includes(a) && a.length >= Math.ceil(target.length * 0.6));
          heard.textContent = "heard: " + alts[0];
          S.stats.spoken++; save();
          if (hit) { addXP(4); confetti(); toast("哇!! sounded great! 🌸"); }
          else toast("close! listen 🐢 and try again~");
        };
        r.onerror = e => {
          if (got) return;
          got = true; clearTimeout(watchdog); heard.textContent = "";
          toast({
            "not-allowed": "🎤 mic blocked — allow it via the icon in the address bar",
            "service-not-allowed": "🎤 mic blocked — allow it in browser settings",
            "network": "speech check needs internet + Chrome/Edge — use 🐢 shadow mode for now",
            "no-speech": "didn't hear anything — speak right after tapping 🎤",
            "audio-capture": "no microphone found on this device",
          }[e.error] || "mic error (" + e.error + ") — use 🐢 shadow mode");
        };
        r.onend = () => {
          clearTimeout(watchdog);
          mic.classList.remove("listening");
          if (!got) { got = true; heard.textContent = ""; toast("nothing came through — check the mic icon in the address bar, then try again"); }
        };
        try { r.start(); } catch { toast("mic is busy — try again in a second"); }
      };
    } else {
      view.append(el(`<div class="card yellow"><b>Shadow mode:</b> play 🐢 slow audio and repeat out loud, then move on.
        ${S.speakingOn === false ? `<div class="muted" style="margin-top:6px">speaking practice is turned off — switch it back on any time from your profile page.</div>` : ""}</div>`));
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
    if (score >= 6) awardSnack();
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
function phraseCard(p) {
  const c = el(`<div class="card phrase"><div class="ptext">
      <div class="hz">${esc(p.hanzi)}</div>${tradChip(p.hanzi)}<div class="pinyin">${esc(p.pinyin)}</div>
      <div class="en muted">${esc(p.en)}</div>${p.note ? `<div class="note">💡 ${esc(p.note)}</div>` : ""}</div>
      <div style="display:flex;flex-direction:column;gap:6px">
        <button class="iconbtn sp">🔊</button><button class="iconbtn sl">🐢</button>
      </div></div>`);
  c.querySelector(".sp").onclick = () => speak(p.hanzi);
  c.querySelector(".sl").onclick = () => speak(p.hanzi, 0.5);
  return c;
}

function renderTravel() {
  view.innerHTML = "";
  view.append(el(`<h2 style="display:flex;align-items:center;gap:8px">Travel survival 🧳 <span class="muted">Taiwan-real</span>
      </h2>`));
  const groups = [];
  const scChipFood = { s1: "jipai", s2: "pancake" };
  T.scenarios.forEach(s => groups.push({
    key: s.id,
    label: (scChipFood[s.id] ? `<img src="chars/food/${scChipFood[s.id]}.png" width="16" height="16" style="object-fit:contain;vertical-align:-3px;margin-right:2px">` : "") + s.emoji + " " + s.title,
    phrases: s.phrases, intro: s.intro
  }));
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
      const scriptTip = { emoji: "🈶", title: "Taiwan writes traditional characters", tip: "You're learning simplified (like mainland China + most apps), but Taiwan's menus, signs and MRT maps use traditional characters — 鸡排 will appear as 雞排. That's why phrases and foods here show a 繁 line: you don't have to write them, just recognize them. Many look similar, and locals will happily read your simplified notes." };
      [scriptTip, ...T.culture].forEach(t => body.append(el(`<div class="card yellow"><h3>${t.emoji} ${esc(t.title)}</h3><div>${esc(t.tip)}</div></div>`)));
      return;
    }
    if (g.intro) body.append(el(`<div class="card pink">${esc(g.intro)}</div>`));
    g.phrases.forEach(p => body.append(phraseCard(p)));
  };
  groups.forEach(g => {
    const c = el(`<button class="scChip ${g.key === active ? "active" : ""}">${g.label}</button>`);
    c.onclick = () => { active = g.key; chips.querySelectorAll(".scChip").forEach(x => x.classList.remove("active")); c.classList.add("active"); renderGroup(); };
    chips.appendChild(c);
  });
  view.append(chips, body);
  renderGroup();
}

/* ================= talk (chats + dialogues) ================= */
function renderTalk() {
  view.innerHTML = "";
  if (CHATS.length) {
    view.append(el(`<h2>Chat with friends 📱</h2>`),
      el(`<div class="muted" style="margin:0 4px 8px">they text you into real Taiwan situations — you pick what to say back!</div>`));
    CHATS.forEach(c => {
      const cast = CAST.find(x => x.id === c.host);
      const locked = cast && S.xp < cast.unlock;
      const b = el(`<button class="lesson ${locked ? "locked" : ""}">
        <span class="lemoji" style="background:var(--pink)">${locked ? "🔒" : mascotSVG(c.host, 34)}</span>
        <span class="linfo"><span class="ltitle">${esc(c.title)}</span> ${c.emoji}
        <br><span class="lsub">${locked ? "meet " + esc(MASCOT_NAMES[c.host].split(" ")[1]) + " first (" + cast.unlock + " ✨xp)" : esc(MASCOT_NAMES[c.host]) + " · 📍 " + esc(c.place)}</span></span>
        <span class="lstate">${S.doneLessons["chat-" + c.id] ? "✅" : "→"}</span></button>`);
      b.onclick = () => { if (locked) { toast("earn " + (cast.unlock - S.xp) + " more ✨xp to unlock this friend!"); return; } runChat(c); };
      view.append(b);
    });
  }
  view.append(el(`<h2>Eavesdrop mode 🎧</h2>`),
    el(`<div class="muted" style="margin:0 4px 8px">listen in on the real thing — clerk speed and all. B is you!</div>`));
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
/* reactive chat: typing dots, bubbles popping in, tap-a-reply choices */
function runChat(c) {
  let i = 0, score = 0, total = 0, immersion = false;
  view.innerHTML = "";
  view.append(
    el(`<div class="backrow"><button class="iconbtn" id="bk">←</button>
        <span style="display:inline-flex;align-items:center;gap:8px">${mascotSVG(c.host, 40)}
        <span><b>${esc(MASCOT_NAMES[c.host])}</b><br><span class="muted" style="font-size:.75rem">📍 ${esc(c.place)}</span></span></span>
        <span class="spacer"></span>
        <button class="btn small ghost" id="zen">🙈 hide help</button></div>`)
  );
  const wrap = el(`<div class="bubblewrap chatwrap"></div>`);
  const tray = el(`<div class="chattray"></div>`);
  view.append(el(`<div class="sess-ambient"><span class="amb a2">✨</span><span class="amb a4">🌸</span><span class="amb a7">⭐</span></div>`), wrap, tray);
  document.getElementById("bk").onclick = renderTalk;
  document.getElementById("zen").onclick = e => {
    immersion = !immersion;
    wrap.classList.toggle("zen", immersion);
    e.target.textContent = immersion ? "🙉 show help" : "🙈 hide help";
  };
  const scrollDown = () => { if (wrap.lastChild) wrap.lastChild.scrollIntoView({ block: "end", behavior: "smooth" }); };
  const addBubble = (who, m, extra) => {
    const b = el(`<div class="bubble ${who} popin">
        <div class="hz">${esc(m.hanzi)}</div><div class="pinyin">${esc(m.pinyin)}</div>
        <div class="en">${esc(m.en)}</div>${m.note ? `<div class="note">💡 ${esc(m.note)}</div>` : ""}${extra || ""}</div>`);
    b.onclick = () => { if (b.classList.contains("reveal")) speak(m.hanzi, who === "A" ? 0.85 : 0.75); else b.classList.add("reveal"); };
    if (!immersion) b.classList.add("reveal");
    wrap.appendChild(b); scrollDown();
    return b;
  };
  const npcSay = (m, then) => {
    const t = el(`<div class="bubble A typing"><span class="dot"></span><span class="dot"></span><span class="dot"></span></div>`);
    wrap.appendChild(t); scrollDown();
    setTimeout(() => {
      t.remove();
      addBubble("A", m);
      speak(m.hanzi, 0.85);
      setTimeout(then, 650 + Math.min(1200, m.hanzi.length * 90));
    }, 550 + Math.random() * 500);
  };
  const step = () => {
    tray.innerHTML = "";
    if (i >= c.script.length) return finish();
    const node = c.script[i++];
    if (node.npc) return npcSay(node.npc, step);
    // choice point
    tray.appendChild(el(`<div class="muted center" style="margin-bottom:4px">your reply — pick one! 👇</div>`));
    node.choice.options.forEach(o => {
      const btn = el(`<button class="choice chatchoice"><span class="hz">${esc(o.hanzi)}</span>
          <span class="pinyin">${esc(o.pinyin)}</span><span class="muted" style="font-size:.8rem">${esc(o.en)}</span></button>`);
      btn.onclick = () => {
        tray.innerHTML = "";
        total++;
        if (o.good !== false) score++;
        addBubble("B", o);
        speak(o.hanzi, 0.75);
        setTimeout(() => { if (o.react) npcSay(o.react, step); else step(); }, 800);
      };
      tray.appendChild(btn);
    });
    scrollDown();
  };
  const finish = () => {
    const great = total > 0 && score >= Math.ceil(total * 0.7);
    addXP(score * 4);
    if (great) awardSnack();
    if (!S.doneLessons["chat-" + c.id]) { S.doneLessons["chat-" + c.id] = today(); save(); }
    bumpStreak(); confetti();
    tray.appendChild(el(`<div class="card mint bigcard">
        <div class="mascot-inline wobble">${mascotSVG(c.host, 64)}</div>
        <h3>${great ? "聊得真好! great chat! 🎀" : "chat done! 加油~"} ${score}/${total}</h3>
        <div class="cardrow"><button class="btn pink" id="reChat">chat again</button>
        <button class="btn ghost" id="outChat">back</button></div></div>`));
    tray.querySelector("#reChat").onclick = () => runChat(c);
    tray.querySelector("#outChat").onclick = renderTalk;
    scrollDown();
  };
  step();
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

if ("serviceWorker" in navigator) navigator.serviceWorker.register("sw.js").catch(() => {});
