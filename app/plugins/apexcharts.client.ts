/**
 * ApexCharts Plugin for Nuxt 3 (Client-only)
 * Registers vue3-apexcharts globally
 * 
 * Note: ApexCharts requires browser APIs, so this plugin must run client-side only
 */

import VueApexCharts from 'vue3-apexcharts'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(VueApexCharts)
})

