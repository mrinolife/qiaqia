# YaHa 呀哈 🌸 — Chinese for the Trip

Chiikawa-themed HSK 1 Chinese learning PWA, built for a first trip to Taiwan.
Simplified characters + pinyin tone marks. Local-first: all progress in
localStorage, all content ships with the app, works offline once loaded.

## Run

```
bash start.sh        # idempotent, binds 0.0.0.0:8807, kept alive by cron (*/5)
```

Live anywhere: **https://mrinolife.github.io/qiaqia/** (GitHub Pages, auto-updates on push).
Local dev: http://localhost:8807. "Add to Home
Screen" installs it as an app.

## The five skills

| Skill | Where |
|---|---|
| Reading | lesson word cards, flashcards (SRS), dialogues |
| Listening | listening quiz, tone quiz, dialogue "listening drill" (text blurred until tapped) |
| Speaking | Practice → Speaking: mic checks your pronunciation (speech recognition); shadow mode fallback + 🐢 slow audio everywhere |
| Writing | Practice → Writing: real stroke-order animation + traced quiz (hanzi-writer, all 332 used characters bundled offline in strokes.js) |
| Grammar | 14 HSK1 grammar lessons with word-tile sentence-building exercises |

## Content

- `data.js` — the full official HSK 1 vocabulary (150 words), 70 travel phrases, 8 daily dialogues, tones
- `taiwan.js` — the realism pack: 14 grammar lessons, 8 Taiwan survival scenarios (night market, 7-Eleven, bubble tea with sugar/ice levels, MRT/EasyCard, taxi, restaurant, asking locals, hotel), 6 messy-real dialogues (clerk-speed lines with notes), 10 culture tips
- Lesson path interleaves words → grammar → travel packs, linear unlock, XP + streak + trip countdown (edit the date on Home)

## Notes

- Audio = browser TTS (zh-CN voice). On the phone, best in Chrome/Safari with a Chinese voice installed.
- The 🎤 mic check needs a secure context: fine on localhost; over Tailscale
  use `tailscale serve` (HTTPS) or she gets the shadow-mode fallback automatically.
- Mascots are hand-drawn fan-art SVGs of Chiikawa, Hachiware and Usagi (characters © Nagano).
  Personal, non-commercial gift app — not for distribution or sale.
