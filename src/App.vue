<script setup lang="ts">
import { watchEffect } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import { isLocale } from '@/i18n';

const route = useRoute();
const { locale } = useI18n();

watchEffect(() => {
  const routeLocale = route.params.locale;
  if (isLocale(routeLocale)) {
    locale.value = routeLocale;
    document.documentElement.lang = routeLocale;
    window.localStorage.setItem('jiulin-blog-locale', routeLocale);
  }
});
</script>

<template>
  <RouterView />
</template>
