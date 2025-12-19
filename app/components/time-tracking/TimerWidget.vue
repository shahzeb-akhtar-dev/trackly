<template>
  <!-- Block Variant - Dashboard -->
  <div v-if="variant === 'block'" class="w-full bg-white border border-gray-200 rounded-xl p-8">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <h3 class="text-sm font-medium text-gray-600">Current Session</h3>
      <span
        v-if="hasActiveTimer"
        class="px-3 py-1 bg-emerald-50 text-emerald-600 text-xs font-semibold rounded-full"
      >
        ACTIVE
      </span>
    </div>

    <!-- Task Title -->
    <h2 v-if="hasActiveTimer" class="text-2xl font-bold text-gray-900 mb-8">
      {{ taskName }}
    </h2>
    <div v-else class="mb-8">
      <p class="text-lg text-gray-500">No active timer</p>
    </div>

    <!-- Timer Display -->
    <div v-if="hasActiveTimer" class="flex items-center justify-center gap-3 mb-10">
      <!-- Hours -->
      <div class="flex flex-col items-center">
        <div class="w-20 h-20 flex items-center justify-center bg-white border border-gray-200 rounded-xl shadow-sm">
          <span class="text-3xl font-bold text-gray-900">{{ hours }}</span>
        </div>
        <span class="text-xs font-medium text-gray-500 uppercase mt-2">Hours</span>
      </div>

      <!-- Separator -->
      <div class="flex flex-col items-center gap-1">
        <span class="text-2xl font-bold text-gray-400">:</span>
        <span class="text-2xl font-bold text-gray-400">:</span>
      </div>

      <!-- Minutes -->
      <div class="flex flex-col items-center">
        <div class="w-20 h-20 flex items-center justify-center bg-white border border-gray-200 rounded-xl shadow-sm">
          <span class="text-3xl font-bold text-gray-900">{{ minutes }}</span>
        </div>
        <span class="text-xs font-medium text-gray-500 uppercase mt-2">Minutes</span>
      </div>

      <!-- Separator -->
      <div class="flex flex-col items-center gap-1">
        <span class="text-2xl font-bold text-gray-400">:</span>
        <span class="text-2xl font-bold text-gray-400">:</span>
      </div>

      <!-- Seconds -->
      <div class="flex flex-col items-center">
        <div class="w-20 h-20 flex items-center justify-center bg-blue-50 border-2 border-blue-200 rounded-xl shadow-sm">
          <span class="text-3xl font-bold text-blue-600">{{ seconds }}</span>
        </div>
        <span class="text-xs font-medium text-blue-600 uppercase mt-2">Seconds</span>
      </div>
    </div>

    <!-- Error Message -->
    <div v-if="timerComposable.error.value" class="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg">
      <p class="text-sm text-red-600">{{ timerComposable.error.value }}</p>
    </div>

    <!-- Action Buttons -->
    <div class="flex items-center gap-4">
      <!-- Start/Break Button -->
      <button
        v-if="!hasActiveTimer"
        class="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
        @click="showStartModal = true"
      >
        <Icon name="heroicons:play" class="w-5 h-5" />
        <span>Start</span>
      </button>

      <button
        v-else
        :disabled="isLoading"
        class="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        @click="handleBreak"
      >
        <Icon v-if="!isPaused" name="heroicons:pause" class="w-5 h-5" />
        <Icon v-else name="heroicons:play" class="w-5 h-5" />
        <span>{{ isPaused ? 'Resume' : 'Break' }}</span>
      </button>

      <!-- Stop Button -->
      <button
        :disabled="!hasActiveTimer || isLoading"
        class="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        @click="handleStop"
      >
        <Icon name="heroicons:stop" class="w-5 h-5" />
        <span>Stop</span>
      </button>
    </div>
  </div>

  <!-- Inline Variant - Header -->
  <div v-if="variant === 'inline'" class="hidden md:flex items-center gap-4 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl">
    <!-- Start Button -->
    <button
      v-if="!hasActiveTimer"
      class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm"
      @click="showStartModal = true"
    >
      <Icon name="heroicons:play" class="w-4 h-4" />
      <span>Start Timer</span>
    </button>

    <!-- Active Timer Display -->
    <template v-else>
      <span class="text-sm text-gray-700 font-medium truncate max-w-[150px]">
        {{ taskName }}
      </span>
      <span class="text-gray-900 font-bold text-sm tabular-nums">
        {{ hours }}:{{ minutes }}:{{ seconds }}
      </span>
      <div class="flex items-center gap-1 ml-2 pl-2 border-l border-gray-200">
        <button
          :disabled="isLoading"
          class="p-1.5 text-gray-500 hover:bg-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          @click="handleBreak"
          :title="isPaused ? 'Resume' : 'Break'"
        >
          <Icon v-if="!isPaused" name="heroicons:pause" class="w-4 h-4" />
          <Icon v-else name="heroicons:play" class="w-4 h-4" />
        </button>
        <button
          :disabled="isLoading"
          class="p-1.5 text-gray-500 hover:bg-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          @click="handleStop"
          title="Stop"
        >
          <Icon name="heroicons:stop" class="w-4 h-4" />
        </button>
      </div>
    </template>
  </div>

  <!-- Start Timer Modal -->
  <StartTimerModal
    :is-open="showStartModal"
    :projects="mockProjects"
    @close="showStartModal = false"
    @start="handleStartTimer"
  />
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useTimer } from '~/composables/time-tracking/useTimer'
import StartTimerModal from './StartTimerModal.vue'
import type { Project, Task } from '~/types/timer'

