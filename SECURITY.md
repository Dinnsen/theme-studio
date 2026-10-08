# Security policy

## Supported versions

Only the latest release of Theme Studio gets fixes.

## Reporting a vulnerability

Please do not open a public issue for a security problem. Report it privately through [GitHub's security advisories](https://github.com/Dinnsen/theme-studio/security/advisories/new) for this repository. You will get an answer as soon as possible, and a fix is released before the details are made public.

## What Theme Studio does that is worth knowing

- The panel's write commands (save, delete, upload, use theme) are for administrators only.
- Uploaded background images are checked by content (PNG, JPEG, WebP or GIF, at most 15 MB), stored under a safe file name and never overwrite another file.
- Files in `/config/www/` can be opened by anyone who knows the address. The panel's *Share* writes nothing there; only the `theme_studio.export_user_theme` service does.
- Theme Studio makes no requests to the internet. The fonts are served by your own Home Assistant.
