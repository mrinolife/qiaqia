#!/usr/bin/env python3
"""Generate SBV2 train.list for Usagi using Whisper on source audio + timestamp mapping."""
import os, json, subprocess, whisper

CHAR = "Usagi"
WAV_DIR = f"/home/jznle/ina-ai/Style-Bert-VITS2/Data/{CHAR}/wavs"
SRC_FILES = [
    "/home/jznle/apps/qiaqia/chiikawa-source/usagi-screams.mp3",
    "/home/jznle/apps/qiaqia/chiikawa-source/usagi-1hr.mp3",
]

model = whisper.load_model("tiny")
all_segments = []

for src in SRC_FILES:
    name = os.path.basename(src).replace(".mp3", "")
    print(f"Transcribing {name}...")
    result = model.transcribe(src)
    for seg in result["segments"]:
        all_segments.append({
            "source": name,
            "start": seg["start"],
            "end": seg["end"],
            "text": seg["text"].strip(),
        })
    print(f"  {len(result['segments'])} segments")

# Now match clips to transcriptions
# Clips are usagi_{idx:04d}.wav, each starting at idx*2 seconds, 3 seconds long
# from the combined source
entries = []
clip_files = sorted([f for f in os.listdir(WAV_DIR) if f.endswith(".wav")])

# First source: usagi-screams.mp3 (idx 0-~60)
# Second source: usagi-1hr.mp3 (idx ~60+)
screams_dur = float(subprocess.run(["ffprobe","-v","error","-show_entries","format=duration",
    "-of","default=noprint_wrappers=1:nokey=1",SRC_FILES[0]], capture_output=True,text=True).stdout.strip())

unmatched = 0
for fname in clip_files:
    # Parse index
    idx = int(fname.replace("usagi_","").replace(".wav",""))
    # Determine which source file and offset
    clip_start = idx * 2  # each clip starts at idx*2 seconds
    
    # Find matching transcription
    source_name = "usagi-screams" if clip_start < int(float(screams_dur)) else "usagi-1hr"
    relative_start = clip_start if source_name == "usagi-screams" else clip_start - int(float(screams_dur))
    
    # Find segment that overlaps with this clip
    matched_text = ""
    for seg in [s for s in all_segments if s["source"] == source_name]:
        if seg["start"] <= relative_start + 1.5 and seg["end"] >= relative_start:
            matched_text = seg["text"]
            break
    
    if not matched_text:
        matched_text = ""
        unmatched += 1
    
    entry = f"Data/{CHAR}/wavs/{fname}|{CHAR}|JP|{matched_text}||"
    entries.append(entry)

# Write train.list
train = entries[:len(entries)//10*9]
val = entries[len(entries)//10*9:]
with open(f"/home/jznle/ina-ai/Style-Bert-VITS2/Data/{CHAR}/train.list", "w") as f:
    f.write("\n".join(train))
with open(f"/home/jznle/ina-ai/Style-Bert-VITS2/Data/{CHAR}/val.list", "w") as f:
    f.write("\n".join(val))

print(f"\nTotal clips: {len(entries)}")
print(f"Train: {len(train)}, Val: {len(val)}")
print(f"Unmatched: {unmatched}")
print(f"Train list: /home/jznle/ina-ai/Style-Bert-VITS2/Data/{CHAR}/train.list")
