"""Small SVG previews of the built-in presets (light and dark).

Written to /config/www/theme_studio/previews/<slug>_<variant>.svg when the
integration starts, so the studio can show what a preset looks like before it
is loaded. The colours come from the real engine output.
"""

from __future__ import annotations

import json
from pathlib import Path
import re
from types import ModuleType
from typing import Any

WIDTH, HEIGHT = 120, 200


def _solid(cli: ModuleType, values: dict[str, Any], key: str, backdrop) -> tuple:
    colour = cli.parse_css_color(cli._resolve_var(values, values.get(key, "")))
    return cli.composite(colour, backdrop) if colour else backdrop


def _hex(colour) -> str:
    return "#%02x%02x%02x" % tuple(round(c * 255) for c in colour[:3])


def preview_svg(cli: ModuleType, values: dict[str, Any], title: str) -> str:
    """Render one variant as a tiny phone screen."""
    white = (1.0, 1.0, 1.0, 1.0)
    page = _solid(cli, values, "background-color", white)
    card = _solid(cli, values, "ha-card-background", page)
    bubble = _solid(cli, values, "bubble-main-background-color", page)
    navbar = _solid(cli, values, "theme-studio-navbar-background-color", page)
    text = _hex(_solid(cli, values, "primary-text-color", card))
    secondary = _hex(_solid(cli, values, "secondary-text-color", card))
    icon = _hex(_solid(cli, values, "state-icon-color", card))
    active = _hex(_solid(cli, values, "state-icon-active-color", card))
    accent = _hex(_solid(cli, values, "accent-color", page))
    slider = _hex(_solid(cli, values, "bubble-accent-color", bubble))
    nav_icon = _hex(_solid(cli, values, "theme-studio-navbar-primary-color", navbar))
    match = re.match(r"(\d+)", str(values.get("ha-card-border-radius", "16")))
    radius = min(int(match.group(1)) if match else 16, 28) * 0.45
    safe_title = (
        title.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;").replace('"', "&quot;")
    )
    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {WIDTH} {HEIGHT}" width="{WIDTH}" height="{HEIGHT}" role="img" aria-label="{safe_title}">
  <title>{safe_title}</title>
  <rect width="{WIDTH}" height="{HEIGHT}" rx="14" fill="{_hex(page)}"/>
  <rect x="10" y="16" width="62" height="8" rx="4" fill="{text}"/>
  <rect x="10" y="29" width="40" height="5" rx="2.5" fill="{secondary}"/>
  <rect x="8" y="44" width="104" height="58" rx="{radius:.1f}" fill="{_hex(card)}"/>
  <circle cx="22" cy="60" r="6" fill="{icon}"/>
  <rect x="34" y="55" width="40" height="5" rx="2.5" fill="{text}"/>
  <rect x="34" y="63" width="26" height="4" rx="2" fill="{secondary}"/>
  <rect x="86" y="55" width="18" height="10" rx="5" fill="{accent}"/>
  <circle cx="22" cy="86" r="6" fill="{active}"/>
  <rect x="34" y="81" width="34" height="5" rx="2.5" fill="{text}"/>
  <rect x="34" y="89" width="22" height="4" rx="2" fill="{secondary}"/>
  <rect x="8" y="110" width="104" height="26" rx="13" fill="{_hex(bubble)}"/>
  <rect x="8" y="110" width="62" height="26" rx="13" fill="{slider}" fill-opacity="0.55"/>
  <circle cx="22" cy="123" r="5.5" fill="{icon}"/>
  <rect x="32" y="119" width="30" height="5" rx="2.5" fill="{text}"/>
  <rect x="8" y="170" width="104" height="22" rx="11" fill="{_hex(navbar)}"/>
  <circle cx="30" cy="181" r="4.5" fill="{accent}"/>
  <circle cx="50" cy="181" r="4.5" fill="{nav_icon}"/>
  <circle cx="70" cy="181" r="4.5" fill="{nav_icon}"/>
  <circle cx="90" cy="181" r="4.5" fill="{nav_icon}"/>
</svg>
"""


USER_PREFIX = "user_"


def write_previews(
    cli: ModuleType, preset_dir: Path, output_dir: Path, prefix: str = ""
) -> list[str]:
    """Write a preview per preset file and variant; only rewrite changed files.

    Built-in presets use ``<slug>_<variant>.svg``; user themes use the
    ``user_`` prefix so they never collide with a built-in preset.
    """
    output_dir.mkdir(parents=True, exist_ok=True)
    written: list[str] = []
    if not preset_dir.is_dir():
        return written
    for preset_file in sorted(preset_dir.glob("*.json")):
        if preset_file.name == "index.json":
            continue
        try:
            preset = json.loads(preset_file.read_text(encoding="utf-8"))
        except (OSError, json.JSONDecodeError):
            continue
        for variant in ("light", "dark"):
            settings = preset.get(variant)
            if not isinstance(settings, dict):
                continue
            values = cli.build(cli.namespace_from_settings(settings, "/tmp/unused.yaml"))
            svg = preview_svg(cli, values, f"{preset.get('name', preset_file.stem)} ({variant})")
            target = output_dir / f"{prefix}{preset_file.stem}_{variant}.svg"
            if target.exists() and target.read_text(encoding="utf-8") == svg:
                continue
            target.write_text(svg, encoding="utf-8")
            written.append(str(target))
    return written


def write_user_previews(cli: ModuleType, user_dir: Path, output_dir: Path) -> list[str]:
    """Previews for user themes; previews of deleted user themes are removed."""
    written = write_previews(cli, user_dir, output_dir, prefix=USER_PREFIX)
    existing = {path.stem for path in user_dir.glob("*.json")} if user_dir.is_dir() else set()
    for preview in output_dir.glob(f"{USER_PREFIX}*.svg"):
        slug = preview.stem[len(USER_PREFIX):].rsplit("_", 1)[0]
        if slug not in existing:
            preview.unlink(missing_ok=True)
    return written
