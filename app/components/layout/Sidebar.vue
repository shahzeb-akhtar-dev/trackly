<template>
  <aside
    class="fixed left-0 h-screen bg-white border-r border-gray-200 z-30 transition-all duration-300 flex flex-col"
    :class="{
      'w-64': !layoutStore.sidebar.isCollapsed || layoutStore.sidebar.isHovered,
      'w-16': layoutStore.sidebar.isCollapsed && !layoutStore.sidebar.isHovered,
      'translate-x-0': layoutStore.isSidebarOpen || !layoutStore.isMobile,
      '-translate-x-full': !layoutStore.isSidebarOpen && layoutStore.isMobile,
    }"
    @mouseenter="layoutStore.handleSidebarHover(true)"
    @mouseleave="layoutStore.handleSidebarHover(false)"
  >
    <!-- Logo Section -->
    <div class="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
      <div class="w-10 h-10 bg-linear-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shrink-0 shadow-sm">
        <Icon name="heroicons:clock" class="w-6 h-6 text-white" />
      </div>
      <span 
        class="font-bold text-xl text-gray-900 whitespace-nowrap overflow-hidden transition-opacity duration-200"
        :class="{ 'opacity-0 w-0': layoutStore.sidebar.isCollapsed && !layoutStore.sidebar.isHovered }"
      >
        TimeTrack
      </span>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 overflow-y-auto overflow-x-hidden pb-4 px-3 mt-4">
      <div class="space-y-1">
        <!-- Menu Label -->
        <p 
          class="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider"
          :class="{ 'sr-only': layoutStore.sidebar.isCollapsed && !layoutStore.sidebar.isHovered }"
        >
          Menu
        </p>

        <template v-for="item of navStore.items" :key="item.id">
          <!-- Link Item -->
          <NavItem
            v-if="item.type === 'link'"
            :item="item"
            :active="navStore.activeItemId === item.id"
            :collapsed="layoutStore.sidebar.isCollapsed && !layoutStore.sidebar.isHovered"
            @click="handleNavClick(item)"
          />

          <!-- Section Item (Collapsible) -->
          <MenuSection
            v-else-if="item.type === 'section'"
            :section="item"
            :is-expanded="layoutStore.sidebar.expandedSections.includes(item.id)"
            :collapsed="layoutStore.sidebar.isCollapsed && !layoutStore.sidebar.isHovered"
            @toggle="layoutStore.toggleExpandSection(item.id)"
          >
            <template #items>
              <NavItem
                v-for="child of item.children"
                :key="child.id"
                :item="child"
                :active="navStore.activeItemId === child.id"
                :is-child="true"
                :collapsed="layoutStore.sidebar.isCollapsed && !layoutStore.sidebar.isHovered"
                @click="handleNavClick(child)"
              />
            </template>
          </MenuSection>

          <!-- Divider -->
          <div v-else-if="item.type === 'divider'" class="my-3 mx-3 border-t border-gray-100" />
        </template>
      </div>
    </nav>

    <!-- User Profile Footer -->
    <div 
      class="border-t border-gray-100 p-3"
      :class="{ 'px-2': layoutStore.sidebar.isCollapsed && !layoutStore.sidebar.isHovered }"
    >
      <div 
        class="flex items-center gap-3 p-2 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
        :class="{ 'justify-center': layoutStore.sidebar.isCollapsed && !layoutStore.sidebar.isHovered }"
      >
        <img 
          src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face" 
          alt="User avatar"
          class="w-10 h-10 rounded-full object-cover shrink-0 ring-2 ring-white"
        />
        <div 
          class="flex-1 min-w-0 transition-opacity duration-200"
          :class="{ 'hidden': layoutStore.sidebar.isCollapsed && !layoutStore.sidebar.isHovered }"
        >
          <p class="text-sm font-semibold text-gray-900 truncate">Alex Morgan</p>
          <p class="text-xs text-gray-500 truncate">Senior Developer</p>
        </div>
        <div 
          class="w-2 h-2 bg-emerald-500 rounded-full shrink-0"
          :class="{ 'absolute bottom-0 right-0': layoutStore.sidebar.isCollapsed && !layoutStore.sidebar.isHovered }"
        ></div>
      </div>
    </div>

    <!-- Mobile Overlay -->
    <Teleport v-if="layoutStore.isMobile && layoutStore.isSidebarOpen" to="body">
      <div 
        class="fixed inset-0 bg-black/50 z-20 lg:hidden"
        @click="layoutStore.toggleSidebar" 
      />
    </Teleport>
  </aside>
</template>

<script setup lang="ts">
import { useLayoutStore } from '~/stores/layout'
import { useNavigationStore } from '~/stores/navigation'
import type { NavigationItem } from '~/types/layout'
import MenuSection from './MenuSection.vue'
import NavItem from './NavItem.vue'

const layoutStore = useLayoutStore()
const navStore = useNavigationStore()

const handleNavClick = (item: NavigationItem) => {
  if (item.type === 'link' && item.route) {
    navStore.setActiveNavItem(item.id)
    if (layoutStore.isMobile) {
      layoutStore.toggleSidebar()
    }
    navigateTo(item.route)
  }
}
</script>
