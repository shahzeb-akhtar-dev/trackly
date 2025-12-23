// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [ '@nuxt/ui', '@pinia/nuxt', 'pinia-plugin-persistedstate/nuxt'],
  css: ['@/assets/css/main.css'],
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
  ui:{
    theme: {
     colors: ['primary', 'secondary', 'success', 'info', 'warning', 'error'],
      
      // Enable/disable transitions
      transitions: true,
       // Set default variants for all components
      defaultVariants: {
        color: 'primary',
        size: 'md'
      },
      
  }
}
})
