"""Theme generation engine.

Runs the bundled ``theme_studio_cli.py`` in-process instead of through
``shell_command``. Every function here does file I/O and must run in the
executor.
"""

from __future__ import annotations

import argparse
from contextlib import redirect_stdout
from dataclasses import dataclass
import importlib.util
import io
import json
from pathlib import Path
import threading
from types import ModuleType
from typing import Any

from .const import (
    BACKGROUND_DIR,
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

    @classmethod
    def create(cls, config_dir: str) -> ThemeEngine:
        """Load the CLI and point it at this installation (blocking)."""
        engine = cls(Path(config_dir), _load_cli())
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
        """Keep user_themes/index.json for anything that still reads it."""
        return self._run(
            self.cli.cmd_list_user_themes,
            preset_dir=str(self.preset_dir),
            output_json=str(self.user_theme_dir / "index.json"),
        )

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
