<script setup lang="ts">
import type { Heading } from '@/utils/markdown';

defineProps<{
  headings: Heading[];
  activeHeadingId: string;
}>();

const scrollToHeading = (id: string) => {
  document.getElementById(id)?.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
  });
};
</script>

<template>
  <aside v-if="headings.length" class="article-toc" :aria-label="$t('article.toc')">
    <h2>{{ $t('article.toc') }}</h2>
    <a
      v-for="heading in headings"
      :key="heading.id"
      :href="`#${heading.id}`"
      :class="[`toc-level-${heading.level}`, { active: heading.id === activeHeadingId }]"
      :style="{ '--depth': String(heading.level - 2) }"
      @click.prevent="scrollToHeading(heading.id)"
    >
      {{ heading.text }}
    </a>
  </aside>
</template>
