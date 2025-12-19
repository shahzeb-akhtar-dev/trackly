/**
 * Time Tracking System - Implementation Guide
 * 
 * This document outlines how to use the time tracking composable and component
 * throughout the application following Trackly's architecture patterns.
 */

// ============ BASIC USAGE ============

/**
 * Using in any component that needs timer actions
 */

import { useTimer } from '~/composables/time-tracking/useTimer'

export default {
  setup() {
    const timer = useTimer()

    // Start a timer for task ID 42
    const startTracking = async () => {
      const timerResult = await timer.startTimer(42, 'Fixing login bug')
      if (timerResult) {
        console.log('Timer started:', timerResult.id)
      } else {
        console.error('Failed to start timer:', timer.error)
      }
    }

    // Check if timer is running
    const isWorking = computed(() => timer.isRunning)

    // Break/pause the timer
    const takeBreak = async () => {
      await timer.pauseTimer()
    }

    // Resume after break
    const continueWork = async () => {
      await timer.resumeTimer()
    }

    // Stop timer and save time log
    const finishWork = async () => {
      const timeLog = await timer.stopTimer('Completed login authentication')
      if (timeLog) {
        // Show success notification
        console.log('Time logged:', timeLog.duration_hours, 'hours')
      }
    }

    return {
      timer,
      startTracking,
      isWorking,
      takeBreak,
      continueWork,
      finishWork,
    }
  },
}

// ============ COMPONENT INTEGRATION ============

/**
 * Using TimerWidget in different layouts
 */

// In dashboard page (block variant):
<template>
  <div class="p-6">
    <TimerWidget 
      variant="block" 
      taskName="Current Project Task"
    />
  </div>
</template>

// In header (inline variant - already integrated):
<template>
  <header>
    <TimerWidget 
      variant="inline" 
      taskName="Working on Feature X"
    />
  </header>
</template>

// ============ STATE MANAGEMENT ============

/**
 * Composable returns reactive state
 */

const timer = useTimer()

// Accessing state
console.log(timer.activeTimer)      // Current timer object or null
console.log(timer.loading)          // Boolean - true during API calls
console.log(timer.error)            // Error message or null
console.log(timer.isRunning)        // Computed - is timer actively running
console.log(timer.isPaused)         // Computed - is timer paused
console.log(timer.elapsedSeconds)   // Computed - seconds elapsed since start

// ============ ERROR HANDLING ============

/**
 * Always check for errors after API calls
 */

const startTimer = async () => {
  const result = await timer.startTimer(123)
  
  if (!result) {
    // Error occurred
    if (timer.error.includes('active timer')) {
      showModal('Stop your current timer first')
    } else if (timer.error.includes('assigned')) {
      showModal('Task not assigned to you')
    } else {
      showModal('Failed to start timer: ' + timer.error)
    }
    return
  }

  // Success
  showNotification('Timer started!')
}

// Auto-clear errors after 5 seconds
watch(() => timer.error, (newError) => {
  if (newError) {
    setTimeout(() => timer.clearError(), 5000)
  }
})

// ============ COMPUTED VALUES FOR UI ============

/**
 * Format time for display
 */

const displayTime = computed(() => {
  const hours = Math.floor(timer.elapsedSeconds / 3600)
  const minutes = Math.floor((timer.elapsedSeconds % 3600) / 60)
  const seconds = timer.elapsedSeconds % 60
  
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
})

const displayStatus = computed(() => {
  if (!timer.activeTimer) return 'No timer running'
  if (timer.isPaused) return 'Timer paused'
  if (timer.isRunning) return 'Timer running'
  return 'Timer stopped'
})

// ============ LIFECYCLE PATTERNS ============

/**
 * Fetch timer state on component mount
 */

onMounted(async () => {
  // Check if user has active timer
  await timer.getActiveTimer()
  
  if (timer.activeTimer) {
    // Resume UI if timer is running
    startAutoUpdate()
  }
})

/**
 * Clean up on component unmount
 */

onUnmounted(() => {
  clearInterval(autoUpdateInterval)
})

/**
 * Periodic sync with server (recommended every 30s)
 */

let autoUpdateInterval: NodeJS.Timeout | null = null

const startAutoUpdate = () => {
  autoUpdateInterval = setInterval(async () => {
    await timer.getActiveTimer()
  }, 30000) // 30 seconds
}

// ============ FULL PAGE EXAMPLE ============

/**
 * Complete page implementation
 */

