# JiuLin Blog V3

A Vue 3 personal blog for writing posts in Markdown, with English and Traditional Chinese routes, automatic tag/category indexes, article table of contents, and a particle-style background.

## Tech Stack

- Vue 3
- Vite
- TypeScript
- Vue Router
- Vue I18n
- Markdown-it
- tsParticles

## Environment

Use `nvm` before installing dependencies.

```sh
nvm install 18.20.8
nvm use
```

Then install and run:

```sh
npm install
npm run dev
```

Production build:

```sh
npm run build
```

Preview the build:

```sh
npm run preview
```

## Project Architecture

```txt
.
├─ public/
│  ├─ avatar.jpg
│  ├─ cover.jpg
│  └─ favicon.svg
├─ src/
│  ├─ assets/
│  │  └─ main.css
│  ├─ components/
│  │  ├─ ArticleToc.vue
│  │  ├─ ParticlesBackground.vue
│  │  ├─ PostCard.vue
│  │  ├─ ProfilePanel.vue
│  │  └─ SiteHeader.vue
│  ├─ content/
│  │  ├─ en/
│  │  └─ zh-TW/
│  ├─ data/
│  │  └─ profile.ts
│  ├─ i18n/
│  │  └─ index.ts
│  ├─ router/
│  │  └─ index.ts
│  ├─ utils/
│  │  ├─ frontmatter.ts
│  │  ├─ markdown.ts
│  │  └─ posts.ts
│  ├─ views/
│  │  ├─ ArticleView.vue
│  │  ├─ HomeView.vue
│  │  └─ ListingView.vue
│  ├─ App.vue
│  ├─ AppShell.vue
│  └─ main.ts
├─ .nvmrc
├─ package.json
└─ vite.config.ts
```

## Website Architecture

The app is a static Vite SPA.

- `main.ts` creates the Vue app, registers router, i18n, and tsParticles.
- `App.vue` syncs the current route locale into Vue I18n.
- `AppShell.vue` owns the shared layout: particle background, header, page content, footer.
- `router/index.ts` defines locale-prefixed routes.
- `utils/posts.ts` loads every Markdown file with `import.meta.glob`.
- `utils/frontmatter.ts` parses each Markdown file's metadata.
- `utils/markdown.ts` renders Markdown and extracts headings for the article TOC.

## Routes

All public pages are locale-prefixed:

```txt
/en
/zh-TW
/en/archive
/zh-TW/archive
/en/posts/:slug
/zh-TW/posts/:slug
/en/tags/:tag
/zh-TW/tags/:tag
/en/categories/:category
/zh-TW/categories/:category
```

The root route `/` redirects to a preferred locale from local storage or browser language.

## Content Model

Posts live in `src/content`.

Use the same file name for translated versions:

```txt
src/content/en/my-post.md
src/content/zh-TW/my-post.md
```

The file name becomes the slug:

```txt
/en/posts/my-post
/zh-TW/posts/my-post
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

## Tags and Categories

Tags and categories are generated automatically from Markdown frontmatter.

You do not need to maintain a separate tag config file. If a new article uses a new tag, the homepage/profile tag list and tag counts update automatically.

Example:

```md
tags: ["Vue", "Router", "Architecture"]
category: "Blog"
```

Categories are broad groups. Tags are more specific labels.

When switching languages on tag/category pages, the app maps localized terms by matching translated posts with the same slug. For example, `架構` can map to `Architecture`.

## Homepage

The homepage contains:

- hero section
- profile panel
- article/category/tag counts
- generated tag summary
- search box
- latest article cards

Only the latest four matching posts are shown on the homepage. If the blog grows to hundreds of posts, the homepage remains short. Archive, tag, and category pages currently show all matching posts.

## Article Page

The article page contains:

- article category
- title
- description
- author/date metadata
- tags
- rendered Markdown body
- left category navigation
- right table of contents

The table of contents is generated from Markdown headings and highlights the current section while scrolling.

## I18n

UI translations are stored in `src/i18n/index.ts`.

Supported locales:

- `en`
- `zh-TW`

Article translations are stored as separate Markdown files under `src/content/en` and `src/content/zh-TW`.

## Styling

Global styling lives in `src/assets/main.css`.

The visual system uses:

- dark surfaces
- purple accent color
- restrained card borders
- particle background
- responsive layouts
- reduced-motion fallback for animations

Shared UI pieces are implemented as Vue components in `src/components`.

## Static Assets

Static files live in `public`.

- `avatar.jpg`: profile image
- `cover.jpg`: page background image
- `favicon.svg`: browser tab icon

Files in `public` are served from the site root.

## Deployment

Build the project:

```sh
npm run build
```

Deploy the generated `dist` folder to any static hosting provider.

If deploying under a subpath, update `base` in `vite.config.ts`.
