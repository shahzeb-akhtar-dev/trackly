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
        type="radialBar"
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
  endAngle?: number
  options?: any
}

const props = withDefaults(defineProps<Props>(), {
  height: 350,
  showHeader: true,
  labels: () => ['Completed', 'Delayed', 'Pending'],
  endAngle: 360,
})

const chartDefaults = useChartDefaults()

const mergedOptions = computed(() => {
  const baseOptions = chartDefaults.getRadialBarChartDefaults()
  return {
    ...baseOptions,
    labels: props.labels,
    plotOptions: {
      ...baseOptions.plotOptions,
      radialBar: {
        ...baseOptions.plotOptions.radialBar,
        endAngle: props.endAngle,
      },
    },
    ...props.options,
  }
})
</script>
