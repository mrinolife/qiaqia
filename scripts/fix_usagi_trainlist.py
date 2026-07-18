#!/usr/bin/env python3
"""Fix Usagi training data - add transcriptions using Whisper or defaults."""
import os, whisper, subprocess

CHAR = "Usagi"
DATA_DIR = f"/home/jznle/ina-ai/Style-Bert-VITS2/Data/{CHAR}"
WAV_DIR = f"{DATA_DIR}/wavs"

# Run Whisper on the source compilations
model = whisper.load_model("tiny")

# Get timestamps for all segments
all_segments = {}
for src_name, src in [
    ("screams", "/home/jznle/apps/qiaqia/chiikawa-source/usagi-screams.mp3"),
]:
    print(f"Transcribing {src_name}...")
    result = model.transcribe(src)
    for seg in result["segments"]:
        t = round(seg["start"])
        all_segments[t] = seg["text"].strip()
    print(f"  {len(result['segments'])} segments")

# Build train.list with text
entries = []
for fname in sorted(os.listdir(WAV_DIR)):
    if not fname.endswith(".wav"):
        continue
    idx = int(fname.replace("usagi_","").replace(".wav",""))
    clip_start = idx * 2
    
    # Find matching transcription
    text = ""
    for ts, t in sorted(all_segments.items()):
        if abs(ts - clip_start) <= 2:
            text = t
            break
    
    # If no transcription, use "ya ha" as default for Usagi vocalizations
    if not text:
        text = "ya ha"
    
    entry = f"Data/{CHAR}/wavs/{fname}|{CHAR}|JP|{text}|"
    entries.append(entry)

split = len(entries) // 10
train = entries[split:]
val = entries[:split]

with open(f"{DATA_DIR}/train.list", "w") as f:
    f.write("\n".join(train))
with open(f"{DATA_DIR}/val.list", "w") as f:
    f.write("\n".join(val))

print(f"Done: {len(entries)} entries, {sum(1 for e in entries if '||' not in e.split('|')[3])} with text")
