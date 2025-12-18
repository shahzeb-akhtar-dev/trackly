/**
 * Composable: useLayoutState
 * Manages global layout state (header, sidebar, theme)
 */

import { ref, computed, onMounted, onUnmounted, readonly } from 'vue'
import type { LayoutContext, ThemeMode } from '~/types/layout'

export const useLayoutState = () => {
  // Global layout state
  const state = ref<LayoutContext>({
    header: {
      isSticky: true,
      isScrolled: false,
      profileMenuOpen: false,
      notificationsOpen: false,
      searchOpen: false,
      user: null,
      unreadNotifications: 3,
      unreadMessages: 5,
    },
    sidebar: {
      isOpen: true,
      isCollapsed: false,
      isHovered: false,
      expandedSections: [],
      activeItem: null,
      navigationItems: [],
    },
    theme: 'light' as ThemeMode,
    isMobile: false,
    isTablet: false,
    isDesktop: true,
  })

  // Scroll state for sticky header
  const handleScroll = () => {
    state.value.header.isScrolled = window.scrollY > 10
  }

  // Responsive breakpoints
  const updateBreakpoints = () => {
    const width = window.innerWidth
    state.value.isMobile = width < 768
    state.value.isTablet = width >= 768 && width < 1024
    state.value.isDesktop = width >= 1024

    // Auto-collapse sidebar on mobile
    if (state.value.isMobile && state.value.sidebar.isOpen) {
      state.value.sidebar.isOpen = false
      state.value.sidebar.isCollapsed = true
    }
  }

  // Initialize event listeners
  onMounted(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', updateBreakpoints, { passive: true })
    updateBreakpoints()
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
    window.removeEventListener('resize', updateBreakpoints)
  })

  // Actions
  const toggleSidebar = () => {
    state.value.sidebar.isOpen = !state.value.sidebar.isOpen
  }

  const toggleSidebarCollapse = () => {
    state.value.sidebar.isCollapsed = !state.value.sidebar.isCollapsed
  }

  const toggleProfileMenu = () => {
    state.value.header.profileMenuOpen = !state.value.header.profileMenuOpen
    // Close notifications menu when opening profile
    if (state.value.header.profileMenuOpen) {
      state.value.header.notificationsOpen = false
    }
  }

  const toggleNotifications = () => {
    state.value.header.notificationsOpen = !state.value.header.notificationsOpen
    // Close profile menu when opening notifications
    if (state.value.header.notificationsOpen) {
      state.value.header.profileMenuOpen = false
    }
  }

  const toggleSearch = () => {
    state.value.header.searchOpen = !state.value.header.searchOpen
  }

  const closeMenus = () => {
    state.value.header.profileMenuOpen = false
    state.value.header.notificationsOpen = false
  }

  const setSidebarHovered = (hovered: boolean) => {
    state.value.sidebar.isHovered = hovered
  }

  const handleSidebarHover = (hovered: boolean) => {
    if (!state.value.isDesktop) return // Only on desktop
    state.value.sidebar.isHovered = hovered
  }

  const setActiveNavItem = (itemId: string) => {
    state.value.sidebar.activeItem = itemId
  }

  const toggleExpandSection = (sectionId: string) => {
    const index = state.value.sidebar.expandedSections.indexOf(sectionId)
    if (index > -1) {
      state.value.sidebar.expandedSections.splice(index, 1)
    } else {
      state.value.sidebar.expandedSections.push(sectionId)
    }
  }

  const setTheme = (theme: ThemeMode) => {
    state.value.theme = theme
    document.documentElement.setAttribute('data-theme', theme)
  }

  return {
    // Read-only state
    state: readonly(state),

    // Computed
    isHeaderSticky: computed(() => state.value.header.isSticky),
    isHeaderScrolled: computed(() => state.value.header.isScrolled),
    isSidebarOpen: computed(() => state.value.sidebar.isOpen),
    isSidebarCollapsed: computed(() => state.value.sidebar.isCollapsed),
    currentTheme: computed(() => state.value.theme),
    isMobile: computed(() => state.value.isMobile),
    isTablet: computed(() => state.value.isTablet),
    isDesktop: computed(() => state.value.isDesktop),

    // Actions
    toggleSidebar,
    toggleSidebarCollapse,
    toggleProfileMenu,
    toggleNotifications,
    toggleSearch,
    closeMenus,
    setSidebarHovered,
    handleSidebarHover,
    setActiveNavItem,
    toggleExpandSection,
    setTheme,
  }
}
