"""Export and import of user themes as a JSON file or a share string.

A share string is ``TS1:`` followed by URL-safe base64 of the zlib-compressed
JSON, so a theme fits in a chat message. Imported themes are always written as
new user themes; an existing user theme is never overwritten.
"""

from __future__ import annotations

import base64
import json
import re
from typing import Any
import zlib

SHARE_PREFIX = "TS1:"
FORMAT = "theme_studio_user_theme"
FORMAT_VERSION = 1
VARIANTS = ("light", "dark")
MAX_IMPORT_BYTES = 256 * 1024


class ImportError_(ValueError):
    """The import data is not a Theme Studio theme."""


def export_document(theme: dict[str, Any], setting_keys: list[str], version: str) -> dict[str, Any]:
    """Return the portable form of a stored user theme."""
    return {
        "format": FORMAT,
        "format_version": FORMAT_VERSION,
        "theme_studio_version": version,
        "name": theme.get("name", ""),
        "light": _clean_variant(theme.get("light") or {}, setting_keys),
        "dark": _clean_variant(theme.get("dark") or {}, setting_keys),
        "theme": theme.get("theme") or {},
    }


def to_share_string(document: dict[str, Any]) -> str:
    raw = json.dumps(document, separators=(",", ":"), ensure_ascii=False).encode("utf-8")
    return SHARE_PREFIX + base64.urlsafe_b64encode(zlib.compress(raw, 9)).decode("ascii").rstrip("=")


def parse_import(text: str, setting_keys: list[str]) -> dict[str, Any]:
    """Parse JSON or a share string into ``{"name", "light", "dark", "theme"}``."""
    data = str(text or "").strip()
    if not data:
        raise ImportError_("empty")
    if len(data.encode("utf-8")) > MAX_IMPORT_BYTES:
        raise ImportError_("too_large")
    if data.startswith(SHARE_PREFIX):
        encoded = re.sub(r"\s+", "", data[len(SHARE_PREFIX):])
        encoded += "=" * (-len(encoded) % 4)
        try:
            # Bounded decompression: a crafted string cannot expand without limit.
            raw = zlib.decompressobj().decompress(
                base64.urlsafe_b64decode(encoded), MAX_IMPORT_BYTES + 1
            )
        except (ValueError, zlib.error) as err:
            raise ImportError_("bad_share_string") from err
        if len(raw) > MAX_IMPORT_BYTES:
            raise ImportError_("too_large")
        data = raw.decode("utf-8", errors="replace")
    try:
        document = json.loads(data)
    except json.JSONDecodeError as err:
        raise ImportError_("bad_json") from err
    if not isinstance(document, dict):
        raise ImportError_("bad_json")
    light = document.get("light")
    dark = document.get("dark")
    if not isinstance(light, dict) and not isinstance(dark, dict):
        raise ImportError_("no_variants")
    light = light if isinstance(light, dict) else dark
    dark = dark if isinstance(dark, dict) else light
    theme = document.get("theme") if isinstance(document.get("theme"), dict) else {}
    return {
        "name": str(document.get("name") or "Imported theme").strip()[:60] or "Imported theme",
        "light": _clean_variant(light, setting_keys),
        "dark": _clean_variant(dark, setting_keys),
        "theme": _clean_variant(theme, setting_keys),
    }


def unique_name(name: str, taken_slugs: set[str], slugify) -> str:
    """``name``, or ``name (2)``, ``name (3)`` … when the slug is already used."""
    if slugify(name) not in taken_slugs:
        return name
    for number in range(2, 1000):
        candidate = f"{name} ({number})"
        if slugify(candidate) not in taken_slugs:
            return candidate
    raise ImportError_("no_free_name")


def _clean_variant(values: dict[str, Any], setting_keys: list[str]) -> dict[str, Any]:
    """Keep known settings with plain values only."""
    allowed = set(setting_keys)
    clean: dict[str, Any] = {}
    for key, value in values.items():
        if key not in allowed:
            continue
        if value is None:
            continue
        if isinstance(value, bool):
            clean[key] = "on" if value else "off"
        elif isinstance(value, (int, float)):
            clean[key] = float(value)
        elif isinstance(value, str):
            clean[key] = value[:255]
    return clean
