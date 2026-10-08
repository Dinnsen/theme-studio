"""Theme generation engine.

Runs the bundled ``theme_studio_cli.py`` in-process instead of through
``shell_command``. Every function here does file I/O and must run in the
executor.
"""

from __future__ import annotations

import argparse
from contextlib import redirect_stdout
from dataclasses import dataclass, field
from datetime import datetime
import importlib.util
import io
import json
from pathlib import Path
import re
import shutil
import threading
from types import ModuleType
from typing import Any

from . import palette as palette_module, previews as previews_module, sharing
from . import fonts as fonts_module, variants as variants_module
from .settings import load_settings
from .const import (
    BACKGROUND_DIR,
    CONTRAST_LABELS,
    EXPORT_DIR,
    EXPORT_URL,
    IMPORT_DIR,
    PRESET_DIR,
    THEME_OUTPUT_DIR,
    USER_THEME_DIR,
)

CLI_PATH = (
    Path(__file__).resolve().parent
    / "templates"
    / "theme_studio"
    / "scripts"
    / "theme_studio_cli.py"
)

IMAGE_SUFFIXES = {".png", ".jpg", ".jpeg", ".webp", ".gif", ".svg"}
MAX_BACKGROUND_BYTES = 15 * 1024 * 1024
# Uploads are checked by content; SVG is not accepted because it can carry script.
BACKGROUND_FORMATS = {"PNG": ".png", "JPEG": ".jpg", "WEBP": ".webp", "GIF": ".gif"}

# redirect_stdout swaps the process-wide sys.stdout; serialise CLI calls.
_STDOUT_LOCK = threading.Lock()


def _variant_setting_keys(cli: ModuleType) -> list[str]:
    """Every per-variant setting: the CLI's keys plus the surface FX keys the editor stores."""
    stored = {setting.key for setting in load_settings()}
    return sorted(set(cli.SETTING_KEYS) | stored)


def _integration_version() -> str:
    try:
        manifest = json.loads((Path(__file__).with_name("manifest.json")).read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError):
        return ""
    return str(manifest.get("version", ""))


def _load_cli() -> ModuleType:
    spec = importlib.util.spec_from_file_location("theme_studio_cli_engine", CLI_PATH)
    if spec is None or spec.loader is None:
        raise ImportError(f"Cannot load Theme Studio CLI from {CLI_PATH}")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


