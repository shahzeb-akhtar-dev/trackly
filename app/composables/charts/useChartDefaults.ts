/**
 * Composable: useChartDefaults
 * Provides shared chart configuration and styling defaults
 */

export const useChartDefaults = () => {
  // ============ Color Palette ============
  const colors = {
    primary: '#3b82f6',
    success: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444',
    info: '#06b6d4',
    gray: '#6b7280',
    lightGray: '#d1d5db',
    white: '#ffffff',
  }

  // ============ Common Grid Configuration ============
  const gridConfig = {
    show: true,
    borderColor: '#e5e7eb',
    strokeDashArray: 4,
    xaxis: {
      lines: { show: false },
    },
  }

  // ============ Common Tooltip Configuration ============
  const tooltipConfig = {
    enabled: true,
    theme: 'light',
    style: {
      fontSize: '12px',
    },
  }

  // ============ Common XAxis Labels Configuration ============
  const xaxisLabelsConfig = {
    style: {
      colors: colors.gray,
      fontSize: '12px',
    },
  }

  // ============ Common YAxis Labels Configuration ============
  const yaxisLabelsConfig = {
    style: {
      colors: colors.gray,
      fontSize: '12px',
    },
  }

  // ============ Bar Chart Default Options ============
  const getBarChartDefaults = () => ({
    chart: {
      type: 'bar',
      toolbar: { show: false },
      sparkline: { enabled: false },
    },
    colors: [colors.primary, colors.lightGray],
    plotOptions: {
      bar: {
        columnWidth: '70%',
        borderRadius: 4,
        dataLabels: {
          position: 'top',
        },
      },
    },
    xaxis: {
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: xaxisLabelsConfig,
    },
    yaxis: {
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: yaxisLabelsConfig,
    },
    grid: gridConfig,
    tooltip: tooltipConfig,
    responsive: [
      {
        breakpoint: 768,
        options: {
          plotOptions: {
            bar: {
              columnWidth: '80%',
            },
          },
        },
      },
    ],
  })

  // ============ Line Chart Default Options ============
  const getLineChartDefaults = () => ({
    chart: {
      type: 'line',
      toolbar: { show: false },
      sparkline: { enabled: false },
    },
    colors: [colors.primary, colors.success],
    stroke: {
      curve: 'smooth',
      width: 2,
    },
    markers: {
      size: 4,
      colors: [colors.white],
      strokeColors: [colors.primary],
      strokeWidth: 2,
      hover: {
        size: 6,
      },
    },
    xaxis: {
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: xaxisLabelsConfig,
    },
    yaxis: {
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: yaxisLabelsConfig,
    },
    grid: gridConfig,
    tooltip: tooltipConfig,
    responsive: [
      {
        breakpoint: 768,
        options: {
          stroke: {
            width: 1.5,
          },
          markers: {
            size: 3,
          },
        },
      },
    ],
  })

  // ============ Pie Chart Default Options ============
  const getPieChartDefaults = () => ({
    chart: {
      type: 'pie',
      toolbar: { show: false },
    },
    colors: [colors.primary, colors.success, colors.warning, colors.danger],
    labels: ['Category 1', 'Category 2', 'Category 3', 'Category 4'],
    legend: {
      position: 'bottom',
      labels: {
        colors: colors.gray,
      },
    },
    plotOptions: {
      pie: {
        donut: {
          size: '65%',
          labels: {
            show: true,
            name: {
              fontSize: '12px',
              color: colors.gray,
            },
            value: {
              fontSize: '16px',
              fontWeight: 600,
              color: '#111827',
            },
          },
        },
      },
    },
    tooltip: tooltipConfig,
  })

  // ============ Area Chart Default Options ============
  const getAreaChartDefaults = () => ({
    chart: {
      type: 'area',
      toolbar: { show: false },
      sparkline: { enabled: false },
    },
    colors: [colors.primary, colors.success],
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.45,
        opacityTo: 0.05,
        stops: [0, 100],
      },
    },
    stroke: {
      curve: 'smooth',
      width: 2,
    },
    xaxis: {
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: xaxisLabelsConfig,
    },
    yaxis: {
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: yaxisLabelsConfig,
    },
    grid: gridConfig,
    tooltip: tooltipConfig,
    responsive: [
      {
        breakpoint: 768,
        options: {
          stroke: {
            width: 1.5,
          },
        },
      },
    ],
  })

  // ============ Radial Bar Chart Default Options ============
  const getRadialBarChartDefaults = () => ({
    chart: {
      type: 'radialBar',
      toolbar: { show: false },
    },
    colors: [colors.primary, colors.success, colors.warning],
    plotOptions: {
      radialBar: {
        size: undefined,
        inverseOrder: false,
        hollow: {
          margin: 5,
          size: '48%',
          background: 'transparent',
        },
        track: {
          show: true,
          background: colors.lightGray,
          strokeWidth: '7%',
          margin: 5,
          dropShadow: {
            enabled: false,
          },
        },
        dataLabels: {
          show: true,
          name: {
            offsetY: -10,
            fontSize: '13px',
            color: colors.gray,
          },
          value: {
            formatter(val: any) {
              return `${parseInt(val)}%`
            },
            fontSize: '30px',
            color: '#111827',
            offsetY: 16,
            fontWeight: 600,
          },
        },
      },
    },
    stroke: {
      lineCap: 'round',
    },
    labels: ['Completed', 'Delayed', 'Pending'],
  })

  return {
    colors,
    gridConfig,
    tooltipConfig,
    xaxisLabelsConfig,
    yaxisLabelsConfig,
    getBarChartDefaults,
    getLineChartDefaults,
    getPieChartDefaults,
    getAreaChartDefaults,
    getRadialBarChartDefaults,
  }
}
