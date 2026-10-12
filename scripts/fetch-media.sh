#!/usr/bin/env bash
# Pulls the pub's original photos and clips from their current site into media-src/.
# Run scripts/optimise-media.sh afterwards to build the web versions in public/media.
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p media-src && cd media-src
W=https://static.wixstatic.com/media
while read -r f id; do curl -sfL "$W/$id" -o "$f" || true; done <<'LIST'
logo.png 9a23e8_1be7645f6bd14b0caf85ffe1c7c2e876~mv2.png
the-vic.jpg 9a23e8_00b683ee2d6f4ed2a8ee5dd44ddfbf25~mv2.jpg
home.jpg 9a23e8_c13b6ec988f54838b58488259246246c~mv2.jpg
deals-1.jpg 9a23e8_1f671a8e974e4135a5b6a533fab98955~mv2.jpg
deals-2.png 9a23e8_b14c9ff6284d4c4ca36d405602768ec6~mv2.png
deals-3.jpg 9a23e8_9c9b7062b2a14af3acfd8cb6d5f7d45b~mv2.jpg
deals-4.jpg 9a23e8_48cba411743349c095b29b689a10a839~mv2.jpg
screens-poster.jpg 9a23e8_3ca4206e342147859f8d8e9da6608c5bf000.jpg
dogs-poster.jpg 9a23e8_3e3ac01fcf3e40a7b8d68690871d2ae1f000.jpg
games-poster.jpg 9a23e8_73353b87ab1449568f3bf69455b238eaf000.jpg
outside-poster.jpg 9a23e8_d790b05f2b10452aa40df0c1a2e3a260f000.jpg
LIST
for p in screens:3ca4206e342147859f8d8e9da6608c5b dogs:3e3ac01fcf3e40a7b8d68690871d2ae1 games:73353b87ab1449568f3bf69455b238ea outside:d790b05f2b10452aa40df0c1a2e3a260; do
  for q in 1080p 720p 480p 360p; do
    curl -sfL "https://video.wixstatic.com/video/9a23e8_${p#*:}/$q/mp4/file.mp4" -o "${p%%:*}.mp4" && break
  done
done
find . -size 0 -delete
ls -la
