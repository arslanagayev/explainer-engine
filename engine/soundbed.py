"""Synthesises a quiet music bed + scene-change whooshes for an episode (pure Python, no deps).

    python3 engine/soundbed.py episodes/<episode>   -> episodes/<episode>/out/bed.wav

A soft four-chord pad (Am F C G, 2 s per chord) over a gentle pulse, plus a short filtered-noise
whoosh just before every scene. The voice-over is mixed on top with ducking in ffmpeg."""
import json, math, os, random, struct, sys, wave

ep = sys.argv[1]
timing = json.load(open(f'{ep}/timing.json'))
SR = 32000
dur = timing['total'] + 0.5
n = int(dur * SR)
CHORDS = [(220.0, 261.63, 329.63), (174.61, 220.0, 261.63), (261.63, 329.63, 392.0), (196.0, 246.94, 293.66)]
CHORD_LEN = 2.0
BEAT = 0.5
scene_starts = [0.0] + [l['start'] - 0.22 for l in timing['lines'][1:]]

rand = random.Random(7)
out = [0.0] * n
for i in range(n):
    t = i / SR
    # Pad: crossfade between neighbouring chords so the changes are soft.
    c = t / CHORD_LEN
    k = int(c) % 4
    frac = c - int(c)
    blend = min(1.0, frac / 0.25)
    s = 0.0
    for idx, w in ((k, blend), ((k - 1) % 4, 1 - blend)):
        if w <= 0:
            continue
        for f in CHORDS[idx]:
            s += w * (math.sin(2 * math.pi * f * t) + 0.5 * math.sin(2 * math.pi * f * 1.003 * t))
    pad = s * 0.018 * (0.8 + 0.2 * math.sin(2 * math.pi * 0.25 * t))
    # Pulse: a soft sub note on every beat, root of the chord an octave down.
    bt = t % BEAT
    root = CHORDS[k][0] / 2
    pulse = math.sin(2 * math.pi * root * t) * math.exp(-bt * 9) * 0.10
    # Fade the whole bed in and out.
    env = min(1.0, t / 1.5) * min(1.0, max(0.0, (dur - t) / 2.0))
    out[i] = (pad + pulse) * env

# Whooshes: low-passed noise with a rise-and-fall envelope, ending right at each scene start.
W = 0.32
for s0 in scene_starts[1:]:
    a = int((s0 - W * 0.7) * SR)
    lp = 0.0
    for j in range(int(W * SR)):
        i = a + j
        if not 0 <= i < n:
            continue
        x = j / (W * SR)
        env = math.sin(math.pi * x) ** 2
        cutoff = 0.04 + 0.25 * x
        lp += cutoff * (rand.uniform(-1, 1) - lp)
        out[i] += lp * env * 0.55

peak = max(abs(v) for v in out) or 1
gain = 0.6 / peak
os.makedirs(f'{ep}/out', exist_ok=True)
with wave.open(f'{ep}/out/bed.wav', 'wb') as f:
    f.setnchannels(1)
    f.setsampwidth(2)
    f.setframerate(SR)
    f.writeframes(b''.join(struct.pack('<h', int(max(-1, min(1, v * gain)) * 32767)) for v in out))
print(f'bed.wav {dur:.2f} s, {len(scene_starts) - 1} whooshes')
