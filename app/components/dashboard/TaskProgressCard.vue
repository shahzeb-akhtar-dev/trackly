<template>
  <div class="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
    <div class="flex flex-col items-center">
      <!-- Circular Progress Chart -->
      <div class="relative w-32 h-32 mb-4">
        <ClientOnly>
          <apexchart
            type="radialBar"
            :series="[percentage]"
            :options="chartOptions"
            height="128"
            width="128"
          />
        </ClientOnly>
        <!-- Center Text -->
        <div class="absolute inset-0 flex flex-col items-center justify-center">
          <span class="text-3xl font-bold" :class="textColorClass">{{ percentage }}%</span>
        </div>
      </div>

      <!-- Status Label -->
      <div class="flex items-center gap-2 mb-2">
        <Icon v-if="icon" :name="icon" class="w-4 h-4" :class="iconColorClass" />
        <span class="text-sm font-semibold" :class="textColorClass">{{ statusLabel }}</span>
      </div>

      <!-- Description -->
      <p class="text-xs text-gray-500 text-center">{{ description }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  percentage: number
  statusLabel: string
  description: string
  variant: 'completed' | 'delayed' | 'pending'
}

const props = defineProps<Props>()

const chartOptions = computed(() => {
  const colors = {
    completed: '#10b981',
    delayed: '#ef4444',
    pending: '#f59e0b',
  }

  return {
    chart: {
      type: 'radialBar',
      toolbar: { show: false },
      sparkline: { enabled: true },
    },
    plotOptions: {
      radialBar: {
        hollow: {
          size: '70%',
        },
        track: {
          background: '#f3f4f6',
          strokeWidth: '100%',
        },
        dataLabels: {
          show: false,
        },
      },
    },
    colors: [colors[props.variant]],
    stroke: {
      lineCap: 'round',
    },
  }
})

const textColorClass = computed(() => {
  const classes = {
    completed: 'text-emerald-600',
    delayed: 'text-red-600',
    pending: 'text-amber-600',
  }
  return classes[props.variant]
})

const iconColorClass = computed(() => {
  const classes = {
    completed: 'text-emerald-600',
    delayed: 'text-red-600',
    pending: 'text-amber-600',
  }
  return classes[props.variant]
})

const icon = computed(() => {
  const icons = {
    completed: 'heroicons:check-circle',
    delayed: 'heroicons:exclamation-triangle',
    pending: 'heroicons:clock',
  }
  return icons[props.variant]
})
</script>

