"""Asset installer for Theme Studio.

Copies bundled Theme Studio templates from the integration folder to the
Home Assistant /config folder.

Important:
- User themes are runtime data and are never overwritten.
- Built-in presets and bundled managed files may be updated safely.
- Existing managed files are backed up before overwrite.
"""

from __future__ import annotations

import logging
import shutil
from dataclasses import dataclass, field
from datetime import datetime
from functools import partial
from pathlib import Path
from typing import Any

from homeassistant.core import HomeAssistant

_LOGGER = logging.getLogger(__name__)

DOMAIN = "theme_studio"

INTEGRATION_DIR = Path(__file__).resolve().parent
TEMPLATES_DIR = INTEGRATION_DIR / "templates"

SKIP_NAMES = {
    "__pycache__",
    ".DS_Store",
    "Thumbs.db",
    ".gitkeep",
}

SKIP_SUFFIXES = {
    ".pyc",
    ".pyo",
}

PROTECTED_TARGET_DIRS = (
    ("theme_studio", "user_themes"),
)


@dataclass
class AssetInstallResult:
    """Result for Theme Studio asset installation."""

    created_dirs: list[str] = field(default_factory=list)
    copied_files: list[str] = field(default_factory=list)
    updated_files: list[str] = field(default_factory=list)
    skipped_files: list[str] = field(default_factory=list)
    backups: list[str] = field(default_factory=list)
    errors: list[str] = field(default_factory=list)

    @property
    def success(self) -> bool:
        """Return true if no errors occurred."""
        return not self.errors

    def as_dict(self) -> dict[str, Any]:
        """Return result as service-response friendly dict."""
        return {
            "success": self.success,
            "created_dirs": self.created_dirs,
            "copied_files": self.copied_files,
            "updated_files": self.updated_files,
            "skipped_files": self.skipped_files,
            "backups": self.backups,
            "errors": self.errors,
        }


def initialize_assets(
    hass: HomeAssistant,
    *,
    overwrite: bool = True,
    backup: bool = True,
) -> dict[str, Any]:
    """Install or update Theme Studio assets in /config."""
    result = AssetInstallResult()

    if not TEMPLATES_DIR.exists():
        msg = f"Template directory does not exist: {TEMPLATES_DIR}"
        _LOGGER.error(msg)
        result.errors.append(msg)
        return result.as_dict()

    config_dir = Path(hass.config.path())

    target_dirs = {
        "packages": config_dir / "packages",
        "lovelace": config_dir / "lovelace",
        "themes": config_dir / "themes",
        "theme_studio": config_dir / "theme_studio",
        "www": config_dir / "www",
    }

    for path in target_dirs.values():
        _mkdir(path, result)

    _mkdir(config_dir / "theme_studio" / "presets", result)
    _mkdir(config_dir / "theme_studio" / "scripts", result)
    _mkdir(config_dir / "theme_studio" / "user_themes", result)
    _mkdir(config_dir / "www" / "background", result)

    copy_jobs = [
        (TEMPLATES_DIR / "packages", config_dir / "packages"),
        (TEMPLATES_DIR / "lovelace", config_dir / "lovelace"),
        (TEMPLATES_DIR / "themes", config_dir / "themes"),
        (TEMPLATES_DIR / "theme_studio" / "presets", config_dir / "theme_studio" / "presets"),
        (TEMPLATES_DIR / "theme_studio" / "scripts", config_dir / "theme_studio" / "scripts"),
        (TEMPLATES_DIR / "www" / "background", config_dir / "www" / "background"),
    ]

    for source, destination in copy_jobs:
        _copy_tree_contents(
            source=source,
            destination=destination,
            config_dir=config_dir,
            result=result,
            overwrite=overwrite,
            backup=backup,
        )

    _LOGGER.info(
        "Theme Studio assets installed. copied=%s updated=%s skipped=%s backups=%s errors=%s",
        len(result.copied_files),
        len(result.updated_files),
        len(result.skipped_files),
        len(result.backups),
        len(result.errors),
    )

    return result.as_dict()


# Backwards-compatible alias.
# Keeps old imports working if __init__.py or tests still import install_assets.
install_assets = initialize_assets


