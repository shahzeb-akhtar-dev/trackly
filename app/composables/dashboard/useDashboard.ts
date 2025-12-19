/**
 * Composable: useDashboard
 * Fetches all dashboard data: stats, charts, activity, requests
 */

import { ref } from 'vue'
import type { DashboardData } from '~/types/dashboard'

interface UseDashboardReturn {
  dashboardData: DashboardData | null
  loading: boolean
  error: string | null
  fetchDashboard: () => Promise<DashboardData | null>
}

export const useDashboard = (): UseDashboardReturn => {
  // ============ State ============
  const dashboardData = ref<DashboardData | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // ============ Actions ============

  /**
   * Fetch all dashboard data from backend
   */
  const fetchDashboard = async (): Promise<DashboardData | null> => {
    loading.value = true
    error.value = null

    try {
      const data = await $fetch<DashboardData>('/api/dashboard')
      dashboardData.value = data
      return data
    } catch (e: any) {
      error.value = e.data?.message || 'Failed to fetch dashboard data'
      console.error('Error fetching dashboard:', e)
      return null
    } finally {
      loading.value = false
    }
  }

  return {
    dashboardData: dashboardData.value,
    loading: loading.value,
    error: error.value,
    fetchDashboard,
  }
}
