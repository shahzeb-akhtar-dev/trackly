<template>
  <div :class="['rounded-lg border border-gray-200 bg-white', containerClass]">
    <!-- Header -->
    <div v-if="title || description || $slots.actions" :class="['px-6 py-4 border-b border-gray-200', headerClass]">
      <div class="flex items-start justify-between gap-4">
        <div class="flex-1 min-w-0">
          <div v-if="icon || title" class="flex items-center gap-3">
            <div
              v-if="icon"
              :class="[
                'p-2 rounded-lg',
                iconBackgroundClass
              ]"
            >
              <Icon :name="icon" :class="['w-5 h-5', iconColorClass]" />
            </div>
            <div>
              <h3 v-if="title" class="text-lg font-semibold text-gray-900">
                {{ title }}
              </h3>
              <p v-if="subtitle" class="text-sm text-gray-600 mt-0.5">
                {{ subtitle }}
              </p>
            </div>
          </div>
          <p v-if="description" :class="['text-sm text-gray-600', title || icon ? 'mt-2' : '']">
            {{ description }}
          </p>
        </div>
        <div v-if="$slots.actions">
          <slot name="actions" />
        </div>
      </div>
    </div>

    <!-- Content -->
    <div :class="['px-6 py-5', contentClass]">
      <slot />
    </div>

    <!-- Footer -->
    <div v-if="$slots.footer" :class="['px-6 py-4 border-t border-gray-200 bg-gray-50', footerClass]">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

export interface FormSectionProps {
  // Header
  title?: string
  subtitle?: string
  description?: string
  icon?: string
  
  // Styling
  color?: 'blue' | 'green' | 'orange' | 'red' | 'purple' | 'yellow' | 'indigo' | 'pink' | 'gray'
  containerClass?: string
  headerClass?: string
  contentClass?: string
  footerClass?: string
}

const props = withDefaults(defineProps<FormSectionProps>(), {
  color: 'blue',
  containerClass: '',
  headerClass: '',
  contentClass: '',
  footerClass: '',
})

// Color mappings
const colorMap = {
  blue: {
    bg: 'bg-blue-50',
    text: 'text-blue-600',
  },
  green: {
    bg: 'bg-green-50',
    text: 'text-green-600',
  },
  orange: {
    bg: 'bg-orange-50',
    text: 'text-orange-600',
  },
  red: {
    bg: 'bg-red-50',
    text: 'text-red-600',
  },
  purple: {
    bg: 'bg-purple-50',
    text: 'text-purple-600',
  },
  yellow: {
    bg: 'bg-yellow-50',
    text: 'text-yellow-600',
  },
  indigo: {
    bg: 'bg-indigo-50',
    text: 'text-indigo-600',
  },
  pink: {
    bg: 'bg-pink-50',
    text: 'text-pink-600',
  },
  gray: {
    bg: 'bg-gray-50',
    text: 'text-gray-600',
  },
}

const iconBackgroundClass = computed(() => colorMap[props.color].bg)
const iconColorClass = computed(() => colorMap[props.color].text)
</script>
