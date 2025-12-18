<template>
  <aside
    class="sidebar"
    :class="{
      'sidebar--open': layout.isSidebarOpen,
      'sidebar--collapsed': layout.state.value.sidebar.isCollapsed,
      'sidebar--hovered': layout.state.value.sidebar.isHovered,
    }"
    @mouseenter="layout.handleSidebarHover(true)"
    @mouseleave="layout.handleSidebarHover(false)"
  >
    <!-- Header Section -->
    <div class="sidebar__header">
      <NuxtLink to="/" class="sidebar__logo">
        <svg class="sidebar__logo-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <circle cx="12" cy="12" r="1" />
          <circle cx="12" cy="5" r="1" />
          <circle cx="12" cy="19" r="1" />
          <path d="M12 6v12M6 12h12" stroke-width="2" stroke-linecap="round" />
        </svg>
        <span class="sidebar__logo-text">TimeTrack</span>
      </NuxtLink>
      <button
        v-if="layout.isMobile"
        class="sidebar__close-btn"
        @click="layout.toggleSidebar"
        aria-label="Close sidebar"
      >
        <svg class="sidebar__close-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <!-- Navigation Content -->
    <nav class="sidebar__nav">
      <!-- Main Navigation Items -->
      <template v-for="item of navigation.items" :key="item.id">
        <!-- Link Item -->
        <NavItem
          v-if="item.type === 'link'"
          :item="item"
          :active="navigation.activeItemId.value === item.id"
          @click="handleNavClick(item)"
        />

        <!-- Section Item (Collapsible) -->
        <MenuSection
          v-else-if="item.type === 'section'"
          :section="item"
          :is-expanded="layout.state.value.sidebar.expandedSections.includes(item.id)"
          @toggle="layout.toggleExpandSection(item.id)"
        >
          <template #items>
            <NavItem
              v-for="child of item.children"
              :key="child.id"
              :item="child"
              :active="navigation.activeItemId.value === child.id"
              :is-child="true"
              @click="handleNavClick(child)"
            />
          </template>
        </MenuSection>

        <!-- Divider -->
        <div v-else-if="item.type === 'divider'" class="sidebar__divider" />
      </template>
    </nav>

    <!-- Footer Section -->
    <div v-if="!layout.state.value.sidebar.isCollapsed || layout.state.value.sidebar.isHovered" class="sidebar__footer">
      <div class="sidebar__footer-content">
        <p class="sidebar__footer-text">© 2024 TimeTrack</p>
        <p class="sidebar__footer-version">v1.0.0</p>
      </div>
    </div>

    <!-- Mobile Overlay -->
    <Teleport v-if="layout.isMobile && layout.isSidebarOpen" to="body">
      <div class="sidebar__mobile-overlay" @click="layout.toggleSidebar" />
    </Teleport>
  </aside>
</template>

<script setup lang="ts">
import { useLayoutState } from '~/composables/layout/useLayoutState'
import { useNavigation } from '~/composables/layout/useNavigation'
import { useRouter } from 'vue-router'

const layout = useLayoutState()
const navigation = useNavigation()
const router = useRouter()

const handleNavClick = (item: any) => {
  if (item.type === 'link' && item.route) {
    navigation.setActiveNavItem(item.id)
    if (layout.isMobile) {
      layout.toggleSidebar()
    }
    router.push(item.route)
  }
}
</script>

<style scoped lang="postcss">
/* =========================================
   SIDEBAR COMPONENT - STYLES
========================================= */

