import type { Locale } from '@/i18n';
import { defaultLocale } from '@/i18n';
import { parseFrontmatter } from './frontmatter';

export type BlogPost = {
  slug: string;
  locale: Locale;
  title: string;
  description: string;
  date: string;
  updated?: string;
  tags: string[];
  category: string;
  draft: boolean;
  body: string;
  readingMinutes: number;
};

type RawModuleMap = Record<string, string>;

export const normalizeTaxonomyTerm = (term?: string) =>
  term?.trim().replace(/^["'“”]+|["'“”]+$/g, '');

const modules = import.meta.glob<string>('../content/**/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as RawModuleMap;

const getString = (value: unknown, fallback = '') =>
  typeof value === 'string' ? value : fallback;

const getStringArray = (value: unknown) => {
  if (Array.isArray(value)) return value.filter((item): item is string => typeof item === 'string');
  if (typeof value === 'string') return [value];
  return [];
};

const getSlugParts = (path: string) => {
  const match = path.match(/content\/([^/]+)\/(.+)\.md$/);
  if (!match) return null;

  return {
    locale: match[1] as Locale,
    slug: match[2],
  };
};

const countReadingMinutes = (body: string) => {
  const words = body
    .replace(/```[\s\S]*?```/g, '')
    .replace(/[^\p{Letter}\p{Number}\s]/gu, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;

  const cjkCharacters = body.match(/[\u3400-\u9fff]/g)?.length ?? 0;
  return Math.max(1, Math.ceil(Math.max(words / 220, cjkCharacters / 450)));
};

const posts = Object.entries(modules)
  .map(([path, raw]) => {
    const slugParts = getSlugParts(path);
    if (!slugParts) return null;

    const { data, body } = parseFrontmatter(raw);
    const post: BlogPost = {
      slug: slugParts.slug,
      locale: slugParts.locale,
      title: getString(data.title, slugParts.slug),
      description: getString(data.description),
      date: getString(data.date, '1970-01-01'),
      updated: getString(data.updated) || undefined,
      tags: getStringArray(data.tags),
      category: getString(data.category, 'Notes'),
      draft: data.draft === true,
      body,
      readingMinutes: countReadingMinutes(body),
    };

    return post;
  })
  .filter((post): post is BlogPost => Boolean(post))
  .sort((a, b) => b.date.localeCompare(a.date));

export const listPosts = (locale: Locale) =>
  posts.filter((post) => post.locale === locale && !post.draft);

export const getPost = (locale: Locale, slug: string) =>
  listPosts(locale).find((post) => post.slug === slug) ??
  listPosts(defaultLocale).find((post) => post.slug === slug);

export const getTagStats = (locale: Locale) => {
  const counts = new Map<string, number>();
  listPosts(locale).forEach((post) => {
    post.tags.forEach((tag) => counts.set(tag, (counts.get(tag) ?? 0) + 1));
  });

  return [...counts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => a.name.localeCompare(b.name, locale));
};

export const getCategoryStats = (locale: Locale) => {
  const counts = new Map<string, number>();
  listPosts(locale).forEach((post) => {
    counts.set(post.category, (counts.get(post.category) ?? 0) + 1);
  });

  return [...counts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => a.name.localeCompare(b.name, locale));
};

const pickTopVote = (votes: Map<string, number>) =>
  [...votes.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))[0]?.[0];

export const translateTag = (sourceLocale: Locale, targetLocale: Locale, tag?: string) => {
  const sourceTag = normalizeTaxonomyTerm(tag);
  if (!sourceTag) return tag;

  const targetPosts = listPosts(targetLocale);
  const votes = new Map<string, number>();

  listPosts(sourceLocale)
    .filter((post) => post.tags.some((postTag) => normalizeTaxonomyTerm(postTag) === sourceTag))
    .forEach((sourcePost) => {
      const tagIndex = sourcePost.tags.findIndex((postTag) => normalizeTaxonomyTerm(postTag) === sourceTag);
      const targetPost = targetPosts.find((post) => post.slug === sourcePost.slug);
      const targetTag = targetPost?.tags[tagIndex];

      if (targetTag) {
        votes.set(targetTag, (votes.get(targetTag) ?? 0) + 1);
      }
    });

  return pickTopVote(votes) ?? sourceTag;
};

export const translateCategory = (sourceLocale: Locale, targetLocale: Locale, category?: string) => {
  const sourceCategory = normalizeTaxonomyTerm(category);
  if (!sourceCategory) return category;

  const targetPosts = listPosts(targetLocale);
  const votes = new Map<string, number>();

  listPosts(sourceLocale)
    .filter((post) => normalizeTaxonomyTerm(post.category) === sourceCategory)
    .forEach((sourcePost) => {
      const targetCategory = targetPosts.find((post) => post.slug === sourcePost.slug)?.category;

      if (targetCategory) {
        votes.set(targetCategory, (votes.get(targetCategory) ?? 0) + 1);
      }
    });

  return pickTopVote(votes) ?? sourceCategory;
};

export const filterPosts = (locale: Locale, options: { tag?: string; category?: string; query?: string }) => {
  const query = options.query?.trim().toLocaleLowerCase(locale);
  const tag = normalizeTaxonomyTerm(options.tag);
  const category = normalizeTaxonomyTerm(options.category);

  return listPosts(locale).filter((post) => {
    const matchesTag = tag ? post.tags.some((postTag) => normalizeTaxonomyTerm(postTag) === tag) : true;
    const matchesCategory = category ? normalizeTaxonomyTerm(post.category) === category : true;
    const matchesQuery = query
      ? [post.title, post.description, post.category, ...post.tags]
          .join(' ')
          .toLocaleLowerCase(locale)
          .includes(query)
      : true;

    return matchesTag && matchesCategory && matchesQuery;
  });
};
