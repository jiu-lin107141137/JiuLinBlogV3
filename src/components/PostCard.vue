<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import type { BlogPost } from '@/utils/posts';
import type { Locale } from '@/i18n';

defineProps<{
  post: BlogPost;
}>();

const route = useRoute();
const locale = computed(() => route.params.locale as Locale);

const formatDate = (date: string) =>
  new Intl.DateTimeFormat(locale.value, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(`${date}T00:00:00`));
</script>

<template>
  <article class="post-card">
    <RouterLink class="post-card-title" :to="{ name: 'post', params: { locale, slug: post.slug } }">
      {{ post.title }}
    </RouterLink>
    <p>{{ post.description }}</p>
    <div class="post-meta">
      <time :datetime="post.date">{{ formatDate(post.date) }}</time>
      <RouterLink :to="{ name: 'category', params: { locale, category: post.category } }">
        {{ post.category }}
      </RouterLink>
    </div>
    <div class="post-tags">
      <RouterLink
        v-for="tag in post.tags"
        :key="tag"
        :to="{ name: 'tag', params: { locale, tag } }"
      >
        {{ tag }}
      </RouterLink>
    </div>
  </article>
</template>
