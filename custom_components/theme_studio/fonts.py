"""Fonts that ship with Theme Studio, and the custom fonts of your themes.

The bundled fonts (SIL Open Font License, see frontend/fonts/*-OFL.txt) are
served by Home Assistant itself, so no Google Fonts request leaves the house
and nothing has to be added as a dashboard resource. A small module loaded on
every Home Assistant page adds one stylesheet with the @font-face rules.
"""

from __future__ import annotations

import json
from pathlib import Path
import re
from typing import Any

from .const import DOMAIN, PANEL_STATIC_URL

FONTS_DIR = Path(__file__).parent / "frontend" / "fonts"
FONTS_CSS_URL = f"/api/{DOMAIN}/fonts.css"
LOADER_FILE = "theme-studio-fonts.js"

CUSTOM_FAMILY = re.compile(r"^[A-Za-z0-9 _-]{1,60}$")
CUSTOM_PATH = re.compile(r"^/local/[A-Za-z0-9 _./-]{1,200}\.(woff2|woff|ttf|otf)$", re.IGNORECASE)
FORMATS = {"woff2": "woff2", "woff": "woff", "ttf": "truetype", "otf": "opentype"}


def bundled_fonts() -> list[dict[str, str]]:
    """The fonts in frontend/fonts, as written by scripts/build_fonts.py."""
    try:
        entries = json.loads((FONTS_DIR / "fonts.json").read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError):
        return []
    return [entry for entry in entries if isinstance(entry, dict) and (FONTS_DIR / str(entry.get("file"))).is_file()]


def custom_font(settings: dict[str, Any]) -> tuple[str, str] | None:
    """(family, path) of a theme variant's own font, if it is switched on and safe."""
    if str(settings.get("use_custom_font", "off")).lower() not in ("on", "true"):
        return None
    family = str(settings.get("custom_font_family") or "").strip()
    path = str(settings.get("custom_font_path") or "").strip()
    if not CUSTOM_FAMILY.match(family) or not CUSTOM_PATH.match(path) or ".." in path:
        return None
    return family, path


def fonts_css(custom: list[tuple[str, str]], version: str) -> str:
    """@font-face rules for the bundled fonts and the given custom fonts."""
    rules = []
    for entry in bundled_fonts():
        url = f"{PANEL_STATIC_URL}/fonts/{entry['file']}?v={version}"
        rules.append(
            "@font-face{"
            f"font-family:\"{entry['family']}\";"
            f"src:url(\"{url}\") format(\"woff\");"
            f"font-weight:{entry['weight']};font-style:normal;font-display:swap"
            "}"
        )
    for family, path in sorted(set(custom)):
        fmt = FORMATS[path.rsplit(".", 1)[1].lower()]
        rules.append(
            "@font-face{"
            f"font-family:\"{family}\";"
            f"src:url(\"{path}\") format(\"{fmt}\");"
            "font-weight:100 900;font-style:normal;font-display:swap"
            "}"
        )
    return "\n".join(rules) + "\n"
