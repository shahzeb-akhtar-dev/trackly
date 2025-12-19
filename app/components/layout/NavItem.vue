<template>
  <component
    :is="item.route ? 'NuxtLink' : 'button'"
    :to="item.route"
    class="flex items-center gap-3 w-full cursor-pointer! px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
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
    <!-- Icon (hidden for sub-menu items) -->
    <Icon 
      v-if="!isChild"
      :name="getIconName(item.icon)"
      class="size-6 shrink-0"
      :class="active ? 'text-blue-600' : 'text-gray-400'"
    />

    <!-- Label -->
    <span 
      class="flex-1 text-left truncate transition-opacity duration-200 cursor-pointer"
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

const moduleIconMap: Record<string, string> = {
  'dashboard': 'material-symbols:dashboard-outline-rounded',
  'settings': 'famicons:settings-outline',
  'projects-tasks': 'line-md:clipboard-check',
  'time-management': 'mage:clock',
  'payroll': 'la:hand-holding-usd',
  'reports': 'mdi:analytics',
  'chat': 'material-symbols:chat-outline-sharp',
}
const getIconName = (icon?: string) => {
  if (!icon) return ''
  return moduleIconMap[icon] || ''
}
</script>
