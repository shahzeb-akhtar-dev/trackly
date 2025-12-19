# Chart Components - Real-World Examples

This document provides real-world examples and copy-paste templates for common dashboard scenarios.

## 1. HR Dashboard Example

### Monthly Attendance Overview
```vue
<template>
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <!-- Attendance by Day -->
    <BarChart
      title="Daily Attendance"
      subtitle="Current month"
      :series="[
        { name: 'Present', data: [145, 148, 142, 150, 148, 143] },
        { name: 'Absent', data: [5, 2, 8, 0, 2, 7] },
        { name: 'Late', data: [3, 4, 2, 4, 3, 5] }
      ]"
      :categories="['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Partial']"
      :show-legend="true"
      :legend-items="['Present', 'Absent', 'Late']"
    />

    <!-- Attendance Trend -->
    <LineChart
      title="Attendance Rate"
      subtitle="Last 3 months trend"
      :series="[
        { name: 'Attendance %', data: [95, 94, 96, 97, 95, 98] }
      ]"
      :categories="['Nov 1', 'Nov 8', 'Nov 15', 'Nov 22', 'Dec 1', 'Dec 8']"
      :show-legend="true"
      :legend-items="['Attendance %']"
    />
  </div>
</template>

<script setup lang="ts">
import BarChart from '~/components/charts/BarChart.vue'
import LineChart from '~/components/charts/LineChart.vue'
</script>
```

---

## 2. Time Tracking Dashboard

### Hours Logged Analysis
```vue
<template>
  <div class="space-y-6">
    <!-- Hours Distribution -->
    <AreaChart
      title="Daily Hours Logged"
      subtitle="Last 7 days"
      :series="[
        { name: 'Productive', data: [6, 7, 6.5, 7.5, 8, 7, 7.5] },
        { name: 'Break', data: [1, 1, 1.5, 0.5, 0, 1.5, 0.5] },
        { name: 'Administrative', data: [1, 0, 0.5, 0.5, 0, 0.5, 1] }
      ]"
      :categories="['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']"
      fill-type="gradient"
      :show-legend="true"
      :legend-items="['Productive', 'Break', 'Administrative']"
    />

    <!-- Category Breakdown -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <PieChart
        title="Hours by Category"
        :series="[45, 25, 20, 10]"
        :labels="['Development', 'Testing', 'Planning', 'Documentation']"
        chart-type="donut"
      />

      <PieChart
        title="Project Allocation"
        :series="[35, 30, 25, 10]"
        :labels="['Project A', 'Project B', 'Project C', 'Maintenance']"
        chart-type="pie"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import AreaChart from '~/components/charts/AreaChart.vue'
import PieChart from '~/components/charts/PieChart.vue'
</script>
```

---

## 3. Task Management Dashboard

### Task Completion Status
```vue
<template>
  <div class="space-y-6">
    <!-- Stats Cards -->
    <div class="grid grid-cols-3 gap-6">
      <div class="bg-white border border-gray-200 rounded-xl p-6">
        <p class="text-3xl font-bold text-emerald-600">65%</p>
        <p class="text-sm text-gray-600 mt-2">Completed</p>
        <p class="text-xs text-gray-500">{{ completedCount }} tasks done</p>
      </div>

      <div class="bg-white border border-gray-200 rounded-xl p-6">
        <p class="text-3xl font-bold text-red-600">20%</p>
        <p class="text-sm text-gray-600 mt-2">Delayed</p>
        <p class="text-xs text-gray-500">{{ delayedCount }} tasks overdue</p>
      </div>

      <div class="bg-white border border-gray-200 rounded-xl p-6">
        <p class="text-3xl font-bold text-amber-600">15%</p>
        <p class="text-sm text-gray-600 mt-2">Pending</p>
        <p class="text-xs text-gray-500">{{ pendingCount }} in progress</p>
      </div>
    </div>

    <!-- Radial Chart -->
    <RadialChart
      title="Task Completion Metrics"
      :series="[65, 20, 15]"
      :labels="['Completed', 'Delayed', 'Pending']"
    />

    <!-- Trend -->
    <LineChart
      title="Task Completion Trend"
      subtitle="Last 4 weeks"
      :series="[
        { name: 'Completed', data: [45, 52, 58, 65] },
        { name: 'Target', data: [50, 55, 60, 65] }
      ]"
      :categories="['Week 1', 'Week 2', 'Week 3', 'Week 4']"
      :show-legend="true"
      :legend-items="['Completed', 'Target']"
      curve-type="smooth"
    />
  </div>
</template>

<script setup lang="ts">
import RadialChart from '~/components/charts/RadialChart.vue'
import LineChart from '~/components/charts/LineChart.vue'

const completedCount = 130
const delayedCount = 40
const pendingCount = 30
</script>
```

