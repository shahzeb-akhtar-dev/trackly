import { computed } from 'vue'
import { useTimerStore } from '~/stores/timer'

/**
 * Composable: useTimer
 * Manages active timer state using Pinia store for global synchronization
 * 
 * Features:
 * - Start/pause/resume/stop timer
 * - Track elapsed time with auto-updates
 * - Synchronized across all components (Header and Dashboard)
 * 
 * NOTE: This composable wraps the Pinia store to provide a convenient API.
 * The store handles the actual state management and timer intervals.
 */
export const useTimer = () => {
  const timerStore = useTimerStore()

  return {
    // State
    activeTimer: computed(() => timerStore.activeTimer),
    loading: computed(() => timerStore.loading),
    error: computed(() => timerStore.error),
    
    // Computed
    isRunning: computed(() => timerStore.isRunning),
    isPaused: computed(() => timerStore.isPaused),
    elapsedSeconds: computed(() => timerStore.elapsedSeconds),
    formattedTime: computed(() => timerStore.formattedTime),
    
    // Actions
    startTimer: timerStore.startTimer,
    pauseTimer: timerStore.pauseTimer,
    resumeTimer: timerStore.resumeTimer,
    stopTimer: timerStore.stopTimer,
    clearError: timerStore.clearError,
  }
}
