<template>
  <div class="min-h-screen bg-[rgb(var(--color-surface))]">
    <!-- Page Header -->
    <div class="mb-8">
      <h1 class="text-4xl font-bold text-[rgb(var(--color-text-main))]">Dashboard</h1>
      <p class="text-[rgb(var(--color-text-muted))] mt-2">Welcome back, {{ displayName }}! Here's your activity for today.</p>
    </div>

    <!-- Key Metrics Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <!-- Active Timer -->
      <div class="bg-[rgb(var(--color-surface))] rounded-[var(--radius-lg)] shadow-sm border border-[rgb(var(--color-border-subtle))] border-l-4 border-l-[rgb(var(--color-primary))] p-6">
        <p class="text-[rgb(var(--color-text-muted))] text-sm font-semibold">Active Timer</p>\n        <p class="text-3xl font-bold text-[rgb(var(--color-text-main))] mt-3">00:15:23</p>\n        <p class="text-xs text-[rgb(var(--color-text-muted))] mt-2">Redesign Homepage</p>\n      </div>

      <!-- Pending Tasks -->
      <div class="bg-[rgb(var(--color-surface))] rounded-[var(--radius-lg)] shadow-sm border border-[rgb(var(--color-border-subtle))] border-l-4 border-l-[rgb(var(--ui-color-warning-500))] p-6">
        <p class="text-[rgb(var(--color-text-muted))] text-sm font-semibold">Pending Tasks</p>
        <p class="text-3xl font-bold text-[rgb(var(--color-text-main))] mt-3">8</p>
        <p class="text-xs text-[rgb(var(--color-text-muted))] mt-2">Assigned to you</p>
      </div>

      <!-- Hours Tracked -->
      <div class="bg-[rgb(var(--color-surface))] rounded-[var(--radius-lg)] shadow-sm border border-[rgb(var(--color-border-subtle))] border-l-4 border-l-[rgb(var(--ui-color-success-500))] p-6">
        <p class="text-[rgb(var(--color-text-muted))] text-sm font-semibold">Hours Tracked</p>
        <p class="text-3xl font-bold text-[rgb(var(--color-text-main))] mt-3">7.5h</p>
        <p class="text-xs text-[rgb(var(--color-text-muted))] mt-2">Today</p>
      </div>

      <!-- Pending Approvals -->
      <div class="bg-[rgb(var(--color-surface))] rounded-[var(--radius-lg)] shadow-sm border border-[rgb(var(--color-border-subtle))] border-l-4 border-l-[rgb(var(--ui-color-error-500))] p-6">
        <p class="text-[rgb(var(--color-text-muted))] text-sm font-semibold">Pending Approvals</p>
        <p class="text-3xl font-bold text-[rgb(var(--color-text-main))] mt-3">3</p>
        <p class="text-xs text-[rgb(var(--color-text-muted))] mt-2">Awaiting action</p>
      </div>
    </div>

    <!-- Recent Activity Section -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Recent Tasks -->
      <div class="lg:col-span-2 bg-[rgb(var(--color-surface))] rounded-[var(--radius-lg)] shadow-sm border border-[rgb(var(--color-border-subtle))] p-6">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-bold text-[rgb(var(--color-text-main))]">Recent Activity</h2>
          <NuxtLink to="/task-management" class="text-sm text-[rgb(var(--color-primary))] hover:opacity-80 font-semibold transition-opacity">
            View All
          </NuxtLink>
        </div>

        <div class="space-y-3">
          <div class="flex items-start justify-between p-4 bg-[rgb(var(--color-surface-alt))] rounded-[var(--radius-md)] hover:shadow-xs transition-shadow cursor-pointer">
            <div class="flex-1">
              <p class="text-sm font-semibold text-[rgb(var(--color-text-main))]">Client Meeting</p>
              <p class="text-xs text-[rgb(var(--color-text-muted))] mt-1">00:45:00 • Admin</p>
            </div>
            <span class="text-xs font-bold px-3 py-1 bg-[rgba(var(--color-primary),0.12)] text-[rgb(var(--color-primary))] rounded-[var(--radius-full)]">Active</span>
          </div>

          <div class="flex items-start justify-between p-4 bg-[rgb(var(--color-surface-alt))] rounded-[var(--radius-md)] hover:shadow-xs transition-shadow cursor-pointer">
            <div class="flex-1">
              <p class="text-sm font-semibold text-[rgb(var(--color-text-main))]">Bug Fixes #402</p>
              <p class="text-xs text-[rgb(var(--color-text-muted))] mt-1">02:15:30 • Maintenance</p>
            </div>
            <span class="text-xs font-bold px-3 py-1 bg-[rgba(var(--ui-color-warning-500),0.12)] text-[rgb(var(--ui-color-warning-500))] rounded-[var(--radius-full)]">In Progress</span>
          </div>

          <div class="flex items-start justify-between p-4 bg-[rgb(var(--color-surface-alt))] rounded-[var(--radius-md)] hover:shadow-xs transition-shadow cursor-pointer">
            <div class="flex-1">
              <p class="text-sm font-semibold text-[rgb(var(--color-text-main))]">Weekly Sync</p>
              <p class="text-xs text-[rgb(var(--color-text-muted))] mt-1">01:00:00 • Planning</p>
            </div>
            <span class="text-xs font-bold px-3 py-1 bg-[rgba(var(--ui-color-success-500),0.12)] text-[rgb(var(--ui-color-success-500))] rounded-[var(--radius-full)]">Completed</span>
          </div>
        </div>
      </div>

      <!-- What are you working on -->
      <div class="bg-[rgb(var(--color-surface))] rounded-[var(--radius-lg)] shadow-sm border border-[rgb(var(--color-border-subtle))] p-6">
        <h2 class="text-xl font-bold text-[rgb(var(--color-text-main))] mb-4">What are you working on?</h2>
        <button class="w-full flex items-center justify-center px-4 py-2 bg-[rgb(var(--color-primary))] text-white font-semibold rounded-[var(--radius-md)] hover:opacity-90 transition-opacity">
          Start Timer
        </button>
        
        <div class="mt-6 space-y-2">
          <h3 class="text-xs font-bold text-[rgb(var(--color-text-muted))] uppercase tracking-wider">Requests</h3>
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <div class="w-2 h-2 bg-[rgb(var(--ui-color-success-500))] rounded-full"></div>
                <span class="text-sm text-[rgb(var(--color-text-main))] font-medium">Sick Leave</span>
              </div>
              <span class="text-xs text-[rgb(var(--color-text-muted))]">Pending</span>
            </div>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <div class="w-2 h-2 bg-[rgb(var(--ui-color-warning-500))] rounded-full"></div>
                <span class="text-sm text-[rgb(var(--color-text-main))] font-medium">Equipment</span>
              </div>
              <span class="text-xs text-[rgb(var(--color-text-muted))]">Approved</span>
            </div>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <div class="w-2 h-2 bg-[rgb(var(--ui-color-info-500))] rounded-full"></div>
                <span class="text-sm text-[rgb(var(--color-text-main))] font-medium">Vacation</span>
              </div>
              <span class="text-xs text-[rgb(var(--color-text-muted))]">Approved</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthState } from '~/composables/auth/useAuthState'

const { displayName } = useAuthState()

definePageMeta({
  layout: 'default'
})
</script>

