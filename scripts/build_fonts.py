"""Build the fonts that ship with Theme Studio.

Usage: python scripts/build_fonts.py <path to a checkout of github.com/google/fonts>

Takes the font files from the Google Fonts repository (SIL Open Font License),
keeps the Latin characters (including the Nordic and other European letters),
limits variable fonts to weights 300–700 and writes WOFF files plus each
font's licence to custom_components/theme_studio/frontend/fonts/. Roboto is
not included: Home Assistant ships it already.

Needs fontTools (pip install fonttools).
"""

from __future__ import annotations

import io
import json
from pathlib import Path
import shutil
import sys

from fontTools import subset
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer

ROOT = Path(__file__).resolve().parents[1]
TARGET = ROOT / "custom_components" / "theme_studio" / "frontend" / "fonts"

# Basic Latin, Latin-1, Latin Extended-A and common punctuation and symbols.
UNICODES = (
    "U+0000-00FF,U+0100-017F,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,"
    "U+2000-206F,U+2074,U+20AC,U+2122,U+2190-2193,U+2212,U+2215,U+FEFF,U+FFFD"
)

# family, source directory, files: (source file, weight range or weight, output name, limits)
FONTS = [
    ("Inter", "ofl/inter", [("Inter[opsz,wght].ttf", "300 700", "inter.woff", {"opsz": 14, "wght": (300, 700)})]),
    ("Quicksand", "ofl/quicksand", [("Quicksand[wght].ttf", "300 700", "quicksand.woff", {"wght": (300, 700)})]),
    ("Josefin Sans", "ofl/josefinsans", [("JosefinSans[wght].ttf", "300 700", "josefin-sans.woff", {"wght": (300, 700)})]),
    ("Orbitron", "ofl/orbitron", [("Orbitron[wght].ttf", "400 700", "orbitron.woff", {"wght": (400, 700)})]),
    (
        "Iosevka Charon Mono",
        "ofl/iosevkacharonmono",
        [
            ("IosevkaCharonMono-Regular.ttf", "400", "iosevka-charon-mono-400.woff", None),
            ("IosevkaCharonMono-Medium.ttf", "500", "iosevka-charon-mono-500.woff", None),
            ("IosevkaCharonMono-Bold.ttf", "700", "iosevka-charon-mono-700.woff", None),
        ],
    ),
]


def build_one(source: Path, target: Path, limits: dict | None) -> None:
    font = TTFont(source, lazy=False)
    if limits:
        font = instancer.instantiateVariableFont(font, limits)
        # Re-read the instanced font so every table is fully loaded before subsetting.
        buffer = io.BytesIO()
        font.save(buffer)
        buffer.seek(0)
        font = TTFont(buffer, lazy=False)
    options = subset.Options()
    options.flavor = "woff"
    options.layout_features = ["*"]
    options.name_IDs = ["*"]
    options.name_languages = ["*"]
    options.notdef_outline = True
    options.drop_tables += ["DSIG"]
    subsetter = subset.Subsetter(options)
    subsetter.populate(unicodes=subset.parse_unicodes(UNICODES))
    subsetter.subset(font)
    font.flavor = "woff"
    font.save(target)


def main(google_fonts: Path) -> None:
    if TARGET.exists():
        shutil.rmtree(TARGET)
    TARGET.mkdir(parents=True)
    manifest = []
    for family, folder, files in FONTS:
        source_dir = google_fonts / folder
        licence = TARGET / f"{family.lower().replace(' ', '-')}-OFL.txt"
        shutil.copyfile(source_dir / "OFL.txt", licence)
        for source_name, weight, output, limits in files:
            build_one(source_dir / source_name, TARGET / output, limits)
            manifest.append({"family": family, "weight": weight, "file": output, "licence": licence.name})
            print(f"{output}: {(TARGET / output).stat().st_size // 1024} KB")
    (TARGET / "fonts.json").write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")


if __name__ == "__main__":
    if len(sys.argv) != 2:
        raise SystemExit(__doc__)
    main(Path(sys.argv[1]))
