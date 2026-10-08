# GitHub Copilot / Codex Instructions

<!-- Kept in step with AGENTS.md in the repository root. -->

Repository: `Dinnsen/theme-studio`
Project: **Theme Studio**
Domain: `theme_studio`
Platform: Home Assistant custom integration + bundled YAML assets.

These instructions apply to the entire repository unless a more specific `AGENTS.md` exists in a subdirectory.

---

# Project purpose

Theme Studio is a Home Assistant theming system: an integration with its own sidebar panel where users create, edit, check and apply themes. Since v1.0.0 there is no YAML dashboard, no package and no helper entities; the panel talks to the integration over WebSocket commands.

Core goals:

- Generate complete Home Assistant themes from a base color.
- Support separate Light and Dark workflows.
- Support built-in presets and custom user themes.
- Provide live preview for:
  - colors
  - overlays
  - backgrounds
  - borders
  - shadows
  - fonts
  - navbar styling
  - card styling
- Export/build a usable Home Assistant YAML theme.
- Keep installation friendly for HACS users.

---

# Repository structure

Important paths:

```text
custom_components/theme_studio/
  __init__.py
  asset_manager.py
  config_flow.py
  const.py
  manifest.json
  services.yaml
  strings.json
  translations/
  brand/
  engine.py           theme engine used by the panel (runs the bundled CLI)
  settings.json       per-variant theme settings the panel edits
  websocket.py        the panel's WebSocket commands
  retirement.py       clean-up after the v1.0.0 removal of the dashboard
  frontend/           built panel bundle and bundled fonts (committed)
  templates/
    theme_studio/
      presets/
      scripts/        theme_studio_cli.py (used in-process, not installed)
      user_themes/
    themes/
    www/background/

frontend/             panel source (Lit + TypeScript)
docs/assets/
tests/
.github/workflows/
hacs.json
README.md
```

---

# Home Assistant integration rules

- Follow Home Assistant custom integration patterns.
- Keep the integration domain as `theme_studio`.
- Keep the config flow enabled unless there is a very specific reason to change it.
- Keep the integration HACS-compatible.
- Do not add runtime dependencies unless absolutely necessary.
- Keep:
  - `manifest.json`
  - `services.yaml`
  - `strings.json`
  - translations
  - config flow
  aligned and synchronized.
- Prefer async Home Assistant APIs when inside the event loop.
- Preserve service response behavior for asset install services.
- Do not remove backward-compatible aliases unless all references and tests are updated.

---

# Asset installation rules

Theme Studio installs bundled files from:

```text
custom_components/theme_studio/templates/
```

into Home Assistant `/config` locations such as:

```text
/config/themes/
/config/theme_studio/presets/
/config/theme_studio/user_themes/
/config/www/background/
```

Files of the removed YAML dashboard (`RETIRED_FILES` in `asset_manager.py`)
are renamed to `.bak_YYYYMMDD_HHMMSS` on update, never deleted outright.
Do not reintroduce `/config/packages/` or `/config/lovelace/` assets.

---

# Critical safety rules

## Never overwrite user themes

Protected runtime path:

```text
/config/theme_studio/user_themes/
```

User themes are runtime data and must never be:

- overwritten
- reset
- deleted
- renamed automatically

Built-in presets are managed assets.

User themes are user-owned runtime data.

---

# Preserve backup behavior

Managed bundled files may be updated with backup support.

Preserve:

```text
.bak_YYYYMMDD_HHMMSS
```

style backups unless intentionally refactored everywhere consistently.

---

# Built-in presets vs user themes

Built-in presets:

```text
custom_components/theme_studio/templates/theme_studio/presets/
/config/theme_studio/presets/
```

User themes:

```text
custom_components/theme_studio/templates/theme_studio/user_themes/
/config/theme_studio/user_themes/
```

Rules:

- Built-in presets are read-only from the user perspective.
- User themes are editable and user-owned.
- Never mix preset files and user theme files.
- Never save user themes into the preset folder.
- Never save presets into the user theme folder.
- Do not make presets depend on generated runtime user themes.
- Do not hardcode `auto` decisions into preset JSON when Theme Studio build logic should resolve them dynamically.

---

# Theme logic rules

## Manual overrides must stay manual

Color adjustments should affect:

- auto-generated colors

Manual color overrides must NOT be modified by adjustment logic except intentional opacity handling.

---

# Light/Dark workflow rules

Theme Studio supports separate:

- Light variants
- Dark variants

Rules:

- Saving Light must not overwrite Dark.
- Saving Dark must not overwrite Light.
- Loading a theme in the panel must show each variant's own values.
- Generated themes must preserve Light/Dark separation.

