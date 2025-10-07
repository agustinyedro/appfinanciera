<template>
  <div class="h-80">
    <div v-if="hasData">
      <v-chart class="chart" :option="chartOption" autoresize />
    </div>
    <div v-else class="h-full flex items-center justify-center text-base-content/60">
      No hay datos suficientes para generar el ranking.
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
  type: 'ingreso' | 'gasto',
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
  return databaseStore.getCategoryRanking(props.type, props.rangeInMonths);
});

const hasData = computed(() => chartData.value.series.length > 0 && chartData.value.series.some(s => s.data.some(d => d > 0)));

const chartOption = computed(() => {
  // eslint-disable-next-line
  const theme = currentTheme.value; // Ensures reactivity to theme changes

  return {
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: chartData.value.categories,
      textStyle: {
        color: 'rgb(var(--color-base-content))'
      },
      type: 'scroll',
      bottom: 0
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: chartData.value.months,
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
    series: chartData.value.series
  }
});
</script>
