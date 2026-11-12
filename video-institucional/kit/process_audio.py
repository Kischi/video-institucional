#!/usr/bin/env python3
"""Prepara a narração final a partir das partes geradas no ElevenLabs.

1. decodifica cada parte (wav 48 kHz mono)
2. detecta silêncios ≥ LONG_SIL e encurta cada um para KEEP_SIL (ritmo mais ágil)
3. concatena as partes com GAP de silêncio
4. acelera levemente (TEMPO) sem mudar o tom e normaliza o volume
5. grava assets/audio/narracao.mp3 e audio_map.json (mapa tempo bruto → tempo final, por parte)

Uso: python3 process_audio.py parte1.mp3 parte2.mp3
"""
import json, subprocess, sys, tempfile, os
import numpy as np

SR = 48000
LONG_SIL = 0.90     # silêncio considerado "longo" (s)
KEEP_SIL = 0.55     # quanto manter de cada silêncio longo (s)
GAP = 0.60          # silêncio entre as partes (s)
TEMPO = 1.10        # boas-vindas graduação: 1,10
THRESH_DB = -42.0   # limiar de silêncio (dBFS, RMS em janelas de 10 ms)
WIN = int(0.010 * SR)

def decode(path):
    out = subprocess.run(["ffmpeg", "-v", "error", "-i", path, "-ac", "1", "-ar", str(SR), "-f", "f32le", "-"], capture_output=True, check=True).stdout
    return np.frombuffer(out, dtype=np.float32).copy()

def silences(x):
    n = len(x) // WIN
    rms = np.sqrt(np.mean(x[: n * WIN].reshape(n, WIN) ** 2, axis=1) + 1e-12)
    db = 20 * np.log10(rms)
    quiet = db < THRESH_DB
    out, i = [], 0
    while i < n:
        if quiet[i]:
            j = i
            while j < n and quiet[j]:
                j += 1
            out.append((i * WIN / SR, j * WIN / SR))
            i = j
        else:
            i += 1
    return out

def fade_join(pieces):
    """Concatena com fade de 6 ms nas emendas para evitar estalos."""
    f = int(0.006 * SR)
    ramp = np.linspace(0, 1, f, dtype=np.float32)
    out = []
    for i, seg in enumerate(pieces):
        seg = seg.copy()
        if i > 0 and len(seg) > f: seg[:f] *= ramp
        if i < len(pieces) - 1 and len(seg) > f: seg[-f:] *= ramp[::-1]
        out.append(seg)
    return np.concatenate(out)

def trim(x, sils, cuts=()):
    """Encurta silêncios longos (mantendo KEEP_SIL) e remove os trechos em `cuts` [(a,b)] por completo.
    Devolve (novo_sinal, mapa) com mapa = lista de (raw_start, raw_end, new_start)."""
    removals = [(a, b, KEEP_SIL, 0.0) for (a, b) in sils if b - a >= LONG_SIL] + [(c[0], c[1], 0.0, (c[2] if len(c) > 2 else 0.0)) for c in cuts]
    removals.sort()
    pieces, mapping = [], []
    cur_raw, cur_new = 0.0, 0.0
    total = len(x) / SR
    for (a, b, keep, insert) in removals:
        keep_end = a + keep / 2
        seg = x[int(cur_raw * SR): int(keep_end * SR)]
        pieces.append(seg)
        mapping.append((cur_raw, keep_end, cur_new))
        cur_new += len(seg) / SR
        if insert > 0:  # silêncio inserido no lugar do trecho cortado
            pieces.append(np.zeros(int(insert * SR), dtype=np.float32))
            cur_new += insert
        cur_raw = b - keep / 2
    seg = x[int(cur_raw * SR):]
    pieces.append(seg)
    mapping.append((cur_raw, total, cur_new))
    cur_new += len(seg) / SR
    return fade_join(pieces), mapping, cur_new

def main(paths):
    os.makedirs("assets/audio", exist_ok=True)
    cuts_all = json.load(open("cuts.json")) if os.path.exists("cuts.json") else {}
    parts, amap = [], {"tempo": TEMPO, "parts": []}
    offset = 0.0
    for k, p in enumerate(paths):
        x = decode(p)
        # corta silêncio inicial/final além de 0,25 s
        sils = silences(x)
        lead = sils[0][1] if sils and sils[0][0] == 0.0 else 0.0
        if lead > 0.25:
            x = x[int((lead - 0.25) * SR):]
        sils = silences(x)
        lc = max(0.0, lead - 0.25)
        cuts = [(c[0] - lc, c[1] - lc) + tuple(c[2:]) for c in cuts_all.get(str(k), [])]
        y, mapping, dur = trim(x, sils, cuts)
        if cuts: print(f"parte {k+1}: cortes explícitos (brutos): {cuts}")
        long_sils = [(round(a, 2), round(b, 2)) for a, b in sils if b - a >= LONG_SIL]
        print(f"parte {k+1}: {len(x)/SR:.1f}s brutos → {dur:.1f}s após encurtar {len(long_sils)} pausas longas: {long_sils}")
        amap["parts"].append({"file": p, "offset_new": offset, "raw_duration": len(x) / SR, "lead_cut": max(0.0, lead - 0.25), "map": mapping, "silences": [(round(a, 3), round(b, 3)) for a, b in sils]})
        parts.append(y)
        offset += dur + GAP
        parts.append(np.zeros(int(GAP * SR), dtype=np.float32))
    full = np.concatenate(parts[:-1])
    tmp = tempfile.mktemp(suffix=".wav")
    import wave
    with wave.open(tmp, "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((np.clip(full, -1, 1) * 32767).astype(np.int16).tobytes())
    subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", tmp, "-af", f"atempo={TEMPO},rubberband=pitch=0.943874:formant=preserved,loudnorm=I=-16:TP=-1.5:LRA=11", "-ar", "48000", "-c:a", "libmp3lame", "-q:a", "2", "assets/audio/narracao.mp3"], check=True)
    os.remove(tmp)
    dur = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", "assets/audio/narracao.mp3"], capture_output=True, text=True).stdout.strip())
    amap["final_duration"] = dur
    json.dump(amap, open("audio_map.json", "w"), indent=1)
    print(f"narração final: {dur:.1f}s ({int(dur//60)}:{dur%60:04.1f})")

def raw_to_final(amap, part_index, t_raw):
    """Converte um tempo bruto (segundos, no arquivo original da parte) para o tempo na narração final."""
    p = amap["parts"][part_index]
    t = t_raw - p["lead_cut"]
    new = None
    for (a, b, ns) in p["map"]:
        if a <= t <= b:
            new = ns + (t - a); break
        if t < a:  # caiu dentro de um trecho de silêncio removido
            new = ns; break
    if new is None:
        new = p["map"][-1][2] + (p["map"][-1][1] - p["map"][-1][0])
    return (p["offset_new"] + new) / amap["tempo"]

if __name__ == "__main__":
    main(sys.argv[1:])
