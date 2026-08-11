#!/usr/bin/env python3
"""Generate small WebP thumbnails for post hero images.

WHY THIS EXISTS
The home page lists every post with its hero. Those heroes are full-size
renders, up to 3.2 MB each, and the card displays them in a 168px box. Measured
on the live site before this script existed: 31 image requests, 3.28 MB, to draw
thumbnails. `loading="lazy"` only changes WHEN that arrives, not how much.

Thumbnails are generated rather than resized in the browser because GitHub Pages
builds with a fixed plugin allowlist, so no image-processing plugin can run at
build time. Committing the derived files is the trade: a little repo weight for
a home page that is roughly 30x lighter.

Usage:
    python scripts/make-thumbs.py            # generate anything missing
    python scripts/make-thumbs.py --force    # regenerate everything
    python scripts/make-thumbs.py --check    # report only, exit 1 if any missing
"""
from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path

from PIL import Image

REPO = Path(__file__).resolve().parent.parent
POSTS = REPO / "_posts"
ASSETS = REPO / "assets"
THUMBS = ASSETS / "thumbs"

# 400px covers the 168px card at 2x DPI. Wider buys nothing a reader can see.
WIDTH = 400
QUALITY = 80

# `[^\S\n]` rather than `\s`, because `\s*` happily crosses the newline and an
# empty `image:` field then captures the `---` that closes the front matter.
IMAGE_FIELD = re.compile(r"^image:[^\S\n]*(\S+)[^\S\n]*$", re.MULTILINE)


def hero_paths() -> list[str]:
    """Every distinct `image:` value declared in post front matter."""
    found: list[str] = []
    for post in sorted(POSTS.glob("*.md")):
        text = post.read_text(encoding="utf-8", errors="replace")
        match = IMAGE_FIELD.search(text)
        if match:
            value = match.group(1).strip().strip("\"'")
            if value and value not in found:
                found.append(value)
    return found


def thumb_name(hero: str) -> str:
    return Path(hero).stem + ".webp"


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--force", action="store_true", help="regenerate existing thumbnails")
    parser.add_argument("--check", action="store_true", help="report only; exit 1 if any are missing")
    args = parser.parse_args()

    THUMBS.mkdir(parents=True, exist_ok=True)

    made = skipped = missing_source = 0
    saved_bytes = 0
    missing: list[str] = []

    for hero in hero_paths():
        source = REPO / hero.lstrip("/")
        if not source.exists():
            # A hero that does not exist is a broken post, not a thumbnail
            # problem, so say so instead of silently producing nothing.
            print(f"  SOURCE MISSING  {hero}")
            missing_source += 1
            continue

        target = THUMBS / thumb_name(hero)
        if target.exists() and not args.force:
            skipped += 1
            continue

        if args.check:
            missing.append(hero)
            continue

        with Image.open(source) as img:
            img = img.convert("RGB")
            ratio = WIDTH / img.width
            size = (WIDTH, max(1, round(img.height * ratio)))
            # Only ever shrink. Upscaling a small hero would add bytes and blur.
            if img.width > WIDTH:
                img = img.resize(size, Image.Resampling.LANCZOS)
            img.save(target, "WEBP", quality=QUALITY, method=6)

        saved_bytes += source.stat().st_size - target.stat().st_size
        made += 1
        print(f"  {source.stat().st_size // 1024:>6} KB -> {target.stat().st_size // 1024:>4} KB  {target.name}")

    if args.check:
        for hero in missing:
            print(f"  MISSING THUMB  {hero}")
        print(f"{len(missing)} missing, {skipped} present")
        return 1 if missing else 0

    print(f"\n{made} generated, {skipped} already present, {missing_source} source images missing")
    if made:
        print(f"saved {saved_bytes / 1048576:.1f} MB against serving the originals")
    return 0


if __name__ == "__main__":
    sys.exit(main())
