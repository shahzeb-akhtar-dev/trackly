<template>
  <div>
    <!-- Page Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Dashboard</h1>
      <p class="text-gray-600 mt-2">Welcome back, {{ displayName }}! Here's what's happening in your workspace.</p>
    </div>

    <!-- Key Metrics Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <!-- Active Timer -->
      <div class="bg-white rounded-lg shadow p-6 border-l-4 border-blue-600">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-600 text-sm font-medium">Active Timer</p>
            <p class="text-3xl font-bold text-gray-900 mt-2">00:15:23</p>
            <p class="text-xs text-gray-500 mt-1">Task: Website Redesign</p>
          </div>
          <svg class="w-12 h-12 text-blue-600 opacity-20" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 100-12 6 6 0 000 12zm0-6a1 1 0 11-2 0 1 1 0 012 0z" clip-rule="evenodd" />
          </svg>
        </div>
      </div>

      <!-- Pending Tasks -->
      <div class="bg-white rounded-lg shadow p-6 border-l-4 border-orange-600">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-600 text-sm font-medium">Pending Tasks</p>
            <p class="text-3xl font-bold text-gray-900 mt-2">8</p>
            <p class="text-xs text-gray-500 mt-1">Assigned to you</p>
          </div>
          <svg class="w-12 h-12 text-orange-600 opacity-20" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"></path>
            <path fill-rule="evenodd" d="M4 5a2 2 0 012-2 1 1 0 000-2H6a2 2 0 012 2h1a1 1 0 100 2H3a1 1 0 100-2h1zm-.464 5h.464a1 1 0 100-2H2a1 1 0 000 2h.536zm.464 2H3a1 1 0 100 2h.536a1 1 0 110-2z" clip-rule="evenodd"></path>
          </svg>
        </div>
      </div>

      <!-- Hours Today -->
      <div class="bg-white rounded-lg shadow p-6 border-l-4 border-green-600">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-600 text-sm font-medium">Hours Tracked</p>
            <p class="text-3xl font-bold text-gray-900 mt-2">7.5h</p>
            <p class="text-xs text-gray-500 mt-1">Today</p>
          </div>
          <svg class="w-12 h-12 text-green-600 opacity-20" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"></path>
          </svg>
        </div>
      </div>

      <!-- Pending Approvals -->
      <div class="bg-white rounded-lg shadow p-6 border-l-4 border-red-600">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-600 text-sm font-medium">Pending Approvals</p>
            <p class="text-3xl font-bold text-gray-900 mt-2">3</p>
            <p class="text-xs text-gray-500 mt-1">Awaiting action</p>
          </div>
          <svg class="w-12 h-12 text-red-600 opacity-20" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 3.062v6.372a3.066 3.066 0 01-2.812 3.062 3.066 3.066 0 01-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 01-1.745-.723 3.066 3.066 0 01-2.812-3.062V6.517a3.066 3.066 0 012.812-3.062zm7.958 5.953a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
          </svg>
        </div>
      </div>
    </div>

    <!-- Recent Activity Section -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Recent Tasks -->
      <div class="lg:col-span-2 bg-white rounded-lg shadow p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-bold text-gray-900">Recent Tasks</h2>
          <NuxtLink to="/task-management" class="text-sm text-blue-600 hover:text-blue-700 font-medium">
            View All
          </NuxtLink>
        </div>

        <div class="space-y-3">
          <div class="flex items-start justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition">
            <div class="flex-1">
              <p class="text-sm font-medium text-gray-900">Website Redesign Homepage</p>
              <p class="text-xs text-gray-500 mt-1">In Progress • Due in 2 days</p>
            </div>
            <span class="px-2 py-1 text-xs font-semibold text-blue-600 bg-blue-100 rounded">50%</span>
          </div>

          <div class="flex items-start justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition">
            <div class="flex-1">
              <p class="text-sm font-medium text-gray-900">Fix Login Form Validation</p>
              <p class="text-xs text-gray-500 mt-1">To Do • Due Today</p>
            </div>
            <span class="px-2 py-1 text-xs font-semibold text-orange-600 bg-orange-100 rounded">0%</span>
          </div>

          <div class="flex items-start justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition">
            <div class="flex-1">
              <p class="text-sm font-medium text-gray-900">Database Optimization</p>
              <p class="text-xs text-gray-500 mt-1">Review • Due in 5 days</p>
            </div>
            <span class="px-2 py-1 text-xs font-semibold text-green-600 bg-green-100 rounded">100%</span>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>

        <div class="space-y-2">
          <NuxtLink
            to="/task-management"
            class="flex items-center gap-3 p-3 rounded-lg text-gray-700 hover:bg-blue-50 transition group"
          >
            <svg class="w-5 h-5 text-gray-400 group-hover:text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
            </svg>
            <span class="text-sm font-medium">New Task</span>
          </NuxtLink>

          <NuxtLink
            to="/time-management/personal"
            class="flex items-center gap-3 p-3 rounded-lg text-gray-700 hover:bg-blue-50 transition group"
          >
            <svg class="w-5 h-5 text-gray-400 group-hover:text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 100-12 6 6 0 000 12zm0-6a1 1 0 11-2 0 1 1 0 012 0z" clip-rule="evenodd" />
            </svg>
            <span class="text-sm font-medium">Time Management</span>
          </NuxtLink>

          <NuxtLink
            to="/approvals/pending"
            class="flex items-center gap-3 p-3 rounded-lg text-gray-700 hover:bg-blue-50 transition group"
          >
            <svg class="w-5 h-5 text-gray-400 group-hover:text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
            <span class="text-sm font-medium">Approvals</span>
          </NuxtLink>

          <NuxtLink
            to="/chat"
            class="flex items-center gap-3 p-3 rounded-lg text-gray-700 hover:bg-blue-50 transition group"
          >
            <svg class="w-5 h-5 text-gray-400 group-hover:text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5z"></path>
            </svg>
            <span class="text-sm font-medium">Messages</span>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthState } from '~/composables/auth/useAuthState'

const { displayName } = useAuthState()
</script>
