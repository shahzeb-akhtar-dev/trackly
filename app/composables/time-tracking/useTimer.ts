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
 * 
 * NOTE: API calls are currently commented out for frontend-only operation.
 * When ready to integrate with backend:
 * 1. Uncomment the API calls in each function
 * 2. Remove the frontend-only mock logic
 * 3. Consider using WebSockets or Server-Sent Events for real-time updates
 *    instead of polling every few seconds (reduces server load)
 */

import { ref, computed } from 'vue'
import type { Timer, TimeLog } from '~/types/timer'

export const useTimer = () => {
  // ============ State ============
  const activeTimer = ref<Timer | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Frontend-only state for local timer management
  const localStartTime = ref<number | null>(null)
  const localPauseTime = ref<number | null>(null)
  const localPausedDuration = ref<number>(0) // Total paused time in seconds

  // ============ Computed ============
  const isRunning = computed(() => {
    // If using API: activeTimer.value?.is_running ?? false
    // Frontend-only: check if timer is started and not paused
    return activeTimer.value !== null && localPauseTime.value === null
  })
  
  const isPaused = computed(() => {
    // If using API: activeTimer.value?.is_paused ?? false
    // Frontend-only: check if paused
    return localPauseTime.value !== null
  })
  
  const elapsedSeconds = computed(() => {
    if (!activeTimer.value && !localStartTime.value) return 0
    
    // Frontend-only calculation
    if (localStartTime.value) {
      const now = Date.now()
      const totalSeconds = Math.floor((now - localStartTime.value) / 1000)
      const pausedSeconds = localPausedDuration.value
      return Math.max(0, totalSeconds - pausedSeconds)
    }
    
    // API-based calculation (when API is enabled)
    // const startedAt = new Date(activeTimer.value.started_at).getTime()
    // const now = Date.now()
    // const totalSeconds = Math.floor((now - startedAt) / 1000)
    // const pausedSeconds = activeTimer.value.paused_duration_seconds
    // return Math.max(0, totalSeconds - pausedSeconds)
    
    return 0
  })

  // ============ Actions ============

  /**
   * Fetch active timer from backend
   * 
   * BEST PRACTICE: Instead of polling every 30 seconds, consider:
   * - WebSockets for real-time bidirectional updates
   * - Server-Sent Events (SSE) for server-to-client updates
   * - Only sync on user actions (pause/resume/stop) or page focus
   */
  const getActiveTimer = async (): Promise<Timer | null> => {
    loading.value = true
    error.value = null
    
    try {
      // ============ API CALL (COMMENTED OUT) ============
      // const data = await $fetch<{ timer: Timer | null }>('/api/timers/active')
      // activeTimer.value = data.timer
      // return data.timer
      
      // ============ FRONTEND-ONLY MOCK ============
      // For demo: create a mock timer if none exists
      if (!activeTimer.value && localStartTime.value) {
        activeTimer.value = {
          id: 1,
          user_id: 1,
          company_id: 1,
          task_id: 1,
          project_id: 1,
          task: {
            id: 1,
            title: 'Redesign Homepage',
            status: 'in_progress' as const,
          },
          project: {
            id: 1,
            name: 'Project Alpha',
          },
          started_at: new Date(localStartTime.value).toISOString(),
          paused_at: localPauseTime.value ? new Date(localPauseTime.value).toISOString() : null,
          paused_duration_seconds: localPausedDuration.value,
          is_running: isRunning.value,
          is_paused: isPaused.value,
          notes: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        } as Timer
      }
      
      return activeTimer.value
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
      // ============ API CALL (COMMENTED OUT) ============
      // const data = await $fetch<{ timer: Timer; message: string }>('/api/timers/start', {
      //   method: 'POST',
      //   body: {
      //     task_id: taskId,
      //     notes: notes || null,
      //   },
      // })
      // activeTimer.value = data.timer
      // return data.timer
      
      // ============ FRONTEND-ONLY MOCK ============
      localStartTime.value = Date.now()
      localPauseTime.value = null
      localPausedDuration.value = 0
      
      activeTimer.value = {
        id: 1,
        user_id: 1,
        company_id: 1,
        task_id: taskId,
        project_id: 1,
        task: {
          id: taskId,
          title: 'Redesign Homepage',
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
      
      return activeTimer.value
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
    if (!activeTimer.value && !localStartTime.value) {
      error.value = 'No active timer to pause'
      return null
    }
    
    loading.value = true
    error.value = null
    
    try {
      // ============ API CALL (COMMENTED OUT) ============
      // const data = await $fetch<{ timer: Timer }>('/api/timers/active/pause', {
      //   method: 'PATCH',
      // })
      // activeTimer.value = data.timer
      // return data.timer
      
      // ============ FRONTEND-ONLY MOCK ============
      if (localStartTime.value && !localPauseTime.value) {
        localPauseTime.value = Date.now()
        
        if (activeTimer.value) {
          activeTimer.value.is_paused = true
          activeTimer.value.is_running = false
          activeTimer.value.paused_at = new Date(localPauseTime.value).toISOString()
        }
      }
      
      return activeTimer.value
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
    if (!activeTimer.value && !localStartTime.value) {
      error.value = 'No active timer to resume'
      return null
    }
    
    loading.value = true
    error.value = null
    
    try {
      // ============ API CALL (COMMENTED OUT) ============
      // const data = await $fetch<{ timer: Timer }>('/api/timers/active/resume', {
      //   method: 'PATCH',
      // })
      // activeTimer.value = data.timer
      // return data.timer
      
      // ============ FRONTEND-ONLY MOCK ============
      if (localPauseTime.value) {
        // Calculate paused duration and add to total
        const pauseDuration = Math.floor((Date.now() - localPauseTime.value) / 1000)
        localPausedDuration.value += pauseDuration
        localPauseTime.value = null
        
        if (activeTimer.value) {
          activeTimer.value.is_paused = false
          activeTimer.value.is_running = true
          activeTimer.value.paused_at = null
          activeTimer.value.paused_duration_seconds = localPausedDuration.value
        }
      }
      
      return activeTimer.value
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
    if (!activeTimer.value && !localStartTime.value) {
      error.value = 'No active timer to stop'
      return null
    }
    
    loading.value = true
    error.value = null
    
    try {
      // ============ API CALL (COMMENTED OUT) ============
      // const data = await $fetch<{ time_log: TimeLog; message: string }>('/api/timers/active/stop', {
      //   method: 'POST',
      //   body: {
      //     task_id: activeTimer.value.task_id,
      //     description: description || null,
      //   },
      // })
      // activeTimer.value = null
      // return data.time_log
      
      // ============ FRONTEND-ONLY MOCK ============
      const finalDuration = elapsedSeconds.value
      
      const timeLog: TimeLog = {
        id: Date.now(),
        task_id: activeTimer.value?.task_id || 1,
        user_id: 1,
        date_logged: new Date().toISOString().split('T')[0],
        start_time: localStartTime.value ? new Date(localStartTime.value).toISOString() : new Date().toISOString(),
        end_time: new Date().toISOString(),
        duration_seconds: finalDuration,
        duration_hours: Number((finalDuration / 3600).toFixed(2)),
        description: description || null,
        status: 'logged' as const,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      
      // Reset timer state
      activeTimer.value = null
      localStartTime.value = null
      localPauseTime.value = null
      localPausedDuration.value = 0
      
      console.log('Time log created (frontend-only):', timeLog)
      return timeLog
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
    if (!activeTimer.value && !localStartTime.value) {
      error.value = 'No active timer to discard'
      return false
    }
    
    loading.value = true
    error.value = null
    
    try {
      // ============ API CALL (COMMENTED OUT) ============
      // await $fetch('/api/timers/active', {
      //   method: 'DELETE',
      // })
      // activeTimer.value = null
      // return true
      
      // ============ FRONTEND-ONLY MOCK ============
      activeTimer.value = null
      localStartTime.value = null
      localPauseTime.value = null
      localPausedDuration.value = 0
      
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
    // State (return refs for reactivity)
    activeTimer,
    loading,
    error,
    
    // Computed
    isRunning,
    isPaused,
    elapsedSeconds,
    
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
