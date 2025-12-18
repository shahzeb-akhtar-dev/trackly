/**
 * Layout Types - Header, Sidebar, Navigation
 * Defines all interfaces for layout components and state management
 */

export type ThemeMode = 'light' | 'dark' | 'auto'

export type NavigationItemType = 'link' | 'section' | 'divider'

export type BadgeVariant = 'success' | 'warning' | 'error' | 'info' | 'default'

/**
 * Navigation Item - Represents a menu item in the sidebar
 */
export interface NavigationItem {
  id: string
  label: string
  type: NavigationItemType
  icon?: string
  route?: string
  badge?: {
    value: number | string
    variant: BadgeVariant
  }
  children?: NavigationItem[]
  dividerLabel?: string
  isActive?: boolean
  disabled?: boolean
  divider?: boolean
}

/**
 * User Profile - Header profile dropdown
 */
export interface UserProfile {
  id: string
  name: string
  email: string
  avatar?: string
  role: string
  company?: string
  isOnline?: boolean
}

/**
 * Header State - Manages header UI state
 */
export interface HeaderState {
  isSticky: boolean
  isScrolled: boolean
  profileMenuOpen: boolean
  notificationsOpen: boolean
  searchOpen: boolean
  user: UserProfile | null
  unreadNotifications: number
  unreadMessages: number
}

/**
 * Sidebar State - Manages sidebar UI state
 */
export interface SidebarState {
  isOpen: boolean
  isCollapsed: boolean
  isHovered: boolean
  expandedSections: string[]
  activeItem: string | null
  navigationItems: NavigationItem[]
}

/**
 * Layout Context - Global layout state
 */
export interface LayoutContext {
  header: HeaderState
  sidebar: SidebarState
  theme: ThemeMode
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
}

/**
 * Notification Item - For notification center
 */
export interface NotificationItem {
  id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  timestamp: Date
  read: boolean
  actionUrl?: string
  avatar?: string
}

/**
 * Timer Widget State - For the active timer in header
 */
export interface TimerState {
  isRunning: boolean
  elapsedSeconds: number
  projectName: string
  taskName: string
}

/**
 * Search Result - For global search
 */
export interface SearchResult {
  id: string
  title: string
  category: 'task' | 'project' | 'user' | 'document'
  icon: string
  route: string
  description?: string
}
