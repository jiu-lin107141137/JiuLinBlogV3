<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { filterPosts, normalizeTaxonomyTerm } from '@/utils/posts';
import type { BlogPost } from '@/utils/posts';
import type { Locale } from '@/i18n';

const route = useRoute();
const locale = computed(() => route.params.locale as Locale);
const tag = computed(() => (typeof route.params.tag === 'string' ? route.params.tag : undefined));
const category = computed(() =>
  typeof route.params.category === 'string' ? route.params.category : undefined,
);
const posts = computed(() =>
  filterPosts(locale.value, {
    tag: tag.value,
    category: category.value,
  }),
);

const title = computed(() => {
  if (tag.value) return normalizeTaxonomyTerm(tag.value);
  if (category.value) return normalizeTaxonomyTerm(category.value);
  return '';
});
const isFilteredListing = computed(() => Boolean(tag.value || category.value));

const listingDescriptionKey = computed(() => {
  if (tag.value) return 'listing.tagDescription';
  if (category.value) return 'listing.categoryDescription';
  return 'listing.archiveDescription';
});

const relatedTags = computed(() => {
  if (!isFilteredListing.value) return [];

  const currentTag = normalizeTaxonomyTerm(tag.value);
  const counts = new Map<string, number>();

  posts.value.forEach((post) => {
    post.tags.forEach((postTag) => {
      const normalizedTag = normalizeTaxonomyTerm(postTag);
      if (!normalizedTag || normalizedTag === currentTag) return;
      counts.set(postTag, (counts.get(postTag) ?? 0) + 1);
    });
  });

  return [...counts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, locale.value))
    .slice(0, 8);
});

const formatMonth = (date: string) =>
  new Intl.DateTimeFormat(locale.value, {
    month: 'long',
  }).format(new Date(`${date}T00:00:00`));

const formatArchiveDate = (date: string) =>
  new Intl.DateTimeFormat(locale.value, {
    month: 'short',
    day: 'numeric',
  }).format(new Date(`${date}T00:00:00`));

const archiveGroups = computed(() => {
  const years = new Map<string, Map<string, { label: string; posts: BlogPost[] }>>();

  posts.value.forEach((post) => {
    const [year, month] = post.date.split('-');
    const monthKey = `${year}-${month}`;

    if (!years.has(year)) years.set(year, new Map());

    const yearMonths = years.get(year);
    if (!yearMonths) return;

    if (!yearMonths.has(monthKey)) {
      yearMonths.set(monthKey, {
        label: formatMonth(post.date),
        posts: [],
      });
    }

    yearMonths.get(monthKey)?.posts.push(post);
  });

  return [...years.entries()].map(([year, months]) => ({
    year,
    months: [...months.entries()].map(([key, month]) => ({
      key,
      ...month,
    })),
  }));
});
</script>

<template>
  <section class="listing-page page-pad">
    <div class="listing-heading">
      <p class="eyebrow">
        <template v-if="tag">{{ $t('listing.tag') }}</template>
        <template v-else-if="category">{{ $t('listing.category') }}</template>
        <template v-else>{{ $t('listing.archive') }}</template>
      </p>
      <h1>{{ title || $t('listing.archive') }}</h1>
      <p class="listing-summary">
        <span>{{ $t('listing.count', { count: posts.length }) }}</span>
        {{ $t(listingDescriptionKey, { title: title || $t('listing.archive') }) }}
      </p>
    </div>

    <nav v-if="relatedTags.length" class="listing-related" :aria-label="$t('listing.relatedTags')">
      <span>{{ $t('listing.relatedTags') }}</span>
      <RouterLink
        v-for="relatedTag in relatedTags"
        :key="relatedTag.name"
        :to="{ name: 'tag', params: { locale, tag: relatedTag.name } }"
      >
        <span class="related-tag-name">{{ relatedTag.name }}</span>
        <small>{{ relatedTag.count }}</small>
      </RouterLink>
    </nav>

    <div v-if="posts.length" class="archive-groups">
      <section v-for="yearGroup in archiveGroups" :key="yearGroup.year" class="archive-year">
        <h2>{{ yearGroup.year }}</h2>

        <section v-for="monthGroup in yearGroup.months" :key="monthGroup.key" class="archive-month">
          <div class="archive-month-heading">
            <h3>{{ monthGroup.label }}</h3>
            <span>{{ $t('listing.count', { count: monthGroup.posts.length }) }}</span>
          </div>

          <ol class="archive-list">
            <li v-for="post in monthGroup.posts" :key="post.slug">
              <time :datetime="post.date">{{ formatArchiveDate(post.date) }}</time>
              <div>
                <RouterLink class="archive-post-title" :to="{ name: 'post', params: { locale, slug: post.slug } }">
                  {{ post.title }}
                </RouterLink>
                <p>{{ post.description }}</p>
                <div class="archive-post-meta">
                  <span>{{ $t('article.readingTime', { minutes: post.readingMinutes }) }}</span>
                  <RouterLink :to="{ name: 'category', params: { locale, category: post.category } }">
                    {{ post.category }}
                  </RouterLink>
                </div>
                <div class="archive-post-tags">
                  <RouterLink
                    v-for="postTag in post.tags"
                    :key="postTag"
                    :to="{ name: 'tag', params: { locale, tag: postTag } }"
                  >
                    {{ postTag }}
                  </RouterLink>
                </div>
              </div>
            </li>
          </ol>
        </section>
      </section>
    </div>

    <p v-else class="empty-state">{{ $t('home.empty') }}</p>
  </section>
</template>
