<template>
  <div class="w-full h-80">
    <div v-if="hasData">
      <v-chart class="chart" :option="chartOption" autoresize />
    </div>
    <div v-else class="h-full flex items-center justify-center text-base-content/60">
      No hay datos de ahorro para mostrar.
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { LineChart } from 'echarts/charts';
import { TitleComponent, TooltipComponent, LegendComponent, GridComponent } from 'echarts/components';
import VChart from 'vue-echarts';
import { useDatabaseStore } from '@/stores/database';
import { useTheme } from '@/composables/useTheme';

const props = defineProps<{
  rangeInMonths: number
}>();

use([
  CanvasRenderer,
  LineChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
]);

const databaseStore = useDatabaseStore();
const { currentTheme } = useTheme();

const chartData = computed(() => {
  return databaseStore.getSavingsHistory(props.rangeInMonths);
});

const hasData = computed(() => chartData.value.data.length > 0 && chartData.value.data.some(d => d > 0));

const chartOption = computed(() => {
  // eslint-disable-next-line
  const theme = currentTheme.value; // Ensures reactivity to theme changes

  return {
    tooltip: {
      trigger: 'axis'
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: chartData.value.labels,
      axisLine: {
        lineStyle: {
          color: 'rgb(var(--color-base-content))'
        }
      }
    },
    yAxis: {
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
    },
    series: [
      {
        name: 'Ahorro Total',
        type: 'line',
        smooth: true,
        data: chartData.value.data,
        itemStyle: {
          color: 'rgb(var(--color-primary))'
        },
        areaStyle: {
          color: 'rgba(var(--color-primary), 0.1)'
        }
      }
    ]
  }
});
</script>
