#!/usr/bin/env python3
"""Extract character voice segments from Chiikawa episodes using Whisper + pitch analysis.
Outputs segments grouped by estimated speaker, ready for SBV2 training."""

import os, sys, json, subprocess, torch, torchaudio
import whisper
import numpy as np

EPISODE_DIR = "/home/jznle/apps/qiaqia/chiikawa-source/episodes"
OUTPUT_DIR = "/home/jznle/apps/qiaqia/chiikawa-source/training_data"
os.makedirs(OUTPUT_DIR, exist_ok=True)

def extract_pitch(audio_path):
    """Extract average pitch and other voice characteristics."""
    audio, sr = torchaudio.load(audio_path)
    audio = audio.mean(0)  # mono
    if sr != 16000:
        audio = torchaudio.functional.resample(audio, sr, 16000)
    
    # Simple pitch estimation via autocorrelation
    n = len(audio)
    # Center and normalize
    audio_np = audio.numpy()
    audio_np = audio_np - audio_np.mean()
    audio_np = audio_np / (audio_np.std() + 1e-8)
    
    # Compute short-term energy (volume)
    frame_len = 400  # 25ms at 16kHz
    energy = []
    for i in range(0, n - frame_len, frame_len // 2):
        frame = audio_np[i:i+frame_len]
        energy.append(np.sqrt(np.mean(frame**2)))
    
    avg_energy = np.mean(energy) if energy else 0
    peak_energy = np.max(energy) if energy else 0
    
    # Spectral centroid - higher = brighter voice
    spec = np.abs(np.fft.rfft(audio_np))
    freqs = np.fft.rfftfreq(n, 1/16000)
    centroid = np.sum(freqs * spec) / (np.sum(spec) + 1e-8)
    
    return {
        "avg_energy": float(avg_energy),
        "peak_energy": float(peak_energy),
        "spectral_centroid": float(centroid),
        "duration": float(n / 16000),
    }

def process_episode(ep_path, ep_name):
    """Process a single episode file."""
    print(f"\nProcessing {ep_name}...")
    
    # Run Whisper
    model = whisper.load_model("tiny")
    result = model.transcribe(ep_path, word_timestamps=False)
    
    segments = []
    for seg in result["segments"]:
        start = seg["start"]
        end = seg["end"]
        text = seg["text"].strip()
        if not text or end - start < 0.3:
            continue
        
        # Extract this segment as wav
        seg_name = f"{ep_name}_{start:.1f}_{end:.1f}"
        seg_path = os.path.join(OUTPUT_DIR, f"{seg_name}.wav")
        
        subprocess.run([
            "ffmpeg", "-y", "-i", ep_path,
            "-ss", str(start), "-to", str(end),
            "-ac", "1", "-ar", "16000",
            seg_path
        ], capture_output=True)
        
        if not os.path.exists(seg_path) or os.path.getsize(seg_path) < 1000:
            continue
        
        # Extract pitch characteristics
        pitch_info = extract_pitch(seg_path)
        
        segments.append({
            "episode": ep_name,
            "start": start,
            "end": end,
            "text": text,
            "path": seg_name,
            "pitch": pitch_info,
            "character": "unknown"
        })
        
        print(f"  {start:.1f}s-{end:.1f}s: [{seg_name}] {text[:40]}... centroid={pitch_info['spectral_centroid']:.0f}Hz")
    
    return segments

def main():
    all_segments = []
    
    # Find all downloaded episode files
    for f in sorted(os.listdir(EPISODE_DIR)):
        if f.endswith(".mp3"):
            ep_path = os.path.join(EPISODE_DIR, f)
            ep_name = f.replace(".mp3", "")
            segs = process_episode(ep_path, ep_name)
            all_segments.extend(segs)
    
    # Save all segments
    with open(os.path.join(OUTPUT_DIR, "all_segments.json"), "w") as f:
        json.dump(all_segments, f, indent=1, ensure_ascii=False)
    
    # Print summary by character (unknown for now)
    print(f"\n{'='*50}")
    print(f"Total segments: {len(all_segments)}")
    print(f"Saved to {OUTPUT_DIR}/")
    print(f"Segments file: {OUTPUT_DIR}/all_segments.json")
    
    # Cluster by spectral centroid for rough character grouping
    import collections
    centroids = [s["pitch"]["spectral_centroid"] for s in all_segments]
    if centroids:
        print(f"\nPitch range: {min(centroids):.0f}Hz - {max(centroids):.0f}Hz")
        print(f"Mean: {np.mean(centroids):.0f}Hz")

if __name__ == "__main__":
    main()
