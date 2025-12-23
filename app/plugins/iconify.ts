import { Icon } from '@iconify/vue';

export default defineNuxtPlugin((nuxtApp) => {
  if (!nuxtApp.vueApp.component('Icon')) {
    nuxtApp.vueApp.component('Icon', Icon);
  }
});
