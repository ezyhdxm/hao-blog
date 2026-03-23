# Blog Style Guide

This document defines the writing and content conventions for new posts on this blog. It covers voice, structure, mathematics, and the epigraph convention. For technical setup (frontmatter, file naming, asset placement, interactive content), see `CREATE_NEW_POST.md` and `POST_INTERACTIVE_CONTRACT.md`.

---

## Audience

Posts are written for readers with strong quantitative backgrounds — statisticians, mathematicians, and technically sophisticated practitioners. Assume comfort with multivariable calculus, linear algebra, and standard probability notation. Do not explain what a gradient, an expectation, or a matrix transpose is. Do explain every domain-specific concept that is not universally shared across these fields (e.g., GPU memory layout, attention mechanisms, floating-point formats).

---

## Voice and Tone

- **Rigorous and precise.** Every claim should be defensible. Prefer exact statements over hedged ones.
- **Clean prose.** No metaphors, no rhetorical flourishes, no filler phrases ("it is worth noting that", "as we can see", "in other words"). If something is worth noting, note it directly.
- **Impersonal but not cold.** Use "we" sparingly and only when genuinely joint — as in, the reader and writer working through something together. Avoid "I".
- **No humor.** The body text is not the place for wit or irony. The epigraph carries whatever literary weight is needed.
- **British-adjacent spelling.** Use: *optimiser*, *normalisation*, *behaviour*, *colour*, *analyse*. Be consistent within a post.

---

## The Epigraph

Every post opens with an epigraph — a single quotation from modern or contemporary literature. The conventions are strict:

- **Source.** Literary fiction, essays, or poetry. Not technical writing, not aphorisms, not social media. Preferred authors include (but are not limited to) Italo Calvino, Jorge Luis Borges, Thomas Pynchon, Samuel Beckett, W.G. Sebald, Marilynne Robinson, Don DeLillo.
- **Thematic relationship.** The quote should be *adjacent* to the post's subject — evoking the same underlying tension or idea — but not directly about it. The connection is left implicit. A post about memory constraints in GPU training might open with a Borges passage about the impossibility of forgetting; a post about waveform synthesis might open with a Calvino line about weightless atoms.
- **Attribution format.**
  ```
  > Quotation text.
  >
  > — Author Name, *Work Title* (Year)
  ```
- **Never referenced in the body.** The epigraph stands entirely alone. Do not explain it, allude to it, or close the loop on it anywhere in the post. It is not a thesis statement.

---

## Post Structure

### Sections

- Major sections use numbered `##` headers: `## 1. Title`, `## 2. Title`, etc.
- Subsections use unnumbered `###` headers: `### Subsection Title`.
- Separate major sections with a horizontal rule `---`.
- Do not use a table of contents. Posts are meant to be read linearly.

### Section 1 (Opening)

Section 1 should:
1. Start immediately with a concrete motivating example — a number, a calculation, or a specific scenario. No abstract preamble.
2. State the core tension or problem clearly and quantitatively within the first few paragraphs.
3. Close with a one-paragraph roadmap of what the post covers.

### Summary Tables

Use Markdown tables at natural consolidation points — after deriving several related quantities, or before moving to a new topic. Tables should have aligned columns and a clear header row. Example:

```markdown
| Component | Precision | Bytes/param |
|:----------|:----------|------------:|
| Working weights | fp16 | 2 |
| Master weights  | fp32 | 4 |
```

### Closing Section

End with a section that ties together the post's main results and, if appropriate, identifies what remains open or what the natural next question is. Do not name future posts by title. Do not end with motivational language ("now you can...", "the reader is equipped to...").

### References

Use Jekyll footnotes (`[^1]`, `[^2]`, ...) placed inline at the point of citation. The references section appears at the end of the post. Each footnote should include: author(s), year, title in italics, and venue (journal or conference name in full). Example:

```markdown
[^1]: Kingma, D. P., & Ba, J. (2015). Adam: A Method for Stochastic Optimization. *International Conference on Learning Representations (ICLR)*.
```

---

## Mathematics

### Inline vs. Display

- Inline math: `$expression$` — for variables, short expressions, and quantities embedded in prose.
- Display math: `$$ ... $$` on its own line — for equations that are the focus of a sentence or paragraph.

Both delimiters are registered in the MathJax configuration (`head.html`). `$...$` is preferred for inline math; it is cleaner to read and write. It is safe for all technical posts on this blog, which contain no currency symbols or other non-math uses of `$`.

### Notation

- Introduce notation the first time it is used: "Let \\(P\\) denote the number of parameters."
- Be consistent within a post. Do not use \\(n\\) and \\(N\\) interchangeably.
- Use standard conventions: bold lowercase for vectors (\\(\mathbf{v}\\)), uppercase for matrices (\\(W\\)), calligraphic for sets (\\(\mathcal{L}\\)).

### Key Results

Box the most important equations using `\boxed{}`:

```
$$\boxed{dS_{ij} = P_{ij}(dP_{ij} - D_i).}$$
```

### Derivations

Walk through derivations step by step when the steps are non-obvious or when understanding the derivation is part of the point. Skip steps that follow from routine algebra. Label intermediate quantities clearly and refer back to them by name.

---

## What to Avoid

- **Explaining the epigraph.** The body text should be self-contained without it.
- **Poetic or metaphorical prose in the body.** The body is technical writing. Save all literary energy for the epigraph selection.
- **Over-qualifying.** Do not write "it is approximately true that" when you can just state the approximation and note its regime of validity precisely.
- **Bullet-point prose.** Use bullet lists for genuine enumeration (a list of stored tensors, a table of formats). Do not fragment continuous reasoning into bullets.
- **Naming future posts.** Closing remarks may point toward open questions but should not announce sequels by title.
- **Explaining basic statistics or probability.** The audience knows what a gradient, an expectation, a covariance matrix, and a confidence interval are.
