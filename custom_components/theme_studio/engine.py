"""Theme generation engine.

Runs the bundled ``theme_studio_cli.py`` in-process instead of through
``shell_command``. Every function here does file I/O and must run in the
executor.
"""

from __future__ import annotations

import argparse
from contextlib import redirect_stdout
from dataclasses import dataclass, field
import importlib.util
import io
import json
from pathlib import Path
import re
import threading
from types import ModuleType
from typing import Any

from . import palette as palette_module, previews as previews_module, sharing
from .definitions import load_definitions
from .const import (
    BACKGROUND_DIR,
    CONTRAST_LABELS,
    EXPORT_DIR,
    EXPORT_URL,
    IMPORT_DIR,
    PREVIEW_DIR,
    LIVE_THEME_FILE,
    LIVE_THEME_NAME,
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

# redirect_stdout swaps the process-wide sys.stdout; serialise CLI calls.
_STDOUT_LOCK = threading.Lock()


def _variant_setting_keys(cli: ModuleType) -> list[str]:
    """Every per-variant setting: the CLI's keys plus the surface FX keys the editor stores."""
    stored = {definition.setting for definition in load_definitions() if definition.setting}
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
    def live_theme_file(self) -> Path:
        return self._path(LIVE_THEME_FILE)

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

    def generate_live(self, arguments: dict[str, str]) -> dict[str, Any]:
        """Write the live preview theme. Returns whether the file changed."""
        values = {key: arguments.get(key, "") for key in self.cli.LIVE_ARGUMENT_KEYS}
        values["output"] = str(self.live_theme_file)
        theme = self.cli.build(argparse.Namespace(**values))

        lines = [f"{LIVE_THEME_NAME}:\n"]
        lines.extend(self.cli.emit_value(key, value) for key, value in theme.items())
        content = "".join(lines)
        contrast = self.cli.contrast_report(theme)

        target = self.live_theme_file
        changed = not (target.exists() and target.read_text(encoding="utf-8") == content)
        if changed:
            target.parent.mkdir(parents=True, exist_ok=True)
            target.write_text(content, encoding="utf-8")
        return {"ok": True, "changed": changed, "output": str(target), "contrast": contrast}

    def save_preset(self, payload: dict[str, Any]) -> dict[str, Any]:
        return self._run(
            self.cli.cmd_save_preset,
            preset_dir=str(self.preset_dir),
            payload=json.dumps(payload, ensure_ascii=False),
        )

    def copy_preset(self, source: str, name: str) -> dict[str, Any]:
        return self._run(
            self.cli.cmd_copy_preset,
            preset_dir=str(self.preset_dir),
            source=source,
            name=name,
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

    def write_user_theme_index(self) -> dict[str, Any]:
        """Keep user_themes/index.json and the user theme previews up to date."""
        result = self._run(
            self.cli.cmd_list_user_themes,
            preset_dir=str(self.preset_dir),
            output_json=str(self.user_theme_dir / "index.json"),
        )
        previews_module.write_user_previews(self.cli, self.user_theme_dir, self._path(PREVIEW_DIR))
        return result

    # Catalogs --------------------------------------------------------------

    def preset_catalog(self) -> dict[str, Any]:
        names = list(self.cli.BUILTIN_PRESET_NAMES)
        return {"count": len(names), "options": names, "builtin_options": names}

    def user_theme_catalog(self) -> dict[str, Any]:
        return self.cli.collect_user_themes(str(self.preset_dir))

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

    def read_preset(self, name: str) -> dict[str, Any]:
        path = self.cli.resolve_preset(str(self.preset_dir), name)
        if not path or not path.exists():
            return {}
        try:
            data = json.loads(path.read_text(encoding="utf-8"))
        except (OSError, json.JSONDecodeError):
            return {}
        return data if isinstance(data, dict) else {}

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

    # Images and previews ---------------------------------------------------

    def palette_from_image(self, image: str) -> dict[str, Any]:
        """Colours of an image in /config/www/background (name only)."""
        name = Path(str(image)).name
        path = self.background_dir / name
        if not name or not path.is_file():
            return {"ok": False, "reason": "image_not_found", "image": name}
        result = palette_module.palette_from_image(path)
        result.update({"ok": True, "image": name})
        return result

    def write_previews(self) -> list[str]:
        """Previews for the built-in presets and the user themes."""
        output = self._path(PREVIEW_DIR)
        written = previews_module.write_previews(self.cli, self.preset_dir, output)
        written += previews_module.write_user_previews(self.cli, self.user_theme_dir, output)
        return written

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

    def theme_from_image(self, image: str, name: str | None = None) -> dict[str, Any]:
        """Create a new user theme (light and dark) from a background image."""
        palette = self.palette_from_image(image)
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

    # Save and load ---------------------------------------------------------

    def read_theme(self, name: str) -> dict[str, Any] | None:
        """A built-in preset or user theme by name, or None."""
        path = self.cli.resolve_preset(str(self.preset_dir), name)
        if not path or not path.exists():
            return None
        try:
            data = json.loads(path.read_text(encoding="utf-8"))
        except (OSError, json.JSONDecodeError):
            return None
        if not isinstance(data, dict):
            return None
        data["_user_theme"] = path.resolve().parent == self.user_theme_dir.resolve()
        data["_path"] = str(path)
        return data

    def save_variant(self, name: str, variant: str, settings: dict[str, Any]) -> dict[str, Any]:
        """Write one variant of a user theme; the other variant is kept as it is."""
        theme = self.read_theme(name)
        if theme is None:
            return {"ok": False, "reason": "not_found", "name": name}
        if not theme["_user_theme"]:
            return {"ok": False, "reason": "built_in", "name": name}
        path = Path(theme.pop("_path"))
        theme.pop("_user_theme")
        theme[variant] = {**(theme.get(variant) or {}), **settings}
        path.write_text(json.dumps(theme, indent=2, ensure_ascii=False), encoding="utf-8")
        return {"ok": True, "name": theme.get("name", name), "variant": variant}

    def save_as_new(
        self, name: str, source: str, variant: str, settings: dict[str, Any]
    ) -> dict[str, Any]:
        """New user theme: the editor becomes ``variant``, the other variant comes from ``source``."""
        name = name.strip()
        if not name:
            return {"ok": False, "reason": "missing_name"}
        slug = self.cli.slugify(name)
        if slug in self._user_theme_slugs():
            return {"ok": False, "reason": "exists", "name": name}
        base = self.read_theme(source) or self.read_theme("Default") or {}
        stored = {
            "name": name,
            "slug": slug,
            "theme": base.get("theme", {}),
            "light": dict(base.get("light") or {}),
            "dark": dict(base.get("dark") or {}),
        }
        stored[variant] = {**stored[variant], **settings}
        self.user_theme_dir.mkdir(parents=True, exist_ok=True)
        target = self.user_theme_dir / f"{slug}.json"
        if target.exists():
            return {"ok": False, "reason": "exists", "name": name}
        target.write_text(json.dumps(stored, indent=2, ensure_ascii=False), encoding="utf-8")
        return {"ok": True, "name": name, "slug": slug, "variant": variant}

    # Panel (read-only) -----------------------------------------------------

    def _defaults(self) -> dict[str, Any]:
        """Editor defaults per theme setting, used for keys a theme file lacks."""
        cached = self.__dict__.get("_default_settings")
        if cached is not None:
            return cached
        defaults: dict[str, Any] = {}
        for definition in load_definitions():
            if not definition.setting or definition.default is None:
                continue
            value = definition.default
            if isinstance(value, bool):
                value = "on" if value else "off"
            defaults[definition.setting] = value
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
        allowed = set(self.setting_keys)
        clean = {
            key: value
            for key, value in settings.items()
            if key in allowed and isinstance(value, (str, int, float, bool))
        }
        return self._describe(self._build(clean), with_variables=True)

