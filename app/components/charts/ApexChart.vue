<template>
  <div ref="chartElement" class="w-full"></div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue'
import ApexCharts from 'apexcharts'

interface Props {
  type: string
  series: any[]
  options?: any
  height?: number | string
}

const props = withDefaults(defineProps<Props>(), {
  height: 400,
})

const chartElement = ref<HTMLElement | null>(null)
let chart: ApexCharts | null = null

const mergedOptions = computed(() => ({
  ...props.options,
  chart: {
    ...props.options?.chart,
    type: props.type,
    height: props.height,
  },
}))

const initChart = () => {
  if (chartElement.value && !chart) {
    chart = new ApexCharts(chartElement.value, {
      ...mergedOptions.value,
      series: props.series,
    })
    chart.render()
  }
}

const updateChart = async () => {
  if (chart) {
    await chart.updateOptions(mergedOptions.value)
    await chart.updateSeries(props.series)
  }
}

onMounted(() => {
  initChart()
})

watch([() => props.series, () => props.options], () => {
  updateChart()
}, { deep: true })
</script>