<template>
  <div class="page-container">
    <!-- Error Alert -->
    <div v-if="timer.error" class="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
      <p class="text-red-600">{{ timer.error }}</p>
    </div>

    <!-- Timer Status -->
    <div v-if="!timer.activeTimer" class="mb-6">
      <p class="text-gray-600">No active timer</p>
      <button 
        @click="startNewTimer"
        class="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg"
      >
        Start Timer
      </button>
    </div>

    <!-- Active Timer Widget -->
    <TimerWidget 
      v-else
      variant="block"
      :taskName="timer.activeTimer.task.title"
    />

    <!-- Timer Details -->
    <div v-if="timer.activeTimer" class="mt-6 p-4 bg-gray-50 rounded-lg">
      <p class="text-sm text-gray-600">
        <strong>Elapsed:</strong> {{ displayTime }}
      </p>
      <p class="text-sm text-gray-600">
        <strong>Status:</strong> {{ displayStatus }}
      </p>
      <p class="text-sm text-gray-600">
        <strong>Project:</strong> {{ timer.activeTimer.project.name }}
      </p>
    </div>

    <!-- Action Buttons -->
    <div v-if="timer.activeTimer" class="mt-6 flex gap-2">
      <button
        :disabled="timer.loading"
        @click="togglePause"
        class="px-4 py-2 bg-amber-500 text-white rounded-lg disabled:opacity-50"
      >
        {{ timer.isPaused ? 'Resume' : 'Break' }}
      </button>
      <button
        :disabled="timer.loading"
        @click="stopTimer"
        class="px-4 py-2 bg-red-500 text-white rounded-lg disabled:opacity-50"
      >
        Stop
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useTimer } from '~/composables/time-tracking/useTimer'
import TimerWidget from '~/components/time-tracking/TimerWidget.vue'

const timer = useTimer()
let autoUpdateInterval: NodeJS.Timeout | null = null

// Computed
const displayTime = computed(() => {
  const h = Math.floor(timer.elapsedSeconds / 3600)
  const m = Math.floor((timer.elapsedSeconds % 3600) / 60)
  const s = timer.elapsedSeconds % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
})

const displayStatus = computed(() => {
  if (!timer.activeTimer) return 'No timer running'
  if (timer.isPaused) return 'Timer paused'
  if (timer.isRunning) return 'Timer running'
  return 'Timer stopped'
})

// Methods
const startNewTimer = async () => {
  // TODO: Show task selector modal
  const taskId = 42 // Selected task ID
  await timer.startTimer(taskId)
}

const togglePause = async () => {
  if (timer.isPaused) {
    await timer.resumeTimer()
  } else {
    await timer.pauseTimer()
  }
}

const stopTimer = async () => {
  const timeLog = await timer.stopTimer('Task completed')
  if (timeLog) {
    console.log('Time logged successfully')
  }
}

const syncWithServer = async () => {
  await timer.getActiveTimer()
}

// Lifecycle
onMounted(async () => {
  await timer.getActiveTimer()
  
  if (timer.activeTimer) {
    autoUpdateInterval = setInterval(syncWithServer, 30000)
  }
})

onUnmounted(() => {
  if (autoUpdateInterval) {
    clearInterval(autoUpdateInterval)
  }
})

// Clear errors after 5 seconds
watch(() => timer.error, (newError) => {
  if (newError) {
    setTimeout(() => timer.clearError(), 5000)
  }
})
</script>

// ============ TESTING EXAMPLES ============

/**
 * Unit tests for useTimer composable
 */

describe('useTimer composable', () => {
  it('should start a timer', async () => {
    const { startTimer, activeTimer } = useTimer()
    
    const timer = await startTimer(123)
    
    expect(timer).toBeDefined()
    expect(activeTimer.value?.task_id).toBe(123)
  })

  it('should pause and resume timer', async () => {
    const { pauseTimer, resumeTimer, isPaused } = useTimer()
    
    await pauseTimer()
    expect(isPaused.value).toBe(true)
    
    await resumeTimer()
    expect(isPaused.value).toBe(false)
  })

  it('should calculate elapsed seconds', () => {
    const { elapsedSeconds } = useTimer()
    
    // After 1 second
    expect(elapsedSeconds.value).toBeGreaterThan(0)
  })
})

// ============ TROUBLESHOOTING ============

/**
 * Common issues and solutions
 */

// Issue: Timer not starting
// Solution: Check if user already has active timer
if (timer.error?.includes('active timer')) {
  await timer.discardTimer() // or stopTimer()
  await timer.startTimer(taskId)
}

// Issue: Error not clearing
// Solution: Manually clear error
timer.clearError()

// Issue: Timer not syncing
// Solution: Ensure interval is set and not cleared
onMounted(() => {
  const interval = setInterval(() => timer.getActiveTimer(), 30000)
  onUnmounted(() => clearInterval(interval))
})

// Issue: Memory leak
// Solution: Always clear intervals in onUnmounted
onUnmounted(() => {
  if (intervalId) clearInterval(intervalId)
})
