/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './app/components/**/*.{vue,js,ts,html}',
    './app/layouts/**/*.{vue,js,ts,html}',
    './app/pages/**/*.{vue,js,ts,html}',
    './pages/**/*.{vue,js,ts,html}',
    './components/**/*.{vue,js,ts,html}',
    './composables/**/*.{ts,js,vue}',
    './app/plugins/**/*.{js,ts}',
    './app/app.{js,ts,vue}',
    './app/error.{js,ts,vue}',
    './node_modules/@nuxt/ui/dist/**/*.mjs'
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0052cc',
        'background-light': '#f0f4f8',
        'background-dark': '#111827'
      },
      fontFamily: {
        display: ['Poppins', 'sans-serif']
      },
      borderRadius: {
        DEFAULT: '0.5rem',
        lg: '1rem',
        xl: '1.5rem',
        '2xl': '2rem',
        '3xl': '3rem',
        'd-shape': '8rem'
      },
    }
  },
  plugins: []
};