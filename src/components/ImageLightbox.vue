<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue';

defineProps<{
  src: string;
  alt?: string;
}>();

defineEmits<{
  close: [];
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
        <img :src="src" :alt="alt || ''" />
        <figcaption v-if="alt">{{ alt }}</figcaption>
      </figure>
    </div>
  </Teleport>
</template>
