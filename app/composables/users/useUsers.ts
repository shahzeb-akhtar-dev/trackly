/**
 * User Management Composable
 * Handles API calls for fetching and managing users
 */

import { ref, computed } from 'vue'
import type { User, UserStats, UsersResponse, UserFilter } from '~/types/users'

export const useUsers = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const users = ref<User[]>([])
  const stats = ref({
    totalUsers: 142,
    activeUsers: 128,
    pendingInvites: 14,
    totalUsersChange: 12,
    activeUsersChange: 8,
    pendingInvitesChange: 3,
  })

  const currentPage = ref(1)
  const pageSize = ref(10)
  const totalUsers = ref(142)

  // Mock data for demonstration
  const mockUsers: User[] = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@company.com',
      avatar: 'JD',
      role: 'Administrator',
      department: 'Engineering',
      jobTitle: 'CTO',
      status: 'active',
      hireDate: 'Jan 14, 2020',
      createdAt: '2020-01-14T00:00:00Z',
      updatedAt: '2025-01-06T00:00:00Z',
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane.smith@company.com',
      avatar: 'JS',
      role: 'Manager',
      department: 'Human Resources',
      jobTitle: 'HR Director',
      status: 'active',
      hireDate: 'Mar 02, 2021',
      createdAt: '2021-03-02T00:00:00Z',
      updatedAt: '2025-01-06T00:00:00Z',
    },
    {
      id: 3,
      name: 'Michael Ross',
      email: 'michael.ross@company.com',
      avatar: 'MR',
      role: 'Editor',
      department: 'Marketing',
      jobTitle: 'Content Writer',
      status: 'pending',
      hireDate: 'Sep 15, 2023',
      createdAt: '2023-09-15T00:00:00Z',
      updatedAt: '2025-01-06T00:00:00Z',
    },
    {
      id: 4,
      name: 'Sarah Connor',
      email: 'sarah.connor@company.com',
      avatar: 'SC',
      role: 'Viewer',
      department: 'Operations',
      jobTitle: 'Coordinator',
      status: 'inactive',
      hireDate: 'Nov 20, 2019',
      createdAt: '2019-11-20T00:00:00Z',
      updatedAt: '2025-01-06T00:00:00Z',
    },
    {
      id: 5,
      name: 'Alex Johnson',
      email: 'alex.j@company.com',
      avatar: 'AJ',
      role: 'Admin',
      department: 'IT',
      jobTitle: 'System Admin',
      status: 'active',
      hireDate: 'Jun 10, 2022',
      createdAt: '2022-06-10T00:00:00Z',
      updatedAt: '2025-01-06T00:00:00Z',
    },
  ]

  /**
   * Fetch users list with pagination and filters
   */
  const fetchUsers = async (filters?: UserFilter, page = 1) => {
    loading.value = true
    error.value = null

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      currentPage.value = page
      users.value = mockUsers
      totalUsers.value = 142

      return users.value
    } catch (e: any) {
      error.value = e?.data?.message || 'Failed to fetch users'
      console.error('Failed to fetch users:', error.value)
      throw e
    } finally {
      loading.value = false
    }
  }

  /**
   * Get user stats
   */
  const getStats = async () => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 300))
      return stats.value
    } catch (e: any) {
      error.value = e?.data?.message || 'Failed to fetch stats'
      console.error('Failed to fetch stats:', error.value)
      throw e
    }
  }

  /**
   * Create new user
   */
  const createUser = async (userData: Partial<User>) => {
    loading.value = true
    error.value = null

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      const newUser: User = {
        id: Math.max(...users.value.map((u) => u.id), 0) + 1,
        name: userData.name || '',
        email: userData.email || '',
        role: userData.role || 'Viewer',
        department: userData.department || '',
        jobTitle: userData.jobTitle || '',
        status: 'pending',
        hireDate: new Date().toLocaleDateString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      users.value.unshift(newUser)
      return newUser
    } catch (e: any) {
      error.value = e?.data?.message || 'Failed to create user'
      console.error('Failed to create user:', error.value)
      throw e
    } finally {
      loading.value = false
    }
  }

  /**
   * Delete user
   */
  const deleteUser = async (userId: number) => {
    loading.value = true
    error.value = null

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      users.value = users.value.filter((u) => u.id !== userId)
      totalUsers.value -= 1

      return true
    } catch (e: any) {
      error.value = e?.data?.message || 'Failed to delete user'
      console.error('Failed to delete user:', error.value)
      throw e
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
    loading,
    error,
    users,
    stats,
    currentPage,
    pageSize,
    totalUsers,
    fetchUsers,
    getStats,
    createUser,
    deleteUser,
    clearError,
  }
}
