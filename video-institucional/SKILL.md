---
name: video-institucional
description: Produz vídeo institucional animado (explicativo, boas-vindas, apresentação) com narrador em círculo, cenas sincronizadas à fala, legendas, trilha e thumbnail, no Hyperframes. Use ao pedirem vídeo institucional narrado, com ou sem ElevenLabs.
---

# Vídeo Institucional

Receita validada em 12/11/2026 no vídeo "Comece bem a sua graduação" (Faculdade Infnet, 4min02s, 1920×1080): narração com voz clonada, 16 cenas animadas no tempo da fala, narrador em círculo com lábios sincronizados, fotos tratadas, trilha composta sob medida, legendas e thumbnail. Serve para qualquer narrador e qualquer identidade visual.

**Kit:** pasta `kit/` ao lado deste arquivo, no repositório privado `Kischi/video-institucional` (clonar com `git clone --depth 1`). O kit é o próprio projeto do vídeo de exemplo, completo e reproduzível: troque textos, cores, fotos, voz e narrador. Comandos em `kit/LEIA-ME.md`. Telas de exemplo em `exemplos/`, guia para leigos em `guia/guia-video-institucional.pdf`.

## 1. Como conduzir (o que mais importa)

Trabalhe **uma etapa por vez, com aprovação a cada uma**. A ordem abaixo evita refazer o que é caro:

1. **Texto da fala** em documento editável. A pessoa revisa e aprova. Tudo depende dele.
2. **Desenho das cenas** em quadros parados (um por cena), antes de animar. Aprovar.
3. **Fotos** (opcional): a pessoa escolhe, você trata para parecerem do mesmo conjunto.
4. **Narração**: gerar, a pessoa ouve e aprova **o arquivo completo final**.
5. **Animação** no tempo da fala + **vídeo do narrador** + **lip-sync** + render.
6. **Trilha** por último, sobre o vídeo pronto.
7. **Thumbnail** e variações de marca.

Regras de convivência aprendidas:
- **Diga o custo antes de gerar** qualquer coisa paga e o total acumulado ao fim de cada rodada.
- **Você não ouve nem assiste.** Diga isso e peça para a pessoa conferir pontos específicos (minuto:segundo). Confira o que dá por medição: duração de palavras, volume por trecho, quadros parados.
- **Mudou a fala, muda tudo depois dela**: tempos das cenas, vídeo do narrador, lip-sync (o item mais caro) e encaixe da trilha. Por isso feche o texto e o áudio antes do lip-sync, e junte os pedidos de mudança de fala numa rodada só.
- Mudança só de **quadro** (texto na tela, layout) é barata: re-renderize apenas o trecho (`render --start --end`) e emende.
- Nomeie os arquivos com versão (`-v2`, `-v3`) e diga sempre **qual arquivo** a pessoa deve abrir; ela se perde entre cartões e players.
- Mantenha um documento de status do projeto atualizado (IDs de gerações, decisões, custos).

## 2. Texto da fala
- 600–700 palavras dão ~4 min no ritmo final (1,10×). Gancho forte nos primeiros 15 s, apresentação do narrador, blocos temáticos curtos, fecho com chamada para ação.
- Um parágrafo por cena. Cada parágrafo precisa fazer sentido sozinho, porque é a unidade de regravação.
- Evite citar na fala o que muda entre versões de marca (nome da instituição, cargo): cada variação exige nova gravação e novo lip-sync.
- Confira fatos com a fonte oficial (manual, regulamento) e marque o que é simplificação.

## 3. Desenho das cenas
- Arquivo `kit/anim.mjs`, PARTE 1: cada cena é um `add("nome", html)` com elementos posicionados em pixels num palco 1920×1080. Sistema visual em `kit/tema.css` (fundo com auroras e órbitas, cartões de vidro `.g`, etiqueta `.lab`, título `.ttl` com `<em>` sublinhado, numeral de capítulo `.wm`, chips `.chip`, fotos `.photo`).
- Reserve o canto inferior direito (≈ x>1500, y>680) para o círculo do narrador e o inferior esquerdo para o logotipo.
- **Regras de quadro que a pessoa cobrou:** nenhum texto encostando em borda de cartão ou em outro elemento; não repetir a mesma informação duas vezes no mesmo quadro; tirar legendas redundantes; o que aparece precisa ajudar a entender a fala; conceitos de naturezas diferentes não podem parecer "a mesma escala" (ex.: par aprova/reprova separado do reconhecimento de excelência).
- Os rótulos na tela devem usar as palavras da fala. Não invente texto de apoio sem avisar.
- Confira sempre com `npx hyperframes snapshot --no-end --at t1,t2 -o snaps` e **olhe as imagens** antes de mostrar.
- O `style.css` do kit tem classes curtas que colidem (`.a` = oculto, `.num`, `.lt`, `.nm`, `.big`): use nomes próprios.

