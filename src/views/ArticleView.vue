<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import ArticleToc from '@/components/ArticleToc.vue';
import { getPost, listPosts } from '@/utils/posts';
import { renderMarkdown } from '@/utils/markdown';
import type { Locale } from '@/i18n';

const route = useRoute();
const locale = computed(() => route.params.locale as Locale);
const slug = computed(() => String(route.params.slug));
const post = computed(() => getPost(locale.value, slug.value));
const rendered = computed(() => renderMarkdown(post.value?.body ?? ''));
const activeHeadingId = ref('');

const updateActiveHeading = () => {
  const headings = rendered.value.headings;
  if (!headings.length) {
    activeHeadingId.value = '';
    return;
  }

  const readingLine = 112;
  const currentHeading =
    headings
      .map((heading) => ({
        ...heading,
        top: document.getElementById(heading.id)?.getBoundingClientRect().top ?? Number.POSITIVE_INFINITY,
      }))
      .filter((heading) => heading.top <= readingLine)
      .at(-1) ?? headings[0];

  activeHeadingId.value = currentHeading.id;
};

const categoryPosts = computed(() => {
  if (!post.value) return [];
  return listPosts(locale.value)
    .filter((candidate) => candidate.category === post.value?.category)
    .slice(0, 6);
});

const formatDate = (date?: string) => {
  if (!date) return '';

  return new Intl.DateTimeFormat(locale.value, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(`${date}T00:00:00`));
};

onMounted(() => {
  window.addEventListener('scroll', updateActiveHeading, { passive: true });
  window.addEventListener('resize', updateActiveHeading);
});

onUnmounted(() => {
  window.removeEventListener('scroll', updateActiveHeading);
  window.removeEventListener('resize', updateActiveHeading);
});

watch(
  () => rendered.value.html,
  async () => {
    await nextTick();
    updateActiveHeading();
  },
  { immediate: true },
);
</script>

<template>
  <section v-if="post" class="article-page page-pad">
    <aside class="article-related">
      <RouterLink class="back-link" :to="{ name: 'archive', params: { locale } }">
        {{ $t('article.back') }}
      </RouterLink>
      <h2>{{ $t('article.related') }}</h2>
      <RouterLink
        class="category-link"
        :to="{ name: 'category', params: { locale, category: post.category } }"
      >
        {{ post.category }}
      </RouterLink>
      <RouterLink
        v-for="categoryPost in categoryPosts"
        :key="categoryPost.slug"
        class="category-post-link"
        :class="{ active: categoryPost.slug === post.slug }"
        :to="{ name: 'post', params: { locale, slug: categoryPost.slug } }"
      >
        {{ categoryPost.title }}
      </RouterLink>
    </aside>

    <article class="article-body">
      <header class="article-header">
        <p class="eyebrow">{{ post.category }}</p>
        <h1>{{ post.title }}</h1>
        <p>{{ post.description }}</p>
        <div class="article-meta">
          <span>{{ $t('article.by') }} JiuLin</span>
          <time :datetime="post.date">{{ formatDate(post.date) }}</time>
          <span v-if="post.updated">{{ $t('article.updated') }} {{ formatDate(post.updated) }}</span>
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
      </header>

      <div class="markdown-body" v-html="rendered.html"></div>
    </article>

    <ArticleToc :headings="rendered.headings" :active-heading-id="activeHeadingId" />
  </section>

  <section v-else class="listing-page page-pad">
    <div class="listing-heading">
      <p class="eyebrow">404</p>
      <h1>{{ $t('article.missing') }}</h1>
    </div>
    <RouterLink class="back-link" :to="{ name: 'archive', params: { locale } }">
      {{ $t('article.back') }}
    </RouterLink>
  </section>
</template>