.sidebar {
  --sidebar-bg: rgb(var(--color-surface));
  --sidebar-border: rgb(var(--color-border-subtle));
  --sidebar-text: rgb(var(--color-text-main));
  --sidebar-text-muted: rgb(var(--color-text-muted));
  --sidebar-hover: rgb(var(--color-surface-alt));

  position: fixed;
  left: 0;
  top: var(--layout-header-height);
  width: var(--layout-sidebar-width);
  height: calc(100vh - var(--layout-header-height));
  background-color: var(--sidebar-bg);
  border-right: 1px solid var(--sidebar-border);
  display: flex;
  flex-direction: column;
  z-index: 30;
  transition: all var(--transition-base);
  overflow-y: auto;
  overflow-x: hidden;

  @media (max-width: 1024px) {
    width: 64px;
    
    &:not(.sidebar--open) {
      transform: translateX(-100%);
    }

    &.sidebar--hovered,
    &.sidebar--open {
      width: var(--layout-sidebar-width);
    }
  }

  @media (max-width: 768px) {
    top: 60px;
    width: 100%;

    &:not(.sidebar--open) {
      transform: translateX(-100%);
    }

    &.sidebar--open {
      transform: translateX(0);
    }

    &.sidebar--hovered {
      transform: translateX(0);
    }
  }
}

.sidebar--collapsed {
  width: 64px;

  @media (max-width: 1024px) {
    width: 64px;
  }
}

/* Header Section */
.sidebar__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 12px;
  gap: 8px;
  border-bottom: 1px solid var(--sidebar-border);
  flex-shrink: 0;
  min-height: 64px;

  @media (max-width: 1024px) {
    .sidebar--collapsed & {
      padding: 16px 8px;
    }

    .sidebar--open & {
      padding: 16px 12px;
    }
  }
}

.sidebar__logo {
  display: flex;
  align-items: center;
  gap: 12px;
  color: rgb(var(--color-primary));
  text-decoration: none;
  font-weight: 700;
  font-size: 18px;
  transition: all var(--transition-fast);
  flex: 1;
  min-width: 0;

  &:hover {
    opacity: 0.8;
  }

  @media (max-width: 1024px) {
    .sidebar--collapsed & {
      justify-content: center;
    }
  }
}

.sidebar__logo-icon {
  width: 28px;
  height: 28px;
  flex-shrink: 0;
}

.sidebar__logo-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (max-width: 1024px) {
    .sidebar--collapsed & {
      display: none;
    }
  }
}

.sidebar__close-btn {
  display: none;
  width: 36px;
  height: 36px;
  padding: 6px;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--sidebar-text);
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
  flex-shrink: 0;

  &:hover {
    background-color: rgba(var(--color-primary), 0.08);
    color: rgb(var(--color-primary));
  }

  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.sidebar__close-icon {
  width: 20px;
  height: 20px;
  stroke: currentColor;
}

/* Navigation Section */
.sidebar__nav {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 12px 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.sidebar__divider {
  height: 1px;
  background: var(--sidebar-border);
  margin: 8px 0;
  margin-left: 8px;
  margin-right: 8px;
}

/* Footer Section */
.sidebar__footer {
  padding: 16px 12px;
  border-top: 1px solid var(--sidebar-border);
  background-color: rgba(var(--color-primary), 0.02);
  flex-shrink: 0;
  text-align: center;

  @media (max-width: 1024px) {
    .sidebar--collapsed & {
      display: none;
    }
  }
}

.sidebar__footer-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.sidebar__footer-text {
  font-size: 12px;
  font-weight: 500;
  color: var(--sidebar-text);
  margin: 0;
}

.sidebar__footer-version {
  font-size: 11px;
  color: var(--sidebar-text-muted);
  margin: 0;
}

/* Mobile Overlay */
.sidebar__mobile-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 29;
  animation: fadeIn var(--transition-fast);

  @media (min-width: 769px) {
    display: none;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Custom Scrollbar */
.sidebar__nav::-webkit-scrollbar {
  width: 6px;
}

.sidebar__nav::-webkit-scrollbar-track {
  background: transparent;
}

.sidebar__nav::-webkit-scrollbar-thumb {
  background: rgba(var(--color-slate-300), 0.4);
  border-radius: 3px;

  &:hover {
    background: rgba(var(--color-slate-400), 0.6);
  }
}
</style>
