"""Restore the supplied streetwear images and place each one on its matching product."""
import re
import shutil
import zipfile
from pathlib import Path

from PIL import Image

root = Path(__file__).resolve().parent.parent
downloads = Path(r"C:\Users\JOAN WOLUGBOM\Downloads")
zip_path = downloads / "fashion_editorial_images.zip"
assets = root / "assets"
assets.mkdir(exist_ok=True)
tmp = root / "tools" / ".source_extract"

# (asset filename, source filename in Downloads, OR zip entry name, label)
IMAGES = [
    ("hero-vortex.jpg", "Vortex Clothing Co. Streetwear Portrait.png", None, "Hero — VORTEX streetwear portrait"),
    ("about-vortex.jpg", "Vortex Streetwear Studio Portrait.png", None, "About — VORTEX studio portrait"),
    ("og-vortex.jpg", "Editorial Portrait of a Streetwear Model.png", None, "OG VORTEX — mid indigo jeans"),
    ("night-vortex.jpg", "Monochrome Streetwear Studio Portrait.png", None, "Grey hoodie photo"),
    ("sky-vortex.jpg", "Minimalist Streetwear Studio Portraitq.png", None, "Black denim shorts photo"),
    ("heavy-hood.jpg", "Minimalist Black Hoodie Portrait.png", None, "Black hoodie photo"),
    ("ash-hood.jpg", None, "studio_portrait_a_young_black_african_descent_man.png", "Person holding a painting photo"),
    ("box-tee-white.jpg", "Minimalist Streetwear Portrait.png", None, "Box Tee — off white"),
    ("box-tee-black.jpg", "Minimalist Monochrome Streetwear Portrait.png", None, "Box Tee — faded black"),
    ("gods-plan-tee.jpg", None, "a_studio_portrait_fashion_catalog_style_photo_a.png", "God's Plan Tee — hand-painted"),
    ("cargo-olive.jpg", "Streetwear Portrait in Olive Cargo Pants.png", None, "Cargo Pant — olive"),
    ("vortex-jacket.jpg", "Minimalist Streetwear Studio Portrait.png", None, "Black denim jeans photo"),
    ("vortex-short.jpg", "Minimalist Streetwear Studio Portraits.png", None, "White long sleeve photo"),
    ("long-sleeve.jpg", "Relaxed Urban Studio Portrait.png", None, "Light blue jeans photo"),
    ("bucket-hat.jpg", "Serious Studio Portrait in Black Hat.png", None, "Bucket Hat — jet black"),
    ("canvas-tote.jpg", "Modern Streetwear Portrait with Tote Bag.png", None, "Canvas Tote — natural"),
    ("custom-jeans.jpg", "Monochrome Streetwear Studio Portraita.png", None, "Custom VORTEX Jeans"),
    ("custom-tee.jpg", "Urban Abstract Streetwear Showcase.png", None, "Custom Box Tee"),
    ("custom-hoodie.jpg", "Monochrome Streetwear Hoodie Showcase.png", None, "Custom Heavy Hood"),
    ("custom-mug.jpg", "Vibrant Sunset Mug Portrait.png", None, "Custom Mug"),
    ("custom-poster.jpg", None, "a_studio_portrait_scene_with_a_dark_gray_black_sea.png", "Denim jacket photo"),
]

