from __future__ import annotations

from pathlib import Path
import shutil
import logging

from .const import (
    CLI_FILENAME,
    DASHBOARD_FILENAME,
    DYNAMIC_THEME_FILENAME,
    PACKAGE_FILENAME,
    PRESETS_DIRNAME,
    SCRIPTS_DIRNAME,
)

_LOGGER = logging.getLogger(__name__)


def _copy(src: Path, dst: Path, overwrite: bool) -> bool:
    dst.parent.mkdir(parents=True, exist_ok=True)
    if dst.exists() and not overwrite:
        return False
    shutil.copy2(src, dst)
    return True


def install_assets(template_root: Path, config_root: Path, packages_path: str, lovelace_path: str, workdir_path: str, themes_path: str, overwrite: bool = False) -> dict[str, list[str]]:
    changed: list[str] = []
    skipped: list[str] = []

    packages_dir = Path(packages_path)
    lovelace_dir = Path(lovelace_path)
    workdir_dir = Path(workdir_path)
    themes_dir = Path(themes_path)

    mappings = [
        (template_root / 'theme_studio_package.yaml', packages_dir / PACKAGE_FILENAME),
        (template_root / 'theme_studio_dashboard.yaml', lovelace_dir / DASHBOARD_FILENAME),
        (template_root / 'theme_studio_dynamic_theme.yaml', themes_dir / DYNAMIC_THEME_FILENAME),
        (template_root / 'theme_studio_cli.py', workdir_dir / SCRIPTS_DIRNAME / CLI_FILENAME),
        (template_root / PRESETS_DIRNAME / 'glass.json', workdir_dir / PRESETS_DIRNAME / 'glass.json'),
        (template_root / PRESETS_DIRNAME / 'md3.json', workdir_dir / PRESETS_DIRNAME / 'md3.json'),
    ]

    for src, dst in mappings:
        if _copy(src, dst, overwrite):
            changed.append(str(dst))
        else:
            skipped.append(str(dst))

    return {"changed": changed, "skipped": skipped}
