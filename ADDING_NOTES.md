# Adding Notes to the Notes Page

## 1. Add the PDF

Place your PDF file in `assets/notes/`. Use a descriptive filename, e.g.:

```
assets/notes/2024-fall-stat-inference.pdf
```

## 2. Add a card in `notes.markdown`

Copy the template below into the `notes-grid` div in `notes.markdown`, above the closing `</div>` tag. Fill in the date, topic, title, description, and file path.

```html
<div class="note-card">
  <div class="note-card-top">
    <div class="note-card-meta">
      <span class="note-date">Month YYYY</span>
      <span class="note-topic-badge">Topic</span>
    </div>
    <h2 class="note-title">Note Title</h2>
    <p class="note-desc">Short description of what the notes cover.</p>
  </div>
  <div class="note-actions">
    <a class="note-btn note-btn--view"
       href="/hao-blog/assets/notes/your-file.pdf"
       target="_blank" rel="noopener">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
      View PDF
    </a>
    <a class="note-btn note-btn--dl"
       href="/hao-blog/assets/notes/your-file.pdf"
       download>
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
      Download
    </a>
  </div>
</div>
```

The **View PDF** button opens the file in the browser's built-in PDF viewer. The **Download** button is optional — remove it if you only want to offer inline viewing.

## Notes

- The `note-topic-badge` is free-form text. Use whatever label fits: `Statistics`, `Jazz`, `Analysis`, etc.
- Cards are displayed in a responsive grid — they reflow automatically as you add more.
- Keep PDFs reasonably sized. GitHub has a 100 MB per-file limit, and large files will slow page loads. For very large documents, consider compressing the PDF first.
