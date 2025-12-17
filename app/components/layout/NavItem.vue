<template>
  <NuxtLink
    :to="to"
    class="flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors"
    :class="[
      isActive
        ? 'bg-blue-600 text-white'
        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
    ]"
  >
    <!-- Icon SVG -->
    <svg class="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
      <component :is="getIconPath(icon)" />
    </svg>

    <!-- Label -->
    <span class="text-sm font-medium flex-1">{{ label }}</span>

    <!-- Badge -->
    <span
      v-if="badge && badge > 0"
      class="px-2 py-0.5 text-xs font-semibold text-white bg-red-500 rounded-full"
    >
      {{ badge }}
    </span>
  </NuxtLink>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

interface Props {
  to: string
  icon: string
  label: string
  badge?: number
}

const props = defineProps<Props>()
const route = useRoute()

const isActive = computed(() => {
  if (props.to === '/') return route.path === '/'
  return route.path.startsWith(props.to)
})

const getIconPath = (iconName: string) => {
  const iconPaths: Record<string, string> = {
    'chart-bar': 'M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z',
    'check-circle': 'M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z',
    'clock': 'M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 100-12 6 6 0 000 12zm0-6a1 1 0 11-2 0 1 1 0 012 0z',
    'calendar': 'M6 2a1 1 0 00-1 1v2H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v2H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h12a1 1 0 100-2H6z',
    'hourglass': 'M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm6 0a1 1 0 100-2 1 1 0 000 2z',
    'users': 'M9 6a3 3 0 11-6 0 3 3 0 016 0zM9 6a9 9 0 11-18 0 9 9 0 0118 0z',
    'chart-line': 'M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z',
    'document': 'M9 2a1 1 0 000 2h2a1 1 0 100-2H9z',
    'chat': 'M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5z',
    'cog': 'M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z',
    'credit-card': 'M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm12 4v8a2 2 0 01-2 2H4a2 2 0 01-2-2v-4h2a1 1 0 100 2h6a1 1 0 100-2h2a1 1 0 110 2h2v-2a2 2 0 012-2h-2z',
    'briefcase': 'M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2H3a1 1 0 110-2V4zm2 5a1 1 0 000 2h6a1 1 0 000-2H6z',
  }
  return iconPaths[iconName] || 'M10 18a8 8 0 100-16 8 8 0 000 16z'
}
</script>

<style scoped>
/* NavItem component styles */
</style>
