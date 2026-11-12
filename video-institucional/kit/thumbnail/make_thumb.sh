#!/bin/bash
# Gera o thumbnail do YouTube (1280×720) a partir de thumb.html. Troque face.png (foto quadrada do narrador) e os textos no HTML.
# Uso (dentro de kit/thumbnail): ./make_thumb.sh [saida.jpg]
set -e
CH=${HYPERFRAMES_BROWSER_PATH:-$(command -v google-chrome || command -v chromium || command -v chromium-browser)}
"$CH" --headless=new --no-sandbox --disable-gpu --hide-scrollbars --window-size=1920,1080 --screenshot=thumb-1920.png "file://$PWD/thumb.html" >/dev/null 2>&1
ffmpeg -y -v error -i thumb-1920.png -vf scale=1280:720:flags=lanczos -q:v 2 "${1:-thumbnail.jpg}"; rm -f thumb-1920.png; echo "ok: ${1:-thumbnail.jpg}"
