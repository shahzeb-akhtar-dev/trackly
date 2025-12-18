<template>
  <header
    class="fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-200 h-16 transition-all duration-200"
    :class="{
      'shadow-sm': layoutStore.isHeaderScrolled,
    }"
  >
    <div class="flex items-center justify-between h-full px-4 lg:px-6 gap-4">
      <!-- Left Section: Menu Toggle + Breadcrumb -->
      <div class="flex items-center gap-4">
        <!-- Mobile Menu Toggle -->
        <button
          class="lg:hidden flex items-center justify-center w-10 h-10 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
          @click="layoutStore.toggleSidebar"
          :aria-label="layoutStore.isSidebarOpen ? 'Close menu' : 'Open menu'"
        >
          <Icon v-if="!layoutStore.isSidebarOpen" name="heroicons:bars-3" class="w-6 h-6" />
          <Icon v-else name="heroicons:x-mark" class="w-6 h-6" />
        </button>

        <!-- Logo (visible on mobile) -->
        <NuxtLink to="/" class="lg:hidden flex items-center gap-2">
          <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Icon name="heroicons:clock" class="w-5 h-5 text-white" />
          </div>
          <span class="font-bold text-lg text-gray-900">TimeTrack</span>
        </NuxtLink>

        <!-- Breadcrumb -->
        <nav class="hidden md:flex items-center gap-2 text-sm">
          <span class="text-gray-500">Application</span>
          <Icon name="heroicons:chevron-right" class="w-4 h-4 text-gray-400" />
          <span class="text-gray-900 font-medium">Dashboard</span>
        </nav>
      </div>

      <!-- Right Section -->
      <div class="flex items-center gap-3">
        <!-- Active Task Timer -->
        <div class="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-lg">
          <span class="text-xs text-blue-600 font-medium truncate max-w-[120px]">Redesign Homepage</span>
          <span class="text-blue-700 font-bold text-sm tabular-nums">01:24:15</span>
        </div>

        <!-- Search -->
        <div class="relative hidden lg:block">
          <div class="flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg w-64 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
            <Icon name="heroicons:magnifying-glass" class="w-4 h-4 text-gray-400 flex-shrink-0" />
            <input
              type="text"
              class="flex-1 bg-transparent border-none outline-none text-sm text-gray-700 placeholder-gray-400"
              placeholder="What are you working on?"
            />
          </div>
        </div>

        <!-- Start Timer Button -->
        <button class="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium text-sm transition-colors">
          <Icon name="heroicons:play-circle-solid" class="w-4 h-4" />
          <span class="hidden sm:inline">Start Timer</span>
        </button>

        <!-- Notifications -->
        <div class="relative">
          <button
            class="flex items-center justify-center w-10 h-10 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors relative"
            @click="layoutStore.toggleNotifications"
          >
            <Icon name="heroicons:bell" class="w-5 h-5" />
            <span v-if="layoutStore.header.unreadNotifications > 0" class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
        </div>

        <!-- Profile -->
        <div class="relative">
          <button
            class="flex items-center gap-2 pl-1 pr-2 py-1 rounded-lg hover:bg-gray-100 transition-colors"
            @click="layoutStore.toggleProfileMenu"
          >
            <div class="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-semibold text-sm">
              AM
            </div>
          </button>

          <!-- Profile Dropdown -->
          <Teleport v-if="layoutStore.header.profileMenuOpen" to="body">
            <div class="fixed inset-0 z-40" @click="layoutStore.closeMenus" />
            <div class="absolute right-4 top-16 w-72 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
              <div class="p-4 border-b border-gray-100">
                <div class="flex items-center gap-3">
                  <div class="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-semibold">
                    AM
                  </div>
                  <div>
                    <p class="font-semibold text-gray-900">{{ authStore.user?.name || 'Alex Morgan' }}</p>
                    <p class="text-sm text-gray-500">{{ authStore.user?.email || 'alex@company.com' }}</p>
                    <p class="text-xs text-blue-600 font-medium">{{ authStore.user?.role || 'Senior Developer' }}</p>
                  </div>
                </div>
              </div>
              <nav class="py-2">
                <NuxtLink to="/profile" class="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors">
                  <Icon name="heroicons:user" class="w-5 h-5 text-gray-400" />
                  <span>Profile</span>
                </NuxtLink>
                <NuxtLink to="/settings" class="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors">
                  <Icon name="heroicons:cog-6-tooth" class="w-5 h-5 text-gray-400" />
                  <span>Settings</span>
                </NuxtLink>
              </nav>
              <div class="border-t border-gray-100 p-2">
                <button 
                  class="w-full flex items-center gap-3 px-4 py-2.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  @click="handleLogout"
                >
                  <Icon name="heroicons:arrow-right-on-rectangle" class="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </Teleport>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useLayoutStore } from '~/stores/layout'
import { useAuthStore } from '~/stores/auth'

const layoutStore = useLayoutStore()
const authStore = useAuthStore()

const handleLogout = async () => {
  layoutStore.closeMenus()
  authStore.logout()
  navigateTo('/auth/login')
}
</script>
