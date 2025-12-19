<template>
  <!-- Block Variant - Dashboard -->
  <div v-if="variant === 'block'" class="w-full bg-white border border-gray-200 rounded-2xl p-8">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <h3 class="text-gray-600 text-sm font-medium">Current Session</h3>
      <span class="px-3 py-1 bg-emerald-50 text-emerald-600 text-xs font-semibold rounded-full">
        ACTIVE
      </span>
    </div>

    <!-- Task Title -->
    <h2 class="text-2xl font-bold text-gray-900 mb-8">{{ taskName }}</h2>

    <!-- Timer Display -->
    <div class="flex items-center justify-center gap-3 mb-10">
      <!-- Hours -->
      <div class="flex flex-col items-center">
        <div class="w-20 h-20 flex items-center justify-center bg-gray-100 rounded-2xl">
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
        <div class="w-20 h-20 flex items-center justify-center bg-gray-100 rounded-2xl">
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
        <div class="w-20 h-20 flex items-center justify-center bg-blue-50 border-2 border-blue-200 rounded-2xl">
          <span class="text-3xl font-bold text-blue-600">{{ seconds }}</span>
        </div>
        <span class="text-xs font-medium text-blue-600 uppercase mt-2">Seconds</span>
      </div>
    </div>

    <!-- Error Message -->
    <div v-if="timerComposable.error" class="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg">
      <p class="text-sm text-red-600">{{ timerComposable.error }}</p>
    </div>

    <!-- Action Buttons -->
    <div class="flex items-center gap-4">
      <!-- Break Button -->
      <button
        :disabled="timerComposable.loading"
        class="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-900 font-semibold rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        @click="handleBreak"
      >
        <Icon v-if="!timerComposable.isPaused" name="tabler:player-pause" class="w-5 h-5" />
        <Icon v-else name="tabler:player-play" class="w-5 h-5" />
        <span>{{ timerComposable.isPaused ? 'Resume' : 'Break' }}</span>
      </button>

      <!-- Stop Button -->
      <button
        :disabled="timerComposable.loading"
        class="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        @click="handleStop"
      >
        <Icon name="tabler:player-stop" class="w-5 h-5" />
        <span>Stop</span>
      </button>
    </div>
  </div>

  <!-- Inline Variant - Header -->
  <div v-if="variant === 'inline' && timerComposable.activeTimer" class="hidden md:flex items-center gap-4 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl">
    <!-- Task Name -->
    <span class="text-sm text-gray-700 font-medium truncate max-w-[150px]">
      {{ taskName }}
    </span>

    <!-- Timer -->
    <span class="text-gray-900 font-bold text-sm tabular-nums">
      {{ hours }}:{{ minutes }}:{{ seconds }}
    </span>

    <!-- Action Buttons -->
    <div class="flex items-center gap-1 ml-2 pl-2 border-l border-gray-200">
      <!-- Break Button -->
      <button
        :disabled="timerComposable.loading"
        class="p-1.5 text-gray-500 hover:bg-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        @click="handleBreak"
        :title="timerComposable.isPaused ? 'Resume' : 'Break'"
      >
        <Icon v-if="!timerComposable.isPaused" name="tabler:player-pause" class="w-4 h-4" />
        <Icon v-else name="tabler:player-play" class="w-4 h-4" />
      </button>

      <!-- Stop Button -->
      <button
        :disabled="timerComposable.loading"
        class="p-1.5 text-gray-500 hover:bg-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        @click="handleStop"
        title="Stop"
      >
        <Icon name="tabler:player-stop" class="w-4 h-4" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useTimer } from '~/composables/time-tracking/useTimer'

interface Props {
  /**
   * Timer variant
   * - 'block': Full dashboard widget
   * - 'inline': Compact header widget
   */
  variant: 'block' | 'inline'
  
  /**
   * Active task name/title
   */
  taskName: string
}

defineProps<Props>()

defineEmits<{
  'break': []
  'stop': []
}>()

// ============ Composables ============
const timerComposable = useTimer()

// ============ State ============
let intervalId: NodeJS.Timeout | null = null

// ============ Computed ============
const hours = computed(() => {
  const h = Math.floor(timerComposable.elapsedSeconds / 3600) || 0
  return String(h).padStart(2, '0')
})

const minutes = computed(() => {
  const m = Math.floor((timerComposable.elapsedSeconds % 3600) / 60) || 0
  return String(m).padStart(2, '0')
})

const seconds = computed(() => {
  const s = timerComposable.elapsedSeconds % 60 || 0
  return String(s).padStart(2, '0')
})

// ============ Methods ============

/**
 * Handle break/resume action
 */
const handleBreak = async () => {
  if (timerComposable.isPaused) {
    await timerComposable.resumeTimer()
  } else {
    await timerComposable.pauseTimer()
  }
}

/**
 * Handle stop action
 */
const handleStop = async () => {
  const timeLog = await timerComposable.stopTimer()
  if (timeLog) {
    // Emit success event to parent
    console.log('Time log created:', timeLog)
  }
}

/**
 * Keep timer updated with server state
 */
const syncTimer = async () => {
  await timerComposable.getActiveTimer()
}

// ============ Lifecycle ============
onMounted(async () => {
  // Fetch initial timer state
  await timerComposable.getActiveTimer()
  
  // Sync every 30 seconds to verify state
  intervalId = setInterval(syncTimer, 30000)
})

onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId)
  }
})

// Clear error when variant changes
watch(() => timerComposable.error, () => {
  if (timerComposable.error) {
    setTimeout(() => timerComposable.clearError(), 5000)
  }
})
</script>

