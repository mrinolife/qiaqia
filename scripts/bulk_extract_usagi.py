#!/usr/bin/env python3
"""Bulk extract training clips for SBV2 by fixed-interval splitting."""
import os, subprocess, soundfile as sf

CHAR = "Usagi"
WAV_DIR = f"/home/jznle/ina-ai/Style-Bert-VITS2/Data/{CHAR}/wavs"
RAW_FILES = [
    "/home/jznle/apps/qiaqia/chiikawa-source/usagi-screams.mp3",
    "/home/jznle/apps/qiaqia/chiikawa-source/usagi-1hr.mp3",
]

os.makedirs(WAV_DIR, exist_ok=True)

# Get existing count
existing = len([f for f in os.listdir(WAV_DIR) if f.endswith(".wav")])

for raw_file in RAW_FILES:
    # Get total duration
    dur = float(subprocess.run(["ffprobe","-v","error","-show_entries","format=duration",
        "-of","default=noprint_wrappers=1:nokey=1",raw_file], capture_output=True,text=True).stdout.strip())
    
    # Extract clips every 2 seconds, each 3 seconds long
    # This creates overlapping clips so we don't miss any sounds
    for start in range(0, int(dur) - 2, 2):
        idx = existing + start // 2
        out = f"{WAV_DIR}/usagi_{idx:04d}.wav"
        subprocess.run(["ffmpeg","-y","-ss",str(start),"-t","3","-i",raw_file,
            "-ac","1","-ar","44100",out], capture_output=True)
    
    total_new = len([f for f in os.listdir(WAV_DIR) if f.endswith(".wav")])

print(f"Total clips: {total_new}")
