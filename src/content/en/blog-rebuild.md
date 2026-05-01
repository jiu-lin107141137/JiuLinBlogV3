---
title: "Rebuilding This Blog"
description: "The new direction for my personal page: Markdown-first writing, localized routes, and a cleaner Vue 3 architecture."
date: "2026-05-01"
tags: ["Vue", "Side Project", "Architecture"]
category: "Blog"
---

## Why rebuild?

The previous blog already had the important ideas in place: posts were separated by language, each article had tags, and the article page had a table of contents. This version keeps those ideas, but makes the authoring flow simpler.

### Kept from the old blog

Language-specific content, tags, categories, and article navigation are still first-class features.

### Improved in this version

The content index is generated from Markdown frontmatter, so the article file becomes the source of truth.

Now each post is just a Markdown file with frontmatter:

```md
---
title: "My Article"
description: "A short summary for cards and metadata."
date: "2026-05-01"
tags: ["Vue", "Markdown"]
category: "Blog"
---
```

## What changed?

The site is built around Vue 3, Vue Router, and Vue I18n. Instead of keeping a separate JSON article registry, Vite loads all Markdown files at build time and the app derives article lists, tags, categories, related posts, and reading time from the files themselves.

### Markdown loading

Vite imports the Markdown files during the build, then the app parses frontmatter and renders the body.

### Localized routes

Every main page includes the locale in the URL, like `/en/archive` or `/zh-TW/archive`.

That means the source of truth is the article. Less ceremony, fewer places to forget updating.

## Writing workflow

Add the English article to `src/content/en`, then add the Traditional Chinese version to `src/content/zh-TW` with the same file name. The shared file name becomes the article slug in the URL.

For example:

- `src/content/en/blog-rebuild.md`
- `src/content/zh-TW/blog-rebuild.md`

The article becomes available at `/en/posts/blog-rebuild` and `/zh-TW/posts/blog-rebuild`.
