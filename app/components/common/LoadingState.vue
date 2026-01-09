<template>
  <div :class="['flex items-center justify-center', containerClass]">
    <div class="text-center">
      <div class="relative inline-block">
        <!-- Spinner -->
        <div 
          :class="[
            'border-4 rounded-full animate-spin',
            spinnerSizeClass,
            spinnerColorClass
          ]"
        />
        
        <!-- Reload Icon (shows when allowReload is true and user can interact) -->
        <button
          v-if="allowReload"
          :disabled="loading"
          :class="[
            'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
            'transition-opacity duration-200',
            loading ? 'opacity-0 pointer-events-none' : 'opacity-100',
          ]"
          @click="handleReload"
        >
          <Icon 
            name="i-heroicons-arrow-path-20-solid" 
            :class="['transition-transform hover:rotate-180', iconSizeClass, 'text-gray-500 hover:text-gray-700']"
          />
        </button>
      </div>
      
      <p v-if="message" :class="['mt-4', messageClass]">
        {{ message }}
      </p>
      
      <p v-if="subtitle" :class="['mt-1 text-sm', subtitleClass]">
        {{ subtitle }}
      </p>

      <!-- Custom actions slot -->
      <div v-if="$slots.actions" class="mt-4">
        <slot name="actions" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

export interface LoadingStateProps {
  // Content
  message?: string
  subtitle?: string
  
  // Size variants
  size?: 'sm' | 'md' | 'lg' | 'xl'
  
  // Styling
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error'
  containerClass?: string
  messageClass?: string
  subtitleClass?: string
  
  // Reload functionality
  allowReload?: boolean
  loading?: boolean
  onReload?: () => void | Promise<void>
}

const props = withDefaults(defineProps<LoadingStateProps>(), {
  message: 'Loading...',
  size: 'md',
  color: 'primary',
  containerClass: 'py-12',
  messageClass: 'text-gray-600',
  subtitleClass: 'text-gray-500',
  allowReload: false,
  loading: true,
})

const emit = defineEmits<{
  reload: []
}>()

// Size mappings
const sizeMap = {
  sm: {
    spinner: 'w-6 h-6 border-2',
    icon: 'w-3 h-3',
  },
  md: {
    spinner: 'w-8 h-8 border-4',
    icon: 'w-4 h-4',
  },
  lg: {
    spinner: 'w-12 h-12 border-4',
    icon: 'w-5 h-5',
  },
  xl: {
    spinner: 'w-16 h-16 border-4',
    icon: 'w-6 h-6',
  },
}

// Color mappings
const colorMap = {
  primary: 'border-gray-200 border-t-blue-600',
  secondary: 'border-gray-200 border-t-gray-600',
  success: 'border-gray-200 border-t-green-600',
  warning: 'border-gray-200 border-t-orange-600',
  error: 'border-gray-200 border-t-red-600',
}

const spinnerSizeClass = computed(() => sizeMap[props.size].spinner)
const iconSizeClass = computed(() => sizeMap[props.size].icon)
const spinnerColorClass = computed(() => colorMap[props.color])

const handleReload = async () => {
  if (props.onReload) {
    await props.onReload()
  }
  emit('reload')
}
</script>
