/**
 * Store: useLayoutStore
 * Manages global layout state (header, sidebar, theme)
 * Persisted to localStorage for user preferences
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { ThemeMode } from '~/types/layout'

export const useLayoutStore = defineStore('layout', () => {
  // ============ State ============
  
  // Header state
  const headerSticky = ref(true)
  const headerScrolled = ref(false)
  const profileMenuOpen = ref(false)
  const notificationsOpen = ref(false)
  const searchOpen = ref(false)
  const unreadNotifications = ref(3)
  const unreadMessages = ref(5)
  const headerUser = ref<{
    name: string
    email: string
    avatar: string
    role: string
  } | null>(null)

  // Sidebar state
  const sidebarOpen = ref(true)
  const sidebarCollapsed = ref(false)
  const sidebarHovered = ref(false)
  const expandedSections = ref<string[]>([])
  const activeItem = ref<string | null>(null)

  // Theme & responsive
  const theme = ref<ThemeMode>('light')
  const isMobile = ref(false)
  const isTablet = ref(false)
  const isDesktop = ref(true)

  // ============ Getters ============
  
  const isHeaderSticky = computed(() => headerSticky.value)
  const isHeaderScrolled = computed(() => headerScrolled.value)
  const isSidebarOpen = computed(() => sidebarOpen.value)
  const isSidebarCollapsed = computed(() => sidebarCollapsed.value)
  const currentTheme = computed(() => theme.value)

  // Computed objects for template access
  const header = computed(() => ({
    isSticky: headerSticky.value,
    isScrolled: headerScrolled.value,
    profileMenuOpen: profileMenuOpen.value,
    notificationsOpen: notificationsOpen.value,
    searchOpen: searchOpen.value,
    user: headerUser.value,
    unreadNotifications: unreadNotifications.value,
    unreadMessages: unreadMessages.value,
  }))

  const sidebar = computed(() => ({
    isOpen: sidebarOpen.value,
    isCollapsed: sidebarCollapsed.value,
    isHovered: sidebarHovered.value,
    expandedSections: expandedSections.value,
    activeItem: activeItem.value,
  }))

  // ============ Actions ============

  // Sidebar actions
  const toggleSidebar = () => {
    sidebarOpen.value = !sidebarOpen.value
  }

  const toggleSidebarCollapse = () => {
    sidebarCollapsed.value = !sidebarCollapsed.value
  }

  const setSidebarHovered = (hovered: boolean) => {
    sidebarHovered.value = hovered
  }

  const handleSidebarHover = (hovered: boolean) => {
    if (!isDesktop.value) return
    sidebarHovered.value = hovered
  }

  const setActiveNavItem = (itemId: string) => {
    activeItem.value = itemId
  }

  const toggleExpandSection = (sectionId: string) => {
    const index = expandedSections.value.indexOf(sectionId)
    if (index > -1) {
      expandedSections.value.splice(index, 1)
    } else {
      expandedSections.value.push(sectionId)
    }
  }

  // Header actions
  const toggleProfileMenu = () => {
    profileMenuOpen.value = !profileMenuOpen.value
    if (profileMenuOpen.value) {
      notificationsOpen.value = false
    }
  }

  const toggleNotifications = () => {
    notificationsOpen.value = !notificationsOpen.value
    if (notificationsOpen.value) {
      profileMenuOpen.value = false
    }
  }

  const toggleSearch = () => {
    searchOpen.value = !searchOpen.value
  }

  const closeMenus = () => {
    profileMenuOpen.value = false
    notificationsOpen.value = false
  }

  const setScrolled = (scrolled: boolean) => {
    headerScrolled.value = scrolled
  }

  // Theme actions
  const setTheme = (newTheme: ThemeMode) => {
    theme.value = newTheme
    if (import.meta.client) {
      document.documentElement.setAttribute('data-theme', newTheme)
    }
  }

  // Responsive actions
  const updateBreakpoints = () => {
    if (!import.meta.client) return
    const width = window.innerWidth
    isMobile.value = width < 768
    isTablet.value = width >= 768 && width < 1024
    isDesktop.value = width >= 1024

    if (isMobile.value && sidebarOpen.value) {
      sidebarOpen.value = false
      sidebarCollapsed.value = true
    }
  }

  // User actions
  const setUser = (user: typeof headerUser.value) => {
    headerUser.value = user
  }

  return {
    // State refs (for direct access if needed)
    headerSticky,
    headerScrolled,
    profileMenuOpen,
    notificationsOpen,
    searchOpen,
    unreadNotifications,
    unreadMessages,
    headerUser,
    sidebarOpen,
    sidebarCollapsed,
    sidebarHovered,
    expandedSections,
    activeItem,
    theme,
    isMobile,
    isTablet,
    isDesktop,

    // Computed objects (for template convenience)
    header,
    sidebar,

    // Getters
    isHeaderSticky,
    isHeaderScrolled,
    isSidebarOpen,
    isSidebarCollapsed,
    currentTheme,

    // Actions
    toggleSidebar,
    toggleSidebarCollapse,
    setSidebarHovered,
    handleSidebarHover,
    setActiveNavItem,
    toggleExpandSection,
    toggleProfileMenu,
    toggleNotifications,
    toggleSearch,
    closeMenus,
    setScrolled,
    setTheme,
    updateBreakpoints,
    setUser,
  }
}, {
  persist: {
    pick: ['theme', 'sidebarCollapsed', 'expandedSections'],
  },
})
