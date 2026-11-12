#!/usr/bin/env python3
"""Gera legendas SRT e VTT (pt-BR) a partir de transcript.json (palavras com tempos no vídeo final)."""
import json, re

MAX_LINE = 42          # caracteres por linha
MAX_CUE = 78           # 2 linhas
MIN_DUR, MAX_DUR = 1.0, 6.0
ORPHANS = {"a", "o", "e", "de", "do", "da", "em", "no", "na", "que", "os", "as", "um", "uma", "para", "por", "com", "ou", "se", "é", "ao", "nas", "nos", "dos", "das", "pelo", "pela"}
GAP_BREAK = 0.7        # pausa que força quebra de legenda

words = json.load(open("transcript.json"))

# 1) normaliza grafias de TTS para a forma escrita
toks = [{"t": w["text"], "s": w["start"], "e": w["end"]} for w in words]

def split_punct(t):
    m = re.match(r"^(.*?)([.,;:!?…]*)$", t)
    return m.group(1), m.group(2)

out = []
i = 0
LETTER = re.compile(r"^[A-Z]$")
while i < len(toks):
    core, p = split_punct(toks[i]["t"])
    # sequência de letras isoladas: C B L → CBL
    if LETTER.match(core) and not p and i + 1 < len(toks) and LETTER.match(split_punct(toks[i + 1]["t"])[0]):
        j = i; letters = []; end = None; punct = ""
        while j < len(toks):
            c, pp = split_punct(toks[j]["t"])
            if LETTER.match(c):
                letters.append(c); end = toks[j]["e"]; punct = pp; j += 1
                if pp: break
            else:
                break
        if letters[0] == "E" and len(letters) >= 3:  # "E DML" — o E é conjunção
            out.append({"t": "E", "s": toks[i]["s"], "e": toks[i]["e"]})
            out.append({"t": "".join(letters[1:]) + punct, "s": toks[i + 1]["s"], "e": end}); i = j; continue
        out.append({"t": "".join(letters) + punct, "s": toks[i]["s"], "e": end}); i = j; continue
    low = core.lower()
    nxt = split_punct(toks[i + 1]["t"]) if i + 1 < len(toks) else ("", "")
    if low == "dê":
        out.append({"t": "D" + p, "s": toks[i]["s"], "e": toks[i]["e"]}); i += 1; continue
    if low == "tê" and nxt[0].lower() in ("pê", "pês"):
        out.append({"t": ("TPs" if nxt[0].lower() == "pês" else "TP") + nxt[1], "s": toks[i]["s"], "e": toks[i + 1]["e"]}); i += 2; continue
    if low == "a" and nxt[0].lower() in ("tê", "tês"):
        out.append({"t": ("ATs" if nxt[0].lower() == "tês" else "AT") + nxt[1], "s": toks[i]["s"], "e": toks[i + 1]["e"]}); i += 2; continue
    if low == "pê" and nxt[0].lower() == "bê":
        out.append({"t": "PB" + nxt[1], "s": toks[i]["s"], "e": toks[i + 1]["e"]}); i += 2; continue
    caps = {"asséssment": "Assessment", "andré": "Andre", "assessment": "Assessment", "assessments": "Assessments", "moodle": "Moodle", "live": "Live", "zoom": "Zoom",
            "coding": "Coding", "competency": "Competency", "based": "Based", "learning": "Learning", "project": "Project"}
    if low in caps:
        out.append({"t": caps[low] + p, "s": toks[i]["s"], "e": toks[i]["e"]}); i += 1; continue
    out.append(dict(toks[i])); i += 1

# 2) agrupa em legendas
cues, cur = [], []
def flush():
    global cur
    if cur:
        cues.append({"s": cur[0]["s"], "e": cur[-1]["e"], "text": " ".join(w["t"] for w in cur)}); cur = []
