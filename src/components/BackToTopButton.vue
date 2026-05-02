<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const isVisible = ref(false);

const updateVisibility = () => {
  isVisible.value = window.scrollY > 420;
};

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
};

onMounted(() => {
  updateVisibility();
  window.addEventListener('scroll', updateVisibility, { passive: true });
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', updateVisibility);
});

watch(
  () => route.fullPath,
  () => {
    window.setTimeout(updateVisibility, 0);
  },
);
</script>

<template>
  <button
    class="back-to-top"
    :class="{ visible: isVisible }"
    type="button"
    aria-label="Back to top"
    title="Back to top"
    @click="scrollToTop"
  >
    <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
      <path d="M12 19V5" />
      <path d="M5 12l7-7 7 7" />
    </svg>
  </button>
</template>
