#!/usr/bin/env python3
"""QiaQia Chiikawa voice pipeline — generate all 10 character voices via CosyVoice3.
   Each character gets their lines spoken in their actual anime voice (zero-shot cloned
   from show clips), converted to MP3 for static serving in the PWA."""

import sys, os, json, subprocess, tempfile, shutil
sys.path.insert(0, '/home/jznle/.hermes/profiles/bounty/home/cosyvoice')
sys.path.insert(0, '/home/jznle/.hermes/profiles/bounty/home/cosyvoice/third_party/Matcha-TTS')

import torch
import soundfile as sf
from cosyvoice.cli.cosyvoice import CosyVoice3

BASE = "/home/jznle/apps/qiaqia"
SRC_DIR = os.path.join(BASE, "chiikawa-source")
REF_DIR = os.path.join(SRC_DIR, "refs")
CAST_DIR = os.path.join(BASE, "audio", "cast")
ORIG_DIR = os.path.join(CAST_DIR, "orig")
from pathlib import Path

INDEX_PATH = Path(os.path.join(CAST_DIR, "index.json"))

os.makedirs(ORIG_DIR, exist_ok=True)

# ── Character config ─────────────────────────────────────
# Each character needs: ref_wav (path to clean audio clip of them speaking),
# and lines (Chinese text to generate)
CHARACTERS = [
    {
        "id": "usagi",
        "ref": os.path.join(REF_DIR, "usagi_ref.wav"),
        "lines": ["呀哈——!!", "乌拉!! 台湾!! 珍珠奶茶!!", "呀哈!", "呀哈", "呜哇哇哇!!", "呀哈!! 好耶!!"],
    },
    {
        "id": "chiikawa",
        "ref": os.path.join(REF_DIR, "chiikawa_ref.wav"),
        "lines": ["今天也加油!", "小小的努力也是努力!", "呜呜…我们一起学吧"],
    },
    {
        "id": "hachiware",
        "ref": os.path.join(REF_DIR, "hachiware_ref.wav"),
        "lines": ["太好了!", "没关系, 慢慢来~", "能学会的!"],
    },
    {
        "id": "momonga",
        "ref": os.path.join(REF_DIR, "momonga_ref.wav"),
        "lines": ["夸我!!", "看我看我!"],
    },
    {
        "id": "kani",
        "ref": os.path.join(REF_DIR, "kani_ref.wav"),
        "lines": ["加油加油!", "好耶!"],
    },
    {
        "id": "kurimanju",
        "ref": os.path.join(REF_DIR, "kurimanju_ref.wav"),
        "lines": ["哈~ 学完喝一杯奶茶吧", "慢慢学, 慢慢吃~"],
    },
    {
        "id": "chimera",
        "ref": os.path.join(REF_DIR, "chimera_ref.wav"),
        "lines": ["一起玩吧~", "嘿嘿, 你进步好快!"],
    },
    {
        "id": "rakko",
        "ref": os.path.join(REF_DIR, "rakko_ref.wav"),
        "lines": ["不错。", "台湾之前, 每天一课。"],
    },
    {
        "id": "yoroi",
        "ref": os.path.join(REF_DIR, "yoroi_ref.wav"),
        "lines": ["你很努力, 真棒!", "劳动辛苦了!"],
    },
    {
        "id": "shisa",
        "ref": os.path.join(REF_DIR, "shisa_ref.wav"),
        "lines": ["嘿嘿! 今天也练习吧!", "台湾见!"],
    },
]

# Filename helpers
def get_fname(char_id, line_idx, total_lines):
    if line_idx >= 3:
        extra_idx = line_idx - 3
        return f"{char_id}-extra{extra_idx}.mp3"
    else:
        return f"{char_id}-line{line_idx}.mp3"


def main():
    print("=" * 60)
    print("QiaQia CosyVoice3 Pipeline — real Chiikawa voices")
    print("=" * 60)

    # Check refs
    for char in CHARACTERS:
        if not os.path.exists(char["ref"]):
            print(f"  ⚠️  Missing ref for {char['id']}: {char['ref']}")

    # Load model (once)
    print("\nLoading CosyVoice3...")
    model = CosyVoice3('/home/jznle/models/cosyvoice/Fun-CosyVoice3-0.5B')
    model.model.llm = model.model.llm.float()
    model.model.flow = model.model.flow.float()
    model.model.hift = model.model.hift.float()
    vram = torch.cuda.memory_allocated() / 1024**3
    print(f"Model loaded! GPU VRAM: {vram:.1f}GB")

    all_entries = {}
    total = sum(len(c["lines"]) for c in CHARACTERS)
    done = 0

    for char in CHARACTERS:
        char_id = char["id"]
        ref = char["ref"]
        lines = char["lines"]

        if not os.path.exists(ref):
            print(f"\n  ⏭️  SKIP {char_id}: no ref wav at {ref}")
            for i, line in enumerate(lines):
                fname = get_fname(char_id, i, len(lines))
                all_entries[f"{char_id}::{line}"] = fname
            continue

        print(f"\n{'─'*50}")
        print(f"🎤 {char_id} ({len(lines)} lines, ref: {os.path.basename(ref)})")

        for i, line in enumerate(lines):
            text_with_prompt = line + "<|endofprompt|>"
            fname = get_fname(char_id, i, len(lines))
            final_path = os.path.join(CAST_DIR, fname)
            wav_tmp = os.path.join(tempfile.mkdtemp(), f"{char_id}_{i}.wav")

            try:
                for result in model.inference_cross_lingual(text_with_prompt, ref):
                    out = result['tts_speech'].squeeze().cpu().numpy()
                    sf.write(wav_tmp, out, model.sample_rate)
                    break
            except Exception as e:
                print(f"    ❌ {char_id}-{i}: {e}")
                done += 1
                continue

            # Backup raw CosyVoice output as orig
            orig_backup = os.path.join(ORIG_DIR, fname.replace(".mp3", ".wav"))
            shutil.copy2(wav_tmp, orig_backup)

            # Convert to MP3 with ffmpeg (smaller, static-serveable)
            subprocess.run([
                "ffmpeg", "-y", "-i", wav_tmp,
                "-codec:a", "libmp3lame", "-q:a", "2",
                final_path
            ], capture_output=True)

            os.remove(wav_tmp)

            if os.path.exists(final_path):
                size_kb = os.path.getsize(final_path) // 1024
                dur = len(out) / model.sample_rate
                print(f"    ✅ \"{line}\" → {fname} ({size_kb}KB, {dur:.1f}s)")
                all_entries[f"{char_id}::{line}"] = fname
            else:
                print(f"    ❌ Failed to create {fname}")

            done += 1
            print(f"    ({done}/{total})")

    # Write index
    sorted_entries = dict(sorted(all_entries.items(), key=lambda x: (x[0].split("::")[0], x[0])))
    INDEX_PATH.write_text(json.dumps(sorted_entries, indent=1, ensure_ascii=False) + "\n")

    print(f"\n{'='*60}")
    print(f"Pipeline complete! {len(sorted_entries)} clips generated")
    total_mb = sum(os.path.getsize(os.path.join(CAST_DIR, v)) for v in sorted_entries.values() if os.path.exists(os.path.join(CAST_DIR, v))) / 1024 / 1024
    print(f"Total: {total_mb:.1f} MB")
    print(f"Index: {INDEX_PATH}")
    print(f"{'='*60}")


if __name__ == "__main__":
    main()
