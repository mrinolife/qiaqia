#!/usr/bin/env python3
"""Prepare SBV2 training data for Usagi character voice.
Splits raw audio into clips, generates transcripts via Whisper,
creates train.list and config.json for Style-Bert-VITS2."""

import os, json, subprocess, whisper
import torchaudio
import numpy as np

CHAR = "Usagi"
DATA_DIR = f"/home/jznle/ina-ai/Style-Bert-VITS2/Data/{CHAR}"
RAW_DIR = f"{DATA_DIR}/raw"
WAV_DIR = f"{DATA_DIR}/wavs"
os.makedirs(WAV_DIR, exist_ok=True)

model = whisper.load_model("tiny")

def split_and_transcribe(raw_file, prefix):
    """Split raw audio into clips at silence gaps, transcribe each."""
    # Load audio
    import soundfile as sf
    audio_np, sr = sf.read(raw_file)
    if len(audio_np.shape) > 1:
        audio_np = audio_np.mean(1)  # stereo to mono
    total_dur = len(audio_np) / sr
    print(f"  {raw_file}: {total_dur:.1f}s, {sr}Hz")
    
    # Use whisper to get segments with timestamps
    result = model.transcribe(raw_file, word_timestamps=True)
    
    clips = []
    for seg in result["segments"]:
        start = seg["start"]
        end = seg["end"]
        text = seg["text"].strip()
        
        if end - start < 0.3 or end - start > 8.0:
            continue  # skip too short or too long
        if len(text) < 1:
            continue
        
        # Extract segment
        start_s = int(start * sr)
        end_s = int(end * sr)
        if end_s > len(audio_np):
            end_s = len(audio_np)
        
        seg_audio = audio_np[start_s:end_s]
        
        # Generate filename
        idx = len([f for f in os.listdir(WAV_DIR) if f.endswith(".wav")])
        fname = f"{prefix}_{idx:04d}.wav"
        out_path = os.path.join(WAV_DIR, fname)
        
        # Save as 44.1kHz WAV (SBV2 format)
        import soundfile as sf
        sf.write(out_path, seg_audio, sr)
        
        clips.append({
            "path": f"Data/{CHAR}/wavs/{fname}",
            "text": text,
            "speaker": CHAR,
            "language": "JP",  # Japanese vocalizations
            "duration": end - start,
        })
        
        print(f"    {fname}: {start:.1f}s-{end:.1f}s [{text[:30]}]")
    
    return clips

def main():
    all_clips = []
    
    for raw_file, prefix in [
        (f"{RAW_DIR}/usagi_screams_raw.wav", "usagi_scream"),
        (f"{RAW_DIR}/usagi_1hr_raw.wav", "usagi_1hr"),
    ]:
        clips = split_and_transcribe(raw_file, prefix)
        all_clips.extend(clips)
    
    # Create train.list in SBV2 format:
    # wav_path|speaker|language|text|phonemes|tones|...
    train_entries = []
    for c in all_clips:
        # Simplified: text as-is, no phonemes/tones for Japanese sounds
        line = f"{c['path']}|{c['speaker']}|{c['language']}|{c['text']}||"
        train_entries.append(line)
    
    # Write train.list
    with open(f"{DATA_DIR}/train.list", "w") as f:
        f.write("\n".join(train_entries))
    with open(f"{DATA_DIR}/val.list", "w") as f:
        # Use last 10% as validation
        split = max(1, len(train_entries) // 10)
        f.write("\n".join(train_entries[-split:]))
        f.write("\n".join(train_entries[:-split]))
    
    print(f"\n{'='*50}")
    print(f"Total clips: {len(all_clips)}")
    print(f"Train: {len(train_entries) - split}")
    print(f"Val: {split}")
    print(f"Train list: {DATA_DIR}/train.list")

if __name__ == "__main__":
    main()
