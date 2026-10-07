"""Colours from a background image (Pillow ships with Home Assistant).

Suggests a base colour, an accent and how much of the page colour to lay over
the image so text stays readable. Blocking: run in the executor.
"""

from __future__ import annotations

import colorsys
from pathlib import Path
from typing import Any

SAMPLE_SIZE = 96
COLOURS = 6


def _hex(rgb) -> str:
    return "#%02X%02X%02X" % tuple(int(round(c)) for c in rgb[:3])


def _luminance(rgb) -> float:
    def channel(c: float) -> float:
        c = c / 255
        return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4

    r, g, b = rgb[:3]
    return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b)


def _hls(rgb):
    return colorsys.rgb_to_hls(*(c / 255 for c in rgb[:3]))


def palette_from_image(path: Path) -> dict[str, Any]:
    """Return the main colours of an image and theme suggestions."""
    from PIL import Image  # noqa: PLC0415 - Pillow ships with Home Assistant; imported when used.

    with Image.open(path) as image:
        image.thumbnail((SAMPLE_SIZE, SAMPLE_SIZE))
        rgba = image.convert("RGBA")
    # Ignore mostly transparent pixels (cloud overlays and the like).
    flat = rgba.get_flattened_data() if hasattr(rgba, "get_flattened_data") else rgba.getdata()
    flat = list(flat)
    pixels = [p[:3] for p in flat if p[3] >= 128]
    if len(pixels) < len(flat) * 0.05:
        # A see-through overlay (like the cloud images): use every visible pixel.
        pixels = [p[:3] for p in flat if p[3] >= 16]
    if not pixels:
        raise ValueError("no_visible_pixels")

    sample = Image.new("RGB", (len(pixels), 1))
    sample.putdata(pixels)
    quantised = sample.quantize(colors=COLOURS, method=Image.Quantize.MEDIANCUT)
    palette = quantised.getpalette()[: COLOURS * 3]
    counts = sorted(quantised.getcolors(), reverse=True)
    total = sum(count for count, _ in counts)
    colours = [
        {
            "hex": _hex(palette[index * 3: index * 3 + 3]),
            "share": round(count / total, 3),
            "rgb": tuple(palette[index * 3: index * 3 + 3]),
        }
        for count, index in counts
    ]

    average = tuple(sum(p[i] for p in pixels) / len(pixels) for i in range(3))
    average_luminance = _luminance(average)

    # Base: the most common colour. Accent: the most saturated colour whose hue
    # differs from the base, falling back to the most saturated one.
    base = colours[0]
    base_h = _hls(base["rgb"])[0]

    def saturation(colour) -> float:
        _, lightness, sat = _hls(colour["rgb"])
        return sat * (1 - abs(lightness - 0.5) * 1.4)

    def hue_distance(colour) -> float:
        distance = abs(_hls(colour["rgb"])[0] - base_h)
        return min(distance, 1 - distance)

    candidates = [c for c in colours[1:] if hue_distance(c) > 0.06] or colours
    accent = max(candidates, key=saturation)

    # Text is chosen for the image; the busier and more mid-toned the image,
    # the more of the page colour should cover it.
    light_text = (1.05) / (average_luminance + 0.05)
    dark_text = (average_luminance + 0.05) / (0.0064 + 0.05)
    text = "#ffffff" if light_text >= dark_text else "#111111"
    best = max(light_text, dark_text)
    background_contrast = int(max(10, min(100, round(100 - (4.5 - min(best, 4.5)) * 22))))

    return {
        "colours": [{"hex": c["hex"], "share": c["share"]} for c in colours],
        "average": _hex(average),
        "average_luminance": round(average_luminance, 3),
        "suggested_base_color": base["hex"],
        "suggested_accent_color": accent["hex"],
        "suggested_text_color": text,
        # Theme Studio's "Background contrast": 100 shows the image fully,
        # lower values lay more of the page colour over it.
        "suggested_background_contrast": background_contrast,
        "image_is_light": average_luminance > 0.18,
    }


# -------------------------------------------------
# A whole theme from an image
# -------------------------------------------------

