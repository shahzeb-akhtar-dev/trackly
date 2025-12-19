<template>
  <div class="space-y-1">
    <!-- Section Header with Toggle -->
    <button
      class="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200"
      :class="{ 'justify-center px-2': collapsed }"
      @click="$emit('toggle')"
      :aria-expanded="isExpanded"
    >
      <!-- Icon for collapsed state -->
      <Icon 
        v-if="section.icon"
        :name="getIconName(section.icon)"
        class="w-5 h-5 shrink-0 text-gray-400"
      />

      <span 
        class="flex-1 text-left truncate"
        :class="{ 'hidden': collapsed }"
      >
        {{ section.label }}
      </span>
      
      <Icon
        v-if="!collapsed"
        name="heroicons:chevron-down"
        class="w-4 h-4 text-gray-400 transition-transform duration-200 shrink-0"
        :class="{ 'rotate-180': isExpanded }"
      />
    </button>

    <!-- Menu Items Container -->
    <div
      v-if="!collapsed"
      class="overflow-hidden transition-all duration-300"
      :class="isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'"
    >
      <div class="space-y-1 pl-2">
        <slot name="items" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { NavigationItem } from '~/types/layout'

interface Props {
  section: NavigationItem
  isExpanded: boolean
  collapsed?: boolean
}

defineProps<Props>()
defineEmits<{ toggle: [] }>()

const sectionIconMap: Record<string, string> = {
  'settings': 'famicons:settings-outline',
  'reports': 'mdi:analytics',
}

const getIconName = (icon?: string) => {
  if (!icon) return 'heroicons:folder'
  return sectionIconMap[icon] || 'heroicons:folder'
}
</script>