---

# Theme metadata rules

Generated user themes should not include unnecessary Home Assistant root theme internals unless intentionally required.

Avoid automatically injecting:

```yaml
card-mod-theme:
card-mod-root-yaml:
```

into generated user themes unless the export/build architecture explicitly requires it.

Keep:

- runtime dynamic theme metadata
- exported/generated user themes
- built-in presets

separated when possible.

---

# YAML rules

This repository is heavily YAML-based.

Rules:

- Preserve indentation exactly.
- Avoid compact inline YAML mappings when nesting is involved.
- Avoid placeholders.
- Generate complete copy/paste-ready blocks.
- Preserve existing card structure unless intentionally refactoring.
- Do not convert working YAML into pseudo-cleaned YAML that breaks Home Assistant parsing.

---

# Lovelace rules

Theme Studio bundles no dashboard since v1.0.0, but generated themes are used
on users' dashboards with cards such as:

- `custom:button-card`
- `custom:bubble-card`
- `custom:mod-card`
- `custom:navbar-card`

Rules for README examples and theme output:

- Be careful with `card_mod:` nesting.
- Be careful with:
  - `style:`
  - `card_mod: style:`
- Preserve existing dynamic templates unless intentionally refactoring.
- Avoid changing card structure globally unless necessary.

---

# CSS/card-mod rules

Theme Studio uses advanced:

- CSS variables
- card-mod
- Bubble Card styling
- dynamic previews
- live theme rendering

Rules:

- Do not simplify CSS just to make it cleaner.
- Preserve CSS variable fallbacks.
- Preserve dynamic `color-mix()` behavior unless replacing it consistently everywhere.
- Border preview cards must show border effects only.
- Shadow preview cards must show shadow effects only.
- Bubble Card styling may require separate handling from standard Home Assistant cards.
- Do not make global CSS changes that unintentionally affect all dashboard cards.

Navbar styling should use Theme Studio variables where possible:

```css
--theme-studio-navbar-background-color
--theme-studio-navbar-primary-color
```

---

# Theme settings rules

The per-variant settings a theme stores (and the panel edits) are listed in
`custom_components/theme_studio/settings.json`: key, control (`number`,
`text`, `switch`, `select`), label, default and limits.

Since v1.0.0 Theme Studio has no entities. The former editor helpers
(`text.theme_studio_*`, `number.theme_studio_*`, ...) and sensors are removed
from the registries on update by `retirement.py`. Do not add entities back.

Rules:

- When adding a setting:
  - add it to `settings.json`
  - make sure `theme_studio_cli.py` understands it (`SETTING_KEYS`)
  - add it to the panel (`frontend/src/editor-config.ts`) and rebuild the bundle
  - update docs and tests
- When removing a setting:
  - verify nothing still references it; existing user themes may still contain it and must keep loading.

---

# Python rules

- Use modern Python typing compatible with the targeted Home Assistant version.
- Keep code explicit and readable.
- Avoid broad exception handling unless setup resilience is required and the exception is logged.
- Keep file operations safe.
- Do not introduce unnecessary network calls.
- Do not add secrets or user-specific paths.

---

# Testing and validation

When changing code:

Recommended checks:

```bash
python -m pytest
python -m compileall custom_components/theme_studio tests
```

Also validate:

- YAML syntax
- Jinja template validity
- Home Assistant entity names
- service names
- Lovelace nesting
- generated paths
- HACS compatibility

---

# Documentation rules

- Keep README aligned with actual behavior.
- Update README if:
  - install flow changes
  - paths change
  - required cards change
  - generated files change
- Prefer relative GitHub image paths where possible.

---

# Output style for AI-generated changes

When generating changes:

- Prefer complete files.
- Prefer complete copy/paste-ready blocks.
- Include exact file paths.
- Avoid vague instructions.
- Avoid placeholders like `...`
- Mention when Home Assistant VM testing is recommended.

---

# High-risk areas

Be extra careful when modifying:

- `asset_manager.py`
- user theme save/load logic
- preset sync logic
- generated theme builder logic
- Light/Dark save/load flows
- the panel (`frontend/`) and its WebSocket commands
- the dashboard retirement (`retirement.py`, `RETIRED_FILES`)
- card-mod root styling
- Bubble Card border/shadow CSS
- HACS metadata/versioning

---

# Never do these things

- Never overwrite user themes.
- Never merge preset and user theme folders.
- Never remove backup behavior.
- Never change the integration domain.
- Never replace working YAML with pseudo-code.
- Never remove service response support from asset services.
- Never assume Bubble Card styling behaves like standard HA cards.
- Never auto-merge large refactors without review.
