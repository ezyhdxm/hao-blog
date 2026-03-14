# Technical Post Publishing Checklist

Use this checklist before publishing technical posts, especially posts with interactive content.

## Content Quality

- [ ] The post has a clear introduction, core idea, and conclusion.
- [ ] Code, formulas, and diagrams are readable on mobile.
- [ ] External references are cited and links are valid.

## Interactive Block Safety

- [ ] Interactive content works with user gesture (no forced autoplay).
- [ ] The page still makes sense if JavaScript is disabled.
- [ ] Embedded media has fallback links or explanatory text.
- [ ] Third-party scripts are minimized and justified.

## Performance And UX

- [ ] Images and media are reasonably compressed.
- [ ] No unnecessary global scripts were added to `_includes/head.html`.
- [ ] Interactive controls are usable on touch devices.
- [ ] Page scroll and header/nav behavior remain stable.

## Maintainability

- [ ] Reusable include patterns are used when possible.
- [ ] New assets follow naming conventions from `POST_INTERACTIVE_CONTRACT.md`.
- [ ] Any post-specific script is isolated and documented in the post body.

## Final Verification

- [ ] Local site preview renders correctly (`bundle exec jekyll serve`).
- [ ] No obvious console/runtime errors during post interaction.
- [ ] Front matter metadata (`title`, `date`, `tags`, `lang`) is complete.
