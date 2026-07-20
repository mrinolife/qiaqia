#!/usr/bin/env python3
"""YaHa voice pipeline — regenerate all cast voice clips with edge-tts + rubberband.
   Uses per-character TTS voice assignments + aggressive Chiikawa-style pitch/tempo curves."""

import asyncio, json, os, subprocess, sys, shutil, tempfile
from pathlib import Path

BASE = Path(__file__).resolve().parent.parent
CAST_DIR = BASE / "audio" / "cast"
ORIG_DIR = CAST_DIR / "orig"
INDEX_PATH = CAST_DIR / "index.json"

# ── Character voice config ──────────────────────────────────────────────
# Each character gets:
#   tts_voice: edge-tts voice name (zh-CN/zh-TW)
#   pitch: semitones shift (positive = higher, negative = lower)
#   tempo: playback speed multiplier (1.0 = normal)
#   lines: list of Chinese text lines to generate

CHARACTERS = {
    "usagi": {
        "tts_voice": "zh-CN-XiaoxiaoNeural",  # energetic female, high ceiling
        "pitch": 8,       # piercingly high — chaotic bunny energy
        "tempo": 1.12,    # faster, more frenetic
        "lines": [
            "呀哈——!!",
            "乌拉!! 台湾!! 珍珠奶茶!!",
            "呀哈!",
            "呀哈!! 好耶!!",
            "呜哇哇哇!!",
            "乌拉!!",
            "呀哈呀哈呀哈!!",
            "好耶好耶好耶!!",
            "乌拉乌拉!!",
            "呜哇啊啊啊!!",
        ],
    },
    "chiikawa": {
        "tts_voice": "zh-CN-XiaoxiaoNeural",  # sweet female, can go soft
        "pitch": 6,       # high but soft, gentle
        "tempo": 1.04,
        "lines": [
            "今天也加油!",
            "小小的努力也是努力!",
            "呜呜…我们一起学吧",
            "可以的…我觉得可以的!",
            "呜, 好难…但是不放弃!",
            "做到了! 太好了…",
        ],
    },
    "hachiware": {
        "tts_voice": "zh-CN-XiaoxiaoNeural",  # warm, optimistic
        "pitch": 5,       # moderately high, friendly
        "tempo": 1.03,
        "lines": [
            "太好了!",
            "没关系, 慢慢来~",
            "能学会的!",
            "深呼吸, 一起来!",
            "错了也没关系哦~",
            "你今天也很棒!",
        ],
    },
    "momonga": {
        "tts_voice": "zh-CN-XiaoyiNeural",  # higher natural pitch, bratty potential
        "pitch": 8,       # very high — bratty, attention-seeking
        "tempo": 1.08,
        "lines": [
            "夸我!!",
            "看我看我!",
            "我是不是很厉害!!",
            "再夸一次!! 嘿嘿",
            "看! 我的分数!! 快看!!",
            "全世界都该看到这个!!",
        ],
    },
    "kani": {
        "tts_voice": "zh-TW-HsiaoYuNeural",  # Taiwan accent, cheerful
        "pitch": 5,       # high, energetic
        "tempo": 1.06,
        "lines": [
            "加油加油!",
            "好耶!",
            "✂️ 咔嚓! 学完一课!",
            "学弟学妹们, 冲啊!",
            "好耶好耶! 干得漂亮!",
            "下一课, 出发!",
        ],
    },
    "kurimanju": {
        "tts_voice": "zh-CN-YunxiNeural",  # male, warm — chill not elderly
        "pitch": 1,       # neutral ratio (1.0 = no shift) — relaxed, not old-man raspy
        "tempo": 0.96,    # slower, lazy, but not draggy
        "lines": [
            "哈~ 学完喝一杯奶茶吧",
            "慢慢学, 慢慢吃~",
            "唔…慢慢来, 急什么呢",
            "学完了? 那就休息一下吧~",
            "哈~ 大家都要慢慢来哦",
            "慢工出细活儿, 慢慢学~",
        ],
    },
    "chimera": {
        "tts_voice": "zh-CN-XiaoxiaoNeural",  # soft, mysterious
        "pitch": 7,       # high, airy
        "tempo": 1.03,
        "lines": [
            "一起玩吧~",
            "嘿嘿, 你进步好快!",
            "咦? 你藏了什么秘密武器?",
            "飞呀飞~ 一起去下一关!",
            "嘿嘿嘿, 猜猜下一题是什么~",
            "你好厉害, 我都想鼓掌!",
        ],
    },
    "rakko": {
        "tts_voice": "zh-CN-YunjianNeural",  # male, cool
        "pitch": 3,       # slight lift — cool but not deep
        "tempo": 0.97,    # relaxed, deliberate
        "lines": [
            "不错。",
            "台湾之前, 每天一课。",
            "继续。",
            "还行。 下一个。",
            "别停。 你在进步。",
            "台湾等着你呢。",
        ],
    },
    "yoroi": {
        "tts_voice": "zh-CN-YunxiNeural",  # male, warm
        "pitch": 2,       # gentle lift — kind, approachable
        "tempo": 0.98,
        "lines": [
            "你很努力, 真棒!",
            "劳动辛苦了!",
            "每一步都算数, 别灰心!",
            "你已经做得很好了!",
            "慢慢来, 我陪着你!",
            "今天的你, 也很了不起!",
        ],
    },
    "shisa": {
        "tts_voice": "zh-TW-HsiaoChenNeural",  # Taiwan female, guardian spirit
        "pitch": 4,       # moderate, cheerful
        "tempo": 1.04,
        "lines": [
            "嘿嘿! 今天也练习吧!",
            "台湾见!",
            "台湾的夜市很热闹哦!",
            "路上小心, 一路平安!",
            "学好这句, 台湾用得上!",
            "嘿嘿, 离台湾又近一步了!",
        ],
    },
}


