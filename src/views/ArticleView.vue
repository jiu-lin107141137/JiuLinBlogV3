<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch, type CSSProperties } from 'vue';
import { useRoute } from 'vue-router';
import ImageLightbox from '@/components/ImageLightbox.vue';
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
const articleBody = ref<HTMLElement | null>(null);
const readingProgress = ref(0);
const articleImages = ref<{ src: string; alt: string }[]>([]);
const lightboxImageIndex = ref<number | null>(null);
const readingProgressStyle = computed<CSSProperties>(() => ({
  transform: `scaleX(${readingProgress.value})`,
}));
const lightboxImage = computed(() =>
  lightboxImageIndex.value === null ? null : articleImages.value[lightboxImageIndex.value],
);

const clampProgress = (value: number) => Math.min(Math.max(value, 0), 1);

const updateReadingProgress = () => {
  const article = articleBody.value;
  if (!article) {
    readingProgress.value = 0;
    return;
  }

  const rect = article.getBoundingClientRect();
  const scrollTop = window.scrollY;
  const articleTop = rect.top + scrollTop;
  const readingOffset = 112;
  const start = articleTop - readingOffset;
  const end = articleTop + article.scrollHeight - window.innerHeight + readingOffset;

  if (end <= start) {
    readingProgress.value = scrollTop >= start ? 1 : 0;
    return;
  }

  readingProgress.value = clampProgress((scrollTop - start) / (end - start));
};

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

const updateArticleScrollState = () => {
  updateActiveHeading();
  updateReadingProgress();
};

const categoryPosts = computed(() => {
  if (!post.value) return [];
  return listPosts(locale.value)
    .filter((candidate) => candidate.category === post.value?.category)
    .slice(0, 6);
});
const adjacentPosts = computed(() => {
  if (!post.value) return { previous: undefined, next: undefined };

  const posts = listPosts(locale.value).filter((candidate) => candidate.category === post.value?.category);
  const postIndex = posts.findIndex((candidate) => candidate.slug === post.value?.slug);

  return {
    previous: postIndex > 0 ? posts[postIndex - 1] : undefined,
    next: postIndex >= 0 ? posts[postIndex + 1] : undefined,
  };
});

const formatDate = (date?: string) => {
  if (!date) return '';

  return new Intl.DateTimeFormat(locale.value, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(`${date}T00:00:00`));
};

const writeClipboardText = async (text: string) => {
  if (window.navigator.clipboard) {
    await window.navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.top = '-9999px';
  document.body.append(textarea);
  textarea.select();
  document.execCommand('copy');
  textarea.remove();
};

const copyCode = async (event: MouseEvent) => {
  const target = event.target;
  if (!(target instanceof Element)) return;

  const button = target.closest<HTMLButtonElement>('.copy-code-button');
  if (!button) return;

  const code = button.closest('.code-block')?.querySelector('code')?.textContent;
  if (!code) return;

  await writeClipboardText(code);
  button.textContent = 'Copied';
  button.classList.add('copied');

  window.setTimeout(() => {
    button.textContent = 'Copy';
    button.classList.remove('copied');
  }, 1400);
};

const getMarkdownImages = () =>
  [...(articleBody.value?.querySelectorAll<HTMLImageElement>('.markdown-body img') ?? [])];

const updateArticleImages = () => {
  articleImages.value = getMarkdownImages().map((image) => ({
    src: image.currentSrc || image.src,
    alt: image.alt,
  }));

  if (lightboxImageIndex.value !== null && !articleImages.value[lightboxImageIndex.value]) {
    lightboxImageIndex.value = null;
  }
};

const openImageLightbox = (image: HTMLImageElement) => {
  updateArticleImages();

  const imageIndex = getMarkdownImages().findIndex((candidate) => candidate === image);
  lightboxImageIndex.value = imageIndex >= 0 ? imageIndex : 0;
};

const closeImageLightbox = () => {
  lightboxImageIndex.value = null;
};

const showPreviousImage = () => {
  if (lightboxImageIndex.value === null || articleImages.value.length < 2) return;
  lightboxImageIndex.value =
    (lightboxImageIndex.value - 1 + articleImages.value.length) % articleImages.value.length;
};

const showNextImage = () => {
  if (lightboxImageIndex.value === null || articleImages.value.length < 2) return;
  lightboxImageIndex.value = (lightboxImageIndex.value + 1) % articleImages.value.length;
};

const handleMarkdownClick = async (event: MouseEvent) => {
  const target = event.target;
  if (!(target instanceof Element)) return;

  const image = target.closest<HTMLImageElement>('.markdown-body img');
  if (image) {
    openImageLightbox(image);
    return;
  }

  await copyCode(event);
};

const handleMarkdownKeydown = (event: KeyboardEvent) => {
  if (event.key !== 'Enter' && event.key !== ' ') return;
  const target = event.target;
  if (!(target instanceof HTMLImageElement)) return;

  event.preventDefault();
  openImageLightbox(target);
};

const handleWindowKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') closeImageLightbox();
  if (!lightboxImage.value) return;

  if (event.key === 'ArrowLeft') {
    event.preventDefault();
    showPreviousImage();
  }

  if (event.key === 'ArrowRight') {
    event.preventDefault();
    showNextImage();
  }
};

