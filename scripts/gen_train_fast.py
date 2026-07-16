#!/usr/bin/env python3
"""Quick training data gen - use whisper only on short source, placeholder for rest."""
import os, subprocess, whisper

CHAR = "Usagi"
WAV_DIR = f"/home/jznle/ina-ai/Style-Bert-VITS2/Data/{CHAR}/wavs"

model = whisper.load_model("tiny")
src = "/home/jznle/apps/qiaqia/chiikawa-source/usagi-screams.mp3"
print("Transcribing usagi-screams...")
result = model.transcribe(src)
segments = {s["start"]: s["text"].strip() for s in result["segments"]}
print(f"  {len(segments)} segments")

entries = []
clip_files = sorted([f for f in os.listdir(WAV_DIR) if f.endswith(".wav")])

for fname in clip_files:
    idx = int(fname.replace("usagi_","").replace(".wav",""))
    clip_start = idx * 2
    # Find matching segment
    text = ""
    for ts, t in sorted(segments.items()):
        if ts <= clip_start + 2 and ts >= clip_start - 1:
            text = t
            break
    
    entry = f"Data/{CHAR}/wavs/{fname}|{CHAR}|JP|{text}||"
    entries.append(entry)

split = len(entries) // 10
train = entries[split:]
val = entries[:split]

with open(f"/home/jznle/ina-ai/Style-Bert-VITS2/Data/{CHAR}/train.list", "w") as f:
    f.write("\n".join(train))
with open(f"/home/jznle/ina-ai/Style-Bert-VITS2/Data/{CHAR}/val.list", "w") as f:
    f.write("\n".join(val))

print(f"Total: {len(entries)}, Train: {len(train)}, Val: {len(val)}")
print(f"Train list ready at /home/jznle/ina-ai/Style-Bert-VITS2/Data/{CHAR}/train.list")
