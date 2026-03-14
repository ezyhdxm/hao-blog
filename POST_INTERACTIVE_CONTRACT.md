# Post Interactive Contract

This document defines how interactive content should be authored in posts.

## Default Pattern

- Prefer reusable include blocks for consistent markup and styling.
- Current default include:
  - `{% include embed-iframe.html src="..." title="..." %}`
- Keep inline HTML/script only for one-off experiments that cannot fit reusable includes.

## Include-First, Inline-Allowed Rule

- Use includes whenever content has a reusable shape (iframe/video/audio/demo shell).
- Use inline fallback when prototyping or writing a highly custom section.
- When using inline fallback, still follow shared CSS classes from the style guide.

## Asset Placement Conventions

- Shared scripts: `assets/javascripts/`
- Shared styles: `_sass/` (compiled through `assets/css/main.scss`)
- Post-specific media:
  - Images: `assets/images/<yyyy_mm_dd_or_topic>/`
  - Audio: `assets/audios/<topic>/`

## Naming Conventions

- Use kebab-case for file names and CSS classes.
- Use page-local IDs only when necessary; prefer classes for style hooks.
- Avoid generic IDs like `playlist` if multiple interactive blocks may appear on one page.

## Progressive Enhancement Rules

- All interactive blocks should show meaningful content without JavaScript when possible.
- Provide a clear fallback link for embedded media.
- Avoid autoplay on page load; require user interaction for audio start.

## Example

```liquid
{% include embed-iframe.html
  src="https://www.youtube.com/embed/x1Pues6F1eg"
  title="Reference performance"
  caption="Example reference video"
%}
```