# Product ID -> (asset, alt text). This is the authoritative placement map.
PRODUCTS = [
    ("og-vortex-indigo", "og-vortex.jpg", "Model wearing blue denim jeans"),
    ("night-vortex-black", "vortex-jacket.jpg", "Model wearing black denim jeans"),
    ("sky-vortex-light", "long-sleeve.jpg", "Model wearing light blue denim jeans"),
    ("heavy-hood-black", "heavy-hood.jpg", "Model wearing a black hoodie"),
    ("ash-hood-grey", "night-vortex.jpg", "Model wearing a grey hoodie"),
    ("box-tee-white", "box-tee-white.jpg", "Model wearing a white t-shirt"),
    ("box-tee-black", "box-tee-black.jpg", "Model wearing a black t-shirt"),
    ("gods-plan-tee", "gods-plan-tee.jpg", "White t-shirt with black and white paint splat design"),
    ("cargo-olive", "cargo-olive.jpg", "Model wearing olive cargo pants"),
    ("denim-jacket", "custom-poster.jpg", "Model wearing a denim jacket"),
    ("baggy-shorts", "sky-vortex.jpg", "Model wearing black denim shorts"),
    ("long-sleeve-white", "vortex-short.jpg", "Model wearing a white long sleeve top"),
    ("bucket-hat", "bucket-hat.jpg", "Model wearing a black bucket hat"),
    ("canvas-tote", "canvas-tote.jpg", "Model holding a canvas tote bag"),
    ("custom-jeans", "custom-jeans.jpg", "Model wearing custom denim jeans"),
    ("custom-tee", "custom-tee.jpg", "T-shirt with custom paint splat design"),
    ("custom-hoodie", "custom-hoodie.jpg", "Black hoodie with custom white deer design"),
    ("custom-mug", "custom-mug.jpg", "Person holding a custom printed mug"),
    ("custom-poster", "ash-hood.jpg", "Person holding a custom printed poster"),
]

# Guard: do not accidentally reuse an image for two different slots.
seen_assets = set()
seen_sources = set()
for asset, dl, zipname, _ in IMAGES:
    if asset in seen_assets:
        raise SystemExit(f"Duplicate asset target: {asset}")
    seen_assets.add(asset)
    source_key = dl or zipname
    if source_key in seen_sources:
        raise SystemExit(f"Duplicate source image: {source_key}")
    seen_sources.add(source_key)
    if (dl is None) == (zipname is None):
        raise SystemExit(f"Exactly one source required for {asset}")

tmp.mkdir(parents=True, exist_ok=True)
if zip_path.exists():
    with zipfile.ZipFile(zip_path) as zf:
        for _, _, zipname, _ in IMAGES:
            if zipname:
                zf.extract(zipname, tmp)

converted = []
for asset, dl, zipname, label in IMAGES:
    src = downloads / dl if dl else tmp / zipname
    if not src.exists():
        raise SystemExit(f"Missing source for {asset}: {src}")
    dst = assets / asset
    with Image.open(src) as im:
        im = im.convert("RGB")
        im.thumbnail((1000, 1280), Image.LANCZOS)
        im.save(dst, "JPEG", quality=82, optimize=True)
    converted.append((asset, label))

# Insert image fields into every product in config.js.
cfg_path = root / "js" / "config.js"
cfg = cfg_path.read_text(encoding="utf-8")
for pid, asset, alt in PRODUCTS:
    pattern = re.compile(r'(id: "' + re.escape(pid) + r'",[\s\S]*?index: "[^"]+",\n)')
    match = pattern.search(cfg)
    if not match:
        raise SystemExit(f"Could not locate product block for {pid}")
    insertion = f'      image: "{asset}",\n      imageAlt: "{alt}",\n'
    cfg = cfg[:match.end(1)] + insertion + cfg[match.end(1):]
cfg_path.write_text(cfg, encoding="utf-8")

# Contact sheet so the placement can be checked at a glance.
sheet = ["<!doctype html><html><head><meta charset='utf-8'><title>VORTEX image placement</title>",
         "<style>body{background:#111;color:#eee;font:14px system-ui;padding:24px}.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:18px}",
         "figure{margin:0;border:1px solid #333;padding:8px}img{width:100%;aspect-ratio:4/5;object-fit:cover;display:block}figcaption{padding-top:8px;color:#d3f85a}</style></head><body>",
         "<h1>VORTEX image placement check</h1><div class='grid'>"]
for asset, label in converted:
    sheet.append(f"<figure><img src='../assets/{asset}' alt='{label}'><figcaption>{label}<br><code>{asset}</code></figcaption></figure>")
sheet.append("</div></body></html>")
(root / "tools" / "IMAGE_CHECK.html").write_text("".join(sheet), encoding="utf-8")

shutil.rmtree(tmp, ignore_errors=True)
print(f"restored {len(converted)} images")
print(f"updated {len(PRODUCTS)} product placements")
