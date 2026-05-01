import { createApp } from 'vue';
import Particles from '@tsparticles/vue3';
import { loadSlim } from '@tsparticles/slim';
import App from './App.vue';
import { i18n } from './i18n';
import { router } from './router';
import './assets/main.css';

createApp(App)
  .use(router)
  .use(i18n)
  .use(Particles, {
    init: async (engine) => {
      await loadSlim(engine);
    },
  })
  .mount('#app');