### Trocar a identidade visual
- Cor de destaque: constante `ACC` no topo de `anim.mjs` (o CSS usa `__ACC__` / `var(--acc)`); azuis de fundo e texto no início de `style.css`/`tema.css`.
- Logotipos em `assets/logos/` (versões para fundo escuro); fonte em `assets/fonts/` (Montserrat) e `@font-face` do `style.css`; ícones Tabler em `assets/icons/` (`ic("nome")`).
- Fotos: `trata_fotos.py` aplica gradiente nas cores da marca + vazamento de luz + vinheta + granulado; troque as cores em `stops`.
- Segunda marca com a mesma fala: `node anim.mjs ecdd` (ver `VAR`).

## 4. Narração

### Com ElevenLabs (conector)
- Voz clonada do narrador (`creative_list_voices`), modelo `eleven_v4`, tudo num único fluxo (`creative_create_flow`). Gere em 3 partes de ~1.200–1.500 caracteres, 2 versões de cada; a pessoa escolhe por parte. Custo ≈ 1 crédito por caractere por versão.
- **Tom sóbrio:** sem `[excited]`; no máximo um `[warmly]` no "Olá" quando ele está no meio de uma parte. Nunca `[warmly]` na despedida (fica "romântico"). **Não comece uma geração com marcação de tom**: muda o timbre do trecho inteiro.
- **Grafias que funcionaram (pt-BR):** siglas soletradas como palavra única (`tepês`, `tepê`; "tê pês" e "tê-pês" falham); `D L`, `D M L`; letra isolada `dê`; anos e horas por extenso; `I A`; estrangeirismos comuns na grafia normal (`Live`, `Moodle`, `Coaching`); IPA entre barras só quando testado (`/lajv/` foi lido como "barra… barra"; `Infnet /ɔnˈlaɪn/` funcionou); nome próprio com acento na sílaba tônica (`André`).
- **Correções:** regrave o **parágrafo inteiro** (2 versões) e emende; nunca meia frase. Para ajuste mínimo (pausa entre duas palavras), edite o áudio (`cuts.json` do `process_audio.py`) em vez de regravar.
- **Alinhamento palavra a palavra:** `creative_transcribe_audio` (`eleven_scribe_v1`, `connect_from` no nó do áudio) custa 0 crédito; leia com `creative_get_flow_run_status` (`transcripts[].words` e a URL do áudio de origem, baixável com curl). Para fixar uma versão num nó use `creative_add_flow_asset_node`.
- Montagem: `splice.py` (corta por palavra, iguala volume) → `process_audio.py` (1,10×, −1 semitom, −16 LUFS) → `words_from_scribe.py` → `make_captions.py` → `make_env.py`.

### Sem ElevenLabs
- A pessoa grava a própria voz (celular em ambiente silencioso, um parágrafo por arquivo ou tudo de uma vez). Pule a queda de tom se a voz já é a real: no `process_audio.py`, ajuste `TEMPO`/pitch.
- Alinhamento: qualquer transcritor com tempos por palavra (ex.: Whisper). O `transcript.json` que o kit espera é só `[{"text": "palavra", "start": s, "end": s}, …]`.

