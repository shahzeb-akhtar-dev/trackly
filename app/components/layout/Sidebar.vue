<template>
  <aside
    class="w-64 bg-gray-900 text-white shadow-lg transition-transform duration-300"
    :class="{ '-translate-x-full': !sidebarOpen }"
  >
    <!-- Logo Section -->
    <div class="h-16 flex items-center justify-between px-6 border-b border-gray-800">
      <div class="flex items-center gap-2">
        <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
          <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path
              d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"
            />
          </svg>
        </div>
        <h1 class="text-xl font-bold">Trackly</h1>
      </div>
      <button
        @click="toggleSidebar"
        class="md:hidden p-1 hover:bg-gray-800 rounded"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <!-- User Section -->
    <div class="p-6 border-b border-gray-800">
      <div class="flex items-center gap-3">
        <img
          src="https://api.dicebear.com/7.x/avataaars/svg?seed=trackly"
          alt="User"
          class="w-10 h-10 rounded-full"
        />
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-white truncate">{{ displayName }}</p>
          <p class="text-xs text-gray-400 truncate">{{ roleLabel }}</p>
        </div>
      </div>
    </div>

    <!-- Navigation Menu -->
    <nav class="px-4 py-6 space-y-2">
      <!-- Dashboard -->
      <NavItem
        to="/"
        icon="chart-bar"
        label="Dashboard"
      />

      <!-- Task Management -->
      <MenuSection title="Tasks & Projects">
        <NavItem
          to="/task-management"
          icon="tasks"
          label="My Tasks"
        />
        <NavItem
          to="/task-management/projects"
          icon="briefcase"
          label="Projects"
        />
        <NavItem
          to="/task-management/kanban-board"
          icon="th"
          label="Kanban Board"
        />
      </MenuSection>

      <!-- Time & Attendance -->
      <MenuSection title="Time & Attendance">
        <NavItem
          to="/time-management/personal"
          icon="clock"
          label="My Time Logs"
        />
        <NavItem
          to="/time-management/leave"
          icon="calendar"
          label="Leave Requests"
        />
        <NavItem
          to="/time-management/overtime"
          icon="hourglass"
          label="Overtime"
        />
      </MenuSection>

      <!-- Management (if manager) -->
      <MenuSection v-if="isManager" title="Management">
        <NavItem
          to="/time-management/workforce"
          icon="users"
          label="Team Time"
        />
        <NavItem
          to="/analytics/productivity"
          icon="chart-line"
          label="Team Analytics"
        />
      </MenuSection>

      <!-- Approvals -->
      <NavItem
        to="/approvals/pending"
        icon="check-circle"
        label="Approvals"
        :badge="pendingApprovalsCount"
      />

      <!-- Reports -->
      <NavItem
        to="/reports"
        icon="document"
        label="Reports"
      />

      <!-- Chat -->
      <NavItem
        to="/chat"
        icon="chat"
        label="Chat"
        :badge="unreadMessagesCount"
      />

      <!-- Admin Section (if owner/admin) -->
      <template v-if="isAdmin">
        <MenuSection title="Administration">
          <NavItem
            to="/settings"
            icon="cog"
            label="Settings"
          />
          <NavItem
            to="/settings/users"
            icon="users"
            label="Users"
          />
          <NavItem
            to="/settings/roles-permissions"
            icon="key"
            label="Roles & Permissions"
          />
          <NavItem
            to="/payroll"
            icon="credit-card"
            label="Payroll"
          />
        </MenuSection>
      </template>
    </nav>

    <!-- Footer -->
    <div class="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800">
      <button
        @click="toggleHelp"
        class="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition"
      >
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fill-rule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
            clip-rule="evenodd"
          />
        </svg>
        <span>Help & Support</span>
      </button>
    </div>
  </aside>

  <!-- Mobile Overlay -->
  <div
    v-if="!sidebarOpen"
    @click="toggleSidebar"
    class="fixed inset-0 bg-black/50 md:hidden z-40"
  ></div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthState } from '~/composables/auth/useAuthState'

const { isAdmin, isManager, displayName, roleLabel } = useAuthState()

const sidebarOpen = ref(true)
const pendingApprovalsCount = ref(3)
const unreadMessagesCount = ref(5)

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}

const toggleHelp = () => {
  // Handle help modal
  console.log('Help menu clicked')
}
</script>

<style scoped>
/* Sidebar component styles */
</style>
