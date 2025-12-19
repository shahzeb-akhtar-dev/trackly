# ApexCharts Integration Guide

## ✅ Installation

The following packages are already installed:
- `apexcharts` - Core charting library
- `vue3-apexcharts` - Vue 3 wrapper component

## ✅ Plugin Setup

The plugin is located at `app/plugins/apexcharts.client.ts` and is automatically loaded by Nuxt.

**Important:** The `.client.ts` suffix ensures the plugin only runs on the client-side, which is required since ApexCharts needs browser APIs.

## ✅ Usage

### Basic Usage with `<apexchart>` Component

The `vue3-apexcharts` component is registered globally, so you can use `<apexchart>` directly in any component:

```vue
<template>
  <div class="w-full">
    <apexchart
      type="bar"
      :series="series"
      :options="options"
      height="350"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const series = ref([{
  name: 'Sales',
  data: [30, 40, 35, 50, 49, 60, 70, 91, 125]
}])

const options = ref({
  chart: {
    toolbar: { show: false }
  },
  xaxis: {
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep']
  }
})
</script>
```

### Using Pre-built Chart Components

We have pre-built chart components in `app/components/charts/`:

- **`BarChart.vue`** - Bar charts
- **`LineChart.vue`** - Line charts
- **`AreaChart.vue`** - Area charts
- **`PieChart.vue`** - Pie/Donut charts
- **`RadialChart.vue`** - Radial bar charts
- **`ApexChart.vue`** - Generic wrapper component

**Example:**

```vue
<template>
  <BarChart
    title="Monthly Sales"
    subtitle="Last 6 months"
    :series="chartSeries"
    :categories="categories"
    height="350"
    color-scheme="success"
  />
</template>

<script setup lang="ts">
const chartSeries = [{
  name: 'Sales',
  data: [30, 40, 35, 50, 49, 60]
}]

const categories = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
</script>
```

### Using Chart Defaults Composable

The `useChartDefaults` composable provides consistent styling:

```vue
<script setup lang="ts">
import { useChartDefaults } from '~/composables/charts/useChartDefaults'

const chartDefaults = useChartDefaults()

const options = {
  ...chartDefaults.getBarChartDefaults(),
  xaxis: {
    categories: ['A', 'B', 'C']
  }
}
</script>
```

## ✅ Chart Types

Supported chart types:
- `line` - Line chart
- `area` - Area chart
- `bar` - Bar chart
- `histogram` - Histogram
- `pie` - Pie chart
- `donut` - Donut chart
- `radialBar` - Radial bar chart
- `scatter` - Scatter plot
- `bubble` - Bubble chart
- `heatmap` - Heatmap
- `treemap` - Treemap
- `boxPlot` - Box plot
- `candlestick` - Candlestick
- `radar` - Radar chart
- `polarArea` - Polar area chart
- `rangeBar` - Range bar chart

## ✅ TypeScript Support

ApexCharts types are automatically available. Import types when needed:

```typescript
import type { ApexOptions } from 'apexcharts'

const options: ApexOptions = {
  chart: { type: 'bar' },
  // ... other options
}
```

## ✅ Common Patterns

### Responsive Charts

```vue
<apexchart
  type="line"
  :series="series"
  :options="{
    ...options,
    responsive: [{
      breakpoint: 768,
      options: {
        chart: { height: 300 }
      }
    }]
  }"
/>
```

### Dynamic Data Updates

```vue
<script setup lang="ts">
const series = ref([{
  name: 'Data',
  data: [10, 20, 30]
}])

const updateData = () => {
  series.value = [{
    name: 'Data',
    data: [40, 50, 60]
  }]
}
</script>
```

### Client-Only Rendering

For SSR compatibility, wrap charts in `<ClientOnly>`:

```vue
<template>
  <ClientOnly>
    <apexchart
      type="bar"
      :series="series"
      :options="options"
    />
  </ClientOnly>
</template>
```

## ✅ Troubleshooting

**Issue:** Chart not rendering
- Ensure the plugin file is named `apexcharts.client.ts` (client-only)
- Check browser console for errors
- Verify data format matches ApexCharts requirements

**Issue:** TypeScript errors
- Ensure `apexcharts` types are installed
- Import types: `import type { ApexOptions } from 'apexcharts'`

**Issue:** SSR errors
- Always use `.client.ts` for the plugin
- Wrap charts in `<ClientOnly>` if needed

## ✅ Resources

- [ApexCharts Documentation](https://apexcharts.com/docs/)
- [Vue 3 ApexCharts](https://github.com/apexcharts/vue3-apexcharts)
- [ApexCharts Examples](https://apexcharts.com/javascript-chart-demos/)

