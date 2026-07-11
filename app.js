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
           stats: { quiz: 0, correct: 0, spoken: 0, written: 0 }, snacks: {}, metFriends: {},
           activeDays: {}, daily: {}, name: "Rachel" };
}
const S = loadState();
function save() { localStorage.setItem(LS_KEY, JSON.stringify(S)); }
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
function addXP(n) { S.xp += n; save(); checkUnlocks(); }

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
let warnedNoVoice = false;
function speak(text, rate, onend) {
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
const CAST = [
  { id: "chiikawa",  unlock: 0,    blurb: "small, brave, tries so hard 🥺", lines: ["今天也加油! (jiāyóu — you got this!)", "小小的努力也是努力! tiny effort still counts!", "呜呜…我们一起学吧 — let's learn together!"] },
  { id: "hachiware", unlock: 0,    blurb: "the optimist — 'we can do it!'", lines: ["太好了! ready for a tiny lesson?", "没关系, 慢慢来~ no rush, we'll get there!", "能学会的! we can totally do this!"] },
  { id: "usagi",     unlock: 0,    blurb: "pure chaos. pure joy. 呀哈!!", lines: ["呀哈——!! LESSON TIME!!", "乌拉!! 台湾!! 珍珠奶茶!!", "呀哈! quiz? QUIZ!!"] },
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
    const ov = el(`<div class="unlock-pop"><div class="card pink bigcard">
        <div class="wobble">${mascotSVG(c.id, 110)}</div>
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
const LOCAL_ART = {};
fetch("chars/manifest.json").then(r => r.ok ? r.json() : null).then(m => {
  if (!m) return;
  (m.chars || []).forEach(k => { LOCAL_ART[k] = `chars/${k}.png`; });
  if (m.bg) {
    document.body.style.background = `url(chars/${m.bg}) center top / cover fixed`;
    document.body.classList.add("has-wallpaper");
  }
  const brand = document.getElementById("brandMascot");
  if (brand) brand.innerHTML = mascotSVG("chiikawa", 38);
  if (document.querySelector(".hero")) renderHome();
}).catch(() => {});

function mascotSVG(kind, size) {
  const s = size || 96;
  if (LOCAL_ART[kind]) return `<img src="${LOCAL_ART[kind]}" width="${s}" height="${s}" style="object-fit:contain" alt="">`;
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
  } else if (kind === "usagi") {
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
  } else if (kind === "momonga") {
    // little white flying squirrel: giant sparkly eyes, big grey tail curling up behind
    body = `
      <path d="M44 54 q16 -2 12 -26 q-3 -10 -10 -12 q6 12 2 24 q-2 8 -4 14z" fill="#cfd6de" stroke="${ink}" stroke-width="2" stroke-linejoin="round"/>
      <circle cx="18" cy="15" r="5.5" fill="#fff" stroke="${ink}" stroke-width="2"/>
      <circle cx="46" cy="15" r="5.5" fill="#fff" stroke="${ink}" stroke-width="2"/>
      <circle cx="18" cy="15" r="2.4" fill="#ffe3ec"/><circle cx="46" cy="15" r="2.4" fill="#ffe3ec"/>
      <path d="M10 33 a22 20 0 1 0 44 0 a22 20 0 1 0 -44 0" fill="#fff" stroke="${ink}" stroke-width="2.4"/>
      <ellipse cx="32" cy="56" rx="11" ry="6.5" fill="#fff" stroke="${ink}" stroke-width="2.2"/>
      <circle cx="14" cy="49" r="4" fill="#fff" stroke="${ink}" stroke-width="2"/>
      <circle cx="50" cy="49" r="4" fill="#fff" stroke="${ink}" stroke-width="2"/>
      <circle cx="23" cy="31" r="4.6" fill="${ink}"/><circle cx="41" cy="31" r="4.6" fill="${ink}"/>
      <circle cx="24.6" cy="29.3" r="1.7" fill="#fff"/><circle cx="42.6" cy="29.3" r="1.7" fill="#fff"/>
      <circle cx="21.8" cy="32.8" r=".9" fill="#fff"/><circle cx="39.8" cy="32.8" r=".9" fill="#fff"/>
      ${blush}
      <path d="M29.5 39 q2.5 2.6 5 0" stroke="${ink}" stroke-width="1.8" fill="none" stroke-linecap="round"/>`;
  } else if (kind === "kurimanju") {
    // the chestnut-bun elder: brown dome on cream bun, sleepy half-lidded eyes
    body = `
      <path d="M10 34 a22 20 0 1 0 44 0 a22 20 0 1 0 -44 0" fill="#fdf3dd" stroke="${ink}" stroke-width="2.4"/>
      <path d="M11.5 29 Q14 12.5 32 12 Q50 12.5 52.5 29 Q47 33.5 32 33.5 Q17 33.5 11.5 29 Z" fill="#a9724b" stroke="${ink}" stroke-width="1.6"/>
      <ellipse cx="32" cy="56" rx="12" ry="7" fill="#fdf3dd" stroke="${ink}" stroke-width="2.2"/>
      <circle cx="14" cy="50" r="4" fill="#fdf3dd" stroke="${ink}" stroke-width="2"/>
      <circle cx="50" cy="50" r="4" fill="#fdf3dd" stroke="${ink}" stroke-width="2"/>
      <path d="M20.5 38 q2.5 1.6 5 0" stroke="${ink}" stroke-width="2.2" fill="none" stroke-linecap="round"/>
      <path d="M38.5 38 q2.5 1.6 5 0" stroke="${ink}" stroke-width="2.2" fill="none" stroke-linecap="round"/>
      ${blush.replace(/cy="38"/g, 'cy="43"')}
      <path d="M30 44.5 q2 1.6 4 0" stroke="${ink}" stroke-width="1.8" fill="none" stroke-linecap="round"/>`;
  } else if (kind === "rakko") {
    // sea-otter senpai: brown coat, pale face, small round ears, cool calm eyes
    body = `
      <circle cx="15" cy="16" r="5" fill="#8b6748" stroke="${ink}" stroke-width="2"/>
      <circle cx="49" cy="16" r="5" fill="#8b6748" stroke="${ink}" stroke-width="2"/>
      <path d="M10 33 a22 20 0 1 0 44 0 a22 20 0 1 0 -44 0" fill="#8b6748" stroke="${ink}" stroke-width="2.4"/>
      <path d="M15 30 Q17 17.5 32 17 Q47 17.5 49 30 Q49 44 32 45 Q15 44 15 30 Z" fill="#f3e6cf" stroke="none"/>
      <ellipse cx="32" cy="56" rx="12" ry="7" fill="#8b6748" stroke="${ink}" stroke-width="2.2"/>
      <circle cx="14" cy="50" r="4" fill="#8b6748" stroke="${ink}" stroke-width="2"/>
      <circle cx="50" cy="50" r="4" fill="#8b6748" stroke="${ink}" stroke-width="2"/>
      <circle cx="24" cy="30" r="2.4" fill="${ink}"/><circle cx="40" cy="30" r="2.4" fill="${ink}"/>
      <path d="M22 25.5 l4.5 -1" stroke="${ink}" stroke-width="1.6" stroke-linecap="round"/>
      <path d="M42 25.5 l-4.5 -1" stroke="${ink}" stroke-width="1.6" stroke-linecap="round"/>
      ${blush}
      <ellipse cx="32" cy="36.5" rx="2" ry="1.4" fill="${ink}"/>
      <path d="M32 38 q0 2 0 2 M32 40 q-2.5 2 -5 .6 M32 40 q2.5 2 5 .6" stroke="${ink}" stroke-width="1.5" fill="none" stroke-linecap="round"/>`;
  } else if (kind === "kani") {
    // kani-chan: cheery red crab, big claws up, eyes on top
    body = `
      <circle cx="20" cy="13" r="3.4" fill="#ef7d67" stroke="${ink}" stroke-width="1.8"/>
      <circle cx="44" cy="13" r="3.4" fill="#ef7d67" stroke="${ink}" stroke-width="1.8"/>
      <path d="M20 16 l0 6 M44 16 l0 6" stroke="${ink}" stroke-width="1.8"/>
      <path d="M6 30 q-4 -10 6 -12 q9 -2 8 8 q-1 6 -6 7 Z" fill="#ef7d67" stroke="${ink}" stroke-width="2" stroke-linejoin="round"/>
      <path d="M58 30 q4 -10 -6 -12 q-9 -2 -8 8 q1 6 6 7 Z" fill="#ef7d67" stroke="${ink}" stroke-width="2" stroke-linejoin="round"/>
      <path d="M12 38 a20 17 0 1 0 40 0 a20 17 0 1 0 -40 0" fill="#ef7d67" stroke="${ink}" stroke-width="2.4"/>
      <path d="M18 55 l-3 5 M26 57 l-1 5 M38 57 l1 5 M46 55 l3 5" stroke="${ink}" stroke-width="2" stroke-linecap="round"/>
      <circle cx="25" cy="35" r="2.4" fill="${ink}"/><circle cx="39" cy="35" r="2.4" fill="${ink}"/>
      <circle cx="20" cy="41" r="3.4" fill="#ffc4d0" opacity=".9"/><circle cx="44" cy="41" r="3.4" fill="#ffc4d0" opacity=".9"/>
      <path d="M28.5 41.5 q3.5 3.4 7 0" stroke="${ink}" stroke-width="1.8" fill="none" stroke-linecap="round"/>`;
  } else if (kind === "yoroi") {
    // yoroi-san: kind knight in grey armor, gentle eyes in the visor slit
    body = `
      <path d="M13 30 q0 -20 19 -20 q19 0 19 20 l0 8 q0 6 -6 6 l-26 0 q-6 0 -6 -6 Z" fill="#b9c0c9" stroke="${ink}" stroke-width="2.4"/>
      <path d="M28 4 l8 0 l-1.5 7 l-5 0 Z" fill="#e0526e" stroke="${ink}" stroke-width="1.8" stroke-linejoin="round"/>
      <path d="M17 27 l30 0 l0 9 q-15 4 -30 0 Z" fill="#4e5560" stroke="${ink}" stroke-width="2"/>
      <circle cx="25" cy="31.5" r="2.2" fill="#fff"/><circle cx="39" cy="31.5" r="2.2" fill="#fff"/>
      <path d="M13 33 q-6 1 -5 8 M51 33 q6 1 5 8" stroke="${ink}" stroke-width="2" fill="none" stroke-linecap="round"/>
      <ellipse cx="32" cy="55" rx="13" ry="7" fill="#b9c0c9" stroke="${ink}" stroke-width="2.2"/>
      <path d="M22 50 l20 0" stroke="${ink}" stroke-width="1.6"/>`;
  } else if (kind === "chimera") {
    // the winged one: white cat-ish with tiny horn and little wings
    body = `
      <path d="M8 30 q-7 -6 -2 -12 q6 -5 10 2 Z" fill="#fff" stroke="${ink}" stroke-width="2" stroke-linejoin="round"/>
      <path d="M56 30 q7 -6 2 -12 q-6 -5 -10 2 Z" fill="#fff" stroke="${ink}" stroke-width="2" stroke-linejoin="round"/>
      <path d="M15 21 L18 9 L27 16 Z" fill="#fff" stroke="${ink}" stroke-width="2" stroke-linejoin="round"/>
      <path d="M49 21 L46 9 L37 16 Z" fill="#fff" stroke="${ink}" stroke-width="2" stroke-linejoin="round"/>
      <path d="M30 8 q2 -6 5 -1 l-2 5 Z" fill="#ffe9a8" stroke="${ink}" stroke-width="1.6" stroke-linejoin="round"/>
      <path d="M10 33 a22 20 0 1 0 44 0 a22 20 0 1 0 -44 0" fill="#fff" stroke="${ink}" stroke-width="2.4"/>
      <ellipse cx="32" cy="56" rx="12" ry="7" fill="#fff" stroke="${ink}" stroke-width="2.2"/>
      <circle cx="14" cy="50" r="4" fill="#fff" stroke="${ink}" stroke-width="2"/>
      <circle cx="50" cy="50" r="4" fill="#fff" stroke="${ink}" stroke-width="2"/>
      <circle cx="23" cy="31" r="2.7" fill="${ink}"/><circle cx="41" cy="31" r="2.7" fill="${ink}"/>
      <circle cx="24" cy="30" r="1" fill="#fff"/><circle cx="42" cy="30" r="1" fill="#fff"/>
      ${blush}
      <path d="M26 38 q6 5 12 0 z" fill="#e0526e" stroke="${ink}" stroke-width="1.8" stroke-linejoin="round"/>`;
  } else { // shisa
    // the little lion-dog: tan coat, curly mane bumps, pointy ears, happy fangy grin
    body = `
      <path d="M14 22 L15 8 L26 15 Z" fill="#e8a75f" stroke="${ink}" stroke-width="2" stroke-linejoin="round"/>
      <path d="M50 22 L49 8 L38 15 Z" fill="#e8a75f" stroke="${ink}" stroke-width="2" stroke-linejoin="round"/>
      <path d="M10 33 a22 20 0 1 0 44 0 a22 20 0 1 0 -44 0" fill="#e8a75f" stroke="${ink}" stroke-width="2.4"/>
      <path d="M17 17 q3 -4 6 0 q3 -4 6 0 q3 -4 6 0 q3 -4 6 0 q3 -4 6 0 l-2 6 q-13 -4 -26 0 Z" fill="#c77f3d" stroke="${ink}" stroke-width="1.6" stroke-linejoin="round"/>
      <ellipse cx="32" cy="56" rx="12" ry="7" fill="#e8a75f" stroke="${ink}" stroke-width="2.2"/>
      <circle cx="14" cy="50" r="4" fill="#e8a75f" stroke="${ink}" stroke-width="2"/>
      <circle cx="50" cy="50" r="4" fill="#e8a75f" stroke="${ink}" stroke-width="2"/>
      <circle cx="23" cy="31" r="2.6" fill="${ink}"/><circle cx="41" cy="31" r="2.6" fill="${ink}"/>
      ${blush}
      <path d="M25 38 q7 6 14 0 z" fill="#e0526e" stroke="${ink}" stroke-width="1.8" stroke-linejoin="round"/>
      <path d="M27.5 38.6 l1.6 2.6 l1.6 -2.4 Z" fill="#fff" stroke="${ink}" stroke-width="1"/>
      <path d="M33.3 38.8 l1.6 2.4 l1.6 -2.6 Z" fill="#fff" stroke="${ink}" stroke-width="1"/>`;
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
  maybePeek();
}
/* a friend occasionally peeks in to cheer */
function maybePeek() {
  if (Math.random() > 0.22 || document.querySelector(".peek")) return;
  const c = shuffle(unlockedCast())[0];
  const line = c.lines[Math.floor(Math.random() * c.lines.length)];
  const pk = el(`<button class="peek">${mascotSVG(c.id, 64)}</button>`);
  pk.onclick = () => {
    toast(line);
    const zh = (line.match(/[一-鿿]+/g) || []).join("，");
    if (zh) speak(zh);
    pk.remove();
  };
  document.body.appendChild(pk);
  setTimeout(() => pk.remove(), 6000);
}
function renderStreak() { document.getElementById("streakN").textContent = S.streak.count; }

/* ================= today's mix (guided daily session) ================= */
const MIX = { active: false, steps: [], i: 0 };
function startMix() {
  MIX.steps = [];
  const due = dueCards().length;
  if (due) MIX.steps.push(["cards", `🎴 review ${Math.min(due, 30)} cards`]);
  const next = LESSONS.find(l => !S.doneLessons[l.id]);
  if (next) MIX.steps.push(["lesson", `${next.emoji} lesson: ${next.title}`]);
  MIX.steps.push(["quiz", "⭐ one 討伐 quiz round"]);
  MIX.active = true; MIX.i = 0;
  mixGo();
}
function mixGo() {
  if (!MIX.active) return go("home");
  if (MIX.i >= MIX.steps.length) {
    MIX.active = false;
    S.daily = S.daily || {}; S.daily[today()] = true;
    addXP(10); bumpStreak(); save(); confetti();
    const hero = shuffle(unlockedCast())[0];
    view.innerHTML = "";
    view.append(el(`<div class="card mint bigcard"><div class="mascot-inline wobble">${mascotSVG(hero.id, 90)}</div>
      <h3>Today's mix complete! 🌟 +10 bonus xp</h3>
      <div class="muted">${esc(MASCOT_NAMES[hero.id])} says: 今天辛苦了! see you tomorrow~</div>
      <button class="btn big yellow" id="mixHome">back home ✨</button></div>`));
    document.getElementById("mixHome").onclick = () => go("home");
    return;
  }
  const [kind, label] = MIX.steps[MIX.i];
  const hero = shuffle(unlockedCast())[0];
  view.innerHTML = "";
  view.append(el(`<div class="card blue bigcard"><div class="mascot-inline wobble">${mascotSVG(hero.id, 80)}</div>
    <div class="muted">today's mix · step ${MIX.i + 1}/${MIX.steps.length}</div>
    <h3>${esc(label)}</h3>
    <div class="cardrow"><button class="btn big pink" id="mixStart">let's go! →</button></div>
    <button class="btn small ghost" id="mixStop" style="margin-top:8px">stop the mix</button></div>`));
  document.getElementById("mixStart").onclick = () => {
    MIX.i++;
    if (kind === "cards") renderCards();
    else if (kind === "lesson") { const l = LESSONS.find(x => !S.doneLessons[x.id]); l ? runLesson(l) : mixGo(); }
    else mcRound("mixed");
  };
  document.getElementById("mixStop").onclick = () => { MIX.active = false; go("home"); };
}
function mixContinueBtn() {
  if (!MIX.active) return null;
  const b = el(`<button class="btn big blue" style="margin-top:10px">▶ continue today's mix (${MIX.i}/${MIX.steps.length} done)</button>`);
  b.onclick = mixGo;
  return b;
}

/* ================= home ================= */
function renderHome() {
  const days = Math.max(0, Math.ceil((new Date(S.tripDate + "T00:00") - new Date()) / 864e5));
  const learned = learnedWords().length;
  const due = dueCards().length;
  const next = LESSONS.find(l => !S.doneLessons[l.id]);
  MIX.active = false; // leaving an unfinished mix resets it
  const who = shuffle(unlockedCast())[0];
  const friendsN = unlockedCast().length;
  const line = who.lines[Math.floor(Math.random() * who.lines.length)];
  const greet = Math.random() < 0.4 ? (S.name || "Rachel") + "! " : "";
  view.innerHTML = "";
  view.append(
    el(`<div class="scene">${sceneSVG("meadow")}</div>`),
    el(`<div class="card pink hero">
          <div class="mascot wobble">${mascotSVG(who.id)}<div class="muted center" style="font-size:.68rem">${esc(MASCOT_NAMES[who.id])}</div></div>
          <div class="speech">${esc(greet + line)}</div>
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
          <h3>Today's mix 🍡 ${S.daily && S.daily[today()] ? '<span class="badge" style="background:var(--mint)">done today ✅</span>' : ""}</h3>
          <div class="muted" style="margin-bottom:10px">${due ? "<b>" + due + "</b> cards to review · " : ""}${next ? "next: <b>" + esc(next.emoji + " " + next.title) + "</b> · " : ""}one quiz round</div>
          <button class="btn big yellow" id="goMix">▶ start today's mix</button>
          <div class="cardrow" style="justify-content:flex-start;margin-top:8px">
            ${next ? `<button class="btn small pink" id="goNext">just the lesson</button>` : ""}
            <button class="btn small blue" id="goReview">just cards${due ? " (" + due + ")" : ""}</button>
          </div>
        </div>`),
    calendarCard(),
    el(`<div class="card blue" id="friendsCard" style="cursor:pointer">
          <h3>Friends & snacks 🧺 <span class="muted">${friendsN}/${CAST.length} met</span></h3>
          <div class="friendrow">${unlockedCast().map(c => mascotSVG(c.id, 40)).join("")}
            ${CAST.length > friendsN ? `<span class="lockball">+${CAST.length - friendsN}?</span>` : ""}</div>
          <div class="muted" style="margin-top:4px">earn ✨xp to meet everyone — tap to visit</div>
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
  document.getElementById("friendsCard").onclick = renderFriends;
  document.getElementById("goMix").onclick = startMix;
  const gn = document.getElementById("goNext"); if (gn) gn.onclick = () => runLesson(next);
  document.getElementById("goReview").onclick = () => go("cards");
  view.querySelectorAll("[data-go]").forEach(b => b.onclick = () => {
    if (b.dataset.go === "quiz") go("quiz");
    else { go("quiz"); startPractice(b.dataset.go); }
  });
}

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

function wordPopup(w) {
  speak(w.hanzi);
  const chars = [...w.hanzi].filter(c => /[一-鿿]/.test(c));
  const ov = el(`<div class="unlock-pop"><div class="card bigcard" style="max-width:340px;width:100%">
      <div class="hanzi-lg">${esc(w.hanzi)}</div>
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
      const row = el(`<button class="lesson"><span class="linfo"><span class="ltitle">${esc(w.hanzi)} <span class="pinyin" style="font-size:.9rem">${esc(w.pinyin)}</span></span>
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

/* ================= friends & snacks ================= */
function renderFriends() {
  view.innerHTML = "";
  view.append(
    el(`<div class="backrow"><button class="iconbtn" id="bk">←</button><h3 style="margin:0">Friends 🧺 <span class="muted">${unlockedCast().length}/${CAST.length}</span></h3></div>`),
    el(`<div class="muted" style="margin:0 4px 8px">everyone from the meadow — keep learning to meet them all!</div>`)
  );
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
      const line = c.lines[Math.floor(Math.random() * c.lines.length)];
      toast(line);
      const zh = (line.match(/[一-鿿~！!?？，。]+/g) || []).join("，");
      if (zh) speak(zh);
    };
    grid.appendChild(cell);
  });
  view.append(grid);
  view.append(el(`<h3 style="margin:16px 4px 4px">Snack shelf 🍱 <span class="muted">${Object.keys(S.snacks || {}).length}/${SNACKS.length}</span></h3>`),
    el(`<div class="muted" style="margin:0 4px 8px">win snacks from quizzes & reviews — tap one to learn its Chinese name!</div>`));
  const shelf = el(`<div class="friendgrid snacks"></div>`);
  SNACKS.forEach(sn => {
    const n = (S.snacks || {})[sn.id] || 0;
    const cell = el(`<button class="card friendcell ${n ? "" : "locked"}">
        <span style="font-size:2.2rem">${n ? sn.emoji : "❓"}</span>
        <div class="fname">${n ? esc(sn.hanzi) : "???"}</div>
        <div class="muted" style="font-size:.72rem">${n ? esc(sn.pinyin) + (n > 1 ? " ×" + n : "") : esc(sn.name)}</div>
      </button>`);
    cell.onclick = () => {
      if (!n) { toast("win it from a quiz, review or chat! 加油!"); return; }
      speak(sn.hanzi);
      const ov = el(`<div class="unlock-pop"><div class="card yellow bigcard" style="text-align:left">
          <div class="center" style="font-size:3rem">${sn.emoji}</div>
          <h3 class="center">${esc(sn.hanzi)} <span class="pinyin">${esc(sn.pinyin)}</span></h3>
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
    };
    shelf.appendChild(cell);
  });
  view.append(shelf);
  document.getElementById("bk").onclick = renderHome;
}

/* scene backdrops from the meadow world */
function sceneSVG(name) {
  const sky = `<rect width="200" height="60" fill="#dff0fb"/>
    <ellipse cx="35" cy="14" rx="14" ry="6" fill="#fff"/><ellipse cx="150" cy="10" rx="18" ry="7" fill="#fff"/>`;
  const grass = `<path d="M0 38 Q50 28 100 36 Q150 42 200 34 L200 60 L0 60 Z" fill="#cfe8c2"/>
    <path d="M14 40 l2 -6 l2 6 M30 42 l2 -6 l2 6 M172 40 l2 -6 l2 6" stroke="#8fbf7d" stroke-width="1.6" fill="none"/>
    <circle cx="60" cy="44" r="2" fill="#ffb7c9"/><circle cx="130" cy="47" r="2" fill="#ffd76e"/><circle cx="90" cy="50" r="2" fill="#fff"/>`;
  if (name === "meadow") return `<svg viewBox="0 0 200 60" preserveAspectRatio="xMidYMid slice">${sky}${grass}
    <path d="M78 36 q0 -12 11 -12 q11 0 11 12 Z" fill="#f7e6b6" stroke="#4a3b30" stroke-width="1.4"/>
    <rect x="85" y="28" width="8" height="9" rx="2" fill="#a9724b" stroke="#4a3b30" stroke-width="1.2"/>
    <circle cx="89" cy="20" r="1.5" fill="#4a3b30"/></svg>`;
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

/* the 討伐 target: a wobbly little monster that shrinks as you answer right */
function monsterSVG(frac) {
  const sc = (0.45 + 0.55 * frac).toFixed(2);
  const mood = frac > 0.6 ? `<path d="M24 40 q4 -3 8 0" stroke="#4a3b30" stroke-width="2" fill="none" stroke-linecap="round"/>`
    : frac > 0.01 ? `<path d="M24 41 q4 3 8 0" stroke="#4a3b30" stroke-width="2" fill="none" stroke-linecap="round"/>`
    : `<path d="M22 36 l5 5 m0 -5 l-5 5 M36 36 l5 5 m0 -5 l-5 5" stroke="#4a3b30" stroke-width="2" stroke-linecap="round"/>`;
  const eyes = frac > 0.01 ? `<circle cx="24" cy="30" r="2.6" fill="#4a3b30"/><circle cx="40" cy="30" r="2.6" fill="#4a3b30"/>` : "";
  return `<svg viewBox="0 0 64 64" width="92" height="92" style="transform:scale(${sc});transition:transform .3s">
    <path d="M18 12 q-3 -8 4 -6 l3 4 M46 12 q3 -8 -4 -6 l-3 4" stroke="#4a3b30" stroke-width="2" fill="#b7a6d9" stroke-linejoin="round"/>
    <path d="M10 36 q-2 -24 22 -24 q24 0 22 24 q1 16 -10 14 q-4 -1 -5 3 q-4 3 -7 -1 q-3 4 -7 1 q-1 -4 -5 -3 q-11 2 -10 -14 Z"
      fill="#b7a6d9" stroke="#4a3b30" stroke-width="2.4" stroke-linejoin="round"/>
    ${eyes}${mood}</svg>`;
}

/* month calendar of active days */
function calendarCard() {
  const now = new Date(), y = now.getFullYear(), m = now.getMonth();
  const firstDow = new Date(y, m, 1).getDay();
  const nDays = new Date(y, m + 1, 0).getDate();
  const tISO = today();
  let cells = "<span></span>".repeat(firstDow);
  for (let d = 1; d <= nDays; d++) {
    const iso = `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    const active = (S.activeDays || {})[iso];
    const isToday = iso === tISO;
    cells += `<span class="calday ${active ? "on" : ""} ${isToday ? "today" : ""}">${active ? "🌸" : d}</span>`;
  }
  const monthName = now.toLocaleString("en", { month: "long" });
  return el(`<div class="card"><h3>${monthName} 🗓️ <span class="muted">${Object.keys(S.activeDays || {}).length} active days</span></h3>
    <div class="cal"><span class="calhd">S</span><span class="calhd">M</span><span class="calhd">T</span><span class="calhd">W</span><span class="calhd">T</span><span class="calhd">F</span><span class="calhd">S</span>${cells}</div></div>`);
}

/* ================= learn path ================= */
function renderLearn() {
  view.innerHTML = "";
  view.append(el(`<div class="scene">${sceneSVG("questboard")}</div>`),
    el(`<h2>Labor board 🌱 <span class="muted">(${doneCount()}/${LESSONS.length} quests)</span></h2>`));
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
  if (MIX.active) return mixGo();
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
    const hero = shuffle(unlockedCast())[0];
    view.append(el(`<div class="card mint bigcard"><div class="mascot-inline wobble">${mascotSVG(hero.id, 72)}</div>
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
    const hero = shuffle(unlockedCast())[0];
    if (score === exs.length) awardSnack();
    view.append(el(`<div class="card mint bigcard"><div class="mascot-inline wobble">${mascotSVG(hero.id, 72)}</div>
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
  view.append(el(`<div class="scene">${sceneSVG("room")}</div>`),
    el(`<h2>Flashcards 🎴 <span class="muted">${Object.keys(S.srs).length} in deck</span></h2>`));
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
    if (due.length >= 5) awardSnack();
    const hero = shuffle(unlockedCast())[0];
    view.innerHTML = "";
    view.append(el(`<div class="card mint bigcard"><div class="mascot-inline wobble">${mascotSVG(hero.id, 72)}</div>
      <h3>Deck cleared! +${due.length * 2} xp ✨</h3>
      <div class="muted">${esc(MASCOT_NAMES[hero.id])}: 好棒! see you at the next review~</div></div>`));
    addXP(due.length * 2);
    const mx = mixContinueBtn(); if (mx) view.append(mx);
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
  view.append(el(`<div class="scene">${sceneSVG("arena")}</div>`),
    el(`<h2>Practice ⭐ <span class="muted">討伐 time!</span></h2>`));
  const modes = [
    ["quiz", "⭐ Quiz", "hanzi → meaning & pinyin", "pink"],
    ["listen", "👂 Listening", "hear it, pick the hanzi", "blue"],
    ["speak", "🎤 Speaking", "say it, mic checks you", "mint"],
    ["write", "✍️ Writing", "stroke order practice", "yellow"],
    ["tones", "🎵 Tones", "the 4 tones + quiz", ""],
    ["voice", "🩺 Voice check", "is audio & the mic working?", "blue"],
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
     write: writePractice, tones: tonesPractice, voice: voiceCheck }[mode])();
}

/* one-tap health check for both voice directions */
function voiceCheck() {
  pickVoice();
  const zh = speechSynthesis.getVoices().filter(v => /^zh([-_]|$)/i.test(v.lang));
  view.innerHTML = "";
  view.append(el(`<div class="qmeta"><button class="iconbtn" id="bk">←</button><h3 style="margin:0">🩺 Voice check</h3></div>`));
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
      view.innerHTML = "";
      view.append(el(`<div class="card mint bigcard">
        <div class="cardrow" style="align-items:center">${monsterSVG(beat ? 0 : 1 - score / qs.length)}<span class="mascot-inline wobble">${mascotSVG(hero.id, 72)}</span></div>
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
    const others = sample(pool.filter(v => v.hanzi !== w.hanzi), 3);
    const opts = shuffle([w, ...others]);
    view.innerHTML = "";
    view.append(el(`<div class="qmeta"><button class="iconbtn" id="bk">←</button>
      <span class="monsterbox">${monsterSVG(1 - score / qs.length)}</span>
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
        r.onresult = e => {
          got = true;
          const alts = [...e.results[0]].map(a => a.transcript.replace(/[。，？！\s]/g, ""));
          const target = p.hanzi.replace(/[。，？！\s]/g, "");
          const hit = alts.some(a => a === target || a.includes(target) || target.includes(a) && a.length >= Math.ceil(target.length * 0.6));
          heard.textContent = "heard: " + alts[0];
          S.stats.spoken++; save();
          if (hit) { addXP(4); confetti(); toast("哇!! sounded great! 🌸"); }
          else toast("close! listen 🐢 and try again~");
        };
        r.onerror = e => {
          got = true; heard.textContent = "";
          toast({
            "not-allowed": "🎤 mic blocked — allow it via the icon in the address bar",
            "service-not-allowed": "🎤 mic blocked — allow it in browser settings",
            "network": "speech check needs internet + Chrome/Edge — use 🐢 shadow mode for now",
            "no-speech": "didn't hear anything — speak right after tapping 🎤",
            "audio-capture": "no microphone found on this device",
          }[e.error] || "mic error (" + e.error + ") — use 🐢 shadow mode");
        };
        r.onend = () => {
          mic.classList.remove("listening");
          if (!got) { heard.textContent = ""; toast("nothing came through — check the mic icon in the address bar, then try again"); }
        };
        try { r.start(); } catch { toast("mic is busy — try again in a second"); }
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
function renderTravel() {
  view.innerHTML = "";
  view.append(el(`<div class="scene">${sceneSVG("ramen")}</div>`),
    el(`<h2>Travel survival 🧳 <span class="muted">Taiwan-real</span></h2>`));
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

/* ================= talk (chats + dialogues) ================= */
function renderTalk() {
  view.innerHTML = "";
  view.append(el(`<div class="scene">${sceneSVG("cafe")}</div>`));
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
  view.append(wrap, tray);
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