@dataclass
class ThemeEngine:
    """Theme Studio file operations bound to one config directory."""

    config_dir: Path
    cli: ModuleType
    version: str = ""
    setting_keys: list[str] = field(default_factory=list)

    @classmethod
    def create(cls, config_dir: str) -> ThemeEngine:
        """Load the CLI and point it at this installation (blocking)."""
        cli = _load_cli()
        engine = cls(Path(config_dir), cli, _integration_version(), _variant_setting_keys(cli))
        engine.cli.USER_THEME_DIR = str(engine.user_theme_dir)
        engine.cli.THEME_OUTPUT_DIR = str(engine.theme_output_dir)
        return engine

    # Paths -----------------------------------------------------------------

    def _path(self, parts: tuple[str, ...]) -> Path:
        return self.config_dir.joinpath(*parts)

    @property
    def preset_dir(self) -> Path:
        return self._path(PRESET_DIR)

    @property
    def user_theme_dir(self) -> Path:
        return self._path(USER_THEME_DIR)

    @property
    def theme_output_dir(self) -> Path:
        return self._path(THEME_OUTPUT_DIR)

    @property
    def background_dir(self) -> Path:
        return self._path(BACKGROUND_DIR)

    # Helpers ---------------------------------------------------------------

    def _run(self, func, **kwargs: Any) -> dict[str, Any]:
        """Run a CLI command function and return its JSON output."""
        buffer = io.StringIO()
        with _STDOUT_LOCK, redirect_stdout(buffer):
            func(argparse.Namespace(**kwargs))
        lines = [line for line in buffer.getvalue().splitlines() if line.strip()]
        if not lines:
            return {"ok": True}
        try:
            result = json.loads(lines[-1])
        except json.JSONDecodeError:
            return {"ok": True, "output": buffer.getvalue()}
        return result if isinstance(result, dict) else {"ok": True, "result": result}

    # Operations ------------------------------------------------------------

    def save_preset(self, payload: dict[str, Any]) -> dict[str, Any]:
        return self._run(
            self.cli.cmd_save_preset,
            preset_dir=str(self.preset_dir),
            payload=json.dumps(payload, ensure_ascii=False),
        )

    def delete_user_theme(self, name: str) -> dict[str, Any]:
        return self._run(
            self.cli.cmd_delete_preset,
            preset_dir=str(self.preset_dir),
            name=name,
        )

    def build_theme(self, name: str) -> dict[str, Any]:
        return self._run(
            self.cli.cmd_build_theme,
            preset_dir=str(self.preset_dir),
            output_dir=str(self.theme_output_dir),
            name=name,
        )

    # Catalogs --------------------------------------------------------------

    def background_image_catalog(self) -> dict[str, Any]:
        root = self.background_dir
        files = (
            sorted(
                path.name
                for path in root.iterdir()
                if path.is_file() and path.suffix.lower() in IMAGE_SUFFIXES
            )
            if root.exists()
            else []
        )
        return {"count": len(files), "options": files}

    # Sharing ---------------------------------------------------------------

    def _user_theme_slugs(self) -> set[str]:
        slugs = {self.cli.slugify(name) for name in self.cli.BUILTIN_PRESET_NAMES}
        if self.user_theme_dir.exists():
            slugs |= {path.stem for path in self.user_theme_dir.glob("*.json") if path.stem != "index"}
        return slugs

    def export_user_theme(self, name: str) -> dict[str, Any]:
        """Write a user theme to /config/www/theme_studio/exports and return it."""
        path = self.cli.resolve_preset(str(self.preset_dir), name)
        if not path or not path.exists() or path.resolve().parent != self.user_theme_dir.resolve():
            return {"ok": False, "reason": "user_theme_not_found", "name": name}
        theme = json.loads(path.read_text(encoding="utf-8"))
        document = sharing.export_document(theme, self.setting_keys, self.version)
        export_dir = self._path(EXPORT_DIR)
        export_dir.mkdir(parents=True, exist_ok=True)
        target = export_dir / f"{path.stem}.json"
        target.write_text(json.dumps(document, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
        return {
            "ok": True,
            "name": document["name"],
            "file": str(target),
            "url": f"{EXPORT_URL}/{target.name}",
            "share_string": sharing.to_share_string(document),
        }

    def import_user_theme(self, data: str, name: str | None = None) -> dict[str, Any]:
        """Create a new user theme from JSON or a share string. Never overwrites."""
        theme = sharing.parse_import(data, self.setting_keys)
        wanted = (name or theme["name"]).strip() or "Imported theme"
        final_name = sharing.unique_name(wanted, self._user_theme_slugs(), self.cli.slugify)
        slug = self.cli.slugify(final_name)
        self.user_theme_dir.mkdir(parents=True, exist_ok=True)
        target = self.user_theme_dir / f"{slug}.json"
        if target.exists():  # unique_name already avoided this; never overwrite.
            return {"ok": False, "reason": "target_exists", "name": final_name}
        stored = {
            "name": final_name,
            "slug": slug,
            "theme": theme["theme"],
            "light": theme["light"],
            "dark": theme["dark"],
        }
        target.write_text(json.dumps(stored, indent=2, ensure_ascii=False), encoding="utf-8")
        return {"ok": True, "name": final_name, "slug": slug, "renamed": final_name != wanted}

    def import_folder(self) -> dict[str, Any]:
        """Import every .json/.txt file in /config/theme_studio/imports.

        Imported files are renamed to ``<file>.imported`` so they are not
        imported twice; files that fail keep their name.
        """
        folder = self._path(IMPORT_DIR)
        folder.mkdir(parents=True, exist_ok=True)
        imported, failed = [], []
        for path in sorted(folder.iterdir()):
            if not path.is_file() or path.suffix.lower() not in (".json", ".txt"):
                continue
            try:
                result = self.import_user_theme(path.read_text(encoding="utf-8"))
            except (OSError, UnicodeDecodeError, sharing.ImportError_) as err:
                failed.append({"file": path.name, "reason": str(err)})
                continue
            if result.get("ok"):
                path.rename(path.with_name(path.name + ".imported"))
                imported.append({"file": path.name, "name": result["name"]})
            else:
                failed.append({"file": path.name, "reason": result.get("reason", "")})
        return {"ok": not failed, "imported": imported, "failed": failed, "folder": str(folder)}

    # Theme from image ------------------------------------------------------

    def _fit_image_theme(self, settings: dict[str, Any], variant: str) -> tuple[dict[str, Any], list]:
        """Nudge the image colours until every contrast pair passes (max 6 rounds)."""
        surfaces = {
            "text_card": "card_bg_override",
            "secondary_text_card": "card_bg_override",
            "text_bubble": "bubble_bg_override",
            "icon_bubble": "bubble_bg_override",
            "text_popup": "popup_bg_override",
            "navbar_icon": "navbar_bg_override",
            "text_sub_button": "bubble_bg_override",
            "text_page": "custom_background_color",
        }
        step = 0.03 if variant == "light" else -0.03
        report: list = []
        for _ in range(6):
            values = self.cli.build(self.cli.namespace_from_settings(settings, "/tmp/unused.yaml"))
            report = self.cli.contrast_report(values)
            failing = {pair["key"] for pair in report if not pair["ok"]}
            if not failing:
                break
            if failing & {"accent_page", "active_icon_card", "text_on_accent"}:
                page = self.cli.composite(
                    self.cli.parse_css_color(self.cli._resolve_var(values, values["background-color"])),
                    (1.0, 1.0, 1.0, 1.0),
                )
                card = self.cli.composite(
                    self.cli.parse_css_color(self.cli._resolve_var(values, values["ha-card-background"])),
                    page,
                )
                h, s, lightness = self.cli.hex_to_hsl(settings["accent_color_override"])
                fitted = self.cli.fit_to_contrast(h, s, lightness, [page, card])
                if "text_on_accent" in failing:
                    # Light: dark enough for white text. Dark: light enough for dark text.
                    label = self.cli.parse_css_color(
                        self.cli.LIGHT_TEXT if variant == "light" else self.cli.DARK_TEXT
                    )
                    fitted = self.cli.fit_to_contrast(h, s, fitted, [label], 4.5)
                accent = palette_module._from_hls(h / 360, fitted / 100, s / 100)
                settings["accent_color_override"] = accent
                settings["state_icon_active_color_override"] = accent
            for key, setting in surfaces.items():
                if key in failing and str(settings.get(setting, "")).startswith("#"):
                    h, lightness, s = palette_module._hls_of(settings[setting])
                    settings[setting] = palette_module._from_hls(h, min(max(lightness + step, 0.03), 0.99), s)
        return settings, report

    def _image_palette(self, image: str) -> dict[str, Any]:
        """Colours of an image in /config/www/background (name only)."""
        name = Path(str(image)).name
        path = self.background_dir / name
        if not name or not path.is_file():
            return {"ok": False, "reason": "image_not_found", "image": name}
        result = palette_module.palette_from_image(path)
        result.update({"ok": True, "image": name})
        return result

    def theme_from_image(self, image: str, name: str | None = None) -> dict[str, Any]:
        """Create a new user theme (light and dark) from a background image."""
        palette = self._image_palette(image)
        if not palette.get("ok"):
            return palette
        default = json.loads((self.preset_dir / "default.json").read_text(encoding="utf-8"))
        image_url = f"/local/background/{palette['image']}"
        variants: dict[str, dict[str, Any]] = {}
        failing: dict[str, list[str]] = {}
        for variant in ("light", "dark"):
            settings = dict(default.get(variant) or {})
            settings.update(palette_module.image_theme_settings(palette, variant, image_url))
            settings, report = self._fit_image_theme(settings, variant)
            variants[variant] = settings
            failing[variant] = [pair["key"] for pair in report if not pair["ok"]]

        stem = Path(palette["image"]).stem.replace("_", " ").replace("-", " ").strip()
        wanted = (name or f"From {stem}").strip()[:60]
        final_name = sharing.unique_name(wanted, self._user_theme_slugs(), self.cli.slugify)
        slug = self.cli.slugify(final_name)
        self.user_theme_dir.mkdir(parents=True, exist_ok=True)
        target = self.user_theme_dir / f"{slug}.json"
        if target.exists():
            return {"ok": False, "reason": "target_exists", "name": final_name}
        stored = {
            "name": final_name,
            "slug": slug,
            "theme": default.get("theme", {}),
            "light": variants["light"],
            "dark": variants["dark"],
        }
        target.write_text(json.dumps(stored, indent=2, ensure_ascii=False), encoding="utf-8")
        return {
            "ok": True,
            "name": final_name,
            "slug": slug,
            "image": palette["image"],
            "colours": palette["colours"],
            "failing": failing,
        }

    # Panel (read-only) -----------------------------------------------------

    def _defaults(self) -> dict[str, Any]:
        """Editor defaults per theme setting, used for keys a theme file lacks."""
        cached = self.__dict__.get("_default_settings")
        if cached is not None:
            return cached
        defaults: dict[str, Any] = {}
        for setting in load_settings():
            if setting.default is None:
                continue
            value = setting.default
            if isinstance(value, bool):
                value = "on" if value else "off"
            defaults[setting.key] = value
        self.__dict__["_default_settings"] = defaults
        return defaults

    def _build(self, settings: dict[str, Any]) -> dict[str, str]:
        merged = {**self._defaults(), **settings}
        values = self.cli.build(self.cli.namespace_from_settings(merged, "/tmp/unused.yaml"))
        return {str(key): str(value) for key, value in values.items()}

    def _describe(self, values: dict[str, str], with_variables: bool) -> dict[str, Any]:
        summary = previews_module.summary_colours(self.cli, values)
        radius = re.match(r"(\d+)", values.get("ha-card-border-radius", "16"))
        summary["radius"] = int(radius.group(1)) if radius else 16
        image = values.get("theme-studio-background-image", "none")
        summary["image"] = (
            values.get("theme-studio-background-image-url", "") if image not in ("", "none") else ""
        )
        contrast = [
            {
                "key": pair["key"],
                "label": CONTRAST_LABELS.get(pair["key"], pair["key"]),
                "ratio": pair["ratio"],
                "minimum": pair["minimum"],
                "ok": pair["ok"],
            }
            for pair in self.cli.contrast_report(values)
        ]
        described: dict[str, Any] = {
            "summary": summary,
            "failing": sum(1 for pair in contrast if not pair["ok"]),
        }
        if with_variables:
            described["variables"] = values
            described["contrast"] = contrast
        return described

    def _merged_settings(self, settings: dict[str, Any]) -> dict[str, Any]:
        """Stored settings on top of the editor defaults, limited to known keys."""
        allowed = set(self.setting_keys)
        merged = {key: value for key, value in self._defaults().items() if key in allowed}
        merged.update(_plain_settings(settings, allowed))
        return merged

    def _theme_files(self) -> list[tuple[Path, bool]]:
        """Built-in presets in their usual order, then user themes by name."""
        order = {self.cli.slugify(name): index for index, name in enumerate(self.cli.BUILTIN_PRESET_NAMES)}
        files: list[tuple[Path, bool]] = []
        if self.preset_dir.is_dir():
            presets = [path for path in self.preset_dir.glob("*.json") if path.name != "index.json"]
            presets.sort(key=lambda path: (order.get(path.stem, len(order)), path.stem))
            files.extend((path, True) for path in presets)
        if self.user_theme_dir.is_dir():
            users = [path for path in self.user_theme_dir.glob("*.json") if path.name != "index.json"]
            files.extend((path, False) for path in sorted(users, key=lambda path: path.stem))
        return files

    def _summarise(self, path: Path, builtin: bool, with_variables: bool) -> dict[str, Any] | None:
        try:
            data = json.loads(path.read_text(encoding="utf-8"))
        except (OSError, json.JSONDecodeError):
            return None
        if not isinstance(data, dict):
            return None
        theme: dict[str, Any] = {
            "name": str(data.get("name") or path.stem),
            "slug": path.stem,
            "builtin": builtin,
        }
        for variant in sharing.VARIANTS:
            settings = data.get(variant) or data.get("theme") or {}
            if not isinstance(settings, dict):
                theme[variant] = None
                continue
            try:
                theme[variant] = self._describe(self._build(settings), with_variables)
            except (ValueError, TypeError, KeyError, ZeroDivisionError):
                theme[variant] = None
                continue
            if with_variables:
                theme[variant]["settings"] = self._merged_settings(settings)
        return theme

    def theme_cards(self) -> list[dict[str, Any]]:
        """Every preset and user theme with the colours for its preview card."""
        cards = []
        for path, builtin in self._theme_files():
            card = self._summarise(path, builtin, with_variables=False)
            if card is not None:
                cards.append(card)
        return cards

    def theme_detail(self, slug: str) -> dict[str, Any] | None:
        """One theme with every CSS variable and the contrast of both variants."""
        for path, builtin in self._theme_files():
            if path.stem == slug:
                return self._summarise(path, builtin, with_variables=True)
        return None

    def preview(self, settings: dict[str, Any]) -> dict[str, Any]:
        """Build one variant from settings without writing anything."""
        clean = _plain_settings(settings, set(self.setting_keys))
        return self._describe(self._build(clean), with_variables=True)

    def preview_options(
        self, settings: dict[str, Any], key: str, values: list[str], fixed: dict[str, Any]
    ) -> list[dict[str, Any]]:
        """One preview per value of ``key`` (for border, shadow and overlay tiles)."""
        allowed = set(self.setting_keys)
        if key not in allowed:
            return []
        base = {**_plain_settings(settings, allowed), **_plain_settings(fixed, allowed)}
        results = []
        for value in values[:20]:
            variables = self._build({**base, key: value})
            results.append({"value": value, "variables": variables})
        return results

    def save_background(self, filename: str, data: bytes) -> dict[str, Any]:
        """Store an uploaded image in /config/www/background under a safe, free name."""
        if len(data) > MAX_BACKGROUND_BYTES:
            return {"ok": False, "reason": "too_large"}
        try:
            from PIL import Image  # noqa: PLC0415 - Pillow ships with Home Assistant
        except ImportError:  # pragma: no cover
            return {"ok": False, "reason": "no_pillow"}
        try:
            with Image.open(io.BytesIO(data)) as image:
                image_format = (image.format or "").upper()
                image.verify()
        except Exception:  # noqa: BLE001 - any decoder error means "not an image"
            return {"ok": False, "reason": "not_an_image"}
        suffix = BACKGROUND_FORMATS.get(image_format)
        if suffix is None:
            return {"ok": False, "reason": "unsupported_format", "format": image_format}
        stem = re.sub(r"[^A-Za-z0-9_-]+", "-", Path(filename or "image").stem).strip("-_")[:60] or "image"
        target_dir = self.background_dir
        target_dir.mkdir(parents=True, exist_ok=True)
        name = f"{stem}{suffix}"
        number = 2
        while (target_dir / name).exists():
            name = f"{stem}-{number}{suffix}"
            number += 1
        (target_dir / name).write_bytes(data)
        return {"ok": True, "file": name, "url": f"/local/background/{name}"}

    def custom_fonts(self) -> list[tuple[str, str]]:
        """(family, path) of every custom font switched on in a preset or user theme."""
        found: set[tuple[str, str]] = set()
        for path, _builtin in self._theme_files():
            try:
                data = json.loads(path.read_text(encoding="utf-8"))
            except (OSError, json.JSONDecodeError):
                continue
            if not isinstance(data, dict):
                continue
            for variant in sharing.VARIANTS:
                settings = data.get(variant)
                if isinstance(settings, dict) and (font := fonts_module.custom_font(settings)):
                    found.add(font)
        return sorted(found)

    def export_theme(self, slug: str) -> dict[str, Any]:
        """A theme as a portable document and share code; nothing is written."""
        for path, _builtin in self._theme_files():
            if path.stem != slug:
                continue
            try:
                theme = json.loads(path.read_text(encoding="utf-8"))
            except (OSError, json.JSONDecodeError):
                break
            document = sharing.export_document(theme, self.setting_keys, self.version)
            return {
                "ok": True,
                "name": document["name"],
                "file_name": f"{slug}.json",
                "document": document,
                "share_string": sharing.to_share_string(document),
            }
        return {"ok": False, "reason": "not_found", "slug": slug}

    # Panel (editing) -------------------------------------------------------

    def schema(self) -> list[dict[str, Any]]:
        """The per-variant settings the editor can change, with their limits."""
        allowed = set(self.setting_keys)
        settings = []
        for setting in load_settings():
            if setting.key not in allowed:
                continue
            settings.append(
                {
                    "key": setting.key,
                    "platform": setting.control,
                    "label": setting.label,
                    "min": setting.min,
                    "max": setting.max,
                    "step": setting.step,
                    "options": list(setting.options),
                    "default": self._defaults().get(setting.key),
                }
            )
        return settings

    def _user_path(self, slug: str) -> Path | None:
        """The file of a user theme, or None for presets and unknown slugs."""
        if not slug or "/" in slug or "\\" in slug or slug.startswith("."):
            return None
        path = self.user_theme_dir / f"{slug}.json"
        return path if path.is_file() and path.stem != "index" else None

    def _taken_slugs(self, except_slug: str | None = None) -> set[str]:
        slugs = {self.cli.slugify(name) for name in self.cli.BUILTIN_PRESET_NAMES}
        for path, _builtin in self._theme_files():
            slugs.add(path.stem)
            try:
                data = json.loads(path.read_text(encoding="utf-8"))
            except (OSError, json.JSONDecodeError):
                continue
            if isinstance(data, dict) and data.get("name") and path.stem != except_slug:
                slugs.add(self.cli.slugify(str(data["name"])))
        slugs.discard(except_slug or "")
        return slugs

    def _backup_once(self, path: Path) -> None:
        """One timestamped copy per user theme per Home Assistant run."""
        done: set[str] = self.__dict__.setdefault("_backed_up", set())
        if path.stem in done:
            return
        stamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        shutil.copy2(path, path.with_name(f"{path.name}.bak_{stamp}"))
        done.add(path.stem)

    def save_theme(
        self, slug: str, name: str | None, variants: dict[str, dict[str, Any]]
    ) -> dict[str, Any]:
        """Write editor changes into a user theme. Built-in presets are never written."""
        path = self._user_path(slug)
        if path is None:
            plain = slug == Path(slug).name and not slug.startswith(".")
            reason = "built_in" if plain and (self.preset_dir / f"{slug}.json").is_file() else "not_found"
            return {"ok": False, "reason": reason, "slug": slug}
        try:
            theme = json.loads(path.read_text(encoding="utf-8"))
        except (OSError, json.JSONDecodeError):
            return {"ok": False, "reason": "unreadable", "slug": slug}
        if not isinstance(theme, dict):
            return {"ok": False, "reason": "unreadable", "slug": slug}
        if name is not None:
            name = name.strip()[:60]
            if not name:
                return {"ok": False, "reason": "invalid_name", "slug": slug}
            if self.cli.slugify(name) != slug and self.cli.slugify(name) in self._taken_slugs(slug):
                return {"ok": False, "reason": "name_taken", "slug": slug, "name": name}
            theme["name"] = name
        allowed = set(self.setting_keys)
        for variant, settings in variants.items():
            if variant not in sharing.VARIANTS or not isinstance(settings, dict):
                continue
            stored = theme.get(variant) if isinstance(theme.get(variant), dict) else {}
            theme[variant] = {**stored, **_plain_settings(settings, allowed)}
        self._backup_once(path)
        path.write_text(json.dumps(theme, indent=2, ensure_ascii=False), encoding="utf-8")
        return {"ok": True, "slug": slug, "name": theme.get("name", slug)}

    def new_theme(
        self, source: str | None, name: str | None, base_color: str | None = None
    ) -> dict[str, Any]:
        """A new user theme copied from a preset or user theme (default: Default)."""
        source_path = None
        for path, _builtin in self._theme_files():
            if path.stem == (source or "default"):
                source_path = path
        if source_path is None:
            return {"ok": False, "reason": "source_not_found", "source": source}
        try:
            data = json.loads(source_path.read_text(encoding="utf-8"))
        except (OSError, json.JSONDecodeError):
            return {"ok": False, "reason": "unreadable", "source": source}
        wanted = (name or f"My {data.get('name') or source_path.stem}").strip()[:60] or "My theme"
        final_name = sharing.unique_name(wanted, self._taken_slugs(), self.cli.slugify)
        slug = self.cli.slugify(final_name)
        stored = {
            "name": final_name,
            "slug": slug,
            "theme": data.get("theme") or {},
            "light": dict(data.get("light") or {}),
            "dark": dict(data.get("dark") or {}),
        }
        if base_color and variants_module.HEX_RE.match(base_color.strip()):
            for variant in sharing.VARIANTS:
                stored[variant]["base_color"] = variants_module.mirror_lightness(base_color.strip(), variant)
        self.user_theme_dir.mkdir(parents=True, exist_ok=True)
        target = self.user_theme_dir / f"{slug}.json"
        if target.exists():
            return {"ok": False, "reason": "target_exists", "name": final_name}
        target.write_text(json.dumps(stored, indent=2, ensure_ascii=False), encoding="utf-8")
        return {"ok": True, "slug": slug, "name": final_name}

    def delete_theme(self, slug: str) -> dict[str, Any]:
        """Delete a user theme and its built theme file. Presets cannot be deleted."""
        path = self._user_path(slug)
        if path is None:
            return {"ok": False, "reason": "not_found", "slug": slug}
        try:
            name = str(json.loads(path.read_text(encoding="utf-8")).get("name") or slug)
        except (OSError, json.JSONDecodeError, AttributeError):
            name = slug
        # A copy stays next to it, so a deleted user theme can always be restored.
        stamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        shutil.copy2(path, path.with_name(f"{path.name}.bak_{stamp}"))
        path.unlink()
        built = []
        for stem in {slug, self.cli.slugify(name)}:
            target = self.theme_output_dir / f"{stem}.yaml"
            if target.is_file():
                target.unlink()
                built.append(target.name)
        return {"ok": True, "slug": slug, "name": name, "removed_theme_files": built}

    def theme_name(self, slug: str) -> str | None:
        for path, _builtin in self._theme_files():
            if path.stem == slug:
                try:
                    return str(json.loads(path.read_text(encoding="utf-8")).get("name") or slug)
                except (OSError, json.JSONDecodeError, AttributeError):
                    return slug
        return None

    def mirror(self, settings: dict[str, Any], target: str) -> dict[str, Any]:
        """Settings for ``target`` made from the other variant; nothing is written."""
        allowed = set(self.setting_keys)
        clean = _plain_settings(settings, allowed)
        mirrored = variants_module.mirror_variant({key: str(value) for key, value in clean.items()}, target)
        numbers = {item["key"] for item in self.schema() if item["platform"] == "number"}
        result: dict[str, Any] = {}
        for key, value in mirrored.items():
            if key in numbers:
                try:
                    result[key] = float(value)
                    continue
                except (TypeError, ValueError):
                    pass
            result[key] = value
        return result


def _plain_settings(settings: dict[str, Any], allowed: set[str]) -> dict[str, Any]:
    """Known settings with plain values; switches as on/off, text capped."""
    clean: dict[str, Any] = {}
    for key, value in settings.items():
        if key not in allowed or value is None:
            continue
        if isinstance(value, bool):
            clean[key] = "on" if value else "off"
        elif isinstance(value, (int, float)):
            clean[key] = value
        elif isinstance(value, str):
            clean[key] = value[:255]
    return clean