## 5. Animação no tempo da fala
`anim.mjs`, PARTE 2:
- `STARTS`: a frase (sem acentos, minúsculas) que abre cada cena. A cena começa 0,4 s antes.
- `CUES`: por cena, `[seletor CSS, frase da fala ou segundos, tipo]`. Tipos: `up` (padrão), `pop`, `left`, `fade`, `blur`, `draw` (traço de SVG), `ring` (anel de progresso), `dim`/`light` (semáforo), `pulse`. `seletor@n` pega o n-ésimo. O que não tem deixa entra em cascata no início da cena.
- Transição: o conteúdo sai, o fundo faz fusão, passa um feixe de luz. Narrador grande no centro na apresentação e no fecho, no canto no resto; anel reage à voz; pulso a cada corte do narrador; logotipo final após a fala.
- `node anim.mjs` avisa `! deixa não encontrada` quando a fala muda: corrija a frase da deixa.
- Hyperframes: `<video>` nunca dentro de elemento com `data-start`; `fromTo` do GSAP com `immediateRender:false` quando o estado inicial não deve aparecer em t=0.
- Render: `HYPERFRAMES_BROWSER_PATH=/usr/bin/google-chrome npx hyperframes render -q looks -w 3 -o saida.mp4` (~17 min para 4 min; `-q draft` ~11 min). Rode em segundo plano e acompanhe o log. Emenda de trecho: codifique as três partes com os mesmos parâmetros e junte com o concat demuxer (um `concat` de filtro estoura a memória).

## 6. Narrador no círculo
- **Fonte ideal:** um vídeo do narrador lendo o próprio roteiro (dispensa lip-sync). Segunda opção: um vídeo antigo dele falando outra coisa + lip-sync. Terceira (sem custo): foto fixa no círculo com o anel reagindo à voz.
- Biblioteca de trechos: recorte do vídeo antigo só os momentos de fala de frente, sem letreiros, enquadramento quadrado no rosto (lado ≈ 2,4× a largura do rosto), 720×720, **só para a frente** (vaivém fica artificial), levemente desacelerado (`setpts` 1/0,88). Salve em `narrador/takes/T1.mp4…`.
- `build_narrador.py` distribui os trechos pela narração, cortando nas pausas reais da fala, e gera `narrador/base-narrador.mp4` + `narrador/audio-narrador.mp3` + `narr_map.json`. Rode de novo sempre que o áudio mudar.
- **Lip-sync (ElevenLabs):** a pessoa envia os dois arquivos pelos seletores (`creative_upload_flow_reference`, **um por vez**, a chamada do seletor como última ação do turno). Confirme a chegada com `creative_get_flow` + `node_ids` (campo `asset`); `creative_get_flow_node` não mostra. Modelo `veed-lipsync` (~40 créditos/s; ~9 mil para 3min40s). Peça estimativa (`estimate_only`) antes: os modelos mais novos custavam 10–20× mais. Depois `prepara_lipsync.sh` e `node anim.mjs`.
- O círculo esconde letreiros do vídeo original com `transform: scale(1.14) translateX(3%)` no `<video>`.

## 7. Trilha
- Por último. Uma peça única do tamanho do vídeo, com roteiro por minutagem no prompt (abertura esparsa, entrada do narrador, miolo estável, momento emotivo, final). `eleven_music_v2_5`, `instrumental`, ~15 créditos/s.
- Peça instrumentos acústicos específicos e diga o que **não** quer (pads, ukulele corporativo, palmas, assobio) para fugir do "jeito de IA".
- Meça onde cai o acorde final e use `mix_trilha.sh`, que estica a música (sem mudar o tom) para o acorde cair na entrada do logotipo e mistura sem novo render.
- **Volume:** a pessoa achou baixa duas vezes. Comece com a música ~6–7 dB abaixo da voz (`GANHO_DB=-6`), não 11–15.
- Sem ElevenLabs: trilha de biblioteca livre (ex.: Biblioteca de Áudio do YouTube), mesmo script.

## 8. Thumbnail
`kit/thumbnail/thumb.html` + `make_thumb.sh` (1280×720). Título curto em duas linhas com folga em relação ao círculo, chamada com a duração, nome e cargo, logotipo; nada importante no canto inferior direito (o YouTube cobre com a duração). Use uma **foto de boa resolução, expressão leve**; quadro de vídeo fica mole e quase sempre de boca aberta.

## 9. Entregas e custos de referência
MP4 1080p com trilha, MP4 sem trilha, SRT/VTT, thumbnail. No exemplo (4 min, com três rodadas de revisão): ~56 mil créditos ElevenLabs (~US$ 10). Uma produção direta custa ~25 mil: narração ~8 mil, lip-sync ~9 mil, trilha ~3,7 mil, margem para regravações.
