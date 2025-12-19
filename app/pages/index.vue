<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Page Header -->
    <div class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 lg:px-6 py-6 sm:py-8">
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 class="text-2xl lg:text-3xl font-bold text-gray-900">Dashboard</h1>
            <p class="text-gray-600 text-sm mt-1">Welcome back, Alex. Here's your activity for today.</p>
          </div>
          <button class="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 whitespace-nowrap">
            <Icon name="tabler:play-circle" class="w-4 h-4" />
            <span class="hidden sm:inline">Start Timer</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 lg:px-6 py-6 lg:py-8">
      <!-- Grid Layout -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Left Column: Timer + Charts -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Current Session Timer -->
          <TimerWidget 
            v-if="timerComposable.activeTimer"
            variant="block" 
            :taskName="timerComposable.activeTimer?.task?.title || 'Current Task'"
          />

          <!-- Attendance Chart -->
          <div class="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <BarChart
              title="Attendance"
              subtitle="Last 30 days"
              :series="attendanceChartSeries"
              :categories="attendanceCategories"
              :show-header="false"
              :show-legend="true"
              :legend-items="['Present', 'Absent']"
              :legend-colors="['#3b82f6', '#d1d5db']"
              height="320"
            />
          </div>
        </div>

        <!-- Right Column: Stats + Activity + Requests -->
        <div class="space-y-6">
          <!-- Statistics Cards -->
          <div class="space-y-4">
            <!-- Completed -->
            <div class="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-4xl font-bold text-gray-900">65%</p>
                  <p class="text-sm text-gray-600 mt-2">Completed</p>
                  <p class="text-xs text-gray-500 mt-1">Tasks in time</p>
                </div>
                <div class="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center">
                  <Icon name="tabler:circle-check" class="w-8 h-8 text-emerald-600" />
                </div>
              </div>
            </div>

            <!-- Delayed -->
            <div class="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-4xl font-bold text-gray-900">20%</p>
                  <p class="text-sm text-gray-600 mt-2">Delayed</p>
                  <p class="text-xs text-gray-500 mt-1">Tasks in red flag</p>
                </div>
                <div class="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
                  <Icon name="tabler:alert-circle" class="w-8 h-8 text-red-600" />
                </div>
              </div>
            </div>

            <!-- Pending -->
            <div class="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-4xl font-bold text-gray-900">15%</p>
                  <p class="text-sm text-gray-600 mt-2">Pending</p>
                  <p class="text-xs text-gray-500 mt-1">Tasks processing</p>
                </div>
                <div class="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center">
                  <Icon name="tabler:clock" class="w-8 h-8 text-amber-600" />
                </div>
              </div>
            </div>
          </div>

          <!-- Recent Activity -->
          <div class="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold text-gray-900">Recent Activity</h3>
              <NuxtLink to="/activity" class="text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors">
                View All
              </NuxtLink>
            </div>

            <!-- Activity List -->
            <div class="space-y-3">
              <div class="flex items-start justify-between py-3 border-b border-gray-100 last:border-0">
                <div class="flex-1">
                  <p class="text-sm font-medium text-gray-900">Design review meeting</p>
                  <p class="text-xs text-gray-500 mt-1">Project Management</p>
                </div>
                <div class="text-right">
                  <p class="text-sm font-semibold text-gray-900">1h 30m</p>
                  <p class="text-xs text-gray-500 mt-1">Today</p>
                </div>
              </div>

              <div class="flex items-start justify-between py-3 border-b border-gray-100">
                <div class="flex-1">
                  <p class="text-sm font-medium text-gray-900">Frontend development</p>
                  <p class="text-xs text-gray-500 mt-1">Development</p>
                </div>
                <div class="text-right">
                  <p class="text-sm font-semibold text-gray-900">3h 45m</p>
                  <p class="text-xs text-gray-500 mt-1">Today</p>
                </div>
              </div>

              <div class="flex items-start justify-between py-3">
                <div class="flex-1">
                  <p class="text-sm font-medium text-gray-900">Code review</p>
                  <p class="text-xs text-gray-500 mt-1">QA</p>
                </div>
                <div class="text-right">
                  <p class="text-sm font-semibold text-gray-900">2h 15m</p>
                  <p class="text-xs text-gray-500 mt-1">Today</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Requests -->
          <div class="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold text-gray-900">Requests</h3>
              <NuxtLink to="/requests" class="text-blue-600 hover:text-blue-700 transition-colors">
                <Icon name="tabler:arrow-right" class="w-4 h-4" />
              </NuxtLink>
            </div>

            <!-- Requests List -->
            <div class="space-y-3">
              <div class="flex items-center justify-between py-2">
                <div class="flex-1">
                  <p class="text-sm text-gray-700">Sick Leave</p>
                </div>
                <span class="px-2 py-1 text-xs font-semibold rounded-full bg-amber-50 text-amber-700">Pending</span>
              </div>

              <div class="flex items-center justify-between py-2">
                <div class="flex-1">
                  <p class="text-sm text-gray-700">Equipment Request</p>
                </div>
                <span class="px-2 py-1 text-xs font-semibold rounded-full bg-emerald-50 text-emerald-700">Approved</span>
              </div>

              <div class="flex items-center justify-between py-2">
                <div class="flex-1">
                  <p class="text-sm text-gray-700">Vacation</p>
                </div>
                <span class="px-2 py-1 text-xs font-semibold rounded-full bg-emerald-50 text-emerald-700">Approved</span>
              </div>

              <div class="flex items-center justify-between py-2">
                <div class="flex-1">
                  <p class="text-sm text-gray-700">Expense Report</p>
                </div>
                <span class="px-2 py-1 text-xs font-semibold rounded-full bg-red-50 text-red-700">Rejected</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useDashboard } from '~/composables/dashboard/useDashboard'
import { useTimer } from '~/composables/time-tracking/useTimer'
import TimerWidget from '~/components/time-tracking/TimerWidget.vue'
import BarChart from '~/components/charts/BarChart.vue'

// ============ Composables ============
const dashboardComposable = useDashboard()
const timerComposable = useTimer()

// ============ State ============
const attendanceChartReady = ref(false)

// ============ Chart Data ============
const attendanceCategories = [
  '1', '5', '10', '15', '20', '25', '30'
]

const attendanceChartSeries = computed(() => [
  {
    name: 'Present',
    data: [24, 28, 25, 30, 28, 26, 29],
  },
  {
    name: 'Absent',
    data: [2, 3, 2, 1, 2, 3, 1],
  },
])

// ============ Lifecycle ============
onMounted(async () => {
  // Fetch active timer
  await timerComposable.getActiveTimer()
  
  // Mark chart as ready
  attendanceChartReady.value = true
})
</script>

