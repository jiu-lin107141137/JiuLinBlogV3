<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { profile } from '@/data/profile';
import { getCategoryStats, getTagStats, listPosts } from '@/utils/posts';
import type { Locale } from '@/i18n';

const route = useRoute();
const locale = computed(() => route.params.locale as Locale);
const posts = computed(() => listPosts(locale.value));
const tags = computed(() => getTagStats(locale.value));
const categories = computed(() => getCategoryStats(locale.value));
</script>

<template>
  <aside class="profile-panel" aria-label="Profile">
    <img class="profile-avatar" src="/avatar.jpg" alt="JiuLin avatar" />
    <div class="profile-identity">
      <h1>{{ profile.name }}</h1>
      <p>{{ profile.role[locale] }}</p>
    </div>
    <blockquote>{{ profile.quote[locale] }}</blockquote>

    <dl class="profile-stats">
      <div>
        <dt>{{ $t('home.posts') }}</dt>
        <dd>{{ posts.length }}</dd>
      </div>
      <div>
        <dt>{{ $t('home.categories') }}</dt>
        <dd>{{ categories.length }}</dd>
      </div>
      <div>
        <dt>{{ $t('home.tags') }}</dt>
        <dd>{{ tags.length }}</dd>
      </div>
    </dl>

    <section class="profile-section">
      <h2>{{ $t('home.categories') }}</h2>
      <RouterLink
        v-for="category in categories"
        :key="category.name"
        :to="{ name: 'category', params: { locale, category: category.name } }"
        class="stat-row"
      >
        <span>{{ category.name }}</span>
        <span>{{ category.count }}</span>
      </RouterLink>
    </section>

    <section class="profile-section">
      <h2>{{ $t('home.tags') }}</h2>
      <div class="tag-cloud">
        <RouterLink
          v-for="tag in tags"
          :key="tag.name"
          :to="{ name: 'tag', params: { locale, tag: tag.name } }"
          class="tag-pill"
        >
          {{ tag.name }}
          <span>{{ tag.count }}</span>
        </RouterLink>
      </div>
    </section>
  </aside>
</template>
