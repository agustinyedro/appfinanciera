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
import { useChartTheme } from '@/composables/useChartTheme';

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
const { textColor } = useChartTheme();

const chartData = computed(() => {
  return databaseStore.getCategoryRanking(props.type, props.rangeInMonths);
});

const hasData = computed(() => chartData.value.series.length > 0 && chartData.value.series.some(s => s.data.some(d => d > 0)));

const chartOption = computed(() => {
  return {
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: chartData.value.categories,
      textStyle: {
        color: textColor.value
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
    series: chartData.value.series
  }
});
</script>
