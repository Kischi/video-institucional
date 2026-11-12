# Vídeo Institucional

Skill e kit para produzir, com o Claude, vídeos institucionais animados com narrador em círculo: cenas sincronizadas com a fala, legendas, trilha e thumbnail. Com ou sem ElevenLabs.

![Telas do vídeo de exemplo](exemplos/mosaico.jpg)

Exemplo completo: **"Comece bem a sua graduação"** (Faculdade Infnet, 4min02s, novembro de 2026) — [vídeo em 720p](exemplos/comece-bem-a-sua-graduacao-720p.mp4), [legendas](exemplos/comece-bem-a-sua-graduacao.srt), [thumbnail](exemplos/thumbnail.jpg).

## O que há no repositório
| Pasta | Conteúdo |
|---|---|
| [`guia/guia-video-institucional.pdf`](guia/guia-video-institucional.pdf) | Guia curto para quem não é especialista: como pedir um vídeo desses ao Claude, com outro narrador e outra identidade visual. **Comece por aqui.** |
| [`video-institucional/SKILL.md`](video-institucional/SKILL.md) | O skill: a receita que o Claude segue, com tudo o que foi aprendido na produção. |
| [`video-institucional/kit/`](video-institucional/kit/) | O projeto completo e reproduzível do vídeo de exemplo: gerador das cenas, scripts de áudio, narrador, trilha, thumbnail, fontes, ícones, logotipos, fotos e os binários (narração, trechos do narrador, vídeo com lip-sync, trilha). Comandos em [`LEIA-ME.md`](video-institucional/kit/LEIA-ME.md). |
| [`exemplos/`](exemplos/) | 14 telas do vídeo, mosaico, thumbnail, vídeo em 720p e legendas. |

## Como usar
1. No Claude, adicione o skill **Vídeo Institucional** (o conteúdo de `video-institucional/SKILL.md`).
2. Dê ao Claude acesso a este repositório e peça: "Use o skill Vídeo Institucional para fazer um vídeo sobre …".
3. Siga as etapas que ele propõe: texto, quadros, narração, animação, trilha, thumbnail.

## Observações
- Repositório privado. Contém a voz, a imagem e as fotos usadas no vídeo de exemplo; não torne público sem as autorizações de uso de imagem.
- Ferramentas: [Hyperframes](https://github.com/heygen-com/hyperframes) 0.9.20, GSAP, ffmpeg, Python (numpy, Pillow). Ícones [Tabler](https://tabler.io/icons), fonte Montserrat.
