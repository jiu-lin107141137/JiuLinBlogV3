<script setup lang="ts">
import ParticlesBackground from '@/components/ParticlesBackground.vue';
import SiteHeader from '@/components/SiteHeader.vue';
</script>

<template>
  <div class="site-shell">
    <ParticlesBackground />
    <SiteHeader />
    <main class="site-main">
      <RouterView />
    </main>
    <footer class="site-footer">
      {{ $t('footer.built') }}
    </footer>
  </div>
</template>
