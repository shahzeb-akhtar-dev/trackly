import VueApexCharts from 'vue3-apexcharts'
import ApexCharts from 'apexcharts'

export default defineNuxtPlugin((nuxtApp) => {
  // Register the official Vue 3 ApexCharts component
  nuxtApp.vueApp.use(VueApexCharts)
  
  // Make ApexCharts available globally for advanced usage
  nuxtApp.provide('apexcharts', ApexCharts)
})



