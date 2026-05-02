<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import PostCard from '@/components/PostCard.vue';
import { filterPosts, normalizeTaxonomyTerm } from '@/utils/posts';
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

const listingDescriptionKey = computed(() => {
  if (tag.value) return 'listing.tagDescription';
  if (category.value) return 'listing.categoryDescription';
  return 'listing.archiveDescription';
});

const relatedTags = computed(() => {
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
        {{ relatedTag.name }}
        <small>{{ relatedTag.count }}</small>
      </RouterLink>
    </nav>

    <div v-if="posts.length" class="post-list compact">
      <PostCard v-for="post in posts" :key="post.slug" :post="post" />
    </div>
    <p v-else class="empty-state">{{ $t('home.empty') }}</p>
  </section>
</template>
