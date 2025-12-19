<template>
  <div class="bg-white border border-gray-200 h-full rounded-xl p-6">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold text-gray-900">Recent Activity</h3>
      <NuxtLink 
        to="/activity" 
        class="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
      >
        View All
      </NuxtLink>
    </div>

    <div class="space-y-3">
      <div
        v-for="(activity, index) in activities"
        :key="index"
        class="flex items-start justify-between py-3 border-b border-gray-100 last:border-0"
      >
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-gray-900 truncate">{{ activity.title }}</p>
          <p class="text-xs text-gray-500 mt-1">{{ activity.project }}</p>
        </div>
        <div class="text-right ml-4 flex-shrink-0">
          <p class="text-sm font-semibold text-gray-900">{{ activity.duration }}</p>
          <p class="text-xs text-gray-500 mt-1">{{ activity.time }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Activity {
  title: string
  project: string
  duration: string
  time: string
}

interface Props {
  activities: Activity[]
}

defineProps<Props>()
</script>