interface Props {
  variant: 'block' | 'inline'
  taskName: string
}

defineProps<Props>()

const timerComposable = useTimer()

const showStartModal = ref(false)

const mockProjects = ref([
  {
    id: 1,
    name: 'Internal Projects',
    tasks: [
      {
        id: 1,
        title: 'Design System Update',
        description: 'Review and merge the new component updates for the dashboard UI kit.',
        status: 'in_progress' as const,
        priority: 'high' as const,
        estimatedHours: 2,
        assignedToYou: true,
      },
      {
        id: 2,
        title: 'Weekly Team Sync',
        description: 'Mandatory meeting for all engineering staff.',
        status: 'pending' as const,
        estimatedHours: 0.5,
        assignedToYou: false,
      },
      {
        id: 3,
        title: 'Documentation Review',
        description: 'Update the API documentation with new endpoints.',
        status: 'pending' as const,
        estimatedHours: 4,
        assignedToYou: false,
      },
    ],
  },
  {
    id: 2,
    name: 'Omega Corp',
    tasks: [
      {
        id: 4,
        title: 'Client Meeting',
        description: 'Discuss project requirements and timeline.',
        status: 'in_progress' as const,
        estimatedHours: 1,
        assignedToYou: true,
      },
    ],
  },
  {
    id: 3,
    name: 'Finance Dept',
    tasks: [
      {
        id: 5,
        title: 'Budget Review',
        description: 'Review quarterly budget allocations.',
        status: 'pending' as const,
        estimatedHours: 3,
        assignedToYou: false,
      },
    ],
  },
  {
    id: 4,
    name: 'Marketing',
    tasks: [
      {
        id: 6,
        title: 'Campaign Planning',
        description: 'Plan Q2 marketing campaigns.',
        status: 'in_progress' as const,
        estimatedHours: 5,
        assignedToYou: true,
      },
    ],
  },
])

const isLoading = computed(() => timerComposable.loading.value)
const isPaused = computed(() => timerComposable.isPaused.value)
const hasActiveTimer = computed(() => timerComposable.activeTimer.value !== null)

const hours = computed(() => {
  const h = Math.floor(timerComposable.elapsedSeconds.value / 3600) || 0
  return String(h).padStart(2, '0')
})

const minutes = computed(() => {
  const m = Math.floor((timerComposable.elapsedSeconds.value % 3600) / 60) || 0
  return String(m).padStart(2, '0')
})

const seconds = computed(() => {
  const s = timerComposable.elapsedSeconds.value % 60 || 0
  return String(s).padStart(2, '0')
})

const handleBreak = async () => {
  if (isPaused.value) {
    await timerComposable.resumeTimer()
  } else {
    await timerComposable.pauseTimer()
  }
}

const handleStop = async () => {
  const timeLog = await timerComposable.stopTimer()
  if (timeLog) {
    console.log('Time log created:', timeLog)
  }
}

const handleStartTimer = async (taskId: number) => {
  await timerComposable.startTimer(taskId)
}

onMounted(async () => {
  await timerComposable.getActiveTimer()
})

onUnmounted(() => {
  // Cleanup if needed
})

watch(() => timerComposable.error.value, () => {
  if (timerComposable.error.value) {
    setTimeout(() => timerComposable.clearError(), 5000)
  }
})
</script>
