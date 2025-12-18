/**
 * Composable: useNavigation
 * Manages sidebar navigation data and state
 */

import { ref, computed } from 'vue'
import type { NavigationItem } from '~/types/layout'

export const useNavigation = () => {
  // Active navigation item
  const activeItemId = ref<string | null>(null)

  // Navigation items configuration
  const items = ref<NavigationItem[]>([
    {
      id: 'dashboard',
      label: 'Dashboard',
      type: 'link',
      icon: 'chart-bar',
      route: '/',
    },
    {
      id: 'tasks-section',
      label: 'Tasks & Projects',
      type: 'section',
      children: [
        {
          id: 'my-tasks',
          label: 'My Tasks',
          type: 'link',
          icon: 'tasks',
          route: '/task-management',
        },
        {
          id: 'projects',
          label: 'Projects',
          type: 'link',
          icon: 'briefcase',
          route: '/task-management/projects',
        },
        {
          id: 'kanban-board',
          label: 'Kanban Board',
          type: 'link',
          icon: 'th',
          route: '/task-management/kanban-board',
        },
      ],
    },
    {
      id: 'time-section',
      label: 'Time & Attendance',
      type: 'section',
      children: [
        {
          id: 'my-time',
          label: 'My Time Logs',
          type: 'link',
          icon: 'clock',
          route: '/time-management/personal',
        },
        {
          id: 'leave-requests',
          label: 'Leave Requests',
          type: 'link',
          icon: 'calendar',
          route: '/time-management/leave',
        },
        {
          id: 'overtime',
          label: 'Overtime',
          type: 'link',
          icon: 'hourglass',
          route: '/time-management/overtime',
        },
      ],
    },
    {
      id: 'approvals',
      label: 'Approvals',
      type: 'link',
      icon: 'check-circle',
      route: '/approvals/pending',
      badge: {
        value: 3,
        variant: 'warning',
      },
    },
    {
      id: 'reports',
      label: 'Reports',
      type: 'link',
      icon: 'document',
      route: '/reports',
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
    {
      id: 'admin-divider',
      label: '',
      type: 'divider',
    },
    {
      id: 'admin-section',
      label: 'Settings',
      type: 'section',
      children: [
        {
          id: 'settings-general',
          label: 'General Settings',
          type: 'link',
          icon: 'cog',
          route: '/settings',
        },
        {
          id: 'users',
          label: 'Users',
          type: 'link',
          icon: 'users',
          route: '/settings/users',
        },
        {
          id: 'roles',
          label: 'Roles & Permissions',
          type: 'link',
          icon: 'key',
          route: '/settings/roles-permissions',
        },
        {
          id: 'payroll',
          label: 'Payroll',
          type: 'link',
          icon: 'credit-card',
          route: '/payroll',
        },
      ],
    },
  ])

  // Find active item by route
  const findActiveItem = (route: string): NavigationItem | null => {
    const findInItems = (itemList: NavigationItem[]): NavigationItem | null => {
      for (const item of itemList) {
        if (item.route === route) {
          return item
        }
        if (item.children) {
          const found = findInItems(item.children)
          if (found) return found
        }
      }
      return null
    }
    return findInItems(items.value)
  }

  // Get all parent sections
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

  // Get icon SVG paths
  const getIconPath = (iconName: string): string => {
    const iconPaths: Record<string, string> = {
      'chart-bar': 'M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z',
      'tasks': 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4',
      'briefcase': 'M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2H3a1 1 0 110-2V4zm2 5a1 1 0 000 2h6a1 1 0 000-2H6z',
      'th': 'M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM15 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2h-2zM5 13a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM15 13a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2h-2z',
      'clock': 'M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 100-12 6 6 0 000 12zm0-6a1 1 0 11-2 0 1 1 0 012 0z',
      'calendar': 'M6 2a1 1 0 00-1 1v2H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v2H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h12a1 1 0 100-2H6z',
      'hourglass': 'M7 2a1 1 0 000 2h6a1 1 0 000-2H7zM4 5a2 2 0 012-2h8a2 2 0 012 2v.05a3 3 0 01-.68 1.9l-2.5 3.5a3 3 0 00-.68 1.9V15a2 2 0 01-2 2h-4a2 2 0 01-2-2v-2.05a3 3 0 00-.68-1.9l-2.5-3.5A3 3 0 014 5.05V5z',
      'check-circle': 'M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z',
      'document': 'M9 12a1 1 0 102 0V8.413l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 8.414V12z',
      'chat': 'M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5z',
      'cog': 'M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z',
      'users': 'M9 6a3 3 0 11-6 0 3 3 0 016 0zM9 6a9 9 0 11-18 0 9 9 0 0118 0z',
      'key': 'M3 6a3 3 0 013-3h10a1 1 0 01.82 1.573l-7 10A1 1 0 018 18H4a1 1 0 01-.82-1.573l7-10A1 1 0 003 6z',
      'credit-card': 'M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm12 4v8a2 2 0 01-2 2H4a2 2 0 01-2-2v-4h2a1 1 0 100 2h6a1 1 0 100-2h2a1 1 0 110 2h2v-2a2 2 0 012-2h-2z',
    }
    return iconPaths[iconName] || 'M10 18a8 8 0 100-16 8 8 0 000 16z'
  }

  return {
    items: items.value as NavigationItem[],
    activeItemId: computed(() => activeItemId.value),
    findActiveItem,
    getParentSections,
    getIconPath,
    setActiveNavItem: (itemId: string) => {
      activeItemId.value = itemId
    },
  }
}
