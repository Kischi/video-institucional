# Tratamento único das fotos: gradação para o azul da marca, luz amarela discreta, vinheta e granulado.
import sys, numpy as np
from PIL import Image, ImageOps, ImageFilter
Image.MAX_IMAGE_PIXELS=None
def treat(src, dst, box, size, leak=(0.0,1.0)):
    im=ImageOps.exif_transpose(Image.open(src)).convert("RGB")
    W,H=im.size; x0,y0,x1,y1=box; im=im.crop((int(x0*W),int(y0*H),int(x1*W),int(y1*H))).resize(size,Image.LANCZOS)
    a=np.asarray(im).astype(np.float32)/255.0
    lum=(0.2126*a[...,0]+0.7152*a[...,1]+0.0722*a[...,2])
    lum=np.clip((lum-0.03)/0.90,0,1); lum=lum**0.72
    lum=0.5+(lum-0.5)*1.12; lum=np.clip(lum,0,1)
    stops=[(0.0,(12,26,60)),(0.30,(28,78,150)),(0.62,(132,180,224)),(1.0,(250,252,255))]
    duo=np.zeros_like(a)
    for (p0,c0),(p1,c1) in zip(stops,stops[1:]):
        m=(lum>=p0)&(lum<=p1); t=((lum-p0)/(p1-p0))[...,None]
        seg=(np.array(c0)/255.0)*(1-t)+(np.array(c1)/255.0)*t; duo=np.where(m[...,None],seg,duo)
    g0=(0.2126*a[...,0]+0.7152*a[...,1]+0.0722*a[...,2])[...,None]; desat=np.clip((g0+(a-g0)*0.7)**0.80,0,1)
    out=0.48*duo+0.52*desat
    h,w=lum.shape; yy,xx=np.mgrid[0:h,0:w]; xx=xx/w; yy=yy/h
    d=np.sqrt((xx-leak[0])**2+(yy-leak[1])**2); glow=np.clip(1-d/0.75,0,1)**2
    out=out+glow[...,None]*np.array([0.996,0.855,0.047])*0.22
    v=np.clip(1-((xx-0.5)**2+(yy-0.5)**2)*0.7,0.62,1)[...,None]; navy=np.array([8,16,38])/255.0
    out=out*v+navy*(1-v)*0.9
    rng=np.random.default_rng(7); out=out+rng.normal(0,0.018,(h,w,1))
    Image.fromarray((np.clip(out,0,1)*255).astype(np.uint8)).filter(ImageFilter.UnsharpMask(1.2,60,2)).save(dst,quality=92)
# Uso: python3 trata_fotos.py assets/fotos pasta-das-originais/
# Edite "jobs": (arquivo original, nome de saída, recorte em frações x0,y0,x1,y1, tamanho final, canto do vazamento de luz).
# As cores do gradiente ("stops") e do vazamento de luz seguem a marca: troque ao mudar de identidade visual.
S=(sys.argv[2].rstrip("/")+"/") if len(sys.argv)>2 else "fotos-originais/"
jobs=[("1113 - Portfólio 2026.1 - 744A6448.jpg","projeto.jpg",(0.0,0.02,0.72,0.637),(1400,800),(1.0,1.0)),
      ("0491 - Campus - _MG_7959.jpg","turma.jpg",(0.02,0.03,0.98,0.94),(1188,750),(0.0,1.0)),
      ("0939 - Colação 2025 T1 - 7D2A9926.jpg","colacao.jpg",(0.20,0.0,0.7625,1.0),(1000,1000),(1.0,0.0)),
      ("0090 - Campus - _MG_7142.jpg","apoio.jpg",(0.0,0.0,0.75,1.0),(1000,889),(0.0,1.0)),
      ("0189 - Campus - _MG_7382.jpg","pratica.jpg",(0.05,0.02,0.95,0.98),(1200,771),(1.0,1.0))]
import os
for f,o,box,size,leak in jobs:
    treat(S+f,os.path.join(sys.argv[1],o),box,size,leak); print(o)
