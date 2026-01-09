<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Page Header -->
    <PageHeader
      title="User Management"
      description="Manage access, roles, and employee details for your organization."
    >
      <UButton
        icon="i-heroicons-plus-20-solid"
        color="primary"
        size="lg"
        @click="navigateToAddUser"
      >
        Add New User
      </UButton>
    </PageHeader>

    <!-- Main Content -->
    <div class="px-4 lg:px-6 py-6 lg:py-8">
      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <!-- Total Users -->
        <KpiCard
          title="Total Users"
          :value="userComposable.stats.value.totalUsers"
          icon="i-heroicons-users-20-solid"
          color="blue"
          :change="userComposable.stats.value.totalUsersChange"
          comparison-text="vs last month"
        />

        <!-- Active Users -->
        <KpiCard
          title="Active Users"
          :value="userComposable.stats.value.activeUsers"
          icon="i-heroicons-check-circle-20-solid"
          color="green"
          :change="userComposable.stats.value.activeUsersChange"
          comparison-text="vs last month"
        />

        <!-- Pending Invites -->
        <KpiCard
          title="Pending Invites"
          :value="userComposable.stats.value.pendingInvites"
          icon="i-heroicons-envelope-20-solid"
          color="orange"
          :change="userComposable.stats.value.pendingInvitesChange"
          comparison-text="vs last month"
        />
      </div>

      <!-- Users Table Card -->
      <UCard>
        <!-- Filters -->
        <template #header>
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 class="text-lg font-semibold text-gray-900">Users</h2>
            </div>
            <UserFilters />
          </div>
        </template>

        <!-- Loading State -->
        <LoadingState
          v-if="userComposable.loading"
          message="Loading users..."
          subtitle="Please wait while we fetch the data"
          :allow-reload="true"
          :loading="userComposable.loading"
          @reload="handleReloadUsers"
        />

        <!-- Error State -->
        <ErrorState
          v-else-if="userComposable.error"
          title="Error loading users"
          :message="userComposable.error"
          variant="error"
          :dismissible="true"
          :allow-retry="true"
          @dismiss="userComposable.clearError"
          @retry="handleReloadUsers"
        />

        <!-- Table -->
        <div v-else class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b border-gray-200 bg-gray-50">
                <th class="px-4 py-3 text-left">
                  <input type="checkbox" class="rounded border-gray-300" />
                </th>
                <th class="px-4 py-3 text-left text-sm font-semibold text-gray-700">NAME</th>
                <th class="px-4 py-3 text-left text-sm font-semibold text-gray-700">ROLE</th>
                <th class="px-4 py-3 text-left text-sm font-semibold text-gray-700">DEPARTMENT</th>
                <th class="px-4 py-3 text-left text-sm font-semibold text-gray-700">JOB TITLE</th>
                <th class="px-4 py-3 text-left text-sm font-semibold text-gray-700">STATUS</th>
                <th class="px-4 py-3 text-left text-sm font-semibold text-gray-700">HIRE DATE</th>
                <th class="px-4 py-3 text-right text-sm font-semibold text-gray-700">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="user in userComposable.users.value"
                :key="user.id"
                class="border-b border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <!-- Checkbox -->
                <td class="px-4 py-3">
                  <input type="checkbox" class="rounded border-gray-300" />
                </td>

                <!-- Name -->
                <td class="px-4 py-3">
                  <div class="flex items-center gap-3">
                    <div
                      class="w-10 h-10 rounded-full bg-linear-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-sm font-semibold"
                    >
                      {{ user.avatar || user.name.split(' ').map((n) => n[0]).join('') }}
                    </div>
                    <div>
                      <p class="font-medium text-gray-900">{{ user.name }}</p>
                      <p class="text-sm text-gray-500">{{ user.email }}</p>
                    </div>
                  </div>
                </td>

                <!-- Role -->
                <td class="px-4 py-3 text-sm text-gray-700">
                  {{ user.role }}
                </td>

                <!-- Department -->
                <td class="px-4 py-3 text-sm text-gray-700">
                  {{ user.department }}
                </td>

                <!-- Job Title -->
                <td class="px-4 py-3 text-sm text-gray-700">
                  {{ user.jobTitle }}
                </td>

                <!-- Status -->
                <td class="px-4 py-3">
                  <UBadge
                    :color="getStatusColor(user.status)"
                    variant="subtle"
                  >
                    {{ capitalize(user.status) }}
                  </UBadge>
                </td>

                <!-- Hire Date -->
                <td class="px-4 py-3 text-sm text-gray-700">
                  {{ user.hireDate }}
                </td>

                <!-- Actions -->
                <td class="px-4 py-3 text-right">
                  <UButton
                    icon="i-heroicons-ellipsis-vertical-20-solid"
                    color="secondary"
                    variant="ghost"
                    @click="openUserMenu($event, user)"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <template #footer>
          <div class="flex items-center justify-between">
            <p class="text-sm text-gray-600">
              Showing 1 to {{ userComposable.users.value.length }} of {{ userComposable.totalUsers.value }} results
            </p>
            <div class="flex items-center gap-2">
              <UButton variant="ghost" color="secondary" icon="i-heroicons-chevron-left-20-solid" />
              <UButton variant="soft" color="primary" label="1" />
              <UButton variant="ghost" color="secondary" label="2" />
              <UButton variant="ghost" color="secondary" label="3" />
              <UButton variant="ghost" color="secondary" label="..." />
              <UButton variant="ghost" color="secondary" label="14" />
              <UButton variant="ghost" color="secondary" icon="i-heroicons-chevron-right-20-solid" />
            </div>
          </div>
        </template>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
// ===== IMPORTS =====
import { ref, computed, onMounted } from 'vue'
import { useUsers } from '~/composables/users/useUsers'
import { useUserFilters } from '~/composables/users/useUserFilters'
import type { User } from '~/types/users'
import ErrorState from '~/components/common/ErrorState.vue'
import LoadingState from '~/components/common/LoadingState.vue'
import KpiCard from '~/components/common/KpiCard.vue'
import PageHeader from '~/components/layout/PageHeader.vue'
import UserFilters from '~/components/users/UserFilters.vue'


// ===== COMPOSABLES =====
const userComposable = useUsers()
const filterComposable = useUserFilters()

// ===== METHODS =====
/**
 * Get badge color for user status
 */
const getStatusColor = (status: string): 'success' | 'error' | 'warning' | 'info' | 'primary' | 'secondary' | 'neutral' => {
  const colorMap: Record<string, 'success' | 'error' | 'warning' | 'info' | 'primary' | 'secondary' | 'neutral'> = {
    active: 'success',
    inactive: 'neutral',
    pending: 'warning',
  }
  return colorMap[status] || 'neutral'
}

/**
 * Navigate to add user page
 */
const navigateToAddUser = () => {
  navigateTo('/settings/users/addUser')
}

/**
 * Capitalize first letter of string
 */
const capitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 * Open user context menu
 */
const openUserMenu = (event: any, user: User) => {
  // TODO: Implement user actions menu
  console.log('Open menu for user:', user)
}

/**
 * Reload users data
 */
const handleReloadUsers = async () => {
  await userComposable.fetchUsers()
  await userComposable.getStats()
}

// ===== LIFECYCLE =====
onMounted(async () => {
  await userComposable.fetchUsers()
  await userComposable.getStats()
})
</script>