async def generate_tts(text, voice, out_path):
    """Generate TTS audio using edge-tts."""
    import edge_tts
    communicate = edge_tts.Communicate(text, voice)
    await communicate.save(str(out_path))


def apply_rubberband(in_path, out_path, pitch_semitones, tempo):
    """Apply pitch shift + tempo change via ffmpeg.
       pitch_semitones: positive = higher, negative = lower
       tempo: 1.0 = normal, >1 = faster, <1 = slower"""
    import math
    
    # rubberband's pitch param only accepts [0.01-100] (positive).
    # For negative pitch (lowering), use asetrate+aresample+atempo chain:
    #   pitch_ratio = 2^(semitones/12)
    #   asetrate=sample_rate * pitch_ratio  (shifts pitch by changing rate)
    #   aresample=sample_rate               (resamples back to original)
    #   atempo=1/pitch_ratio                (restores tempo)
    if pitch_semitones >= 0:
        # Use rubberband for highest quality pitch shift
        cmd = [
            "ffmpeg", "-y", "-i", str(in_path),
            "-af", f"rubberband=pitch={pitch_semitones}:tempo={tempo}",
            "-q:a", "2",
            str(out_path)
        ]
    else:
        # Negative pitch: use asetrate chain
        pitch_ratio = 2 ** (pitch_semitones / 12.0)
        # Probe input sample rate
        probe = subprocess.run([
            "ffprobe", "-v", "quiet",
            "-show_entries", "stream=sample_rate",
            "-of", "default=noprint_wrappers=1:nokey=1",
            str(in_path)
        ], capture_output=True, text=True)
        try:
            sr = int(probe.stdout.strip().split()[0])
        except (ValueError, IndexError):
            sr = 24000  # fallback
        new_rate = round(sr * pitch_ratio)
        tempo_comp = 1.0 / pitch_ratio
        # Combined filter: shift pitch, resample, apply tempo AND the user's tempo
        total_tempo = tempo_comp * tempo
        # asetrate changes speed too, so atempo restores it
        cmd = [
            "ffmpeg", "-y", "-i", str(in_path),
            "-af", f"asetrate={new_rate},aresample={sr},atempo={total_tempo:.4f}",
            "-q:a", "2",
            str(out_path)
        ]
    
    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode != 0:
        print(f"  ERROR: {result.stderr[:500]}")
        return False
    return True


def get_orig_for_line(char_id, line_idx, lines):
    """Build a filename for the original/generated TTS file."""
    # Build a unique but stable filename
    suffix_map = {}
    for i, line in enumerate(lines):
        # Just use the line index
        suffix_map[i] = f"{char_id}-line{i}"
    
    # For usagi's 5th line (index 4, "呜哇哇哇!!") and 6th line (index 5, "呀哈!! 好耶!!")
    # these are new extras — use extra suffix
    if line_idx >= 3:
        extra_idx = line_idx - 3
        return f"{char_id}-extra{extra_idx}"
    else:
        return f"{char_id}-line{line_idx}"


