/**
 * Store: useAuthStore
 * Manages authentication state (user, token, permissions)
 * Persisted to localStorage
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

interface User {
  id: string
  name: string
  email: string
  avatar?: string
  role: string
}

export const useAuthStore = defineStore('auth', () => {
  // ============ State ============
  
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)
  const isAuthenticated = ref(false)
  const permissions = ref<string[]>([])

  // ============ Getters ============

  const currentUser = computed(() => user.value)
  const isLoggedIn = computed(() => isAuthenticated.value)
  const hasPermission = (permission: string) => permissions.value.includes(permission)

  // ============ Actions ============

  const setUser = (newUser: User) => {
    user.value = newUser
    isAuthenticated.value = true
  }

  const setToken = (newToken: string) => {
    token.value = newToken
  }

  const setPermissions = (newPermissions: string[]) => {
    permissions.value = newPermissions
  }

  const logout = () => {
    user.value = null
    token.value = null
    isAuthenticated.value = false
    permissions.value = []
  }

  return {
    // State
    user,
    token,
    isAuthenticated,
    permissions,

    // Getters
    currentUser,
    isLoggedIn,
    hasPermission,

    // Actions
    setUser,
    setToken,
    setPermissions,
    logout,
  }
}, {
  persist: {
    pick: ['token', 'user', 'isAuthenticated'],
  },
})
