<template>
  <header class="bg-white shadow-sm border-b border-gray-200">
    <div class="flex items-center justify-between h-16 px-4 sm:px-6 md:px-8">
      <!-- Left Section: Search -->
      <div class="flex-1 max-w-md">
        <div class="relative">
          <input
            type="text"
            placeholder="Search..."
            class="w-full px-4 py-2 pr-10 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <svg
            class="absolute right-3 top-2.5 h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      <!-- Right Section: Timer, Notifications, Profile -->
      <div class="flex items-center gap-4 ml-4">
        <!-- Timer Widget -->
        <div class="flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-lg">
          <svg class="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 100-12 6 6 0 000 12zm.5-9H9V7a1 1 0 112 0v2.5a1 1 0 01-1.5.866z"
              clip-rule="evenodd"
            />
          </svg>
          <span class="text-sm font-medium text-blue-600">00:15:23</span>
          <button
            class="ml-1 p-1 rounded hover:bg-blue-100 transition"
            title="Stop timer"
          >
            <svg class="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 100 2h4a1 1 0 100-2H8z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
        </div>

        <!-- Notifications -->
        <div class="relative">
          <button class="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
            <span class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
        </div>

        <!-- User Profile Dropdown -->
        <div class="relative">
          <button
            @click="toggleProfileMenu"
            class="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition"
          >
            <img
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=John"
              alt="Profile"
              class="w-8 h-8 rounded-full"
            />
            <span class="hidden sm:block text-sm font-medium text-gray-700">John Doe</span>
            <svg
              class="w-4 h-4 text-gray-500 transition-transform"
              :class="{ 'rotate-180': profileMenuOpen }"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </button>

          <!-- Profile Menu -->
          <Teleport to="body" v-if="profileMenuOpen">
            <div
              @click="profileMenuOpen = false"
              class="fixed inset-0"
            ></div>
            <div class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
              <div class="p-4 border-b border-gray-200">
                <p class="text-sm font-medium text-gray-900">John Doe</p>
                <p class="text-xs text-gray-500">john@company.com</p>
              </div>
              <nav class="py-2">
                <NuxtLink
                  to="/settings"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Settings
                </NuxtLink>
                <NuxtLink
                  to="/profile"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Profile
                </NuxtLink>
              </nav>
              <div class="border-t border-gray-200 p-2">
                <button
                  @click="logout"
                  class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded"
                >
                  Logout
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
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const profileMenuOpen = ref(false)

const toggleProfileMenu = () => {
  profileMenuOpen.value = !profileMenuOpen.value
}

const logout = async () => {
  // Clear auth state and redirect to login
  profileMenuOpen.value = false
  await router.push('/auth/login')
}
</script>

<style scoped>
/* Header component styles */
</style>
