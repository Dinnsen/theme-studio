# Contributing to Theme Studio

Thanks for helping. Bug reports, ideas and pull requests are all welcome.

## Reporting a bug or an idea

Use the [issue forms](https://github.com/Dinnsen/theme-studio/issues/new/choose). For a problem with one theme, a share code (panel → *Use theme* → *Copy share code*) makes it easy to reproduce.

## How the project is laid out

| Path | What it is |
| --- | --- |
| `custom_components/theme_studio/` | The Home Assistant integration. |
| `custom_components/theme_studio/engine.py` | Builds, previews and saves themes for the panel. |
| `custom_components/theme_studio/websocket.py` | The commands the panel uses. |
| `custom_components/theme_studio/settings.json` | Every setting a theme stores per variant, with its control and limits. |
| `custom_components/theme_studio/templates/theme_studio/scripts/theme_studio_cli.py` | The theme generator (colours, contrast, CSS variables). |
| `custom_components/theme_studio/templates/theme_studio/presets/` | The built-in presets. |
| `custom_components/theme_studio/frontend/` | The built panel and the bundled fonts (committed, so HACS users build nothing). |
| `frontend/` | The panel's source (Lit + TypeScript). |
| `tests/` | Tests that run without Home Assistant. |

`AGENTS.md` lists the rules that keep users' data safe; please read it before changing how files are written.

## Development

Python tests:

```bash
pip install pytest pillow pyyaml
python -m pytest
python -m compileall custom_components/theme_studio tests
```

The panel:

```bash
cd frontend
npm ci
npm run typecheck
npm run build
```

Commit the rebuilt `custom_components/theme_studio/frontend/theme-studio-panel.js` together with the source change; the *Panel* workflow fails when they do not match.

After changing the engine or the presets, rebuild the bundled *Theme Studio Standard* theme:

```bash
python scripts/regenerate_bundled_themes.py
```

To try a change in Home Assistant, copy `custom_components/theme_studio` into `/config/custom_components/` and restart.

## Rules that matter most

- Never overwrite, rename or delete files in `/config/theme_studio/user_themes/` automatically.
- Built-in presets are never written; the first change makes a user theme.
- Light and Dark are separate: saving one never changes the other.
- Colours the user set by hand are never changed by automatic adjustments.
- Managed files are backed up as `<file>.bak_YYYYMMDD_HHMMSS` before they are replaced.

## Releases

1. Update `version` in `custom_components/theme_studio/manifest.json` and add the version to `CHANGELOG.md`.
2. Merge to `main` and wait for the checks.
3. Push a tag `vX.Y.Z` that matches the manifest. The *Release* workflow checks the version and publishes the GitHub release with the notes from the changelog; HACS picks it up from there.

## Licence

By contributing you agree that your contribution is licensed under the [MIT licence](LICENSE).
