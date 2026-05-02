<script setup lang="ts">
import { computed, type CSSProperties } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import type { RouteParamsRawGeneric } from 'vue-router';
import { localeLabels, supportedLocales, type Locale } from '@/i18n';
import { translateCategory, translateTag } from '@/utils/posts';

const route = useRoute();
const router = useRouter();

const currentLocale = computed(() => route.params.locale as Locale);
const activeLocaleIndex = computed(() => supportedLocales.indexOf(currentLocale.value));
const localeSwitcherStyle = computed<CSSProperties>(() => ({
  '--active-index': String(Math.max(activeLocaleIndex.value, 0)),
  '--locale-count': String(supportedLocales.length),
}));

const switchLocale = async (locale: Locale) => {
  const params: RouteParamsRawGeneric = {
    ...route.params,
    locale,
  };

  if (route.name === 'tag' && typeof route.params.tag === 'string') {
    params.tag = translateTag(currentLocale.value, locale, route.params.tag);
  }

  if (route.name === 'category' && typeof route.params.category === 'string') {
    params.category = translateCategory(currentLocale.value, locale, route.params.category);
  }

  await router.push({
    name: route.name ?? 'home',
    params,
    query: route.query,
    hash: route.hash,
  });
};
</script>

<template>
  <header class="site-header">
    <RouterLink class="brand" :to="{ name: 'home', params: { locale: currentLocale } }">
      <span class="brand-mark" aria-hidden="true">
        <svg viewBox="0 0 24 24" focusable="false">
          <path d="M4 19L19 4" />
          <path d="M4 13L13 4" />
          <path d="M11 20L20 11" />
          <path d="M5 7L7 5" />
          <path d="M17 19L19 17" />
        </svg>
      </span>
      <span class="brand-text">JiuLin's Blog</span>
    </RouterLink>

    <nav class="nav-links" aria-label="Primary">
      <RouterLink :to="{ name: 'home', params: { locale: currentLocale } }">
        {{ $t('nav.home') }}
      </RouterLink>
      <RouterLink :to="{ name: 'archive', params: { locale: currentLocale } }">
        {{ $t('nav.archive') }}
      </RouterLink>
    </nav>

    <div class="locale-switcher" :style="localeSwitcherStyle" :aria-label="$t('nav.language')">
      <button
        v-for="locale in supportedLocales"
        :key="locale"
        class="locale-button"
        :class="{ active: locale === currentLocale }"
        type="button"
        @click="switchLocale(locale)"
      >
        {{ localeLabels[locale] }}
      </button>
    </div>
  </header>
</template>
