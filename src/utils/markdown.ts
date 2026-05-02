import MarkdownIt from 'markdown-it';

type MarkdownToken = {
  type: string;
  children?: MarkdownToken[] | null;
  attrGet(name: string): string | null;
  attrSet(name: string, value: string): void;
};

export type Heading = {
  id: string;
  level: number;
  text: string;
};

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^\p{Letter}\p{Number}\s-]/gu, '')
    .replace(/\s+/g, '-');

const baseUrl = import.meta.env.BASE_URL;

const withBaseUrl = (src: string) => {
  if (/^(?:[a-z]+:)?\/\//i.test(src) || /^(?:data|blob):/i.test(src) || src.startsWith('#')) return src;
  if (src.startsWith(baseUrl)) return src;

  const cleanBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  const cleanSrc = src.replace(/^\.?\//, '');

  return `${cleanBase}${cleanSrc}`;
};

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const md = new MarkdownIt({
  html: false,
  linkify: true,
  typographer: true,
});

const defaultHeadingOpen =
  md.renderer.rules.heading_open ??
  ((tokens, idx, options, _env, self) => self.renderToken(tokens, idx, options));
const defaultFence =
  md.renderer.rules.fence ??
  ((tokens, idx, options, _env, self) => self.renderToken(tokens, idx, options));
const defaultImage =
  md.renderer.rules.image ??
  ((tokens, idx, options, env, self) => self.renderToken(tokens, idx, options));

md.renderer.rules.heading_open = (tokens, idx, options, env, self) => {
  const token = tokens[idx];
  const nextToken = tokens[idx + 1];
  const text = nextToken?.content ?? '';
  const headingState = env as { headings: Heading[]; headingIds: Map<string, number> };
  const baseId = slugify(text) || `section-${idx}`;
  const idCount = headingState.headingIds.get(baseId) ?? 0;
  const id = idCount ? `${baseId}-${idCount + 1}` : baseId;

  headingState.headingIds.set(baseId, idCount + 1);
  token.attrSet('id', id);
  headingState.headings.push({
    id,
    level: Number(token.tag.slice(1)),
    text,
  });

  return defaultHeadingOpen(tokens, idx, options, env, self);
};

md.renderer.rules.fence = (tokens, idx, options, env, self) => {
  const renderedCode = defaultFence(tokens, idx, options, env, self);

  return `<div class="code-block"><button class="copy-code-button" type="button" aria-label="Copy code">Copy</button>${renderedCode}</div>`;
};

md.renderer.rules.image = (tokens, idx, options, env, self) => {
  const token = tokens[idx];
  const src = token.attrGet('src');
  const alt = token.content;

  if (src) token.attrSet('src', withBaseUrl(src));

  token.attrSet('loading', 'lazy');
  token.attrSet('decoding', 'async');
  token.attrSet('tabindex', '0');
  token.attrSet('role', 'button');

  const renderedImage = defaultImage(tokens, idx, options, env, self);
  const caption = alt.trim()
    ? `<figcaption class="image-caption">${escapeHtml(alt.trim())}</figcaption>`
    : '';

  return `<figure class="article-image">${renderedImage}${caption}</figure>`;
};

const addLinkTargets = (tokens: MarkdownToken[]) => {
  tokens.forEach((token) => {
    if (token.type !== 'link_open') return;

    const href = token.attrGet('href');
    if (!href || href.startsWith('/') || href.startsWith('#')) return;

    token.attrSet('target', '_blank');
    token.attrSet('rel', 'noreferrer');
  });
};

md.core.ruler.after('inline', 'external-links', (state) => {
  state.tokens.forEach((token) => {
    if (token.children) addLinkTargets(token.children);
  });
});

export const renderMarkdown = (source: string) => {
  const env = {
    headings: [] as Heading[],
    headingIds: new Map<string, number>(),
  };

  return {
    html: md.render(source, env),
    headings: env.headings.filter((heading) => heading.level <= 3),
  };
};
