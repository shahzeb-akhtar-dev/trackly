<template>
  <UCard>
    <template #header>
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm text-gray-600">{{ title }}</p>
          <p class="text-3xl font-bold text-gray-900 mt-2">
            {{ formattedValue }}
          </p>
          <p v-if="subtitle" class="text-xs text-gray-500 mt-1">
            {{ subtitle }}
          </p>
        </div>
        <div
          v-if="icon"
          :class="[
            'p-3 rounded-lg',
            iconBackgroundClass
          ]"
        >
          <Icon :name="icon" :class="['w-6 h-6', iconColorClass]" />
        </div>
      </div>
    </template>

    <!-- Trend/Change Indicator -->
    <div v-if="showTrend" class="flex items-center gap-1 text-sm">
      <Icon
        :name="trendIcon"
        :class="[trendColorClass, 'w-4 h-4']"
      />
      <span :class="trendColorClass">
        {{ formattedChange }}
      </span>
      <span class="text-gray-600">{{ comparisonText }}</span>
    </div>

    <!-- Custom Footer Slot -->
    <div v-if="$slots.footer">
      <slot name="footer" />
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="absolute inset-0 bg-white/80 flex items-center justify-center rounded-lg">
      <div class="w-6 h-6 border-2 border-gray-200 border-t-blue-600 rounded-full animate-spin" />
    </div>
  </UCard>
</template>

<script setup lang="ts">
import { computed } from 'vue'

export interface KpiCardProps {
  // Main content
  title: string
  value: number | string
  subtitle?: string
  icon?: string
  
  // Styling
  color?: 'blue' | 'green' | 'orange' | 'red' | 'purple' | 'yellow' | 'indigo' | 'pink'
  
  // Trend/Change data
  showTrend?: boolean
  change?: number
  changePrefix?: string
  changeSuffix?: string
  comparisonText?: string
  invertTrendColor?: boolean // For cases where negative is good (e.g., decrease in errors)
  
  // Formatting
  valuePrefix?: string
  valueSuffix?: string
  formatValue?: (value: number | string) => string
  
  // State
  loading?: boolean
}

const props = withDefaults(defineProps<KpiCardProps>(), {
  color: 'blue',
  showTrend: true,
  change: 0,
  changePrefix: '+',
  changeSuffix: '%',
  comparisonText: 'vs last month',
  invertTrendColor: false,
  loading: false,
})

// Color mappings for icons
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
}

// Computed styles
const iconBackgroundClass = computed(() => colorMap[props.color].bg)
const iconColorClass = computed(() => colorMap[props.color].text)

// Trend computations
const isPositiveTrend = computed(() => props.change >= 0)

const trendIcon = computed(() => {
  return isPositiveTrend.value
    ? 'i-heroicons-arrow-trending-up-20-solid'
    : 'i-heroicons-arrow-trending-down-20-solid'
})

const trendColorClass = computed(() => {
  const isGoodTrend = props.invertTrendColor
    ? !isPositiveTrend.value
    : isPositiveTrend.value
  
  return isGoodTrend ? 'text-green-600' : 'text-red-600'
})

// Value formatting
const formattedValue = computed(() => {
  if (props.formatValue) {
    return props.formatValue(props.value)
  }
  
  const baseValue = typeof props.value === 'number' 
    ? props.value.toLocaleString() 
    : props.value
  
  return `${props.valuePrefix || ''}${baseValue}${props.valueSuffix || ''}`
})

// Change formatting
const formattedChange = computed(() => {
  const absChange = Math.abs(props.change)
  const prefix = props.change >= 0 ? props.changePrefix : '-'
  return `${prefix}${absChange}${props.changeSuffix}`
})
</script>
