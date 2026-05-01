<script setup lang="ts">
const particlesOptions = {
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
          opacity: 0.28,
        },
      },
    },
  },
  particles: {
    color: {
      value: ['#c084fc', '#e9d5ff', '#fb7185'],
    },
    links: {
      color: '#c084fc',
      distance: 135,
      enable: true,
      opacity: 0.16,
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
      value: {
        min: 0.16,
        max: 0.46,
      },
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
};
</script>

<template>
  <div class="particle-background" aria-hidden="true">
    <vue-particles id="blog-particles" class="particle-field" :options="particlesOptions" />
  </div>
</template>
