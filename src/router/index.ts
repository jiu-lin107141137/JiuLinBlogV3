import { createRouter, createWebHistory } from 'vue-router';
import { defaultLocale, isLocale, type Locale } from '@/i18n';

const pickInitialLocale = (): Locale => {
  if (typeof window === 'undefined') return defaultLocale;

  const stored = window.localStorage.getItem('jiulin-blog-locale');
  if (isLocale(stored)) return stored;

  const preferred = window.navigator.language;
  return preferred.toLowerCase().startsWith('zh') ? 'zh-TW' : defaultLocale;
};

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to) {
    if (to.hash) return { el: to.hash, top: 88, behavior: 'smooth' };
    return { top: 0 };
  },
  routes: [
    {
      path: '/',
      redirect: () => `/${pickInitialLocale()}`,
    },
    {
      path: '/:locale(en|zh-TW)',
      component: () => import('@/AppShell.vue'),
      children: [
        {
          path: '',
          name: 'home',
          component: () => import('@/views/HomeView.vue'),
        },
        {
          path: 'archive',
          name: 'archive',
          component: () => import('@/views/ListingView.vue'),
        },
        {
          path: 'tags/:tag',
          name: 'tag',
          component: () => import('@/views/ListingView.vue'),
        },
        {
          path: 'categories/:category',
          name: 'category',
          component: () => import('@/views/ListingView.vue'),
        },
        {
          path: 'posts/:slug',
          name: 'post',
          component: () => import('@/views/ArticleView.vue'),
        },
      ],
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: () => `/${pickInitialLocale()}`,
    },
  ],
});
