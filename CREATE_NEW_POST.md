# How To Create A New Blog Post

This guide is for this Jekyll blog and follows the current conventions in the repo.

## 1) Create the post file

- Location: `_posts/`
- Filename format: `YYYY-MM-DD-title-with-hyphens.md`
- Example: `_posts/2026-03-14-build-a-simple-oscillator.md`

## 2) Add front matter

Use this template at the top of the file:

```yaml
---
layout: post
title: "Your Post Title"
date: 2026-03-14 10:00:00 +0800
tags: music
lang: en
comments: true
---
```

Notes:

- `layout` should be `post`.
- `lang` should be `en` or `zh` so language filtering on the homepage works.
- `tags` can be a single tag or multiple tags.

## 3) Write content with excerpt support

Add `<!--more-->` near the beginning to define homepage excerpt split.

Example:

```md
Intro paragraph...

<!--more-->

Rest of article...
```

## 4) Use standardized links and assets

- Prefer Liquid + `relative_url` for internal links and static assets:
  - `{{ '/assets/images/your-folder/figure.png' | relative_url }}`
  - `{{ '/tag/music' | relative_url }}`
- Do not hardcode `/hao-blog/...` paths in new content.

## 5) Add interactive content (recommended pattern)

- Prefer reusable include blocks:

```liquid
{% include embed-iframe.html
  src="https://www.youtube.com/embed/xxxx"
  title="Demo video"
  caption="Optional caption"
%}
```

- Inline script is allowed for one-off experiments, but keep it minimal and self-contained.
- If JS is required, include fallback text or links for users with JS disabled.

## 6) Add media files

- Images: `assets/images/<topic-or-date>/`
- Audio: `assets/audios/<topic>/`
- Shared scripts: `assets/javascripts/`

Use kebab-case for new filenames where possible.

## 7) Preview before publish

If your local environment has Ruby/Bundler:

```bash
bundle exec jekyll serve
```

Then verify:

- Post appears on homepage and opens correctly.
- Tag links work.
- Mobile layout is readable.
- Interactive blocks and fallback behavior both work.

## 8) Final quality check

Run through `TECH_POST_PUBLISH_CHECKLIST.md` before publishing.
