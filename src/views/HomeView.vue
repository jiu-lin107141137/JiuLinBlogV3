<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import PostCard from '@/components/PostCard.vue';
import ProfilePanel from '@/components/ProfilePanel.vue';
import { filterPosts, getTagStats } from '@/utils/posts';
import type { Locale } from '@/i18n';

const route = useRoute();
const query = ref('');
const locale = computed(() => route.params.locale as Locale);
const posts = computed(() => filterPosts(locale.value, { query: query.value }));
const latestPosts = computed(() => posts.value.slice(0, 4));
const tags = computed(() => getTagStats(locale.value).slice(0, 10));
</script>

<template>
  <section class="home-hero">
    <div class="home-hero-content">
      <p class="eyebrow">{{ $t('home.eyebrow') }}</p>
      <h1>{{ $t('home.title') }}</h1>
      <p>{{ $t('home.intro') }}</p>
      <div class="hero-actions">
        <RouterLink :to="{ name: 'archive', params: { locale } }">
          {{ $t('home.allPosts') }}
        </RouterLink>
      </div>
    </div>
  </section>

  <div class="home-layout page-pad">
    <ProfilePanel />

    <section class="content-column">
      <div class="section-heading">
        <div>
          <p class="eyebrow">{{ posts.length }} {{ $t('home.posts') }}</p>
          <h2>{{ $t('home.latest') }}</h2>
        </div>
        <label class="search-box">
          <span>{{ $t('home.search') }}</span>
          <input v-model="query" type="search" :placeholder="$t('home.searchPlaceholder')" />
        </label>
      </div>

      <div class="featured-tags" aria-label="Featured tags">
        <RouterLink
          v-for="tag in tags"
          :key="tag.name"
          :to="{ name: 'tag', params: { locale, tag: tag.name } }"
        >
          {{ tag.name }}
        </RouterLink>
      </div>

      <div v-if="latestPosts.length" class="post-list">
        <PostCard v-for="post in latestPosts" :key="post.slug" :post="post" />
      </div>
      <p v-else class="empty-state">{{ $t('home.empty') }}</p>
    </section>
  </div>
</template>
