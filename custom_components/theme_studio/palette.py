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
