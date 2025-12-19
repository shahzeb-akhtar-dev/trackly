<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Page Header -->
    <div class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 lg:px-6 py-6">
        <h1 class="text-3xl font-bold text-gray-900">Chart Components Gallery</h1>
        <p class="text-gray-600 text-sm mt-2">Showcase of all available reusable chart components</p>
      </div>
    </div>

    <!-- Content -->
    <div class="max-w-7xl mx-auto px-4 lg:px-6 py-8">
      <!-- Bar Chart -->
      <div class="mb-12">
        <h2 class="text-2xl font-bold text-gray-900 mb-6">Bar Chart Example</h2>
        <BarChart
          title="Monthly Sales"
          subtitle="Comparison of sales and revenue"
          :series="[
            { name: 'Sales', data: [44, 55, 41, 37, 22, 43, 21] },
            { name: 'Revenue', data: [53, 32, 33, 52, 13, 43, 32] }
          ]"
          :categories="['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul']"
          :show-legend="true"
          :legend-items="['Sales', 'Revenue']"
          color-scheme="default"
        />
      </div>

      <!-- Line Chart -->
      <div class="mb-12">
        <h2 class="text-2xl font-bold text-gray-900 mb-6">Line Chart Example</h2>
        <LineChart
          title="Performance Trend"
          subtitle="Last 7 days performance metrics"
          :series="[
            { name: 'Performance', data: [10, 41, 35, 51, 49, 62, 69] },
            { name: 'Target', data: [50, 50, 50, 50, 50, 50, 50] }
          ]"
          :categories="['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']"
          :show-legend="true"
          :legend-items="['Performance', 'Target']"
          curve-type="smooth"
        />
      </div>

      <!-- Area Chart -->
      <div class="mb-12">
        <h2 class="text-2xl font-bold text-gray-900 mb-6">Area Chart Example</h2>
        <AreaChart
          title="User Growth"
          subtitle="Monthly active users"
          :series="[
            { name: 'New Users', data: [31, 40, 28, 51, 42, 109, 100] },
            { name: 'Returning', data: [11, 32, 45, 32, 34, 52, 41] }
          ]"
          :categories="['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7']"
          fill-type="gradient"
          :show-legend="true"
          :legend-items="['New Users', 'Returning']"
        />
      </div>

      <!-- Pie Chart -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
        <!-- Pie -->
        <div>
          <h2 class="text-2xl font-bold text-gray-900 mb-6">Pie Chart Example</h2>
          <PieChart
            title="Market Share"
            :series="[44, 55, 41, 17, 15]"
            :labels="['Product A', 'Product B', 'Product C', 'Product D', 'Product E']"
            chart-type="pie"
          />
        </div>

        <!-- Donut -->
        <div>
          <h2 class="text-2xl font-bold text-gray-900 mb-6">Donut Chart Example</h2>
          <PieChart
            title="Category Distribution"
            :series="[30, 25, 20, 15, 10]"
            :labels="['Electronics', 'Clothing', 'Food', 'Books', 'Other']"
            chart-type="donut"
          />
        </div>
      </div>

      <!-- Radial Chart -->
      <div class="mb-12">
        <h2 class="text-2xl font-bold text-gray-900 mb-6">Radial Chart Example</h2>
        <RadialChart
          title="Task Completion Status"
          :series="[65, 20, 15]"
          :labels="['Completed', 'Delayed', 'Pending']"
        />
      </div>

      <!-- Combined Dashboard Example -->
      <div class="mb-12">
        <h2 class="text-2xl font-bold text-gray-900 mb-6">Dashboard Example</h2>
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <!-- Stats Cards -->
          <div class="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-4xl font-bold text-gray-900">65%</p>
                <p class="text-sm text-gray-600 mt-2">Completed</p>
                <p class="text-xs text-gray-500 mt-1">Tasks on track</p>
              </div>
              <div class="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center">
                <Icon name="tabler:circle-check" class="w-8 h-8 text-emerald-600" />
              </div>
            </div>
          </div>

          <div class="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-4xl font-bold text-gray-900">20%</p>
                <p class="text-sm text-gray-600 mt-2">Delayed</p>
                <p class="text-xs text-gray-500 mt-1">Need attention</p>
              </div>
              <div class="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
                <Icon name="tabler:alert-circle" class="w-8 h-8 text-red-600" />
              </div>
            </div>
          </div>

          <div class="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-4xl font-bold text-gray-900">15%</p>
                <p class="text-sm text-gray-600 mt-2">Pending</p>
                <p class="text-xs text-gray-500 mt-1">In progress</p>
              </div>
              <div class="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center">
                <Icon name="tabler:clock" class="w-8 h-8 text-amber-600" />
              </div>
            </div>
          </div>
        </div>

        <!-- Charts Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Attendance -->
          <BarChart
            title="Attendance"
            subtitle="Last 30 days"
            :series="[
              { name: 'Present', data: [24, 28, 25, 30, 28, 26, 29] },
              { name: 'Absent', data: [2, 3, 2, 1, 2, 3, 1] }
            ]"
            :categories="['1', '5', '10', '15', '20', '25', '30']"
            :show-legend="true"
            :legend-items="['Present', 'Absent']"
            height="320"
          />

          <!-- Task Distribution -->
          <PieChart
            title="Task Distribution"
            :series="[65, 20, 15]"
            :labels="['Completed', 'Delayed', 'Pending']"
            chart-type="donut"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import BarChart from '~/components/charts/BarChart.vue'
import LineChart from '~/components/charts/LineChart.vue'
import AreaChart from '~/components/charts/AreaChart.vue'
import PieChart from '~/components/charts/PieChart.vue'
import RadialChart from '~/components/charts/RadialChart.vue'
</script>
