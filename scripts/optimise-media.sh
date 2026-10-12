#!/usr/bin/env bash
# Web versions of the pub's media: WebP stills plus short, silent, looping MP4s.
set -euo pipefail
cd "$(dirname "$0")/.."
python3 -I scripts/optimise-media.py
enc() { # name, scale filter, trim seconds
  local in="media-src/$1.mp4" out="public/media/$1.mp4"
  [ -f "$in" ] || { echo "missing $in (poster will be used)"; return; }
  ffmpeg -v error -y -t "$3" -i "$in" -an -vf "$2,fps=30,format=yuv420p" \
    -c:v libx264 -profile:v high -preset slow -crf 27 -movflags +faststart "$out"
  # VP9 for browsers built without H.264
  ffmpeg -v error -y -t "$3" -i "$in" -an -vf "$2,fps=30,format=yuv420p" \
    -c:v libvpx-vp9 -b:v 0 -crf 38 -row-mt 1 -deadline good -cpu-used 2 "${out%.mp4}.webm"
  echo "$out $(du -h "$out" | cut -f1), webm $(du -h "${out%.mp4}.webm" | cut -f1)"
}
enc screens "scale=540:-2" 7
enc dogs "scale=540:-2" 30
enc games "scale=540:-2" 30
enc outside "scale=960:-2" 30
