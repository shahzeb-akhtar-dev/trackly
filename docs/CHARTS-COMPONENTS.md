# Chart Components Documentation

This document provides comprehensive guidance on using the reusable chart components in Trackly.

## Overview

All chart components are built on **vue3-apexcharts** (official Vue 3 wrapper for ApexCharts) and follow the ai-prompt architecture standards:
- Tailwind CSS for styling only
- Reusable components for consistency
- Composable for chart defaults
- Type-safe props

## Setup

### Installation
```bash
pnpm add apexcharts vue3-apexcharts
```

### Plugin Registration
The plugin is auto-registered in `app/plugins/apexcharts.ts` via Nuxt auto-import.

## Available Components

### 1. BarChart Component

**Location:** `app/components/charts/BarChart.vue`

**Use Case:** Display comparative data across categories (attendance, tasks, etc.)

**Props:**
```typescript
interface Props {
  title?: string                    // Chart title
  subtitle?: string                 // Chart subtitle
  series: any[]                     // Chart data series
  categories?: string[]             // X-axis categories
  height?: number | string          // Chart height (default: 350)
  showHeader?: boolean              // Show title section (default: true)
  showLegend?: boolean              // Show legend (default: false)
  legendItems?: string[]            // Legend labels
  legendColors?: string[]           // Legend colors
  colorScheme?: 'default' | 'success' | 'warning' | 'danger'
  options?: any                     // Override chart options
}
```

**Example Usage:**
```vue
<template>
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
    :legend-colors="['#3b82f6', '#d1d5db']"
  />
</template>

<script setup lang="ts">
import BarChart from '~/components/charts/BarChart.vue'
</script>
```

---

### 2. LineChart Component

**Location:** `app/components/charts/LineChart.vue`

**Use Case:** Display trends over time (hours tracked, performance, etc.)

**Props:**
```typescript
interface Props {
  title?: string
  subtitle?: string
  series: any[]
  categories?: string[]
  height?: number | string          // default: 350
  showHeader?: boolean              // default: true
  showLegend?: boolean              // default: false
  legendItems?: string[]
  legendColors?: string[]
  curveType?: 'smooth' | 'straight' // default: smooth
  options?: any
}
```

**Example Usage:**
```vue
<LineChart
  title="Hours Tracked"
  subtitle="Last 7 days"
  :series="[
    { name: 'Hours', data: [8, 7.5, 8.5, 7, 8, 8.5, 8] }
  ]"
  :categories="['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']"
  :show-legend="true"
  :legend-items="['Hours Tracked']"
  curve-type="smooth"
/>
```

---

### 3. AreaChart Component

**Location:** `app/components/charts/AreaChart.vue`

**Use Case:** Display trends with filled areas (revenue, productivity, etc.)

**Props:**
```typescript
interface Props {
  title?: string
  subtitle?: string
  series: any[]
  categories?: string[]
  height?: number | string          // default: 350
  showHeader?: boolean              // default: true
  showLegend?: boolean              // default: false
  legendItems?: string[]
  legendColors?: string[]
  fillType?: 'gradient' | 'solid'   // default: gradient
  options?: any
}
```

**Example Usage:**
```vue
<AreaChart
  title="Time Tracking"
  :series="[
    { name: 'Productive', data: [6, 6.5, 7, 6.5, 7.5, 8, 7.5] },
    { name: 'Break', data: [2, 1.5, 1, 1.5, 0.5, 0, 0.5] }
  ]"
  :categories="['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']"
  fill-type="gradient"
  :show-legend="true"
  :legend-items="['Productive', 'Break']"
/>
```

---

### 4. PieChart Component

**Location:** `app/components/charts/PieChart.vue`

**Use Case:** Display distribution data (task completion, expense breakdown, etc.)

**Props:**
```typescript
interface Props {
  title?: string
  subtitle?: string
  series: number[]                  // Data values [30, 25, 20, 15]
  labels?: string[]                 // Category labels
  height?: number | string          // default: 350
  showHeader?: boolean              // default: true
  chartType?: 'pie' | 'donut'       // default: pie
  options?: any
}
```

**Example Usage:**
```vue
<PieChart
  title="Task Completion"
  :series="[65, 20, 15]"
  :labels="['Completed', 'Delayed', 'Pending']"
  chart-type="donut"
/>
```

---

### 5. RadialChart Component

**Location:** `app/components/charts/RadialChart.vue`

**Use Case:** Display progress/percentage metrics (task completion %, completion status, etc.)

**Props:**
```typescript
interface Props {
  title?: string
  subtitle?: string
  series: number[]                  // Progress values [65, 20, 15]
  labels?: string[]                 // Labels for each radial
  height?: number | string          // default: 350
  showHeader?: boolean              // default: true
  endAngle?: number                 // default: 360 (full circle)
  options?: any
}
```

