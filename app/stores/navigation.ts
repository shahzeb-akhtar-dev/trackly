/**
 * Store: useNavigationStore
 * Manages sidebar navigation data and active state
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { NavigationItem } from '~/types/layout'

export const useNavigationStore = defineStore('navigation', () => {
  // ============ State ============
  
  const activeItemId = ref<string | null>(null)
  
  const items = ref<NavigationItem[]>([
    {
      id: 'dashboard',
      label: 'Dashboard',
      type: 'link',
      icon: 'chart-bar',
      route: '/',
    },
    {
      id: 'settings-section',
      label: 'Settings',
      type: 'section',
      icon: 'cog',
      children: [
        {
          id: 'company-profile',
          label: 'Company Profile',
          type: 'link',
          icon: 'briefcase',
          route: '/settings/company',
        },
        {
          id: 'department',
          label: 'Department',
          type: 'link',
          icon: 'users',
          route: '/settings/department',
        },
        {
          id: 'users',
          label: 'Users',
          type: 'link',
          icon: 'users',
          route: '/settings/users',
        },
        {
          id: 'approval-flow',
          label: 'Approval Flow',
          type: 'link',
          icon: 'check-circle',
          route: '/settings/approval-flow',
        },
        {
          id: 'team-management',
          label: 'Team Management',
          type: 'link',
          icon: 'users',
          route: '/settings/team',
        },
        {
          id: 'roles-permissions',
          label: 'Role & Permissions',
          type: 'link',
          icon: 'key',
          route: '/settings/roles-permissions',
        },
      ],
    },
    {
      id: 'projects-tasks',
      label: 'Project & Tasks',
      type: 'link',
      icon: 'briefcase',
      route: '/projects',
    },
    {
      id: 'time-management',
      label: 'Time Management',
      type: 'link',
      icon: 'clock',
      route: '/time-management',
    },
    {
      id: 'payroll',
      label: 'Payroll',
      type: 'link',
      icon: 'credit-card',
      route: '/payroll',
    },
    {
      id: 'reports-section',
      label: 'Reports',
      type: 'section',
      icon: 'document',
      children: [
        {
          id: 'attendance',
          label: 'Attendance',
          type: 'link',
          icon: 'calendar',
          route: '/reports/attendance',
        },
        {
          id: 'task-progress',
          label: 'Task Progress',
          type: 'link',
          icon: 'tasks',
          route: '/reports/task-progress',
        },
      ],
    },
    {
      id: 'chat',
      label: 'Chat',
      type: 'link',
      icon: 'chat',
      route: '/chat',
      badge: {
        value: 5,
        variant: 'info',
      },
    },
  ])

  // ============ Getters ============

  const getActiveItem = computed(() => {
    const findItem = (itemList: NavigationItem[]): NavigationItem | null => {
      for (const item of itemList) {
        if (item.id === activeItemId.value) return item
        if (item.children) {
          const found = findItem(item.children)
          if (found) return found
        }
      }
      return null
    }
    return findItem(items.value)
  })

  // ============ Actions ============

  const setActiveNavItem = (itemId: string) => {
    activeItemId.value = itemId
  }

  const findActiveItem = (route: string): NavigationItem | null => {
    const findInItems = (itemList: NavigationItem[]): NavigationItem | null => {
      for (const item of itemList) {
        if (item.route === route) return item
        if (item.children) {
          const found = findInItems(item.children)
          if (found) return found
        }
      }
      return null
    }
    return findInItems(items.value)
  }

  const getParentSections = (itemId: string): string[] => {
    const parents: string[] = []
    const findParents = (itemList: NavigationItem[], targetId: string): boolean => {
      for (const item of itemList) {
        if (item.children) {
          const hasTarget = item.children.some(child => child.id === targetId)
          if (hasTarget) {
            parents.push(item.id)
            return true
          }
          if (findParents(item.children, targetId)) {
            parents.push(item.id)
            return true
          }
        }
      }
      return false
    }
    findParents(items.value, itemId)
    return parents
  }

  return {
    // State
    activeItemId,
    items,

    // Getters
    getActiveItem,

    // Actions
    setActiveNavItem,
    findActiveItem,
    getParentSections,
  }
})