---

## 4. Payroll Dashboard

### Salary & Payment Analytics
```vue
<template>
  <div class="space-y-6">
    <!-- Monthly Comparison -->
    <BarChart
      title="Monthly Payroll"
      subtitle="Salary vs Bonuses vs Deductions"
      :series="[
        { name: 'Salary', data: [450000, 450000, 450000, 450000, 450000, 450000] },
        { name: 'Bonus', data: [50000, 30000, 75000, 0, 0, 100000] },
        { name: 'Deductions', data: [15000, 12000, 18000, 10000, 14000, 16000] }
      ]"
      :categories="['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']"
      :show-legend="true"
      :legend-items="['Salary', 'Bonus', 'Deductions']"
    />

    <!-- Expense Breakdown -->
    <PieChart
      title="Department-wise Payroll"
      :series="[35, 25, 20, 15, 5]"
      :labels="['IT', 'HR', 'Sales', 'Operations', 'Management']"
      chart-type="donut"
    />

    <!-- Payment History -->
    <AreaChart
      title="Cumulative Payroll"
      subtitle="Year-to-date"
      :series="[
        { name: 'Total Paid', data: [450000, 930000, 1455000, 1915000, 2379000, 2945000] }
      ]"
      :categories="['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']"
      fill-type="gradient"
    />
  </div>
</template>

<script setup lang="ts">
import BarChart from '~/components/charts/BarChart.vue'
import PieChart from '~/components/charts/PieChart.vue'
import AreaChart from '~/components/charts/AreaChart.vue'
</script>
```

---

## 5. Report Builder Example

### Dynamic Report Template
```vue
<template>
  <div class="space-y-8">
    <!-- Header Section -->
    <div class="bg-white border border-gray-200 rounded-xl p-8">
      <h1 class="text-3xl font-bold text-gray-900">{{ report.title }}</h1>
      <p class="text-gray-600 mt-2">{{ report.description }}</p>
      <div class="flex gap-4 mt-4">
        <button class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Export as PDF
        </button>
        <button class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
          Download CSV
        </button>
      </div>
    </div>

    <!-- Charts Section -->
    <div class="space-y-6">
      <div v-for="chart in report.charts" :key="chart.id" class="bg-white border border-gray-200 rounded-xl p-6">
        <!-- Dynamic Chart Rendering -->
        <component
          :is="getChartComponent(chart.type)"
          :title="chart.title"
          :subtitle="chart.subtitle"
          :series="chart.series"
          :categories="chart.categories"
          :labels="chart.labels"
          v-bind="chart.props"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import BarChart from '~/components/charts/BarChart.vue'
import LineChart from '~/components/charts/LineChart.vue'
import PieChart from '~/components/charts/PieChart.vue'
import AreaChart from '~/components/charts/AreaChart.vue'
import RadialChart from '~/components/charts/RadialChart.vue'

const report = ref({
  title: 'Monthly Performance Report',
  description: 'Comprehensive analysis of KPIs for December 2024',
  charts: [
    {
      id: 1,
      type: 'bar',
      title: 'Sales Performance',
      subtitle: 'Weekly comparison',
      series: [{ name: 'Sales', data: [100, 120, 115, 130] }],
      categories: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    },
    {
      id: 2,
      type: 'line',
      title: 'Trend Analysis',
      subtitle: 'Daily metrics',
      series: [{ name: 'Metric', data: [30, 40, 35, 50, 49, 60] }],
      categories: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6'],
    },
  ]
})

const getChartComponent = (type: string) => {
  const components: Record<string, any> = {
    bar: BarChart,
    line: LineChart,
    pie: PieChart,
    area: AreaChart,
    radial: RadialChart,
  }
  return components[type] || BarChart
}
</script>
```

