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
import { useChartTheme } from '@/composables/useChartTheme';

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
const { textColor, successColor, errorColor } = useChartTheme();

const historicalData = computed(() => {
  const monthNames = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
  const labels: string[] = [];
  const income: number[] = [];
  const expenses: number[] = [];
  const getMonthlyBalance = databaseStore.getMonthlyBalance;

  for (let i = props.rangeInMonths - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(1);
    d.setMonth(d.getMonth() - i);
    const year = d.getFullYear();
    const month = d.getMonth();

    labels.push(`${monthNames[month]} '${year.toString().slice(-2)}`);

    const { income: monthlyIncome, expense: monthlyExpenses } = getMonthlyBalance(year, month);

    income.push(parseFloat(monthlyIncome.toFixed(2)));
    expenses.push(parseFloat(monthlyExpenses.toFixed(2)));
  }

  return { labels, income, expenses };
});

const chartOption = computed(() => {
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
        color: textColor.value,
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
            color: textColor.value
          }
        }
      }
    ],
    yAxis: [
      {
        type: 'value',
        axisLine: {
          lineStyle: {
            color: textColor.value
          }
        },
        splitLine: {
          lineStyle: {
            color: 'rgba(128, 128, 128, 0.2)'
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
          color: successColor.value
        }
      },
      {
        name: 'Gastos',
        type: 'bar',
        barWidth: '20%',
        data: historicalData.value.expenses,
        itemStyle: {
          color: errorColor.value
        }
      }
    ]
  }
});
</script>
