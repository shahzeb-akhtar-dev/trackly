<template>
  <div class="w-full">
    <apexchart
      :type="type"
      :series="series"
      :options="chartOptions"
      :height="height"
      :width="width"
    />
  </div>
</template>

<script setup lang="ts">
import type { ApexOptions } from 'apexcharts'

interface Props {
  type: 'line' | 'area' | 'bar' | 'histogram' | 'pie' | 'donut' | 'radialBar' | 'scatter' | 'bubble' | 'heatmap' | 'treemap' | 'boxPlot' | 'candlestick' | 'radar' | 'polarArea' | 'rangeBar'
  series: ApexAxisChartSeries | ApexNonAxisChartSeries
  options?: ApexOptions
  height?: number | string
  width?: number | string
}

const props = withDefaults(defineProps<Props>(), {
  height: 400,
  width: '100%',
})

const chartOptions = computed(() => ({
  chart: {
    toolbar: {
      show: false,
    },
    zoom: {
      enabled: false,
    },
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    curve: 'smooth' as const,
  },
  xaxis: {
    labels: {
      style: {
        colors: '#6b7280',
        fontSize: '12px',
      },
    },
  },
  yaxis: {
    labels: {
      style: {
        colors: '#6b7280',
        fontSize: '12px',
      },
    },
  },
  grid: {
    borderColor: '#e5e7eb',
    strokeDashArray: 4,
  },
  ...props.options,
}))
</script>
