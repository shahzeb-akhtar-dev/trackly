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
    <div class="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
      <apexchart
        type="pie"
        :options="mergedOptions"
        :series="series"
        :height="height"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useChartDefaults } from '~/composables/charts/useChartDefaults'

interface Props {
  title?: string
  subtitle?: string
  series: number[]
  labels?: string[]
  height?: number | string
  showHeader?: boolean
  chartType?: 'pie' | 'donut'
  options?: any
}

const props = withDefaults(defineProps<Props>(), {
  height: 350,
  showHeader: true,
  labels: () => ['Category 1', 'Category 2', 'Category 3', 'Category 4'],
  chartType: 'pie',
})

const chartDefaults = useChartDefaults()

const mergedOptions = computed(() => {
  const baseOptions = chartDefaults.getPieChartDefaults()
  
  const updatedOptions = {
    ...baseOptions,
    labels: props.labels,
    chart: {
      ...baseOptions.chart,
      type: props.chartType === 'donut' ? 'donut' : 'pie',
    },
    ...props.options,
  }

  // Handle donut chart specific settings
  if (props.chartType === 'donut') {
    updatedOptions.plotOptions = {
      pie: {
        donut: {
          ...baseOptions.plotOptions.pie.donut,
        },
      },
    }
  }

  return updatedOptions
})
</script>
