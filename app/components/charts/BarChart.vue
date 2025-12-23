<template>
  <div class="w-full">
    <!-- Header Section -->
    <div v-if="showHeader" class="flex items-center justify-between mb-6">
      <div>
        <h2 class="text-lg font-semibold text-gray-900">{{ title }}</h2>
        <p v-if="subtitle" class="text-sm text-gray-600 mt-1">{{ subtitle }}</p>
      </div>
      <div v-if="$slots.header" class="flex items-center gap-3">
        <slot name="header" />
      </div>
    </div>

    <!-- Chart Container -->
    <div v-if="!noWrapper" class="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
      <div class="w-full">
        <apexchart
          type="bar"
          :options="mergedOptions"
          :series="series"
          :height="height"
        />
      </div>
    </div>
    <div v-else class="w-full">
      <apexchart
        type="bar"
        :options="mergedOptions"
        :series="series"
        :height="height"
      />
    </div>

    <!-- Legend Section -->
    <div v-if="showLegend && legendItems.length > 0" class="flex items-center justify-center gap-6 mt-6">
      <div v-for="(item, index) in legendItems" :key="index" class="flex items-center gap-2">
        <div
          class="w-3 h-3 rounded-full"
          :style="{ backgroundColor: legendColors[index] || 'transparent' }"
        ></div>
        <span class="text-sm text-gray-600">{{ item }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useChartDefaults } from '~/composables/charts/useChartDefaults'

interface Props {
  title?: string
  subtitle?: string
  series: any[]
  categories?: string[]
  height?: number | string
  showHeader?: boolean
  showLegend?: boolean
  legendItems?: string[]
  legendColors?: string[]
  colorScheme?: 'default' | 'success' | 'warning' | 'danger'
  options?: any
  noWrapper?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  height: 350,
  showHeader: true,
  showLegend: false,
  legendItems: () => [],
  legendColors: () => [],
  colorScheme: 'default',
  noWrapper: false,
})

const chartDefaults = useChartDefaults()

const colorMap = {
  default: [chartDefaults.colors.primary, chartDefaults.colors.lightGray],
  success: [chartDefaults.colors.success, chartDefaults.colors.lightGray],
  warning: [chartDefaults.colors.warning, chartDefaults.colors.lightGray],
  danger: [chartDefaults.colors.danger, chartDefaults.colors.lightGray],
}

const mergedOptions = computed(() => {
  const baseOptions = chartDefaults.getBarChartDefaults()
  const customOptions = props.options || {}
  
  return {
    ...baseOptions,
    colors: customOptions.colors || colorMap[props.colorScheme],
    xaxis: {
      ...baseOptions.xaxis,
      ...customOptions.xaxis,
      categories: props.categories || customOptions.xaxis?.categories || (baseOptions.xaxis as any).categories,
    },
    ...customOptions,
  }
})
</script>
