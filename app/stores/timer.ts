import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Timer, TimeLog } from '~/types/timer'

export const useTimerStore = defineStore('timer', () => {
  // State
  const activeTimer = ref<Timer | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  
  // Frontend-only state for local timer management
  const localStartTime = ref<number | null>(null)
  const localPauseTime = ref<number | null>(null)
  const localPausedDuration = ref<number>(0)
  const currentTime = ref<number>(Date.now())
  
  // Timer interval
  let timerInterval: NodeJS.Timeout | null = null

  // Computed
  const isRunning = computed(() => {
    return activeTimer.value !== null && localPauseTime.value === null
  })

  const isPaused = computed(() => {
    return localPauseTime.value !== null
  })

  const elapsedSeconds = computed(() => {
    if (!localStartTime.value) return 0

    if (localPauseTime.value) {
      // Timer is paused - calculate up to pause time
      const totalSeconds = Math.floor((localPauseTime.value - localStartTime.value) / 1000)
      return Math.max(0, totalSeconds - localPausedDuration.value)
    } else {
      // Timer is running - use current time
      const totalSeconds = Math.floor((currentTime.value - localStartTime.value) / 1000)
      return Math.max(0, totalSeconds - localPausedDuration.value)
    }
  })

  const formattedTime = computed(() => {
    const total = elapsedSeconds.value
    const h = Math.floor(total / 3600)
    const m = Math.floor((total % 3600) / 60)
    const s = total % 60
    
    return {
      hours: String(h).padStart(2, '0'),
      minutes: String(m).padStart(2, '0'),
      seconds: String(s).padStart(2, '0'),
    }
  })

  // Actions
  const startTimerInterval = () => {
    if (timerInterval) {
      clearInterval(timerInterval)
    }
    // Update every 100ms for smooth display
    timerInterval = setInterval(() => {
      currentTime.value = Date.now()
    }, 100)
  }

  const stopTimerInterval = () => {
    if (timerInterval) {
      clearInterval(timerInterval)
      timerInterval = null
    }
  }

  const startTimer = async (taskId: number, taskTitle: string = 'Task', notes?: string): Promise<Timer | null> => {
    loading.value = true
    error.value = null

    try {
      localStartTime.value = Date.now()
      localPauseTime.value = null
      localPausedDuration.value = 0
      currentTime.value = Date.now()

      activeTimer.value = {
        id: 1,
        user_id: 1,
        company_id: 1,
        task_id: taskId,
        project_id: 1,
        task: {
          id: taskId,
          title: taskTitle,
          status: 'in_progress' as const,
        },
        project: {
          id: 1,
          name: 'Project Alpha',
        },
        started_at: new Date(localStartTime.value).toISOString(),
        paused_at: null,
        paused_duration_seconds: 0,
        is_running: true,
        is_paused: false,
        notes: notes || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      } as Timer

      startTimerInterval()
      return activeTimer.value
    } catch (e: any) {
      error.value = e.message || 'Failed to start timer'
      return null
    } finally {
      loading.value = false
    }
  }

  const pauseTimer = async (): Promise<Timer | null> => {
    if (!activeTimer.value) {
      error.value = 'No active timer to pause'
      return null
    }

    loading.value = true
    error.value = null

    try {
      localPauseTime.value = Date.now()
      
      if (activeTimer.value) {
        activeTimer.value.is_paused = true
        activeTimer.value.is_running = false
        activeTimer.value.paused_at = new Date(localPauseTime.value).toISOString()
      }

      stopTimerInterval()
      return activeTimer.value
    } catch (e: any) {
      error.value = e.message || 'Failed to pause timer'
      return null
    } finally {
      loading.value = false
    }
  }

  const resumeTimer = async (): Promise<Timer | null> => {
    if (!activeTimer.value) {
      error.value = 'No active timer to resume'
      return null
    }

    loading.value = true
    error.value = null

    try {
      if (localPauseTime.value) {
        const pauseDuration = Math.floor((Date.now() - localPauseTime.value) / 1000)
        localPausedDuration.value += pauseDuration
        localPauseTime.value = null
        currentTime.value = Date.now()

        if (activeTimer.value) {
          activeTimer.value.is_paused = false
          activeTimer.value.is_running = true
          activeTimer.value.paused_at = null
          activeTimer.value.paused_duration_seconds = localPausedDuration.value
        }

        startTimerInterval()
      }

      return activeTimer.value
    } catch (e: any) {
      error.value = e.message || 'Failed to resume timer'
      return null
    } finally {
      loading.value = false
    }
  }

  const stopTimer = async (description?: string): Promise<TimeLog | null> => {
    if (!activeTimer.value) {
      error.value = 'No active timer to stop'
      return null
    }

    loading.value = true
    error.value = null

    try {
      const finalDuration = elapsedSeconds.value

      const timeLog: TimeLog = {
        id: Date.now(),
        task_id: activeTimer.value.task_id,
        user_id: 1,
        date_logged: new Date().toISOString().split('T')[0] || '',
        start_time: localStartTime.value ? new Date(localStartTime.value).toISOString() : new Date().toISOString(),
        end_time: new Date().toISOString(),
        duration_seconds: finalDuration,
        duration_hours: Number((finalDuration / 3600).toFixed(2)),
        description: description || null,
        status: 'logged' as const,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      // Reset state
      activeTimer.value = null
      localStartTime.value = null
      localPauseTime.value = null
      localPausedDuration.value = 0
      stopTimerInterval()

      return timeLog
    } catch (e: any) {
      error.value = e.message || 'Failed to stop timer'
      return null
    } finally {
      loading.value = false
    }
  }

  const clearError = () => {
    error.value = null
  }

  // Cleanup on unmount
  const cleanup = () => {
    stopTimerInterval()
  }

  // Initialize timer interval if there's an active timer
  const initialize = () => {
    if (activeTimer.value && !localPauseTime.value) {
      startTimerInterval()
    }
  }

  // Auto-initialize on store creation
  if (typeof window !== 'undefined') {
    initialize()
  }

  return {
    // State
    activeTimer,
    loading,
    error,
    
    // Computed
    isRunning,
    isPaused,
    elapsedSeconds,
    formattedTime,
    
    // Actions
    startTimer,
    pauseTimer,
    resumeTimer,
    stopTimer,
    clearError,
    cleanup,
  }
}, {
  persist: {
    storage: typeof window !== 'undefined' ? localStorage : undefined,
    pick: ['localStartTime', 'localPauseTime', 'localPausedDuration', 'activeTimer'],
  },
})
