<template>
  <header
    class="sticky top-0 left-0 right-0 z-40 bg-white border-b border-gray-200 h-16 transition-shadow duration-200"
    :class="{
      'shadow-sm': layoutStore.isHeaderScrolled,
    }"
  >
    <div class="flex items-center justify-between h-full px-4 lg:px-6">
      <!-- Left: Breadcrumb + Mobile Menu Toggle -->
      <div class="flex items-center gap-4 flex-1">
        <!-- Mobile Menu Toggle -->
        <button
          class="lg:hidden flex items-center justify-center w-10 h-10 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
          @click="layoutStore.toggleSidebar"
          :aria-label="layoutStore.isSidebarOpen ? 'Close menu' : 'Open menu'"
        >
          <Icon v-if="!layoutStore.isSidebarOpen" name="tabler:menu-2" class="w-6 h-6" />
          <Icon v-else name="tabler:x" class="w-6 h-6" />
        </button>

        <!-- Breadcrumb Navigation -->
        <nav class="hidden sm:flex items-center gap-2 text-sm">
          <span class="text-gray-600">Application</span>
          <Icon name="tabler:chevron-right" class="w-4 h-4 text-gray-400 shrink-0" />
          <span class="text-gray-900 font-medium">Dashboard</span>
        </nav>
      </div>

      <!-- Center: Active Task Timer Widget -->
      <TimerWidget
        variant="inline"
        taskName="Redesign Homepage"
      />

      <!-- Right: Notifications + Profile -->
      <div class="flex items-center gap-2 lg:gap-3">
        <!-- Notifications -->
        <button
          class="flex items-center justify-center w-10 h-10 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors relative"
          @click="layoutStore.toggleNotifications"
          title="Notifications"
        >
          <Icon name="tabler:bell" class="w-5 h-5" />
          <span 
            v-if="layoutStore.header.unreadNotifications > 0" 
            class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"
          ></span>
        </button>

        <!-- Profile Avatar -->
        <button
          class="flex items-center justify-center w-10 h-10 rounded-lg bg-amber-100 text-amber-700 font-semibold text-sm hover:bg-amber-200 transition-colors"
          @click="layoutStore.toggleProfileMenu"
          title="Profile menu"
        >
          AM
        </button>

        <!-- Profile Dropdown Menu -->
        <Teleport v-if="layoutStore.header.profileMenuOpen" to="body">
          <!-- Backdrop -->
          <div 
            class="fixed inset-0 z-40" 
            @click="layoutStore.closeMenus" 
          />
          
          <!-- Dropdown Menu -->
          <div class="absolute right-6 top-16 w-72 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden">
            <!-- User Info -->
            <div class="p-4 border-b border-gray-100">
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-semibold text-lg">
                  AM
                </div>
                <div class="flex-1">
                  <p class="font-semibold text-gray-900">{{ authStore.user?.name || 'Alex Morgan' }}</p>
                  <p class="text-sm text-gray-500">{{ authStore.user?.email || 'alex@company.com' }}</p>
                  <p class="text-xs text-blue-600 font-medium">{{ authStore.user?.role || 'Senior Developer' }}</p>
                </div>
              </div>
            </div>

            <!-- Menu Items -->
            <nav class="py-2">
              <NuxtLink 
                to="/profile" 
                class="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Icon name="tabler:user" class="w-5 h-5 text-gray-400 shrink-0" />
                <span>Profile</span>
              </NuxtLink>
              <NuxtLink 
                to="/settings" 
                class="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Icon name="tabler:settings" class="w-5 h-5 text-gray-400 shrink-0" />
                <span>Settings</span>
              </NuxtLink>
            </nav>

            <!-- Logout -->
            <div class="border-t border-gray-100 p-2">
              <button 
                class="w-full flex items-center gap-3 px-4 py-2.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
                @click="handleLogout"
              >
                <Icon name="tabler:logout" class="w-5 h-5 shrink-0" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </Teleport>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useLayoutStore } from '~/stores/layout'
import { useAuthStore } from '~/stores/auth'
import TimerWidget from '~/components/time-tracking/TimerWidget.vue'

const layoutStore = useLayoutStore()
const authStore = useAuthStore()

const handleLogout = async () => {
  layoutStore.closeMenus()
  authStore.logout()
  navigateTo('/auth/login')
}
</script>
