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
        @click="isAddUserModalOpen = true"
      >
        Add New User
      </UButton>
    </PageHeader>

    <!-- Main Content -->
    <div class="px-4 lg:px-6 py-6 lg:py-8">
      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <!-- Total Users -->
        <UCard>
          <template #header>
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600">Total Users</p>
                <p class="text-3xl font-bold text-gray-900 mt-2">
                  {{ userComposable.stats.value.totalUsers }}
                </p>
              </div>
              <div class="p-3 bg-blue-50 rounded-lg">
                <Icon name="i-heroicons-users-20-solid" class="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </template>
          <div class="flex items-center gap-1 text-sm">
            <Icon
              :name="
                userComposable.stats.value.totalUsersChange >= 0
                  ? 'i-heroicons-arrow-trending-up-20-solid'
                  : 'i-heroicons-arrow-trending-down-20-solid'
              "
              :class="
                userComposable.stats.value.totalUsersChange >= 0
                  ? 'text-green-600'
                  : 'text-red-600'
              "
              class="w-4 h-4"
            />
            <span
              :class="
                userComposable.stats.value.totalUsersChange >= 0
                  ? 'text-green-600'
                  : 'text-red-600'
              "
            >
              +{{ userComposable.stats.value.totalUsersChange }}%
            </span>
            <span class="text-gray-600">vs last month</span>
          </div>
        </UCard>

        <!-- Active Users -->
        <UCard>
          <template #header>
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600">Active Users</p>
                <p class="text-3xl font-bold text-gray-900 mt-2">
                  {{ userComposable.stats.value.activeUsers }}
                </p>
              </div>
              <div class="p-3 bg-green-50 rounded-lg">
                <Icon name="i-heroicons-check-circle-20-solid" class="w-6 h-6 text-green-600" />
              </div>
            </div>
          </template>
          <div class="flex items-center gap-1 text-sm">
            <Icon
              :name="
                userComposable.stats.value.activeUsersChange >= 0
                  ? 'i-heroicons-arrow-trending-up-20-solid'
                  : 'i-heroicons-arrow-trending-down-20-solid'
              "
              :class="
                userComposable.stats.value.activeUsersChange >= 0
                  ? 'text-green-600'
                  : 'text-red-600'
              "
              class="w-4 h-4"
            />
            <span
              :class="
                userComposable.stats.value.activeUsersChange >= 0
                  ? 'text-green-600'
                  : 'text-red-600'
              "
            >
              +{{ userComposable.stats.value.activeUsersChange }}%
            </span>
            <span class="text-gray-600">vs last month</span>
          </div>
        </UCard>

        <!-- Pending Invites -->
        <UCard>
          <template #header>
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600">Pending Invites</p>
                <p class="text-3xl font-bold text-gray-900 mt-2">
                  {{ userComposable.stats.value.pendingInvites }}
                </p>
              </div>
              <div class="p-3 bg-orange-50 rounded-lg">
                <Icon name="i-heroicons-envelope-20-solid" class="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </template>
          <div class="flex items-center gap-1 text-sm">
            <Icon
              :name="
                userComposable.stats.value.pendingInvitesChange >= 0
                  ? 'i-heroicons-arrow-trending-up-20-solid'
                  : 'i-heroicons-arrow-trending-down-20-solid'
              "
              :class="
                userComposable.stats.value.pendingInvitesChange >= 0
                  ? 'text-green-600'
                  : 'text-red-600'
              "
              class="w-4 h-4"
            />
            <span
              :class="
                userComposable.stats.value.pendingInvitesChange >= 0
                  ? 'text-green-600'
                  : 'text-red-600'
              "
            >
              +{{ userComposable.stats.value.pendingInvitesChange }}%
            </span>
            <span class="text-gray-600">vs last month</span>
          </div>
        </UCard>
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
        <div v-if="userComposable.loading" class="flex items-center justify-center py-12">
          <div class="text-center">
            <div class="w-8 h-8 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
            <p class="text-gray-600">Loading users...</p>
          </div>
        </div>

        <!-- Error State -->
        <div v-else-if="userComposable.error" class="p-4 mb-4 bg-red-50 border border-red-200 rounded-lg">
          <div class="flex items-start gap-3">
            <Icon name="i-heroicons-exclamation-circle-20-solid" class="w-5 h-5 text-red-600 mt-0.5" />
            <div>
              <h3 class="font-semibold text-red-900">Error loading users</h3>
              <p class="text-sm text-red-700 mt-1">{{ userComposable.error }}</p>
            </div>
            <UButton
              icon="i-heroicons-x-mark-20-solid"
              color="error"
              variant="ghost"
              size="sm"
              @click="userComposable.clearError"
            />
          </div>
        </div>

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

    <!-- Add User Modal -->
    <UModal v-model="isAddUserModalOpen">
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-semibold text-gray-900">Add New User</h2>
            <UButton
              icon="i-heroicons-x-mark-20-solid"
              color="secondary"
              variant="ghost"
              @click="isAddUserModalOpen = false"
            />
          </div>
        </template>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <UInput v-model="newUserForm.name" placeholder="Enter full name" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <UInput v-model="newUserForm.email" type="email" placeholder="Enter email address" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <USelect
              v-model="newUserForm.role"
              :options="['Administrator', 'Manager', 'Editor', 'Viewer', 'Admin']"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Department</label>
            <USelect
              v-model="newUserForm.department"
              :options="['Engineering', 'Human Resources', 'Marketing', 'Operations', 'IT']"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
            <UInput v-model="newUserForm.jobTitle" placeholder="Enter job title" />
          </div>
        </div>

        <template #footer>
          <div class="flex items-center justify-between">
            <UButton color="secondary" variant="ghost" @click="isAddUserModalOpen = false">
              Cancel
            </UButton>
            <UButton
              color="primary"
              :loading="userComposable.loading.value"
              @click="handleAddUser"
            >
              Create User
            </UButton>
          </div>
        </template>
      </UCard>
    </UModal>
  </div>
</template>

<script setup lang="ts">
// 1. Imports
import { ref, computed, onMounted } from 'vue'
import { useUsers } from '~/composables/users/useUsers'
import { useUserFilters } from '~/composables/users/useUserFilters'
import type { User } from '~/types/users'

// 2. Composables
const userComposable = useUsers()
const filterComposable = useUserFilters()

// 3. Local state
const isAddUserModalOpen = ref(false)
const newUserForm = ref({
  name: '',
  email: '',
  role: 'Viewer',
  department: '',
  jobTitle: '',
})

// 4. Methods
const getStatusColor = (status: string): 'success' | 'error' | 'warning' | 'info' | 'primary' | 'secondary' | 'neutral' => {
  const colorMap: Record<string, 'success' | 'error' | 'warning' | 'info' | 'primary' | 'secondary' | 'neutral'> = {
    active: 'success',
    inactive: 'neutral',
    pending: 'warning',
  }
  return colorMap[status] || 'neutral'
}

const capitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

const openUserMenu = (event: any, user: User) => {
  // Menu action handler
  console.log('Open menu for user:', user)
}

const handleAddUser = async () => {
  try {
    await userComposable.createUser(newUserForm.value)
    isAddUserModalOpen.value = false
    newUserForm.value = {
      name: '',
      email: '',
      role: 'Viewer',
      department: '',
      jobTitle: '',
    }
  } catch (error) {
    console.error('Failed to create user:', error)
  }
}

// 5. Lifecycle
onMounted(async () => {
  await userComposable.fetchUsers()
  await userComposable.getStats()
})
</script>