**Example Usage:**
```vue
<RadialChart
  title="Task Status"
  :series="[65, 20, 15]"
  :labels="['Completed', 'Delayed', 'Pending']"
/>
```

---

## useChartDefaults Composable

**Location:** `app/composables/charts/useChartDefaults.ts`

Provides consistent, reusable chart configurations across all components.

**Available Functions:**

```typescript
const {
  colors,                           // Color palette
  gridConfig,                       // Common grid configuration
  tooltipConfig,                    // Common tooltip configuration
  xaxisLabelsConfig,                // Common X-axis labels styling
  yaxisLabelsConfig,                // Common Y-axis labels styling
  getBarChartDefaults,              // Get bar chart options
  getLineChartDefaults,             // Get line chart options
  getPieChartDefaults,              // Get pie chart options
  getAreaChartDefaults,             // Get area chart options
  getRadialBarChartDefaults,        // Get radial bar chart options
} = useChartDefaults()
```

**Color Palette:**
```typescript
colors = {
  primary: '#3b82f6',      // Blue
  success: '#10b981',      // Green
  warning: '#f59e0b',      // Amber
  danger: '#ef4444',       // Red
  info: '#06b6d4',         // Cyan
  gray: '#6b7280',         // Gray
  lightGray: '#d1d5db',    // Light Gray
  white: '#ffffff',        // White
}
```

---

## Styling & Theming

All components use **Tailwind CSS exclusively**:
- White background with gray border
- 2px rounded corners (rounded-2xl)
- Subtle shadow-sm
- Responsive design (mobile-optimized)
- Consistent padding (p-6)

### Custom Styling via `options` Prop

Override any chart setting using the `options` prop:

```vue
<BarChart
  :series="data"
  :options="{
    plotOptions: {
      bar: { columnWidth: '50%' }
    },
    colors: ['#ff5733', '#33ff57']
  }"
/>
```

---

## Data Format Guidelines

### Series Format

All chart components expect data in ApexCharts series format:

```typescript
// For bar, line, area charts
const series = [
  {
    name: 'Series 1',
    data: [10, 20, 30, 40, 50]
  },
  {
    name: 'Series 2',
    data: [15, 25, 35, 45, 55]
  }
]

// For pie/donut charts
const series = [30, 25, 20, 15]  // Just numbers

// For radial charts
const series = [65, 20, 15]       // Percentages
```

### Categories Format

X-axis categories (for bar, line, area):

```typescript
const categories = ['Jan', 'Feb', 'Mar', 'Apr', 'May']
```

---

## Reactivity & Updates

Charts automatically update when `series` or `options` change:

```vue
<script setup>
import { ref } from 'vue'
import BarChart from '~/components/charts/BarChart.vue'

const chartData = ref([
  { name: 'Data', data: [10, 20, 30] }
])

// Chart updates automatically
const updateChart = () => {
  chartData.value = [
    { name: 'Data', data: [15, 25, 35] }
  ]
}
</script>

<template>
  <BarChart :series="chartData" />
  <button @click="updateChart">Update</button>
</template>
```

---

## Common Patterns

### Dashboard Statistics Cards

Combine with **RadialChart** for percentage display:

```vue
<div class="grid grid-cols-3 gap-6">
  <div class="bg-white border rounded-2xl p-6">
    <p class="text-4xl font-bold">65%</p>
    <p class="text-sm text-gray-600 mt-2">Completed</p>
  </div>
  <!-- Similar cards -->
</div>
```

### Time Series Visualization

Use **LineChart** for tracking metrics over time:

```vue
<LineChart
  title="Daily Hours"
  :series="hoursData"
  :categories="dates"
  :show-legend="true"
  curve-type="smooth"
/>
```

### Comparison Charts

Use **BarChart** for side-by-side comparisons:

```vue
<BarChart
  title="Monthly Comparison"
  :series="comparisonData"
  :categories="months"
  :show-legend="true"
/>
```

---

## Performance Optimization

- Charts render on-demand (wait for data before showing)
- Use `v-if` to conditionally render based on data availability
- Limit legend items to 5-6 for clarity
- Use appropriate `height` based on available space

---

## TypeScript Support

All components have full TypeScript support:

```typescript
import BarChart from '~/components/charts/BarChart.vue'
import type { Series, ChartOptions } from 'apexcharts'
```

---

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Chart not rendering | Ensure `series` data is in correct format |
| Updates not working | Use spread operator for nested objects: `{...options, xaxis: {...}}` |
| Overlapping text | Adjust `height` prop or use `fontSize` in options |
| Legend not showing | Set `show-legend="true"` and provide `legend-items` |
| Colors not applying | Use `color-scheme` prop or override via `options` |

---

## Next Steps

- Add more chart types (scatter, bubble, candlestick) as needed
- Create dashboard with multiple charts
- Integrate with API data fetching composables
- Add chart interaction handlers (click events, drill-down, etc.)