async def process_character(char_id, config):
    """Generate and process all voice clips for one character."""
    lines = config["lines"]
    print(f"\n{'='*50}")
    print(f"Processing {char_id} ({len(lines)} lines)")
    print(f"  TTS voice: {config['tts_voice']}")
    print(f"  Pitch: {config['pitch']:+d} semitones, Tempo: {config['tempo']:.2f}")
    print(f"  Lines: {lines}")
    
    temp_dir = tempfile.mkdtemp(prefix=f"yaha_{char_id}_")
    
    index_entries = {}
    
    for i, line in enumerate(lines):
        suffix = get_orig_for_line(char_id, i, lines)
        stem = f"{suffix}"
        tts_path = Path(temp_dir) / f"{stem}_tts.mp3"
        final_path = CAST_DIR / f"{stem}.mp3"
        orig_backup = ORIG_DIR / f"{stem}.mp3"
        
        # Step 1: Generate TTS
        print(f"  [{i+1}/{len(lines)}] Generating TTS: \"{line}\"")
        try:
            await generate_tts(line, config["tts_voice"], tts_path)
            if not tts_path.exists() or tts_path.stat().st_size < 100:
                print(f"    WARNING: TTS output too small ({tts_path.stat().st_size}b), trying fallback voice")
                # Try fallback with a different voice
                fallback = "zh-CN-XiaoxiaoNeural"
                await generate_tts(line, fallback, tts_path)
        except Exception as e:
            print(f"    ERROR generating TTS: {e}")
            continue
        
        # Step 2: Backup original (if it's a new file, save the TTS as orig)
        ORIG_DIR.mkdir(parents=True, exist_ok=True)
        shutil.copy2(tts_path, orig_backup)
        print(f"    Original saved: {orig_backup.name}")
        
        # Step 3: Apply rubberband
        print(f"    Applying rubberband: pitch={config['pitch']:+d}, tempo={config['tempo']:.2f}")
        if not apply_rubberband(tts_path, final_path, config["pitch"], config["tempo"]):
            print(f"    ERROR applying rubberband, using original as fallback")
            shutil.copy2(tts_path, final_path)
        
        # Verify
        if final_path.exists() and final_path.stat().st_size > 100:
            orig_size = tts_path.stat().st_size
            final_size = final_path.stat().st_size
            print(f"    OK: {final_path.name} ({orig_size//1024}KB -> {final_size//1024}KB)")
            index_entries[f"{char_id}::{line}"] = f"{stem}.mp3"
        else:
            print(f"    FAILED: output file missing or empty")
    
    # Cleanup temp
    shutil.rmtree(temp_dir, ignore_errors=True)
    
    return index_entries


async def main():
    print("=" * 60)
    print("YaHa Voice Pipeline — edge-tts + chiikawa rubberband")
    print("=" * 60)
    
    # Check deps
    for cmd in ["ffmpeg"]:
        if not shutil.which(cmd):
            print(f"ERROR: {cmd} not found")
            sys.exit(1)
    
    # Backup existing index
    if INDEX_PATH.exists():
        shutil.copy2(INDEX_PATH, CAST_DIR / "index.json.bak")
        print(f"Backed up existing index.json -> index.json.bak")
    
    # Process each character
    all_entries = {}
    for char_id, config in CHARACTERS.items():
        entries = await process_character(char_id, config)
        all_entries.update(entries)
    
    # Write index
    sorted_entries = dict(sorted(all_entries.items(), key=lambda x: (x[0].split("::")[0], x[0])))
    INDEX_PATH.write_text(json.dumps(sorted_entries, indent=1, ensure_ascii=False) + "\n")
    
    print(f"\n{'='*60}")
    print(f"Done! Generated {len(sorted_entries)} voice clips")
    print(f"Index: {INDEX_PATH}")
    print(f"Characters: {len(CHARACTERS)}")
    total_bytes = sum(CAST_DIR.joinpath(v).stat().st_size for v in sorted_entries.values() if CAST_DIR.joinpath(v).exists())
    print(f"Total size: {total_bytes // 1024} KB")
    print(f"{'='*60}")


if __name__ == "__main__":
    asyncio.run(main())