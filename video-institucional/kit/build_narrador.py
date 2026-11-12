# Monta o vídeo base do narrador (para o lip-sync) no tempo exato da narração.
# Entrada: narrador/takes/T*.mp4 (trechos quadrados 720×720 do narrador falando, só para a frente),
#          assets/audio/narracao.mp3, transcript.json, audio_map.json
# Saída:   narrador/base-narrador.mp4 + narrador/audio-narrador.mp3 (os dois arquivos que vão para o lip-sync),
#          narr_map.json (onde cada trecho entra) e assets/narrador.mp4 (prévia sem lip-sync).
# Uso: python3 build_narrador.py ["primeira palavra da fala em que o narrador aparece"]   (padrão: "Olá.")
import json,subprocess,re,sys,glob,os
t=json.load(open('transcript.json'))
END=json.load(open('audio_map.json'))['final_duration']
first=sys.argv[1] if len(sys.argv)>1 else 'Olá.'
i0=next(i for i,w in enumerate(t) if w['text']==first)
S=round(max(0,t[i0]['start']-0.35),3)   # o narrador entra um pouco antes de começar a falar
# pontos de corte = meio das pausas reais da fala
r=subprocess.run(['ffmpeg','-v','info','-i','assets/audio/narracao.mp3','-af','silencedetect=noise=-38dB:d=0.28','-f','null','-'],capture_output=True,text=True).stderr
ss=[float(x) for x in re.findall(r'silence_start: ([0-9.]+)',r)]; se=[float(x) for x in re.findall(r'silence_end: ([0-9.]+)',r)]
cands=[round((a+b)/2,3) for a,b in zip(ss,se) if a>S+1]
takes=sorted(glob.glob('narrador/takes/T*.mp4'),key=lambda p:int(re.findall(r'T(\d+)',p)[0]))
dur={}
for p in takes:
    k=int(re.findall(r'T(\d+)',p)[0])
    dur[k]=float(subprocess.run(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',p],capture_output=True,text=True).stdout)
uses={k:0 for k in dur}; recent=[]; segs=[]; cur=S
while cur<END-0.05:
    pool=[k for k in dur if k not in recent[-min(5,len(dur)-1):]]
    m=min(uses[k] for k in pool); pool=[k for k in pool if uses[k]==m]
    best=None
    for k in pool:
        lim=cur+dur[k]-0.1
        if lim>=END: cut=END
        else:
            c=[x for x in cands if cur+4.5<=x<=lim]
            cut=c[-1] if c else lim
        waste=(cur+dur[k])-cut
        score=(cut-cur)-0.6*waste+(0 if (cut in cands or cut==END) else -5)
        if best is None or score>best[0]: best=(score,k,cut)
    _,k,cut=best
    segs.append({'take':k,'start':round(cur,3),'end':round(cut,3)}); uses[k]+=1; recent.append(k); cur=cut
os.makedirs('narrador/partes',exist_ok=True)
fps=30; parts=[]
for n,s in enumerate(segs):
    f0=round((s['start']-S)*fps); f1=round((s['end']-S)*fps); nf=f1-f0   # quantiza em quadros acumulados para não derivar
    out=f'narrador/partes/p{n:02d}.mp4'
    subprocess.run(['ffmpeg','-y','-v','error','-i',f"narrador/takes/T{s['take']}.mp4",'-frames:v',str(nf),'-an','-vf','fps=30,format=yuv420p','-c:v','libx264','-crf','16','-preset','medium','-g','30',out],check=True)
    parts.append(out); s['frames']=nf
    print(n,'T%d'%s['take'],s['start'],s['end'],round(s['end']-s['start'],2),'pausa' if s['end'] in cands or s['end']>=END-0.01 else 'MEIO DA FRASE')
open('narrador/partes/lista.txt','w').write(''.join(f"file '{os.path.basename(p)}'\n" for p in parts))
subprocess.run(['ffmpeg','-y','-v','error','-f','concat','-safe','0','-i','narrador/partes/lista.txt','-c','copy','narrador/base-narrador.mp4'],check=True)
subprocess.run(['ffmpeg','-y','-v','error','-ss',str(S),'-i','assets/audio/narracao.mp3','-c:a','libmp3lame','-q:a','2','narrador/audio-narrador.mp3'],check=True)
subprocess.run(['ffmpeg','-y','-v','error','-i','narrador/base-narrador.mp4','-vf','tpad=stop_mode=clone:stop_duration=1.5','-an','-c:v','libx264','-crf','16','-g','30','-pix_fmt','yuv420p','assets/narrador.mp4'],check=True)
json.dump({'S':S,'segs':segs,'uses':uses},open('narr_map.json','w'),indent=1)
print('narrador entra em',S,'s; usos de cada trecho:',uses)
