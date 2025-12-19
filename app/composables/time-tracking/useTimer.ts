/**
 * Composable: useTimer
 * Manages active timer state and API interactions
 * 
 * Handles:
 * - Getting active timer
 * - Starting a new timer
 * - Pausing/resuming timer
 * - Stopping timer and creating time log
 * - Discarding active timer
 */

import { ref, computed } from 'vue'
import type { Timer, TimeLog } from '~/types/timer'

interface UseTimerReturn {
  // State
  activeTimer: Timer | null
  loading: boolean
  error: string | null
  
  // Computed
  isRunning: boolean
  isPaused: boolean
  elapsedSeconds: number
  
  // Actions
  getActiveTimer: () => Promise<Timer | null>
  startTimer: (taskId: number, notes?: string) => Promise<Timer | null>
  pauseTimer: () => Promise<Timer | null>
  resumeTimer: () => Promise<Timer | null>
  stopTimer: (description?: string) => Promise<TimeLog | null>
  discardTimer: () => Promise<boolean>
  clearError: () => void
}

export const useTimer = (): UseTimerReturn => {
  // ============ State ============
  const activeTimer = ref<Timer | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // ============ Computed ============
  const isRunning = computed(() => activeTimer.value?.is_running ?? false)
  
  const isPaused = computed(() => activeTimer.value?.is_paused ?? false)
  
  const elapsedSeconds = computed(() => {
    if (!activeTimer.value) return 0
    
    const startedAt = new Date(activeTimer.value.started_at).getTime()
    const now = Date.now()
    const totalSeconds = Math.floor((now - startedAt) / 1000)
    const pausedSeconds = activeTimer.value.paused_duration_seconds
    
    return Math.max(0, totalSeconds - pausedSeconds)
  })

  // ============ Actions ============

  /**
   * Fetch active timer from backend
   */
  const getActiveTimer = async (): Promise<Timer | null> => {
    loading.value = true
    error.value = null
    
    try {
      const data = await $fetch<{ timer: Timer | null }>('/api/timers/active')
      activeTimer.value = data.timer
      return data.timer
    } catch (e: any) {
      error.value = e.data?.message || 'Failed to fetch active timer'
      console.error('Error fetching active timer:', e)
      return null
    } finally {
      loading.value = false
    }
  }

  /**
   * Start a new timer for a task
   */
  const startTimer = async (taskId: number, notes?: string): Promise<Timer | null> => {
    loading.value = true
    error.value = null
    
    try {
      const data = await $fetch<{ timer: Timer; message: string }>('/api/timers/start', {
        method: 'POST',
        body: {
          task_id: taskId,
          notes: notes || null,
        },
      })
      
      activeTimer.value = data.timer
      return data.timer
    } catch (e: any) {
      error.value = e.data?.message || 'Failed to start timer'
      console.error('Error starting timer:', e)
      return null
    } finally {
      loading.value = false
    }
  }

  /**
   * Pause active timer
   */
  const pauseTimer = async (): Promise<Timer | null> => {
    if (!activeTimer.value) {
      error.value = 'No active timer to pause'
      return null
    }
    
    loading.value = true
    error.value = null
    
    try {
      const data = await $fetch<{ timer: Timer }>('/api/timers/active/pause', {
        method: 'PATCH',
      })
      
      activeTimer.value = data.timer
      return data.timer
    } catch (e: any) {
      error.value = e.data?.message || 'Failed to pause timer'
      console.error('Error pausing timer:', e)
      return null
    } finally {
      loading.value = false
    }
  }

  /**
   * Resume paused timer
   */
  const resumeTimer = async (): Promise<Timer | null> => {
    if (!activeTimer.value) {
      error.value = 'No active timer to resume'
      return null
    }
    
    loading.value = true
    error.value = null
    
    try {
      const data = await $fetch<{ timer: Timer }>('/api/timers/active/resume', {
        method: 'PATCH',
      })
      
      activeTimer.value = data.timer
      return data.timer
    } catch (e: any) {
      error.value = e.data?.message || 'Failed to resume timer'
      console.error('Error resuming timer:', e)
      return null
    } finally {
      loading.value = false
    }
  }

  /**
   * Stop active timer and create time log
   */
  const stopTimer = async (description?: string): Promise<TimeLog | null> => {
    if (!activeTimer.value) {
      error.value = 'No active timer to stop'
      return null
    }
    
    loading.value = true
    error.value = null
    
    try {
      const data = await $fetch<{ time_log: TimeLog; message: string }>('/api/timers/active/stop', {
        method: 'POST',
        body: {
          task_id: activeTimer.value.task_id,
          description: description || null,
        },
      })
      
      activeTimer.value = null
      return data.time_log
    } catch (e: any) {
      error.value = e.data?.message || 'Failed to stop timer'
      console.error('Error stopping timer:', e)
      return null
    } finally {
      loading.value = false
    }
  }

  /**
   * Discard active timer without saving
   */
  const discardTimer = async (): Promise<boolean> => {
    if (!activeTimer.value) {
      error.value = 'No active timer to discard'
      return false
    }
    
    loading.value = true
    error.value = null
    
    try {
      await $fetch('/api/timers/active', {
        method: 'DELETE',
      })
      
      activeTimer.value = null
      return true
    } catch (e: any) {
      error.value = e.data?.message || 'Failed to discard timer'
      console.error('Error discarding timer:', e)
      return false
    } finally {
      loading.value = false
    }
  }

  /**
   * Clear error state
   */
  const clearError = () => {
    error.value = null
  }

  return {
    // State
    activeTimer: activeTimer.value,
    loading: loading.value,
    error: error.value,
    
    // Computed
    isRunning: isRunning.value,
    isPaused: isPaused.value,
    elapsedSeconds: elapsedSeconds.value,
    
    // Actions
    getActiveTimer,
    startTimer,
    pauseTimer,
    resumeTimer,
    stopTimer,
    discardTimer,
    clearError,
  }
}