---

## 6. Performance Dashboard

### Employee Performance Metrics
```vue
<template>
  <div class="space-y-6">
    <!-- KPI Cards -->
    <div class="grid grid-cols-4 gap-4">
      <div class="bg-white border border-gray-200 rounded-xl p-6">
        <p class="text-sm text-gray-600">Productivity</p>
        <p class="text-2xl font-bold mt-2">92%</p>
      </div>
      <div class="bg-white border border-gray-200 rounded-xl p-6">
        <p class="text-sm text-gray-600">Quality Score</p>
        <p class="text-2xl font-bold mt-2">4.8/5</p>
      </div>
      <div class="bg-white border border-gray-200 rounded-xl p-6">
        <p class="text-sm text-gray-600">On-Time Delivery</p>
        <p class="text-2xl font-bold mt-2">97%</p>
      </div>
      <div class="bg-white border border-gray-200 rounded-xl p-6">
        <p class="text-sm text-gray-600">Satisfaction</p>
        <p class="text-2xl font-bold mt-2">4.6/5</p>
      </div>
    </div>

    <!-- Performance Trends -->
    <LineChart
      title="Performance Over Time"
      subtitle="Last 12 months"
      :series="[
        { name: 'Productivity', data: [75, 78, 80, 82, 85, 87, 88, 89, 90, 91, 91, 92] },
        { name: 'Quality', data: [4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 4.7, 4.8, 4.8, 4.8, 4.8, 4.8] }
      ]"
      :categories="['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']"
      :show-legend="true"
      :legend-items="['Productivity', 'Quality Score']"
    />

    <!-- Team Comparison -->
    <BarChart
      title="Team Performance"
      subtitle="Comparing all departments"
      :series="[
        { name: 'Target', data: [80, 80, 80, 80, 80] },
        { name: 'Actual', data: [92, 88, 85, 91, 87] }
      ]"
      :categories="['IT', 'HR', 'Sales', 'Ops', 'Finance']"
      :show-legend="true"
      :legend-items="['Target', 'Actual']"
      color-scheme="success"
    />
  </div>
</template>

<script setup lang="ts">
import LineChart from '~/components/charts/LineChart.vue'
import BarChart from '~/components/charts/BarChart.vue'
</script>
```

---

## 7. Inventory Dashboard

### Stock Levels & Movement
```vue
<template>
  <div class="space-y-6">
    <!-- Stock Level -->
    <AreaChart
      title="Stock Levels"
      subtitle="Last 30 days"
      :series="[
        { name: 'In Stock', data: [500, 520, 515, 530, 510, 525, 540, 535, 550, 545, 560, 555] }
      ]"
      :categories="['Day 1', 'Day 5', 'Day 10', 'Day 15', 'Day 20', 'Day 25', 'Day 30']"
      fill-type="gradient"
    />

    <!-- Stock by Category -->
    <PieChart
      title="Stock Distribution"
      :series="[35, 25, 20, 15, 5]"
      :labels="['Electronics', 'Clothing', 'Food', 'Books', 'Other']"
      chart-type="donut"
    />

    <!-- Movement Trend -->
    <LineChart
      title="Stock Movement"
      subtitle="Inbound vs Outbound"
      :series="[
        { name: 'Inbound', data: [50, 60, 55, 65, 70, 75, 80] },
        { name: 'Outbound', data: [45, 50, 48, 55, 65, 70, 75] }
      ]"
      :categories="['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7']"
      :show-legend="true"
      :legend-items="['Inbound', 'Outbound']"
    />
  </div>
</template>

<script setup lang="ts">
import AreaChart from '~/components/charts/AreaChart.vue'
import PieChart from '~/components/charts/PieChart.vue'
import LineChart from '~/components/charts/LineChart.vue'
</script>
```

---

## Key Takeaways

✅ **Composability:** Mix and match chart types based on data  
✅ **Consistency:** All charts follow same visual language  
✅ **Flexibility:** Props allow customization without duplication  
✅ **Real-Data Ready:** Examples use realistic data structures  
✅ **Production-Ready:** Copy-paste templates for quick implementation  

---

**Note:** Replace hardcoded data with actual API calls using composables (e.g., `useDashboard()`, `useTimeTracking()`, etc.)
