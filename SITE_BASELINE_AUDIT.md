# Site Baseline Audit

This document tracks the baseline audit for global assets and layout-level scripts.

## Scope

- Shared includes and layouts: `_includes/head.html`, `_layouts/default.html`, `_layouts/post.html`
- Existing interactive post behavior: `_posts/2021-08-11-jazz-music-notes-1-scale-theory.md`, `assets/javascripts/audioPlayer.js`

## Asset Decisions

### Keep

- `main.css` stylesheet from `assets/css/main.scss` (core site styling)
- `fonts.css` and existing font links (current typography baseline)
- Google Analytics snippet (site owner tracking)
- Header interaction scripts in `_layouts/default.html` (navigation behavior)

### Keep, But Monitor

- Typekit loader snippet in `_includes/head.html`
  - Keep for now to avoid typography regressions.
  - Candidate for future simplification if font stack is consolidated.

### Removed In Step 1

- Global `eruda` debug console injection in `_includes/head.html`
  - Reason: this is a production debug tool and adds overhead/security surface.
- Legacy Facebook SDK injection in `_includes/head.html`
  - Reason: share buttons are currently disabled and this script added global third-party JS.
- Duplicate/legacy MathJax loading pattern
  - Replaced with one MathJax v3 script in `_includes/head.html`.
  - Removed duplicate post-level MathJax include from `_layouts/post.html`.

### Deferred

- Inline table styles in `<head>`
  - Works today; can be moved into SCSS in a later cleanup.
- Mixed font provider strategy
  - Works today; postpone until typography system is intentionally redesigned.

## Result

- Global page head is now leaner and less risky.
- Math rendering has a single source of truth.
- Baseline cleanup is complete without changing site structure or theme design.
