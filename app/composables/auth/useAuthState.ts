import { ref, computed } from 'vue'

interface User {
  id: string
  email: string
  name: string
  role: 'owner' | 'admin' | 'manager' | 'employee'
  company_id: string
  tenant_id: string
  avatar?: string
}

const currentUser = ref<User | null>(null)
const isAuthenticated = ref(false)

export const useAuthState = () => {
  /**
   * Set current user after login
   */
  const setUser = (user: User) => {
    currentUser.value = user
    isAuthenticated.value = true
  }

  /**
   * Clear user on logout
   */
  const clearUser = () => {
    currentUser.value = null
    isAuthenticated.value = false
  }

  /**
   * Check if user has specific role
   */
  const hasRole = (role: string | string[]) => {
    if (!currentUser.value) return false
    const roles = Array.isArray(role) ? role : [role]
    return roles.includes(currentUser.value.role)
  }

  /**
   * Check if user is owner/admin
   */
  const isOwner = computed(() => currentUser.value?.role === 'owner')
  const isAdmin = computed(() => currentUser.value?.role === 'admin')
  const isManager = computed(() => 
    currentUser.value?.role === 'manager' || 
    currentUser.value?.role === 'admin' ||
    currentUser.value?.role === 'owner'
  )

  /**
   * Get user display name
   */
  const displayName = computed(() => currentUser.value?.name || 'User')

  /**
   * Get user email
   */
  const email = computed(() => currentUser.value?.email || '')

  /**
   * Get user role label
   */
  const roleLabel = computed(() => {
    const labels: Record<string, string> = {
      owner: 'Owner',
      admin: 'Administrator',
      manager: 'Manager',
      employee: 'Employee',
    }
    return labels[currentUser.value?.role || 'employee'] || 'Employee'
  })

  return {
    currentUser,
    isAuthenticated,
    setUser,
    clearUser,
    hasRole,
    isOwner,
    isAdmin,
    isManager,
    displayName,
    email,
    roleLabel,
  }
}
