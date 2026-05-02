<script setup lang="ts">
import { computed, onMounted, ref, watch, type CSSProperties } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import type { RouteParamsRawGeneric } from 'vue-router';
import { localeLabels, supportedLocales, type Locale } from '@/i18n';
import { translateCategory, translateTag } from '@/utils/posts';

const route = useRoute();
const router = useRouter();
type Theme = 'dark' | 'light';
const themeStorageKey = 'jiulin-blog-theme';

const currentLocale = computed(() => route.params.locale as Locale);
const activeLocaleIndex = computed(() => supportedLocales.indexOf(currentLocale.value));
const localeSwitcherStyle = computed<CSSProperties>(() => ({
  '--active-index': String(Math.max(activeLocaleIndex.value, 0)),
  '--locale-count': String(supportedLocales.length),
}));
const theme = ref<Theme>('dark');
const menuOpen = ref(false);
const isLightTheme = computed(() => theme.value === 'light');
const themeLabel = computed(() => (isLightTheme.value ? 'Switch to dark theme' : 'Switch to light theme'));
const menuLabel = computed(() => (menuOpen.value ? 'Collapse navigation menu' : 'Expand navigation menu'));

const isTheme = (value: unknown): value is Theme => value === 'dark' || value === 'light';

const applyTheme = (nextTheme: Theme) => {
  theme.value = nextTheme;
  document.documentElement.dataset.theme = nextTheme;
  document.documentElement.style.colorScheme = nextTheme;
  window.localStorage.setItem(themeStorageKey, nextTheme);
};

const toggleTheme = () => {
  applyTheme(isLightTheme.value ? 'dark' : 'light');
};

const closeMenu = () => {
  menuOpen.value = false;
};

const toggleMenu = () => {
  menuOpen.value = !menuOpen.value;
};

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

  closeMenu();

  await router.push({
    name: route.name ?? 'home',
    params,
    query: route.query,
    hash: route.hash,
  });
};

onMounted(() => {
  const initialTheme = document.documentElement.dataset.theme;
  if (isTheme(initialTheme)) {
    theme.value = initialTheme;
    return;
  }

  applyTheme(window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
});

watch(
  () => route.fullPath,
  () => {
    closeMenu();
  },
);
</script>

<template>
  <header class="site-header" :class="{ 'menu-open': menuOpen }" @keydown.esc="closeMenu">
    <RouterLink class="brand" :to="{ name: 'home', params: { locale: currentLocale } }" @click="closeMenu">
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

    <button
      class="menu-toggle"
      type="button"
      :aria-expanded="menuOpen"
      aria-controls="site-navigation site-header-actions"
      :aria-label="menuLabel"
      :title="menuLabel"
      @click="toggleMenu"
    >
      <span aria-hidden="true"></span>
      <span aria-hidden="true"></span>
      <span aria-hidden="true"></span>
    </button>

    <nav id="site-navigation" class="nav-links" aria-label="Primary">
      <RouterLink :to="{ name: 'home', params: { locale: currentLocale } }" @click="closeMenu">
        {{ $t('nav.home') }}
      </RouterLink>
      <RouterLink :to="{ name: 'archive', params: { locale: currentLocale } }" @click="closeMenu">
        {{ $t('nav.archive') }}
      </RouterLink>
    </nav>

    <div id="site-header-actions" class="header-actions">
      <button class="theme-toggle" type="button" :aria-label="themeLabel" :title="themeLabel" @click="toggleTheme">
        <svg class="theme-icon theme-icon-sun" viewBox="0 0 24 24" focusable="false" aria-hidden="true">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2" />
          <path d="M12 20v2" />
          <path d="M4.93 4.93l1.41 1.41" />
          <path d="M17.66 17.66l1.41 1.41" />
          <path d="M2 12h2" />
          <path d="M20 12h2" />
          <path d="M6.34 17.66l-1.41 1.41" />
          <path d="M19.07 4.93l-1.41 1.41" />
        </svg>
        <svg class="theme-icon theme-icon-moon" viewBox="0 0 24 24" focusable="false" aria-hidden="true">
          <path d="M20.5 14.5A8.4 8.4 0 0 1 9.5 3.5a8.5 8.5 0 1 0 11 11Z" />
        </svg>
      </button>

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
    </div>
  </header>
</template>
