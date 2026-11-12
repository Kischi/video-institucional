# Kit — Vídeo Institucional

Este kit é o projeto completo do vídeo "Comece bem a sua graduação" (Faculdade Infnet, 4min02s). Rodando os comandos abaixo, sem mudar nada, sai o mesmo vídeo. Para um vídeo novo, troque o conteúdo etapa por etapa.

## Requisitos
- Node 18+ e `npm install` nesta pasta (instala o Hyperframes 0.9.20). Chrome ou Chromium.
- Python 3 com `numpy` e `Pillow`; `ffmpeg` com `rubberband`.

## O que há aqui
| Arquivo | Para quê |
|---|---|
| `anim.mjs` | As cenas (parte 1) e o motor de animação, tempos e deixas (parte 2). Gera `index.html`. |
| `style.css`, `tema.css` | Base tipográfica e sistema visual (cores, cartões, fundo). |
| `assets/` | Fontes (Montserrat), ícones Tabler, logotipos, GSAP, fotos tratadas, `audio/narracao.mp3`, `narrador-lipsync.mp4`. |
| `audio/dl/` | Gravações originais da narração + tempos por palavra (do alinhamento). |
| `splice.py` | Monta a narração a partir das gravações escolhidas. |
| `process_audio.py` | Ritmo 1,10×, −1 semitom, volume padrão (−16 LUFS). Aceita `cuts.json` para cortes e pausas. |
| `words_from_scribe.py`, `make_captions.py` | `transcript.json` (palavra a palavra) e legendas `.srt`/`.vtt`. |
| `make_env.py` | `env.json`, o envelope da voz que faz o anel do narrador pulsar. |
| `narrador/takes/` | 12 trechos do narrador falando (720×720). |
| `build_narrador.py` | Monta o vídeo base do narrador no tempo da narração (entrada do lip-sync). |
| `prepara_lipsync.sh` | Prepara o vídeo que voltou do lip-sync. |
| `trata_fotos.py` | Dá unidade às fotos (cores da marca, luz, vinheta, granulado). |
| `musica/trilha.mp3`, `mix_trilha.sh` | Trilha composta para o vídeo e a mixagem sob a voz. |
| `thumbnail/` | Modelo do thumbnail do YouTube e o script que gera o JPG. |

## Passo a passo
```bash
npm install
export HYPERFRAMES_BROWSER_PATH=/usr/bin/google-chrome   # caminho do Chrome

# 1. Narração (depois de baixar as gravações e os tempos para audio/dl/)
python3 splice.py                                  # edite "plan" antes
python3 process_audio.py audio/seg*.wav            # use a ordem certa: audio/seg{1..10}.wav
python3 words_from_scribe.py && python3 make_captions.py && python3 make_env.py

# 2. Narrador
python3 build_narrador.py "Olá."                   # primeira palavra dita com o narrador na tela
#    → envie narrador/base-narrador.mp4 e narrador/audio-narrador.mp3 ao lip-sync
./prepara_lipsync.sh video-que-voltou.mp4

# 3. Cenas e animação
node anim.mjs                                      # avisa se alguma deixa não bate com a fala
npx hyperframes lint                               # 0 erros (avisos de estrutura são esperados)
npx hyperframes snapshot --no-end --at 22,60,150 -o snaps    # conferir quadros
npx hyperframes render -q looks -w 3 -o renders/video-sem-trilha.mp4

# 4. Trilha (acorde final da música em 236,0 s no exemplo)
./mix_trilha.sh renders/video-sem-trilha.mp4 musica/trilha.mp3 renders/video-final.mp4 236.0

# 5. Thumbnail
cd thumbnail && ./make_thumb.sh thumbnail.jpg
```

## Trocar o conteúdo
- **Fala e cenas:** em `anim.mjs`, edite os `add(...)` (parte 1), a lista `STARTS` (frase que abre cada cena) e a tabela `CUES` (o que aparece em qual frase).
- **Marca:** `ACC` (cor de destaque) em `anim.mjs`; azuis em `style.css`/`tema.css`; logotipos em `assets/logos/`; cores do tratamento de fotos em `trata_fotos.py`.
- **Narrador:** troque `narrador/takes/T*.mp4` por trechos do novo narrador (quadrados, 720×720, só fala de frente). Exemplo de recorte de um vídeo 1280×720 com o rosto centrado em (x=640, y=200) e ~160 px de largura:
  `ffmpeg -ss 29.3 -to 35.7 -i original.mp4 -vf "crop=380:380:450:60,scale=720:720,setpts=PTS/0.88" -an -r 30 narrador/takes/T1.mp4`
- **Sem lip-sync:** use um vídeo do narrador lendo o roteiro como `assets/narrador-lipsync.mp4`, ou uma foto (troque o `<video>` do `#narr` por `<img>` no final de `anim.mjs`).

## Formato do `transcript.json`
`[{"text": "Olá.", "start": 18.0, "end": 18.5}, …]` em segundos do áudio final. Qualquer ferramenta de transcrição com tempo por palavra serve.
