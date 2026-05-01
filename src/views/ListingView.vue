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
    </div>

    <div v-if="posts.length" class="post-list compact">
      <PostCard v-for="post in posts" :key="post.slug" :post="post" />
    </div>
    <p v-else class="empty-state">{{ $t('home.empty') }}</p>
  </section>
</template>
