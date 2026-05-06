# JiuLin Blog V3

A Vue 3 personal blog for Markdown-first writing, bilingual English and Traditional Chinese routes, automatic archive/tag/category pages, article reading tools, and GitHub Pages deployment.

Live site:

```txt
https://jiu-lin107141137.github.io/JiuLinBlogV3/
```

## Features

- Markdown posts with frontmatter
- English and Traditional Chinese content routes
- Automatic archive, tag, and category pages
- Year/month grouped listing pages with compact article rows
- Related tags with count badges on filtered listing pages
- Homepage search across titles, summaries, categories, and tags
- Profile panel with generated post, category, and tag counts
- Localized language switcher
- Light and dark theme toggle
- Responsive collapsible header
- Article table of contents with active-section highlighting
- Reading progress bar
- Estimated reading time in article headers and post cards
- Copy buttons for fenced code blocks
- Article image captions from Markdown alt text
- Image lightbox with previous/next navigation
- Same-category previous/next article navigation
- Back-to-top button
- Particle-style background

## Tech Stack

- Vue 3
- Vite
- TypeScript
- Vue Router
- Vue I18n
- Markdown-it
- tsParticles

## Setup

Use Node `18.20.8`. With `nvm`:

```sh
nvm install 18.20.8
nvm use
```

Install dependencies:

```sh
npm install
```

Start the dev server:

```sh
npm run dev
```

Build for production:

```sh
npm run build
```

Preview the production build:

```sh
npm run preview
```

Type-check only:

```sh
npm run typecheck
```

## Project Structure

```txt
.
|-- public/
|   |-- avatar.jpg
|   |-- cover.jpg
|   |-- favicon.ico
|   `-- favicon.svg
|-- src/
|   |-- assets/
|   |   `-- main.css
|   |-- components/
|   |   |-- ArticleToc.vue
|   |   |-- BackToTopButton.vue
|   |   |-- ImageLightbox.vue
|   |   |-- ParticlesBackground.vue
|   |   |-- PostCard.vue
|   |   |-- ProfilePanel.vue
|   |   `-- SiteHeader.vue
|   |-- content/
|   |   |-- en/
|   |   `-- zh-TW/
|   |-- data/
|   |   `-- profile.ts
|   |-- i18n/
|   |   `-- index.ts
|   |-- router/
|   |   `-- index.ts
|   |-- utils/
|   |   |-- frontmatter.ts
|   |   |-- markdown.ts
|   |   `-- posts.ts
|   |-- views/
|   |   |-- ArticleView.vue
|   |   |-- HomeView.vue
|   |   `-- ListingView.vue
|   |-- App.vue
|   |-- AppShell.vue
|   |-- env.d.ts
|   `-- main.ts
|-- .github/workflows/deploy.yml
|-- .nvmrc
|-- package.json
`-- vite.config.ts
```

## App Architecture

The app is a static Vite SPA.

- `src/main.ts` creates the Vue app and registers router, i18n, and tsParticles.
- `src/App.vue` syncs the route locale into Vue I18n and local storage.
- `src/AppShell.vue` owns the shared page shell: background, header, main content, footer, and back-to-top button.
- `src/views/HomeView.vue` renders the hero, profile panel, search field, featured tags, and latest post cards.
- `src/views/ListingView.vue` renders archive, tag, and category listings with related tag chips.
- `src/views/ArticleView.vue` renders articles, reading progress, same-category links, image lightbox state, and adjacent post navigation.
- `src/router/index.ts` defines hash-based, locale-prefixed routes.
- `src/utils/posts.ts` loads Markdown files with `import.meta.glob`, parses metadata, and computes reading time.
- `src/utils/frontmatter.ts` parses frontmatter.
- `src/utils/markdown.ts` renders Markdown, extracts headings, adds code-copy wrappers, resolves image paths, and renders image captions.

## Routes

All public content routes are locale-prefixed:

```txt
/#/en
/#/zh-TW
/#/en/archive
/#/zh-TW/archive
/#/en/posts/:slug
/#/zh-TW/posts/:slug
/#/en/tags/:tag
/#/zh-TW/tags/:tag
/#/en/categories/:category
/#/zh-TW/categories/:category
```

The root route redirects to the saved locale, or to a locale inferred from the browser language.

## Content Model

Posts live in `src/content`.

Use the same file name for translated versions:

```txt
src/content/en/my-post.md
src/content/zh-TW/my-post.md
```

The file name becomes the article slug:

```txt
/#/en/posts/my-post
/#/zh-TW/posts/my-post
```

Each post uses frontmatter:

```md
---
title: "My Post"
description: "Short summary for article cards and headers."
date: "2026-05-01"
updated: "2026-05-02"
tags: ["Vue", "Markdown"]
category: "Blog"
draft: false
---

## Write here
```

Required fields:

- `title`
- `description`
- `date`
- `tags`
- `category`

Optional fields:

- `updated`
- `draft`

Draft posts are excluded from public lists when `draft: true`.

## Markdown Images

Markdown image alt text is rendered as a visible caption under the article image:

```md
![Caption shown below the image](cover.jpg)
```

Images can be clicked to open the lightbox. The lightbox supports:

- close button
- backdrop click
- `Escape`
- previous/next buttons
- `ArrowLeft` and `ArrowRight`

Local public images should usually be referenced by file name, for example `cover.jpg`. The Markdown renderer resolves them with `import.meta.env.BASE_URL`, so they work under the GitHub Pages subpath.

## Reading Time

Reading time is computed in `src/utils/posts.ts`.

- Code blocks are ignored.
- Non-CJK text is estimated at about 220 words per minute.
- CJK text is estimated at about 450 characters per minute.
- The displayed value is at least 1 minute.

The estimate appears in article headers and post cards.

## Tags And Categories

Tags and categories are generated from Markdown frontmatter.

You do not need a separate tag config file. New tags and categories appear automatically in article lists, profile stats, archives, and filters.

The profile panel shows generated category and tag counts. Filtered listing pages also show related tags with compact count badges, derived from the posts currently visible on the page.

When switching languages on tag/category pages, the app maps localized terms by matching translated posts with the same slug.

## Listing Pages

Archive, tag, and category pages share the same grouped listing template.

- Posts are grouped by year and month.
- Each article is shown as a compact row for fast scanning.
- Rows show date, title, description, reading time, category, and tags.
- Tag and category pages keep their contextual heading and related tags above the grouped list.

Related tags are derived from the posts currently shown on the page. For example, a tag page counts the other tags that appear on posts with that tag, then shows the most common related tags first. The count badge stays visually stable while the surrounding chip provides hover and focus feedback.

## Styling

Global styling lives in `src/assets/main.css`.

The visual system includes:

- light and dark themes
- translucent panels
- purple accent color
- restrained card borders
- responsive layouts
- animation polish
- reduced-motion fallbacks

Shared UI pieces live in `src/components`.

## Static Assets

Static files live in `public`.

- `avatar.jpg`: profile image
- `cover.jpg`: page background and demo image
- `favicon.ico`: browser tab icon
- `favicon.svg`: browser tab icon

## Deployment

The project deploys to GitHub Pages through `.github/workflows/deploy.yml`.

The workflow runs on pushes to `main`:

1. Install dependencies with `npm ci`
2. Build with `npm run build`
3. Copy `dist/index.html` to `dist/404.html` for SPA fallback
4. Deploy the `dist` folder to GitHub Pages

The Vite base path is configured in `vite.config.ts`:

```ts
base: '/JiuLinBlogV3/',
```

If the repository name or deployment path changes, update this value.
