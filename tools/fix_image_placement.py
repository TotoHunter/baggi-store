"""Place the supplied images on products by what the images actually show."""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CFG = ROOT / "js" / "config.js"
CAPTIONS = json.loads((ROOT / "tools" / "image_captions.json").read_text(encoding="utf-8"))

# Product ID -> (image actually in assets/, accurate alt text)
PLACEMENT = {
    "og-vortex-indigo": ("og-vortex.jpg", "Model wearing blue denim jeans"),
    "night-vortex-black": ("vortex-jacket.jpg", "Model wearing black denim jeans"),
    "sky-vortex-light": ("long-sleeve.jpg", "Model wearing light blue denim jeans"),
    "heavy-hood-black": ("heavy-hood.jpg", "Model wearing a black hoodie"),
    "ash-hood-grey": ("night-vortex.jpg", "Model wearing a grey hoodie"),
    "box-tee-white": ("box-tee-white.jpg", "Model wearing a white t-shirt"),
    "box-tee-black": ("box-tee-black.jpg", "Model wearing a black t-shirt"),
    "gods-plan-tee": ("gods-plan-tee.jpg", "White t-shirt with black and white paint splat design"),
    "cargo-olive": ("cargo-olive.jpg", "Model wearing olive cargo pants"),
    "denim-jacket": ("custom-poster.jpg", "Model wearing a denim jacket"),
    "baggy-shorts": ("sky-vortex.jpg", "Model wearing black denim shorts"),
    "long-sleeve-white": ("vortex-short.jpg", "Model wearing a white long sleeve top"),
    "bucket-hat": ("bucket-hat.jpg", "Model wearing a black bucket hat"),
    "canvas-tote": ("canvas-tote.jpg", "Model holding a canvas tote bag"),
    "custom-jeans": ("custom-jeans.jpg", "Model wearing custom denim jeans"),
    "custom-tee": ("custom-tee.jpg", "T-shirt with custom paint splat design"),
    "custom-hoodie": ("custom-hoodie.jpg", "Black hoodie with custom white deer design"),
    "custom-mug": ("custom-mug.jpg", "Person holding a custom printed mug"),
    "custom-poster": ("ash-hood.jpg", "Person holding a custom printed poster"),
}

# Guard: every image is used once by products, except hero/about which are page-only.
used = [image for image, _ in PLACEMENT.values()]
if len(used) != len(set(used)):
    raise SystemExit("Duplicate image in product placement")

cfg = CFG.read_text(encoding="utf-8")
for pid, (image, alt) in PLACEMENT.items():
    if not (ROOT / "assets" / image).exists():
        raise SystemExit(f"Missing asset: {image}")
    pattern = re.compile(
        r'(id: "' + re.escape(pid) + r'",[\s\S]*?image: ")[^"]+(",[\s\S]*?imageAlt: ")[^"]+(")'
    )
    updated, count = pattern.subn(lambda m: m.group(1) + image + m.group(2) + alt + m.group(3), cfg)
    if count != 1:
        raise SystemExit(f"Could not update image for {pid} (matches: {count})")
    cfg = updated
CFG.write_text(cfg, encoding="utf-8")

# Keep the one-click restore script in sync so it cannot undo the corrected map.
restore = ROOT / "tools" / "restore_images.py"
src = restore.read_text(encoding="utf-8")
for pid, (image, alt) in PLACEMENT.items():
    pattern = re.compile(
        r'(\("' + re.escape(pid) + r'", ")[^"]+(", ")[^"]+("\))'
    )
    src, count = pattern.subn(lambda m: m.group(1) + image + m.group(2) + alt.replace('"', '\\"') + m.group(3), src)
    if count != 1:
        raise SystemExit(f"Could not update restore map for {pid} (matches: {count})")
restore.write_text(src, encoding="utf-8")

# Human-checkable contact sheet with product name beside its actual image.
rows = []
for pid, (image, alt) in PLACEMENT.items():
    cap = CAPTIONS.get(image, alt).replace("a photography of ", "")
    rows.append(
        f"<figure><img src='../assets/{image}' alt='{alt}'><figcaption>"
        f"<strong>{pid}</strong><br><code>{image}</code><br><span>{cap}</span>"
        f"</figcaption></figure>"
    )
html = (
    "<!doctype html><html><head><meta charset='utf-8'><title>VORTEX image placement</title>"
    "<style>body{background:#111;color:#eee;font:14px system-ui;padding:24px}"
    ".grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:18px}"
    "figure{margin:0;border:1px solid #333;padding:8px}img{width:100%;aspect-ratio:4/5;object-fit:cover;display:block}"
    "figcaption{padding-top:8px;color:#d3f85a}code{color:#fff}span{color:#bbb}</style></head><body>"
    "<h1>VORTEX image placement — checked by image content</h1><div class='grid'>"
    + "".join(rows) + "</div></body></html>"
)
(ROOT / "tools" / "IMAGE_CHECK.html").write_text(html, encoding="utf-8")

print(f"corrected {len(PLACEMENT)} product image placements")
