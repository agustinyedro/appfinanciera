<template>
  <div class="bg-base-100 p-6 rounded-lg shadow-sm border border-base-300">
    <h2 class="text-lg font-semibold text-base-content mb-4">Ingresos vs Gastos (Últimos 6 Meses)</h2>
    <div class="h-80">
      <v-chart class="chart" :option="chartOption" autoresize />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { BarChart } from 'echarts/charts';
import { TitleComponent, TooltipComponent, LegendComponent, GridComponent } from 'echarts/components';
import VChart from 'vue-echarts';
import { useDatabaseStore } from '@/stores/database';
import { storeToRefs } from 'pinia';

use([
  CanvasRenderer,
  BarChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
]);

const databaseStore = useDatabaseStore();
const { historicalIncomeExpense } = storeToRefs(databaseStore);

const chartOption = computed(() => ({
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    }
  },
  legend: {
    data: ['Ingresos', 'Gastos'],
    textStyle: {
      color: 'rgb(var(--color-base-content))'
    }
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: [
    {
      type: 'category',
      data: historicalIncomeExpense.value.labels,
      axisLine: {
        lineStyle: {
          color: 'rgb(var(--color-base-content))'
        }
      }
    }
  ],
  yAxis: [
    {
      type: 'value',
      axisLine: {
        lineStyle: {
          color: 'rgb(var(--color-base-content))'
        }
      },
      splitLine: {
        lineStyle: {
          color: 'rgba(var(--color-base-content), 0.2)'
        }
      }
    }
  ],
  series: [
    {
      name: 'Ingresos',
      type: 'bar',
      barWidth: '20%',
      data: historicalIncomeExpense.value.income,
      itemStyle: {
        color: 'rgb(var(--color-success))'
      }
    },
    {
      name: 'Gastos',
      type: 'bar',
      barWidth: '20%',
      data: historicalIncomeExpense.value.expenses,
      itemStyle: {
        color: 'rgb(var(--color-error))'
      }
    }
  ]
}));
</script>
