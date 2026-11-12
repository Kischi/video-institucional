#!/bin/bash
# Mistura a trilha sob a voz sem renderizar o vídeo de novo (o vídeo é copiado, só o áudio muda).
# Uso: ./mix_trilha.sh video-sem-trilha.mp4 musica/trilha.mp3 saida.mp4 [ACORDE] [LOGO] [FIM_FALA] [GANHO_DB]
#   ACORDE   = segundo em que cai o acorde final na música original (padrão 236.0)
#   LOGO     = segundo do vídeo em que o logotipo final aparece (padrão: FIM_FALA + 0.9)
#   FIM_FALA = segundo em que a narração termina (padrão: lido de audio_map.json)
#   GANHO_DB = volume da música (padrão -6; -10.5 fica discreto demais, segundo o retorno recebido)
# A música é esticada/encolhida (sem mudar o tom) para o acorde final cair na entrada do logotipo.
set -e
V="$1"; M="$2"; O="$3"
FIM=${6:-$(python3 -c "import json;print(json.load(open('audio_map.json'))['final_duration'])")}
ACORDE=${4:-236.0}; LOGO=${5:-$(python3 -c "print($FIM+0.9)")}; G=${7:--6}
DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$V")
T=$(python3 -c "print($ACORDE/$LOGO)"); FADE=$(python3 -c "print($DUR-1.25)"); SOBE=$(python3 -c "print($FIM+0.15)")
ffmpeg -y -v error -i "$V" -i "$M" -filter_complex "[1:a]rubberband=tempo=$T,volume=${G}dB,volume=volume=4dB:enable='gte(t,$SOBE)',atrim=0:$DUR,afade=t=out:st=$FADE:d=1.2,aresample=48000[m];[0:a]aresample=48000,asplit=2[v1][v2];[m][v1]sidechaincompress=threshold=0.02:ratio=1.7:attack=25:release=450[md];[v2][md]amix=inputs=2:normalize=0:duration=first,volume=-2.5dB,alimiter=limit=0.84[a]" -map 0:v -map "[a]" -c:v copy -c:a aac -b:a 192k -movflags +faststart "$O.tmp.mp4"
mv "$O.tmp.mp4" "$O"; echo "ok: $O (música em tempo $T, acorde final em $LOGO s)"
