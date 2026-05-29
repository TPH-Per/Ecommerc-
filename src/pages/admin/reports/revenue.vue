<script setup lang="ts">
import { ref } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart, BarChart } from 'echarts/charts'
import { GridComponent, TooltipComponent, LegendComponent, TitleComponent } from 'echarts/components'
import VChart from 'vue-echarts'
import { useI18n } from '@/composables/useI18n'

use([CanvasRenderer, LineChart, BarChart, GridComponent, TooltipComponent, LegendComponent, TitleComponent])

const { t } = useI18n()
const dateRange = ref('7days')

const lineChartOption = ref({
  tooltip: { trigger: 'axis' },
  legend: { data: ['Revenue', 'Cost of Goods'], bottom: 0 },
  grid: { left: '3%', right: '4%', bottom: '15%', containLabel: true },
  xAxis: { type: 'category', boundaryGap: false, data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
  yAxis: { type: 'value' },
  series: [
    { name: 'Revenue', type: 'line', smooth: true, data: [1200, 1320, 1010, 1340, 900, 2300, 2100], itemStyle: { color: '#2563EB' } },
    { name: 'Cost of Goods', type: 'line', smooth: true, data: [800, 900, 700, 950, 600, 1500, 1400], itemStyle: { color: '#EF4444' } }
  ]
})

const barChartOption = ref({
  tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
  grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
  xAxis: { type: 'value' },
  yAxis: { type: 'category', data: ['Outerwear', 'Footwear', 'Accessories', 'Tops', 'Bottoms'] },
  series: [
    { name: 'Revenue', type: 'bar', data: [4500, 3200, 1800, 1500, 1200], itemStyle: { color: '#2563EB' } }
  ]
})
</script>

<template>
  <div class="flex flex-col gap-8">
    <div class="flex items-center justify-between">
      <h1 class="text-3xl font-display uppercase tracking-wide">{{ t('admin.revenueReport') }}</h1>
      <select v-model="dateRange" class="bg-[var(--color-bg-surface)] border border-[var(--color-border)] rounded-[var(--radius-sm)] px-4 py-2 text-sm outline-none">
        <option value="7days">{{ t('admin.last7Days') }}</option>
        <option value="30days">{{ t('admin.last30Days') }}</option>
        <option value="thisYear">{{ t('admin.thisYear') }}</option>
      </select>
    </div>

    <!-- KPI Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="bg-[var(--color-bg-surface)] p-6 rounded-[var(--radius-md)] border border-[var(--color-border)] shadow-sm">
        <p class="text-sm text-[var(--color-text-secondary)] font-medium mb-1">{{ t('admin.grossProfit') }}</p>
        <p class="text-2xl font-bold font-mono">$3,450.00</p>
      </div>
      <div class="bg-[var(--color-bg-surface)] p-6 rounded-[var(--radius-md)] border border-[var(--color-border)] shadow-sm">
        <p class="text-sm text-[var(--color-text-secondary)] font-medium mb-1">{{ t('admin.profitMargin') }}</p>
        <p class="text-2xl font-bold font-mono text-[var(--color-success)]">34.2%</p>
      </div>
      <div class="bg-[var(--color-bg-surface)] p-6 rounded-[var(--radius-md)] border border-[var(--color-border)] shadow-sm">
        <p class="text-sm text-[var(--color-text-secondary)] font-medium mb-1">{{ t('admin.totalOrders') }}</p>
        <p class="text-2xl font-bold font-mono">156</p>
      </div>
      <div class="bg-[var(--color-bg-surface)] p-6 rounded-[var(--radius-md)] border border-[var(--color-border)] shadow-sm">
        <p class="text-sm text-[var(--color-text-secondary)] font-medium mb-1">{{ t('admin.avgOrderValue') }}</p>
        <p class="text-2xl font-bold font-mono">$65.20</p>
      </div>
    </div>

    <!-- Charts -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div class="bg-[var(--color-bg-surface)] p-6 rounded-[var(--radius-md)] border border-[var(--color-border)] shadow-sm h-96 flex flex-col">
        <h3 class="font-bold text-lg mb-4">{{ t('admin.revenueVsCost') }}</h3>
        <div class="flex-1 min-h-0">
          <v-chart class="w-full h-full" :option="lineChartOption" autoresize />
        </div>
      </div>
      
      <div class="bg-[var(--color-bg-surface)] p-6 rounded-[var(--radius-md)] border border-[var(--color-border)] shadow-sm h-96 flex flex-col">
        <h3 class="font-bold text-lg mb-4">{{ t('admin.revenueByCategory') }}</h3>
        <div class="flex-1 min-h-0">
          <v-chart class="w-full h-full" :option="barChartOption" autoresize />
        </div>
      </div>
    </div>
  </div>
</template>

<route lang="yaml">
meta:
  layout: admin
  role: admin
</route>
