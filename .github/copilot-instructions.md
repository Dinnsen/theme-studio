# GitHub Copilot / Codex Instructions

Repository: Theme Studio
Domain: theme_studio

## Important

This repository is a Home Assistant custom integration combined with large YAML/dashboard assets.

Be conservative with changes.

Do not break existing Home Assistant flows to make code look cleaner.

---

# Core architecture

Theme Studio separates:

- Built-in presets
- User themes
- Generated/exported themes
- Runtime dashboard helpers
- Bundled managed assets

Never mix these concepts.

---

# Critical safety rules

## Never overwrite user themes

Protected runtime path:

```text
/config/theme_studio/user_themes/
```

User themes are runtime data and must never be reset, deleted or overwritten.

---

## Preserve Light/Dark separation

Theme Studio supports separate:

- Light variants
- Dark variants

Rules:

- Saving Light must not overwrite Dark.
- Saving Dark must not overwrite Light.
- Loading a variant must populate the correct helpers.

---

## Manual overrides must stay manual

Color adjustments should affect auto-generated colors only.

Manual color overrides must not be modified by automatic adjustment logic except intentional opacity handling.

---

# YAML rules

The repository contains extensive Lovelace YAML.

Rules:

- Preserve indentation exactly.
- Avoid compact inline YAML mappings when nesting is involved.
- Avoid placeholders.
- Generate complete copy/paste-ready blocks.
- Preserve existing card structure unless intentionally refactoring.

---

# Home Assistant rules

- Keep HACS compatibility.
- Keep manifest/config flow/services/translations aligned.
- Use async Home Assistant patterns where appropriate.
- Preserve service response support.
- Do not introduce unnecessary dependencies.

---

# Dashboard/frontend rules

Theme Studio uses:

- card-mod
- Bubble Card
- button-card
- dynamic CSS variables
- live previews

Frontend CSS behavior differs between card types.

Do not assume styling behaves identically everywhere.

Border previews should only show borders.

Shadow previews should only show shadows.

---

# Important variables

Navbar variables:

```css
--theme-studio-navbar-background-color
--theme-studio-navbar-primary-color
```

Preserve existing variable patterns and fallbacks.

---

# Output style

When generating changes:

- Prefer complete files.
- Prefer exact copy/paste blocks.
- Include exact file paths.
- Avoid pseudo-code.
- Avoid removing working logic unless necessary.

---

# High-risk files

Be extra careful with:

- asset_manager.py
- generated theme scripts
- preset sync logic
- user theme save/load logic
- dashboard YAML
- card-mod root styling

---

# Never do these things

- Never overwrite user themes.
- Never merge preset and user theme folders.
- Never remove backup behavior from managed asset updates.
- Never remove working HA compatibility to simplify code.
- Never auto-merge large refactors without review.
