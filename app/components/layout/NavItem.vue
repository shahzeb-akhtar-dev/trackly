<template>
  <component
    :is="item.route ? 'NuxtLink' : 'button'"
    :to="item.route"
    class="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
    :class="[
      active 
        ? 'bg-blue-50 text-blue-600' 
        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
      isChild ? 'pl-11' : '',
      collapsed ? 'justify-center px-2' : '',
    ]"
    :aria-current="active ? 'page' : undefined"
    @click="$emit('click')"
  >
    <!-- Icon -->
    <Icon 
      :name="getIconName(item.icon)"
      class="w-5 h-5 flex-shrink-0"
      :class="active ? 'text-blue-600' : 'text-gray-400'"
    />

    <!-- Label -->
    <span 
      class="flex-1 text-left truncate transition-opacity duration-200"
      :class="{ 'hidden': collapsed }"
    >
      {{ item.label }}
    </span>

    <!-- Badge -->
    <span 
      v-if="item.badge && !collapsed" 
      class="px-2 py-0.5 text-xs font-semibold rounded-full"
      :class="getBadgeClasses(item.badge.variant)"
    >
      {{ item.badge.value }}
    </span>
  </component>
</template>

<script setup lang="ts">
import type { NavigationItem } from '~/types/layout'

interface Props {
  item: NavigationItem
  active?: boolean
  isChild?: boolean
  collapsed?: boolean
}

defineProps<Props>()
defineEmits<{ click: [] }>()

const getBadgeClasses = (variant: string) => {
  const variants: Record<string, string> = {
    success: 'bg-emerald-100 text-emerald-700',
    warning: 'bg-amber-100 text-amber-700',
    error: 'bg-red-100 text-red-700',
    info: 'bg-blue-100 text-blue-700',
  }
  return variants[variant] || variants.info
}

const iconMap: Record<string, string> = {
  'chart-bar': 'heroicons:chart-bar',
  'cog': 'heroicons:cog-6-tooth',
  'briefcase': 'heroicons:briefcase',
  'clock': 'heroicons:clock',
  'credit-card': 'heroicons:credit-card',
  'document': 'heroicons:document-text',
  'chat': 'heroicons:chat-bubble-left-right',
  'users': 'heroicons:users',
  'key': 'heroicons:key',
  'check-circle': 'heroicons:check-circle',
  'tasks': 'heroicons:clipboard-document-list',
  'th': 'heroicons:squares-2x2',
  'calendar': 'heroicons:calendar',
  'hourglass': 'heroicons:clock',
}

const getIconName = (icon?: string) => {
  if (!icon) return 'heroicons:circle-stack'
  return iconMap[icon] || 'heroicons:circle-stack'
}
</script>
