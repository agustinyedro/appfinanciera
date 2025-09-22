<template>
  <div class="h-80">
    <v-chart class="chart" :option="chartOption" autoresize />
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
import { useTheme } from '@/composables/useTheme';

const props = defineProps<{
  rangeInMonths: number
}>()

use([
  CanvasRenderer,
  BarChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
]);

const databaseStore = useDatabaseStore();
const { currentTheme } = useTheme();

const historicalData = computed(() => {
  return databaseStore.getHistoricalIncomeExpense(props.rangeInMonths);
});

const chartOption = computed(() => {
  // This makes the computed property reactive to theme changes
  const theme = currentTheme.value;

  return {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    legend: {
      data: ['Ingresos', 'Gastos'],
      textStyle: {
        color: 'rgb(var(--color-base-content))',
        fontSize: 14
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
        data: historicalData.value.labels,
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
        data: historicalData.value.income,
        itemStyle: {
          color: 'rgb(var(--color-success))'
        }
      },
      {
        name: 'Gastos',
        type: 'bar',
        barWidth: '20%',
        data: historicalData.value.expenses,
        itemStyle: {
          color: 'rgb(var(--color-error))'
        }
      }
    ]
  }
});
</script>
