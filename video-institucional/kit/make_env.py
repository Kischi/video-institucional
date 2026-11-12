# Envelope da voz (10 valores por segundo, 0..1) para o anel do narrador reagir à fala. Saída: env.json
import subprocess,numpy as np,json
x=np.frombuffer(subprocess.run(["ffmpeg","-v","error","-i","assets/audio/narracao.mp3","-ac","1","-ar","8000","-f","f32le","-"],capture_output=True).stdout,dtype=np.float32)
n=len(x)//800; r=np.sqrt(np.mean(x[:n*800].reshape(n,800)**2,axis=1)); r=np.clip(r/np.percentile(r,95),0,1)
r=np.convolve(r,[.25,.5,.25],'same'); json.dump([round(float(v),2) for v in r],open('env.json','w')); print(n,'pontos → env.json')