onMounted(() => {
  window.addEventListener('scroll', updateArticleScrollState, { passive: true });
  window.addEventListener('resize', updateArticleScrollState);
  window.addEventListener('keydown', handleWindowKeydown);
});

onUnmounted(() => {
  window.removeEventListener('scroll', updateArticleScrollState);
  window.removeEventListener('resize', updateArticleScrollState);
  window.removeEventListener('keydown', handleWindowKeydown);
});

watch(
  () => rendered.value.html,
  async () => {
    await nextTick();
    updateArticleScrollState();
    updateArticleImages();
  },
  { immediate: true },
);
</script>

<template>
  <div v-if="post" class="reading-progress" aria-hidden="true">
    <span :style="readingProgressStyle"></span>
  </div>

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

    <article ref="articleBody" class="article-body">
      <header class="article-header">
        <p class="eyebrow">{{ post.category }}</p>
        <h1>{{ post.title }}</h1>
        <p>{{ post.description }}</p>
        <div class="article-meta">
          <span>{{ $t('article.by') }} JiuLin</span>
          <time :datetime="post.date">{{ formatDate(post.date) }}</time>
          <span>{{ $t('article.readingTime', { minutes: post.readingMinutes }) }}</span>
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

      <div class="markdown-body" @click="handleMarkdownClick" @keydown="handleMarkdownKeydown" v-html="rendered.html"></div>

      <nav
        v-if="adjacentPosts.previous || adjacentPosts.next"
        class="article-adjacent"
        aria-label="Adjacent articles"
      >
        <RouterLink
          v-if="adjacentPosts.previous"
          class="adjacent-link previous"
          :to="{ name: 'post', params: { locale, slug: adjacentPosts.previous.slug } }"
        >
          <svg class="adjacent-icon" viewBox="0 0 24 24" focusable="false" aria-hidden="true">
            <path d="M19 12H5" />
            <path d="M12 5l-7 7 7 7" />
          </svg>
          <span>{{ $t('article.previous') }}</span>
          <strong>{{ adjacentPosts.previous.title }}</strong>
          <time :datetime="adjacentPosts.previous.date">{{ formatDate(adjacentPosts.previous.date) }}</time>
        </RouterLink>
        <span v-else></span>

        <RouterLink
          v-if="adjacentPosts.next"
          class="adjacent-link next"
          :to="{ name: 'post', params: { locale, slug: adjacentPosts.next.slug } }"
        >
          <svg class="adjacent-icon" viewBox="0 0 24 24" focusable="false" aria-hidden="true">
            <path d="M5 12h14" />
            <path d="M12 5l7 7-7 7" />
          </svg>
          <span>{{ $t('article.next') }}</span>
          <strong>{{ adjacentPosts.next.title }}</strong>
          <time :datetime="adjacentPosts.next.date">{{ formatDate(adjacentPosts.next.date) }}</time>
        </RouterLink>
      </nav>
    </article>

    <ArticleToc :headings="rendered.headings" :active-heading-id="activeHeadingId" />
  </section>

  <ImageLightbox
    v-if="lightboxImage"
    :src="lightboxImage.src"
    :alt="lightboxImage.alt"
    :index="lightboxImageIndex ?? 0"
    :total="articleImages.length"
    @close="closeImageLightbox"
    @previous="showPreviousImage"
    @next="showNextImage"
  />

  <section v-if="!post" class="listing-page page-pad">
    <div class="listing-heading">
      <p class="eyebrow">404</p>
      <h1>{{ $t('article.missing') }}</h1>
    </div>
    <RouterLink class="back-link" :to="{ name: 'archive', params: { locale } }">
      {{ $t('article.back') }}
    </RouterLink>
  </section>
</template>
