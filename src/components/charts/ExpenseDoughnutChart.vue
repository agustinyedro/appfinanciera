<template>
  <div class="h-80">
    <div v-if="hasData">
      <v-chart class="chart" :option="chartOption" autoresize />
    </div>
    <div v-else class="h-full flex items-center justify-center text-base-content/60">
      No hay datos de {{ type === 'gasto' ? 'gastos' : 'ingresos' }} para el período seleccionado.
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { PieChart } from 'echarts/charts';
import { TitleComponent, TooltipComponent, LegendComponent } from 'echarts/components';
import VChart from 'vue-echarts';
import { useDatabaseStore } from '@/stores/database';

const props = defineProps<{
  type: 'ingreso' | 'gasto',
  year: number,
  month: number
}>()

use([
  CanvasRenderer,
  PieChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
]);

const databaseStore = useDatabaseStore();

const chartData = computed(() => {
  return databaseStore.getCategorizedDataForPeriod(props.type, props.year, props.month);
});

const hasData = computed(() => chartData.value.length > 0);

const chartOption = computed(() => ({
  tooltip: {
    trigger: 'item',
    formatter: '{a} <br/>{b}: ${c} ({d}%)',
  },
  legend: {
    orient: 'vertical',
    left: 'left',
    top: 'center',
    textStyle: {
      color: 'rgb(var(--color-base-content))'
    }
  },
  series: [
    {
      name: props.type === 'gasto' ? 'Gastos' : 'Ingresos',
      type: 'pie',
      radius: ['50%', '70%'],
      center: ['70%', '50%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 10,
        borderColor: 'rgb(var(--color-base-100))',
        borderWidth: 2,
      },
      label: {
        show: false,
        position: 'center',
      },
      emphasis: {
        label: {
          show: true,
          fontSize: '20',
          fontWeight: 'bold',
        },
      },
      labelLine: {
        show: false,
      },
      data: chartData.value,
    },
  ],
}));
</script>
