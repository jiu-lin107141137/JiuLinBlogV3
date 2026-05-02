<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue';

defineProps<{
  src: string;
  alt?: string;
  index: number;
  total: number;
}>();

defineEmits<{
  close: [];
  previous: [];
  next: [];
}>();

const closeButton = ref<HTMLButtonElement | null>(null);
let previousBodyOverflow = '';

onMounted(async () => {
  previousBodyOverflow = document.body.style.overflow;
  document.body.style.overflow = 'hidden';

  await nextTick();
  closeButton.value?.focus();
});

onBeforeUnmount(() => {
  document.body.style.overflow = previousBodyOverflow;
});
</script>

<template>
  <Teleport to="body">
    <div class="image-lightbox" role="dialog" aria-modal="true" :aria-label="alt || 'Image preview'">
      <button class="lightbox-backdrop" type="button" aria-label="Close image preview" @click="$emit('close')"></button>
      <figure class="lightbox-frame">
        <button
          ref="closeButton"
          class="lightbox-close"
          type="button"
          aria-label="Close image preview"
          @click="$emit('close')"
        >
          <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>
        <button
          v-if="total > 1"
          class="lightbox-nav previous"
          type="button"
          aria-label="Previous image"
          @click="$emit('previous')"
        >
          <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
            <path d="M15 18 9 12l6-6" />
          </svg>
        </button>
        <img :src="src" :alt="alt || ''" />
        <button
          v-if="total > 1"
          class="lightbox-nav next"
          type="button"
          aria-label="Next image"
          @click="$emit('next')"
        >
          <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
            <path d="m9 18 6-6-6-6" />
          </svg>
        </button>
        <figcaption v-if="alt">{{ alt }}</figcaption>
        <span v-if="total > 1" class="lightbox-count">{{ index + 1 }} / {{ total }}</span>
      </figure>
    </div>
  </Teleport>
</template>
