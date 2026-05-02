import { createI18n } from 'vue-i18n';

export const supportedLocales = ['en', 'zh-TW'] as const;
export type Locale = (typeof supportedLocales)[number];

export const defaultLocale: Locale = 'en';

export const localeLabels: Record<Locale, string> = {
  en: 'English',
  'zh-TW': '繁體中文',
};

export const messages = {
  en: {
    nav: {
      home: 'Home',
      archive: 'Archive',
      tags: 'Tags',
      language: 'Language',
    },
    home: {
      eyebrow: 'Personal notebook',
      title: 'JiuLin Blog',
      intro:
        'Notes on software, side projects, class work, and whatever is worth leaving a trace for future me.',
      latest: 'Latest Articles',
      allPosts: 'All posts',
      search: 'Search articles',
      searchPlaceholder: 'Search title, summary, or tag',
      empty: 'No articles match this filter yet.',
      read: 'Read article',
      posts: 'Articles',
      categories: 'Categories',
      tags: 'Tags',
    },
    article: {
      by: 'By',
      toc: 'On this page',
      related: 'Same category',
      back: 'Back to articles',
      missing: 'Article not found.',
      updated: 'Updated',
      previous: 'Previous',
      next: 'Next',
      readingTime: '{minutes} min read',
    },
    listing: {
      tag: 'Tag',
      category: 'Category',
      archive: 'Archive',
      count: '{count} articles',
      tagDescription: 'Articles tagged with {title}, sorted by newest first.',
      categoryDescription: 'Articles in {title}, with related topics below.',
      archiveDescription: 'All published notes, sorted by newest first.',
      relatedTags: 'Related tags',
    },
    footer: {
      built: 'Built with Vue 3, Markdown, and a small amount of stubborn care.',
    },
  },
  'zh-TW': {
    nav: {
      home: '首頁',
      archive: '文章',
      tags: '標籤',
      language: '語言',
    },
    home: {
      eyebrow: '個人筆記',
      title: 'JiuLin Blog',
      intro: '記錄軟體開發、個人專案、課堂作業，以及值得留給未來自己的想法。',
      latest: '最新文章',
      allPosts: '所有文章',
      search: '搜尋文章',
      searchPlaceholder: '搜尋標題、摘要或標籤',
      empty: '目前沒有符合條件的文章。',
      read: '閱讀文章',
      posts: '文章',
      categories: '分類',
      tags: '標籤',
    },
    article: {
      by: '作者',
      toc: '本頁目錄',
      related: '同分類文章',
      back: '回到文章列表',
      missing: '找不到這篇文章。',
      updated: '更新',
      previous: '上一篇',
      next: '下一篇',
      readingTime: '約 {minutes} 分鐘閱讀',
    },
    listing: {
      tag: '標籤',
      category: '分類',
      archive: '文章彙整',
      count: '{count} 篇文章',
      tagDescription: '所有標記為「{title}」的文章，依最新時間排序。',
      categoryDescription: '「{title}」分類中的文章，並整理相關主題。',
      archiveDescription: '所有已發布文章，依最新時間排序。',
      relatedTags: '相關標籤',
    },
    footer: {
      built: '使用 Vue 3、Markdown，和一點固執的細心打造。',
    },
  },
};

export const isLocale = (value: unknown): value is Locale =>
  typeof value === 'string' && supportedLocales.includes(value as Locale);

export const i18n = createI18n({
  legacy: false,
  locale: defaultLocale,
  fallbackLocale: defaultLocale,
  messages,
});