for k, w in enumerate(out):
    if cur:
        gap = w["s"] - cur[-1]["e"]
        length = len(" ".join(x["t"] for x in cur)) + 1 + len(w["t"])
        last = cur[-1]["t"]
        strong = last.endswith((".", "!", "?", ":", "…"))
        curlen = len(" ".join(x["t"] for x in cur))
        weak = last.endswith((",", ";"))
        if gap > GAP_BREAK or length > MAX_CUE or (strong and curlen >= 10) or (weak and curlen >= 36) or (w["s"] - cur[0]["s"] > MAX_DUR):
            flush()
    cur.append(w)
flush()

# 2b) grafias técnicas do bloco DVBE02
FIXES = [
    (r"\bcê sharp\b", "C#"), (r"\bCê sharp\b", "C#"), (r"\bASP dot net Core\b", "ASP.NET Core"), (r"\bdot net\b", ".NET"), (r"\bASP dót nét Core\b", "ASP.NET Core"), (r"\bASP dót nét\b", "ASP.NET"), (r"\bdót nét\b", ".NET"), (r"\basséssments\b", "Assessments"), (r"\basséssment\b", "Assessment"), (r"\bAsséssment\b", "Assessment"),
    (r"\bTP um\b", "TP1"), (r"\bTP dois\b", "TP2"), (r"\bTP três\b", "TP3"), (r"\bTP quatro\b", "TP4"), (r"\bTP cinco\b", "TP5"),
    (r"\bAP Is\b", "APIs"), (r"\bAPIs\b", "APIs"), (r"\bDT Os\b", "DTOs"), (r"\bProgram ponto CS\b", "Program.cs"),
    (r"\bDB Context\b", "DbContext"), (r"\bMongo DB\b", "MongoDB"), (r"\bO Auth dois\b", "OAuth2"), (r"\bJ Shell\b", "JShell"),
    (r"\bOpen API\b", "OpenAPI"), (r"\bSpec First\b", "Spec-First"), (r"\bSpec Anchored\b", "Spec-Anchored"),
    (r"\bback end\b", "back-end"), (r"\btry with resources\b", "try-with-resources"), (r"\bo padrão try\b", "o padrão TryXxx"),
    (r"\bWeb APIs\b", "Web APIs"), (r"\bo PB e a outra DR nesta semana\b", "\"O PB e a outra DR nesta semana\""),
]
for c in cues:
    for a, b in FIXES: c["text"] = re.sub(a, b, c["text"])

# 3) ajusta tempos e quebra em 2 linhas
def two_lines(text):
    if len(text) <= MAX_LINE: return text
    ws = text.split(); best, bi = None, None
    for i in range(1, len(ws)):
        a, b = " ".join(ws[:i]), " ".join(ws[i:])
        if len(a) <= MAX_LINE + 4 and len(b) <= MAX_LINE + 4:
            score = abs(len(a) - len(b)) - (8 if a.endswith((",", ".", ";", ":", "!", "?")) else 0)
            if ws[i - 1].lower() in ORPHANS: score += 12
            if best is None or score < best: best, bi = score, i
    if bi is None: bi = len(ws) // 2
    return " ".join(ws[:bi]) + "\n" + " ".join(ws[bi:])

for i, c in enumerate(cues):
    c["e"] = max(c["e"] + 0.2, c["s"] + MIN_DUR)
    if i + 1 < len(cues): c["e"] = min(c["e"], cues[i + 1]["s"] - 0.05)
    c["text"] = two_lines(c["text"])

def ts(t, sep=","):
    h = int(t // 3600); m = int(t % 3600 // 60); s = t % 60
    return f"{h:02d}:{m:02d}:{int(s):02d}{sep}{int(round((s - int(s)) * 1000)):03d}"

with open("legendas.srt", "w", encoding="utf-8") as f:
    for i, c in enumerate(cues, 1):
        f.write(f"{i}\n{ts(c['s'])} --> {ts(c['e'])}\n{c['text']}\n\n")
with open("legendas.vtt", "w", encoding="utf-8") as f:
    f.write("WEBVTT\n\n")
    for i, c in enumerate(cues, 1):
        f.write(f"{i}\n{ts(c['s'], '.')} --> {ts(c['e'], '.')}\n{c['text']}\n\n")
print(len(cues), "legendas;", "maior linha:", max(len(l) for c in cues for l in c["text"].split("\n")), "chars")
