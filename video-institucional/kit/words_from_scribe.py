#!/usr/bin/env python3
"""Converte as palavras alinhadas do ElevenLabs (../audio/scribe.json, tempos brutos por parte)
em transcript.json com tempos na narração final (depois de process_audio.py), trocando IPA por palavras legíveis
e descartando as tags de direção ([excited] etc.)."""
import json, re
from process_audio import raw_to_final

IPA = {"/bæk/": "back", "/ɛnd/": "end", "/ʃɑɹp/": "sharp", "/ˈstændəloʊn/": "standalone", "/spɹɪŋ/": "Spring", "/buːt/": "Boot",
       "/ˈmɑŋɡoʊ/": "Mongo", "/dɑt/": "dot", "/nɛt/": "net", "/kɔɹ/": "Core", "/ˈɹeɪzɚ/": "Razor", "/ˈpeɪdʒɪz/": "Pages",
       "/ˈmɪnɪməl/": "Minimal", "/ˈɛntɪti/": "Entity", "/ˈfɹeɪmwɝk/": "Framework", "/ˈpaɪθɑn/": "Python", "/ˈɹɛkɚdz/": "records",
       "/ˈpætɚn/": "pattern", "/ˈmætʃɪŋ/": "matching", "/ɪnˈtɛlɪdʒeɪ/": "IntelliJ", "/ʃɛl/": "Shell", "/tɹaɪ/": "try", "/wɪð/": "with",
       "/ˈɹisɔɹsɪz/": "resources", "/kəˈlɛkʃənz/": "Collections", "/ˈdʒeɪsən/": "JSON", "/ˈvɪʒuəl/": "Visual", "/ˈstudioʊ/": "Studio",
       "/stɹʌkts/": "structs", "/stɹʌkt/": "struct", "/ˈneɪmspeɪsɪz/": "namespaces", "/ɪz/": "is", "/æz/": "as", "/ˈdɛləɡəts/": "delegates",
       "/lɪst/": "List", "/ˈdɪkʃənɛɹi/": "Dictionary", "/stɹimz/": "streams", "/ˈjuzɪŋ/": "using", "/ˈstɑɹtɚz/": "starters",
       "/ɹɛst/": "REST", "/ˈæktʃueɪtɚ/": "Actuator", "/sɪˈkjʊɹɪti/": "Security", "/ˈoʊ/": "O", "/ɔːθ/": "Auth", "/ɪˈnɪʃəlaɪzɚ/": "Initializr",
       "/ˈjæməl/": "YAML", "/kənˈtɹoʊlɚz/": "controllers", "/ˈdeɪtə/": "Data", "/ˈpaɪplaɪn/": "pipeline", "/ˈmɪdəlwɛɹ/": "middleware",
       "/wɛb/": "Web", "/aɪˈdɛntɪti/": "Identity", "/ˈlɔɡɪŋ/": "logging", "/ˈleɪaʊts/": "layouts", "/ˈmɑdəl/": "model", "/ˈbaɪndɪŋ/": "binding",
       "/ˈɛndpɔɪnts/": "endpoints", "/ˈoʊpən/": "Open", "/ˈkɑntɛkst/": "Context", "/maɪˈɡɹeɪʃənz/": "migrations", "/lɪŋk/": "LINQ",
       "/ˈskæfəldɪŋ/": "scaffolding", "/ˈsɛɹɪlɔɡ/": "Serilog", "/spɛk/": "Spec", "/fɝst/": "First", "/ˈæŋkɚd/": "Anchored",
       "/ˈkɑmpətənsi/": "competency", "/beɪst/": "based", "/ˈlɜrnɪŋ/": "learning", "/ˈprɑdʒɛkt/": "project",
       "/əˈsɛsmənts/": "assessments", "/əˈsɛsmənt/": "assessment", "/ˈmuːdəl/": "moodle", "/lajv/": "Live",
       "/zuːm/": "Zoom", "/ɔnˈlaɪn/": "Online", "/ˈkoʊdɪŋ/": "coding"}

amap = json.load(open("audio_map.json"))
parts = json.load(open("audio/scribe.json"))
out = []
for pi, t in enumerate(parts):
    for w in t["words"]:
        txt = w["text"].strip()
        if not txt or re.fullmatch(r"\[[^\]]+\]", txt):
            continue
        core = re.sub(r"[.,;:!?…]+$", "", txt)
        if core in IPA:
            txt = IPA[core] + txt[len(core):]
        s = raw_to_final(amap, pi, w["start"]); e = raw_to_final(amap, pi, w["end"])
        if e <= s + 0.01:  # palavra que caiu dentro de um corte
            continue
        out.append({"text": txt, "start": round(s, 3), "end": round(e, 3), "part": pi + 1})
json.dump(out, open("transcript.json", "w"), ensure_ascii=False, indent=0)
print(len(out), "palavras → transcript.json; última termina em", out[-1]["end"], "s")
