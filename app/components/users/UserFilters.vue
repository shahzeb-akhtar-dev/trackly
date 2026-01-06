<template>
  <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
    <!-- Search Filter -->
    <UInput
      v-if="filterComposable.filterConfig.value.search.visible"
      v-model="filterComposable.searchQuery.value"
      placeholder="Search by name or email"
      icon="i-heroicons-magnifying-glass-20-solid"
      color="secondary"
      class="flex-1 sm:flex-none"
    />

    <!-- Role Filter -->
    <USelect
      v-if="filterComposable.filterConfig.value.role.visible"
      v-model="filterComposable.selectedRole.value"
      :options="filterComposable.roleOptions.value"
      value-attribute="value"
      option-attribute="label"
      :trailing="false"
      :ui="{
        base: 'w-full sm:w-auto',
      }"
    />

    <!-- Department Filter -->
    <USelect
      v-if="filterComposable.filterConfig.value.department.visible"
      v-model="filterComposable.selectedDepartment.value"
      :options="filterComposable.departmentOptions.value"
      value-attribute="value"
      option-attribute="label"
      :trailing="false"
      :ui="{
        base: 'w-full sm:w-auto',
      }"
    />

    <!-- Status Filter -->
    <USelect
      v-if="filterComposable.filterConfig.value.status.visible"
      v-model="filterComposable.selectedStatus.value"
      :options="filterComposable.statusOptions.value"
      value-attribute="value"
      option-attribute="label"
      :trailing="false"
      :ui="{
        base: 'w-full sm:w-auto',
      }"
    />

    <!-- Filter Options Dropdown -->
    <UDropdown
      :items="filterMenuItems"
      :popper="{ placement: 'bottom-end' }"
    >
      <UButton
        icon="i-heroicons-adjustments-horizontal-20-solid"
        color="secondary"
        variant="outline"
        :badge="
          filterComposable.hasActiveFilters.value
            ? String(filterComposable.activeFilterCount.value)
            : undefined
        "
      >
        <template #trailing>
          <Icon name="i-heroicons-chevron-down-20-solid" class="w-4 h-4" />
        </template>
      </UButton>
    </UDropdown>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useUserFilters } from '~/composables/users/useUserFilters'

const filterComposable = useUserFilters()

// Build filter menu items
const filterMenuItems = computed(() => [
  [
    {
      label: 'Filters',
      slot: 'filters',
    },
  ],
  [
    {
      label: filterComposable.hasActiveFilters.value ? 'Reset Filters' : 'Show All',
      icon: filterComposable.hasActiveFilters.value
        ? 'i-heroicons-arrow-path-20-solid'
        : 'i-heroicons-check-20-solid',
      click: () => {
        if (filterComposable.hasActiveFilters.value) {
          filterComposable.resetFilters()
        } else {
          filterComposable.showAllFilters()
        }
      },
    },
  ],
])
</script>