# Lightness and saturation caps per role: (light variant, dark variant).
SURFACE_ROLES = {
    "base_color": ("dominant", (0.82, 0.16), 0.30),
    "custom_background_color": ("dominant", (0.94, 0.08), 0.28),
    "card_bg_override": ("second", (0.975, 0.17), 0.25),
    "bubble_bg_override": ("third", (0.90, 0.23), 0.32),
    "popup_bg_override": ("dominant", (0.985, 0.13), 0.15),
    "navbar_bg_override": ("dominant", (0.97, 0.11), 0.20),
}

# Colours that only make sense when chosen for one background: back to automatic.
AUTO_COLOURS = (
    "secondary_background_color_override",
    "secondary_text_color_override",
    "disabled_text_color_override",
    "app_header_background_color_override",
    "app_header_text_color_override",
    "divider_color_override",
    "sidebar_icon_color_override",
    "state_icon_color_override",
)


def _from_hls(h: float, lightness: float, saturation: float) -> str:
    r, g, b = colorsys.hls_to_rgb(h % 1.0, min(max(lightness, 0), 1), min(max(saturation, 0), 1))
    return _hex((r * 255, g * 255, b * 255))


def _hls_of(hex_colour: str):
    value = hex_colour.lstrip("#")
    return colorsys.rgb_to_hls(*(int(value[i:i + 2], 16) / 255 for i in (0, 2, 4)))


def _pick_roles(colours: list[dict[str, Any]]) -> dict[str, tuple]:
    """Dominant, second and third surface colours and two accents (HLS)."""
    hls = [_hls_of(c["hex"]) for c in colours]
    dominant = hls[0]

    def hue_gap(a, b) -> float:
        gap = abs(a[0] - b[0])
        return min(gap, 1 - gap)

    distinct = [c for c in hls[1:] if hue_gap(c, dominant) > 0.04 or abs(c[1] - dominant[1]) > 0.15]
    second = distinct[0] if distinct else (hls[1] if len(hls) > 1 else dominant)
    third = distinct[1] if len(distinct) > 1 else second

    def vividness(c) -> float:
        return c[2] * (1 - abs(c[1] - 0.5) * 1.4)

    by_vividness = sorted(hls, key=vividness, reverse=True)
    accent = next((c for c in by_vividness if hue_gap(c, dominant) > 0.06), by_vividness[0])
    accent2 = next(
        (c for c in by_vividness if c is not accent and hue_gap(c, accent) > 0.05),
        ((accent[0] + 0.08) % 1.0, accent[1], accent[2]),
    )
    return {"dominant": dominant, "second": second, "third": third, "accent": accent, "accent2": accent2}


def image_theme_settings(palette: dict[str, Any], variant: str, image_url: str) -> dict[str, Any]:
    """Theme Studio settings for one variant, built from ``palette_from_image``."""
    index = 0 if variant == "light" else 1
    roles = _pick_roles(palette["colours"])
    settings: dict[str, Any] = {}
    for key, (role, lightness, max_saturation) in SURFACE_ROLES.items():
        h, _, s = roles[role]
        settings[key] = _from_hls(h, lightness[index], min(s, max_saturation))

    accent_h, _, accent_s = roles["accent"]
    accent = _from_hls(accent_h, (0.42, 0.64)[index], max(accent_s, 0.55))
    slider_h, _, slider_s = roles["accent2"]
    settings.update(
        {
            "use_custom_background_color": "on",
            "accent_color_override": accent,
            "state_icon_active_color_override": accent,
            "bubble_slider_color_override": _from_hls(slider_h, (0.50, 0.58)[index], max(slider_s, 0.45)),
            "card_opacity": (86.0, 88.0)[index],
            "bubble_bg_opacity": 92.0,
            "popup_bg_opacity": 96.0,
            "navbar_bg_opacity": 92.0,
            "tone": 0.0,
            "surface_lift": 0.0,
            "use_custom_text_color": "off",
            "use_custom_icon_color": "off",
            "use_custom_navbar_icon_color": "off",
            "use_background_image": "on",
            "background_image_url": image_url,
            "background_contrast": float(palette["suggested_background_contrast"]),
        }
    )
    for key in AUTO_COLOURS:
        settings[key] = "auto"
    return settings
