"""Builds the web-sized images in public/media from the originals in media-src/."""
from pathlib import Path
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "media-src"
OUT = ROOT / "public" / "media"
OUT.mkdir(parents=True, exist_ok=True)

# name in public/media -> (source file, optional crop box, widths)
PHOTOS = {
    "vic": ("the-vic.jpg", None, [656]),
    "home": ("home.jpg", None, [720, 1280]),
    "burger": ("deals-1.jpg", (0, 70, 1148, 1975), [600, 1000]),
    "steak": ("deals-2.png", None, [700, 1200]),
    "frozen": ("deals-3.jpg", (0, 568, 4000, 5522), [600, 1000]),
    "cheers": ("deals-4.jpg", None, [700, 1200]),
    "screens": ("screens-poster.jpg", None, [720]),
    "dogs": ("dogs-poster.jpg", None, [720]),
    "games": ("games-poster.jpg", None, [720]),
    "outside": ("outside-poster.jpg", None, [1280]),
    # Hero: the packed terrace in daylight, and the sign at blue hour (from the screens clip)
    "hero-day": ("home.jpg", None, [900, 1440]),
    "hero-night": ("screens-poster.jpg", (260, 0, 2160, 2100), [900, 1600]),
    # Parties: groups round the terrace tables (from the outside clip)
    "terrace": ("outside-poster.jpg", (500, 0, 3700, 2160), [800, 1400]),
}


def load(name, box=None):
    im = ImageOps.exif_transpose(Image.open(SRC / name)).convert("RGB")
    return im.crop(box) if box else im


for out, (src, box, widths) in PHOTOS.items():
    if not (SRC / src).exists():
        print("missing", src)
        continue
    im = load(src, box)
    for w in widths:
        w = min(w, im.width)
        h = round(im.height * w / im.width)
        im.resize((w, h), Image.LANCZOS).save(OUT / f"{out}-{w}.webp", quality=82 if out.startswith("hero") else 80, method=6)
        print(f"{out}-{w}.webp", w, h)

# Queen's head from the logo, for the wordmark and icons
logo = Image.open(SRC / "logo.png").convert("RGBA")
head = logo.crop((164, 72, 256, 191))
head.save(OUT / "head.png", optimize=True)
logo.save(OUT / "logo.png", optimize=True)

ink = (18, 17, 14, 255)
for size, name in [(64, "favicon.png"), (180, "apple-touch-icon.png")]:
    canvas = Image.new("RGBA", (size, size), ink)
    scale = (size * 0.86) / head.height
    h = head.resize((round(head.width * scale), round(head.height * scale)), Image.LANCZOS)
    canvas.alpha_composite(h, ((size - h.width) // 2, (size - h.height) // 2 + round(size * 0.04)))
    canvas.convert("RGB").save(OUT.parent / name, optimize=True)

# Social preview card: the terrace at golden hour
og = load("home.jpg")
w, h = og.size
crop_h = round(w * 630 / 1200)
top = round(h * 0.18)
og.crop((0, top, w, top + crop_h)).resize((1200, 630), Image.LANCZOS).save(
    OUT / "og.jpg", quality=82, optimize=True, progressive=True
)
print("done")
