---
title: "Vue Routing Notes"
description: "A short companion note showing how localized routes shape the blog navigation."
date: "2026-04-30"
tags: ["Vue", "Router", "Architecture"]
category: "Blog"
---

## Route shape

The blog keeps the active language in the URL. That makes links explicit and keeps each article easy to share.

### Examples

- `/en/archive`
- `/zh-TW/archive`
- `/en/posts/blog-rebuild`

## Category navigation

The article page uses the current post category to build the left-side list. When you are reading an article in the `Blog` category, the sidebar shows other `Blog` posts and highlights the current one.

### Why it helps

It gives nearby context without forcing every article into a long global archive.
