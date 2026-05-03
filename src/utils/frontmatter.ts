export type FrontmatterValue = string | string[] | boolean;
export type Frontmatter = Record<string, FrontmatterValue>;

const frontmatterPattern = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/;

const stripQuotes = (value: string) => value.trim().replace(/^['"]|['"]$/g, '').trim();

const parseValue = (value: string): FrontmatterValue => {
  const trimmed = value.trim();

  if (trimmed === 'true') return true;
  if (trimmed === 'false') return false;
  if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
    return trimmed
      .slice(1, -1)
      .split(',')
      .map((item) => stripQuotes(item))
      .filter(Boolean);
  }

  return stripQuotes(trimmed);
};

export const parseFrontmatter = (raw: string) => {
  const match = raw.match(frontmatterPattern);
  if (!match) return { data: {} as Frontmatter, body: raw.trim() };

  const data = match[1].split(/\r?\n/).reduce<Frontmatter>((frontmatter, line) => {
    const separator = line.indexOf(':');
    if (separator === -1) return frontmatter;

    const key = line.slice(0, separator).trim();
    const value = line.slice(separator + 1).trim();
    if (key) frontmatter[key] = parseValue(value);
    return frontmatter;
  }, {});

  return {
    data,
    body: raw.slice(match[0].length).trim(),
  };
};
