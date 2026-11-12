#!/bin/bash
# Prepara o vídeo devolvido pelo lip-sync para a composição: 30 fps, 1,5 s de quadro congelado no fim, um keyframe por segundo.
# Uso: ./prepara_lipsync.sh video-do-lipsync.mp4
set -e
ffmpeg -y -v error -i "$1" -vf "fps=30,tpad=stop_mode=clone:stop_duration=1.5,format=yuv420p" -an -c:v libx264 -crf 15 -g 30 assets/narrador-lipsync.mp4
echo "ok: assets/narrador-lipsync.mp4 — rode de novo: node anim.mjs"
