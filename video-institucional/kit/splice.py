# Monta a narração a partir das gravações escolhidas (audio/dl/*.mp3 + *.words.json do alinhamento).
# Edite "plan": cada item é (arquivo, None) para usar inteiro ou (arquivo, (1ª palavra, 2ª palavra, última palavra)) para um trecho.
# Saída: audio/seg*.wav + audio/scribe.json → depois rode process_audio.py, words_from_scribe.py e make_captions.py.
import json,subprocess,numpy as np,wave
SR=48000; D='audio/dl/'
def dec(n):
    o=subprocess.run(["ffmpeg","-v","error","-i",D+n+".mp3","-ac","1","-ar",str(SR),"-f","f32le","-"],capture_output=True,check=True).stdout
    return np.frombuffer(o,dtype=np.float32).copy()
W={n:json.load(open(D+n+'.words.json')) for n in ['p1','p2','p3','trab','conc','pres','dedic','greet']}
def find(n,first,second,last):
    w=[x for x in W[n] if x.get('type','word')=='word' and not x['text'].startswith('[')]
    i=0 if first is None else next(k for k in range(len(w)-1) if w[k]['text']==first and w[k+1]['text']==second)
    j=len(w)-1 if last is None else next(k for k in range(i,len(w)) if w[k]['text']==last)
    return w,i,j
plan=[('p1',(None,None,'verdade.')),('greet',None),('p1',('Para','você',None)),('trab',None),('p2',('Em','dois','pode.')),('conc',None),('pres',None),('p3',('No','dia','sozinho.')),('dedic',None),('p3',('Para','começar','projetos!'))]
segs=[];scribe=[]
def rms_speech(x):
    n=len(x)//480; r=np.sqrt(np.mean(x[:n*480].reshape(n,480)**2,axis=1)+1e-12); r=r[r>10**(-40/20)]
    return 20*np.log10(np.sqrt(np.mean(r**2)))
for k,(n,rng) in enumerate(plan):
    x=dec(n); w=[y for y in W[n] if y.get('type','word')=='word' and not y['text'].startswith('[')]
    if rng: w,i,j=find(n,*rng)
    else: i,j=0,len(w)-1
    a=w[i]['start']-0.12; 
    if i>0: a=max(a,(w[i-1]['end']+w[i]['start'])/2)
    a=max(a,0)
    b=w[j]['end']+0.30
    if j<len(w)-1: b=min(b,(w[j]['end']+w[j+1]['start'])/2)
    b=min(b,len(x)/SR)
    y=x[int(a*SR):int(b*SR)].copy()
    f=int(.01*SR); y[:f]*=np.linspace(0,1,f); y[-f:]*=np.linspace(1,0,f)
    l=rms_speech(y); segs.append((y,l))
    scribe.append({'words':[{'text':q['text'],'start':q['start']-a,'end':q['end']-a} for q in w[i:j+1]]})
    print(k+1,n,round(a,2),round(b,2),round(b-a,2),'rms',round(l,1),w[i]['text'],'…',w[j]['text'])
ref=segs[0][1]; files=[]
for k,(y,l) in enumerate(segs):
    y=y*10**((ref-l)/20)
    fn=f'audio/seg{k+1}.wav'; files.append(fn)
    with wave.open(fn,'wb') as wv:
        wv.setnchannels(1);wv.setsampwidth(2);wv.setframerate(SR);wv.writeframes((np.clip(y,-1,1)*32767).astype(np.int16).tobytes())
json.dump(scribe,open('audio/scribe.json','w'),ensure_ascii=False)
print(' '.join(files))