async def async_initialize_assets(
    hass: HomeAssistant,
    *,
    overwrite: bool = True,
    backup: bool = True,
) -> dict[str, Any]:
    """Install Theme Studio assets using executor thread."""
    return await hass.async_add_executor_job(
        partial(
            initialize_assets,
            hass,
            overwrite=overwrite,
            backup=backup,
        )
    )


def _mkdir(path: Path, result: AssetInstallResult) -> None:
    """Create directory if missing."""
    try:
        if not path.exists():
            path.mkdir(parents=True, exist_ok=True)
            result.created_dirs.append(_display(path))
        else:
            path.mkdir(parents=True, exist_ok=True)
    except OSError as err:
        msg = f"Could not create directory {path}: {err}"
        _LOGGER.exception(msg)
        result.errors.append(msg)


def _copy_tree_contents(
    *,
    source: Path,
    destination: Path,
    config_dir: Path,
    result: AssetInstallResult,
    overwrite: bool,
    backup: bool,
) -> None:
    """Copy all files/folders from source into destination."""
    if not source.exists():
        msg = f"Source path missing: {source}"
        _LOGGER.warning(msg)
        result.errors.append(msg)
        return

    if _is_protected_target(destination, config_dir):
        result.skipped_files.append(_display(destination))
        _LOGGER.info("Skipping protected Theme Studio runtime directory: %s", destination)
        return

    _mkdir(destination, result)

    for item in source.iterdir():
        if _should_skip(item):
            continue

        target = destination / item.name

        if _is_protected_target(target, config_dir):
            result.skipped_files.append(_display(target))
            _LOGGER.info("Skipping protected Theme Studio runtime path: %s", target)
            continue

        if item.is_dir():
            _copy_tree_contents(
                source=item,
                destination=target,
                config_dir=config_dir,
                result=result,
                overwrite=overwrite,
                backup=backup,
            )
            continue

        _copy_file(
            source=item,
            destination=target,
            config_dir=config_dir,
            result=result,
            overwrite=overwrite,
            backup=backup,
        )


def _copy_file(
    *,
    source: Path,
    destination: Path,
    config_dir: Path,
    result: AssetInstallResult,
    overwrite: bool,
    backup: bool,
) -> None:
    """Copy a single file."""
    try:
        if _is_protected_target(destination, config_dir):
            result.skipped_files.append(_display(destination))
            _LOGGER.info("Skipping protected Theme Studio runtime file: %s", destination)
            return

        _mkdir(destination.parent, result)

        if destination.exists():
            if not overwrite:
                result.skipped_files.append(_display(destination))
                return

            if _same_file_content(source, destination):
                result.skipped_files.append(_display(destination))
                return

            if backup:
                backup_path = _backup_file(destination)
                result.backups.append(_display(backup_path))

            shutil.copy2(source, destination)
            result.updated_files.append(_display(destination))
            return

        shutil.copy2(source, destination)
        result.copied_files.append(_display(destination))

    except OSError as err:
        msg = f"Could not copy {source} to {destination}: {err}"
        _LOGGER.exception(msg)
        result.errors.append(msg)


def _is_protected_target(path: Path, config_dir: Path) -> bool:
    """Return true if target path is protected runtime data."""
    try:
        relative_parts = path.resolve().relative_to(config_dir.resolve()).parts
    except ValueError:
        return False

    return any(
        relative_parts[: len(protected)] == protected
        for protected in PROTECTED_TARGET_DIRS
    )


def _same_file_content(source: Path, destination: Path) -> bool:
    """Return true if two files have identical bytes."""
    try:
        return source.read_bytes() == destination.read_bytes()
    except OSError:
        return False


def _backup_file(path: Path) -> Path:
    """Create timestamped backup next to existing file."""
    stamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    backup_path = path.with_name(f"{path.name}.bak_{stamp}")
    shutil.copy2(path, backup_path)
    return backup_path


def _should_skip(path: Path) -> bool:
    """Return true if file/folder should not be copied."""
    return path.name in SKIP_NAMES or path.suffix in SKIP_SUFFIXES


def _display(path: Path) -> str:
    """Return readable path string."""
    return str(path)
