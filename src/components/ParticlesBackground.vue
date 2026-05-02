<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';

type Theme = 'dark' | 'light';

const theme = ref<Theme>('dark');
let themeObserver: MutationObserver | null = null;

const isTheme = (value: unknown): value is Theme => value === 'dark' || value === 'light';

const updateTheme = () => {
  const currentTheme = document.documentElement.dataset.theme;
  theme.value = isTheme(currentTheme) ? currentTheme : 'dark';
};

onMounted(() => {
  updateTheme();

  themeObserver = new MutationObserver(updateTheme);
  themeObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme'],
  });
});

onBeforeUnmount(() => {
  themeObserver?.disconnect();
});

const particleTheme = computed(() =>
  theme.value === 'light'
    ? {
        colors: ['#7c3aed', '#be123c', '#475569'],
        linkColor: '#7c3aed',
        linkOpacity: 0.13,
        grabOpacity: 0.22,
        opacity: {
          min: 0.12,
          max: 0.34,
        },
      }
    : {
        colors: ['#c084fc', '#e9d5ff', '#fb7185'],
        linkColor: '#c084fc',
        linkOpacity: 0.16,
        grabOpacity: 0.28,
        opacity: {
          min: 0.16,
          max: 0.46,
        },
      },
);

const particlesOptions = computed(() => ({
  fullScreen: {
    enable: false,
  },
  background: {
    color: {
      value: 'transparent',
    },
  },
  fpsLimit: 60,
  detectRetina: true,
  interactivity: {
    events: {
      onHover: {
        enable: true,
        mode: 'grab',
      },
      resize: {
        enable: true,
      },
    },
    modes: {
      grab: {
        distance: 150,
        links: {
          opacity: particleTheme.value.grabOpacity,
        },
      },
    },
  },
  particles: {
    color: {
      value: particleTheme.value.colors,
    },
    links: {
      color: particleTheme.value.linkColor,
      distance: 135,
      enable: true,
      opacity: particleTheme.value.linkOpacity,
      width: 1,
    },
    move: {
      direction: 'none',
      enable: true,
      outModes: {
        default: 'out',
      },
      random: true,
      speed: 0.72,
      straight: false,
    },
    number: {
      density: {
        enable: true,
      },
      value: 92,
    },
    opacity: {
      value: particleTheme.value.opacity,
    },
    shape: {
      type: 'circle',
    },
    size: {
      value: {
        min: 1,
        max: 2.8,
      },
    },
  },
}));
</script>

<template>
  <div class="particle-background" aria-hidden="true">
    <vue-particles :id="`blog-particles-${theme}`" :key="theme" class="particle-field" :options="particlesOptions" />
  </div>
</template>
