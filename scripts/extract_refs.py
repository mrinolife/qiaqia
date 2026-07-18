#!/usr/bin/env python3
"""Extract clean reference clips from known character sources and re-run CosyVoice3."""
import os, subprocess, json

REFS_DIR = "/home/jznle/apps/qiaqia/chiikawa-source/refs"
EP_DIR = "/home/jznle/apps/qiaqia/chiikawa-source/episodes"

# Characters with known-good sources
refs = {
    "usagi": {"src": "/home/jznle/apps/qiaqia/chiikawa-source/usagi-screams.mp3", "ss": 0},
    "momonga": {"src": f"{EP_DIR}/ep027_momonga.mp3", "ss": 0},
    "chiikawa": {"src": f"{EP_DIR}/ep001.mp3", "ss": 0},  # Episode 1 - Chiikawa speaks
    "hachiware": {"src": f"{EP_DIR}/ep001.mp3", "ss": 8},  # Ep1 - Hachiware segment
    "kurimanju": {"src": f"{EP_DIR}/ep306_307.mp3", "ss": 90},  # Deep voice = Kurimanju
}

print("Extracting reference clips...")
for char, info in refs.items():
    out = f"{REFS_DIR}/{char}_ref.wav"
    subprocess.run([
        "ffmpeg", "-y", "-i", info["src"],
        "-ss", str(info["ss"]), "-t", "8",
        "-ac", "1", "-ar", "24000", out
    ], capture_output=True)
    size = os.path.getsize(out) if os.path.exists(out) else 0
    print(f"  {char}: {out} ({size//1024}KB)")

print("\nRefs ready. Now re-running CosyVoice3 pipeline with correct refs...")
