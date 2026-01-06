/**
 * User Filters Composable
 * Manages filter state and configuration for user management page
 */

import { ref, computed } from 'vue'

export interface FilterOption {
  id: string
  label: string
  icon: string
  visible: boolean
}

export interface FilterConfig {
  role: FilterOption
  department: FilterOption
  status: FilterOption
  search: FilterOption
}

export const useUserFilters = () => {
  // Filter values
  const searchQuery = ref('')
  const selectedRole = ref('all')
  const selectedDepartment = ref('all')
  const selectedStatus = ref('all')

  // Filter visibility configuration - customize which filters are shown
  const filterConfig = ref<FilterConfig>({
    search: {
      id: 'search',
      label: 'Search',
      icon: 'i-heroicons-magnifying-glass-20-solid',
      visible: true,
    },
    role: {
      id: 'role',
      label: 'Role',
      icon: 'i-heroicons-user-circle-20-solid',
      visible: true,
    },
    department: {
      id: 'department',
      label: 'Department',
      icon: 'i-heroicons-building-office-20-solid',
      visible: true,
    },
    status: {
      id: 'status',
      label: 'Status',
      icon: 'i-heroicons-check-badge-20-solid',
      visible: true,
    },
  })

  // Available options for each filter
  const roleOptions = ref([
    { label: 'All Roles', value: 'all' },
    { label: 'Administrator', value: 'Administrator' },
    { label: 'Manager', value: 'Manager' },
    { label: 'Editor', value: 'Editor' },
    { label: 'Viewer', value: 'Viewer' },
    { label: 'Admin', value: 'Admin' },
  ])

  const departmentOptions = ref([
    { label: 'All Departments', value: 'all' },
    { label: 'Engineering', value: 'Engineering' },
    { label: 'Human Resources', value: 'Human Resources' },
    { label: 'Marketing', value: 'Marketing' },
    { label: 'Operations', value: 'Operations' },
    { label: 'IT', value: 'IT' },
  ])

  const statusOptions = ref([
    { label: 'All Status', value: 'all' },
    { label: 'Active', value: 'active' },
    { label: 'Inactive', value: 'inactive' },
    { label: 'Pending', value: 'pending' },
  ])

  /**
   * Get visible filters in order
   */
  const visibleFilters = computed(() => {
    return Object.values(filterConfig.value).filter((f) => f.visible)
  })

  /**
   * Toggle filter visibility
   */
  const toggleFilterVisibility = (filterId: string) => {
    const filter = filterConfig.value[filterId as keyof FilterConfig]
    if (filter) {
      filter.visible = !filter.visible
    }
  }

  /**
   * Show all filters
   */
  const showAllFilters = () => {
    Object.values(filterConfig.value).forEach((f) => {
      f.visible = true
    })
  }

  /**
   * Hide all filters (except search)
   */
  const hideAllFilters = () => {
    Object.entries(filterConfig.value).forEach(([key, f]) => {
      if (key !== 'search') {
        f.visible = false
      }
    })
  }

  /**
   * Reset all filter values
   */
  const resetFilters = () => {
    searchQuery.value = ''
    selectedRole.value = 'all'
    selectedDepartment.value = 'all'
    selectedStatus.value = 'all'
  }

  /**
   * Check if any filters are active
   */
  const hasActiveFilters = computed(() => {
    return (
      searchQuery.value !== '' ||
      selectedRole.value !== 'all' ||
      selectedDepartment.value !== 'all' ||
      selectedStatus.value !== 'all'
    )
  })

  /**
   * Get active filter count
   */
  const activeFilterCount = computed(() => {
    let count = 0
    if (searchQuery.value) count++
    if (selectedRole.value !== 'all') count++
    if (selectedDepartment.value !== 'all') count++
    if (selectedStatus.value !== 'all') count++
    return count
  })

  /**
   * Set filter configuration - allows customization from parent
   */
  const setFilterConfig = (newConfig: Partial<FilterConfig>) => {
    Object.assign(filterConfig.value, newConfig)
  }

  return {
    // State
    searchQuery,
    selectedRole,
    selectedDepartment,
    selectedStatus,
    filterConfig,
    roleOptions,
    departmentOptions,
    statusOptions,
    visibleFilters,

    // Computed
    hasActiveFilters,
    activeFilterCount,

    // Methods
    toggleFilterVisibility,
    showAllFilters,
    hideAllFilters,
    resetFilters,
    setFilterConfig,
  }
}
