<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Page Header -->
    <div class="">
      <div class="px-4 lg:px-6 py-6 sm:py-8">
        <div
          class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        >
          <div>
            <h1 class="text-2xl lg:text-3xl font-bold text-gray-900">
              Dashboard
            </h1>
            <p class="text-gray-600 text-sm mt-1">
              Welcome back, Alex. Here's your activity for today.
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="px-4 lg:px-6 py-6 lg:py-8">
      <!-- Top Row: Current Session + Recent Activity -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <!-- Current Session Timer -->
        <div class="lg:col-span-2">
          <TimerWidget variant="block" />
        </div>

        <!-- Recent Activity -->
        <div>
          <RecentActivityCard :activities="recentActivities" />
        </div>
      </div>

      <!-- Attendance Chart -->
      <div class="mb-6">
        <div class="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div class="flex items-center justify-between mb-6">
            <div>
              <h3 class="text-lg font-semibold text-gray-900">Attendance</h3>
              <p class="text-sm text-gray-500 mt-1">
                October Activity Overview
              </p>
            </div>
            <!-- Legend -->
            <div class="flex items-center gap-4">
              <div class="flex items-center gap-2">
                <div class="w-3 h-3 rounded-full bg-blue-500"></div>
                <span class="text-xs text-gray-600">Present</span>
              </div>
              <div class="flex items-center gap-2">
                <div class="w-3 h-3 rounded-full bg-gray-300"></div>
                <span class="text-xs text-gray-600">Absent</span>
              </div>
            </div>
          </div>
          <ClientOnly>
            <div class="w-full min-h-[300px]">
              <BarChart
                :series="attendanceChartSeries"
                :categories="attendanceCategories"
                :show-header="false"
                :show-legend="false"
                :no-wrapper="true"
                height="300"
                :options="attendanceChartOptions"
              />
            </div>
          </ClientOnly>
        </div>
      </div>

      <!-- Bottom Row: Task Progress + Requests -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <!-- Completed Tasks -->
        <TaskProgressCard
          :percentage="65"
          status-label="Completed"
          description="24 Tasks on Time"
          variant="completed"
        />

        <!-- Delayed Tasks -->
        <TaskProgressCard
          :percentage="20"
          status-label="Delayed"
          description="8 Tasks Late"
          variant="delayed"
        />

        <!-- Pending Tasks -->
        <TaskProgressCard
          :percentage="15"
          status-label="Pending"
          description="6 Tasks Remaining"
          variant="pending"
        />

        <!-- Requests -->
        <RequestsCard :requests="requests" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import TimerWidget from "~/components/time-tracking/TimerWidget.vue";
import BarChart from "~/components/charts/BarChart.vue";
import TaskProgressCard from "~/components/dashboard/TaskProgressCard.vue";
import RecentActivityCard from "~/components/dashboard/RecentActivityCard.vue";
import RequestsCard from "~/components/dashboard/RequestsCard.vue";

// ============ State ============
const recentActivities = ref([
  {
    title: "Client Meeting",
    project: "Project Alpha",
    duration: "00:45:00",
    time: "10:30 AM",
  },
  {
    title: "Bug Fixes #402",
    project: "Maintenance",
    duration: "02:15:30",
    time: "Yesterday",
  },
  {
    title: "Weekly Sync",
    project: "Internal",
    duration: "01:00:00",
    time: "Yesterday",
  },
]);

const requests = ref([
  { title: "Sick Leave", status: "Pending" as const },
  { title: "Equipment", status: "Approved" as const },
  { title: "Vacation", status: "Approved" as const },
  { title: "Expense", status: "Rejected" as const },
]);

// ============ Chart Data ============
// Generate 30 days of October data
const attendanceCategories = Array.from({ length: 30 }, (_, i) =>
  String(i + 1)
);

const attendanceChartSeries = computed(() => [
  {
    name: "Present",
    data: [
      24, 28, 25, 30, 28, 26, 29, 27, 31, 29, 26, 28, 30, 27, 29, 25, 28, 30,
      27, 29, 26, 28, 31, 29, 27, 30, 28, 26, 29, 27,
    ],
  },
  {
    name: "Absent",
    data: [
      2, 1, 2, 0, 1, 2, 0, 1, 0, 1, 2, 1, 0, 2, 1, 2, 1, 0, 2, 1, 2, 1, 0, 1, 2,
      0, 1, 2, 1, 2,
    ],
  },
]);

const attendanceChartOptions = computed(() => ({
  colors: ["#3b82f6", "#d1d5db"],
  plotOptions: {
    bar: {
      columnWidth: "60%",
      borderRadius: 4,
    },
  },
  xaxis: {
    categories: attendanceCategories,
    labels: {
      style: {
        fontSize: "11px",
        colors: "#6b7280",
      },
    },
  },
  yaxis: {
    labels: {
      style: {
        fontSize: "11px",
        colors: "#6b7280",
      },
    },
  },
  grid: {
    borderColor: "#e5e7eb",
    strokeDashArray: 4,
  },
  legend: {
    show: false,
  },
}));
</script>
