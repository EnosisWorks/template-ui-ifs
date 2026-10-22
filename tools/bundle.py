#!/usr/bin/env python3
"""Bundle a mockup folder into standalone HTML files that can be sent to a client.

Every local stylesheet and script referenced by each page is inlined, so the
pages open by double-click with no other files. Links between pages in the
same folder keep working.

Usage:
    python3 tools/bundle.py mockups/<name>          -> dist/<name>/*.html
    python3 tools/bundle.py mockups/<name> --zip    -> also dist/<name>.zip
"""
import argparse
import re
import shutil
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CSS_RE = re.compile(r'<link\s+rel="stylesheet"\s+href="([^"]+)"\s*/?>')
JS_RE = re.compile(r'<script\s+src="([^"]+)"\s*>\s*</script>')


def is_local(href: str) -> bool:
    return not re.match(r'^(https?:)?//', href)


def inline_page(page: Path) -> str:
    html = page.read_text(encoding="utf-8")

    def css(m):
        href = m.group(1)
        if not is_local(href):
            return m.group(0)
        return "<style>\n" + (page.parent / href).resolve().read_text(encoding="utf-8") + "\n</style>"

    def js(m):
        src = m.group(1)
        if not is_local(src):
            return m.group(0)
        code = (page.parent / src).resolve().read_text(encoding="utf-8").replace("</script", "<\\/script")
        return "<script>\n" + code + "\n</script>"

    return JS_RE.sub(js, CSS_RE.sub(css, html))


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("folder", help="mockup folder, e.g. mockups/acme-sales")
    ap.add_argument("--zip", action="store_true", help="also create dist/<name>.zip")
    args = ap.parse_args()

    src = (ROOT / args.folder).resolve() if not Path(args.folder).is_absolute() else Path(args.folder)
    if not src.is_dir():
        print(f"Not a folder: {src}", file=sys.stderr)
        return 1
    out = ROOT / "dist" / src.name
    if out.exists():
        shutil.rmtree(out)
    out.mkdir(parents=True)

    pages = sorted(src.glob("*.html"))
    for page in pages:
        (out / page.name).write_text(inline_page(page), encoding="utf-8")
    # Copy images and other non-code assets the mockup may use
    for f in src.rglob("*"):
        if f.is_file() and f.suffix.lower() not in {".html", ".js", ".css", ".md"}:
            dest = out / f.relative_to(src)
            dest.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(f, dest)

    print(f"Bundled {len(pages)} page(s) -> {out.relative_to(ROOT)}")
    if args.zip:
        archive = shutil.make_archive(str(out), "zip", out)
        print(f"Zip: {Path(archive).relative_to(ROOT)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
