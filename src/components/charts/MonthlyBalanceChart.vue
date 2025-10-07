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
  year: number,
  month: number
}>();

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

const chartData = computed(() => {
  return databaseStore.getMonthlyBalance(props.year, props.month);
});

const chartOption = computed(() => {
  const balance = chartData.value.income - chartData.value.expense;

  return {
    title: {
      text: `Balance: $${balance.toFixed(2)}`,
      left: 'center',
      top: 0,
      textStyle: {
        color: balance >= 0 ? successColor.value : errorColor.value,
        fontSize: 16,
        fontWeight: 'bold'
      }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    legend: {
      data: ['Ingresos', 'Gastos'],
      textStyle: {
        color: textColor.value
      },
      top: 30
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '25%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: ['Resumen Mensual'],
      axisLine: {
        lineStyle: {
          color: textColor.value
        }
      }
    },
    yAxis: {
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
    },
    series: [
      {
        name: 'Ingresos',
        type: 'bar',
        barWidth: '30%',
        label: {
          show: true,
          position: 'top',
          formatter: '${c}'
        },
        itemStyle: {
          color: successColor.value
        },
        data: [chartData.value.income]
      },
      {
        name: 'Gastos',
        type: 'bar',
        barWidth: '30%',
        label: {
          show: true,
          position: 'top',
          formatter: '${c}'
        },
        itemStyle: {
          color: errorColor.value
        },
        data: [chartData.value.expense]
      }
    ]
  }
});
</script>
