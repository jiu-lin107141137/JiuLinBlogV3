---
title: "[Demo] 重新打造這個部落格"
description: "新個人網站的方向：以 Markdown 寫作、支援本地化路由，並整理成更乾淨的 Vue 3 架構。"
date: "2026-05-01"
tags: ["Vue", "個人專案", "架構", "demo"]
category: "部落格"
---

## 為什麼重做？

舊版部落格其實已經有很棒的核心想法：文章依照語言分開、每篇文章都有標籤，文章頁也有目錄。新版保留這些使用體驗，但把寫作與維護流程變得更直覺。

### 從舊版保留下來的部分

依語言分開內容、標籤、分類，以及文章導覽，仍然是這個版本的一等功能。

### 這次改善的部分

文章索引會直接從 Markdown frontmatter 產生，所以文章檔案本身就是資料來源。

現在每篇文章就是一個帶有 frontmatter 的 Markdown 檔案：

```md
---
title: "我的文章"
description: "用在文章卡片與摘要的短描述。"
date: "2026-05-01"
tags: ["Vue", "Markdown"]
category: "部落格"
---
```

## 這次改了什麼？

網站使用 Vue 3、Vue Router 與 Vue I18n。文章列表不再依賴額外的 JSON 註冊表，而是由 Vite 在建置時讀取所有 Markdown 檔案，再由程式自動整理文章、標籤、分類、相關文章與閱讀時間。

### Markdown 載入

Vite 會在建置時匯入 Markdown 檔案，接著由網站解析 frontmatter 並渲染正文。

### 本地化路由

每個主要頁面都會在網址中包含語言，例如 `/en/archive` 或 `/zh-TW/archive`。

也就是說，文章本身就是唯一的資料來源。少一點手動同步，也少一點忘記更新的機會。

## 寫作流程

英文文章放在 `src/content/en`，繁體中文版本放在 `src/content/zh-TW`，兩邊使用相同檔名。這個檔名會變成文章網址中的 slug。

例如：

- `src/content/en/blog-rebuild.md`
- `src/content/zh-TW/blog-rebuild.md`

文章會出現在 `/en/posts/blog-rebuild` 與 `/zh-TW/posts/blog-rebuild`。
