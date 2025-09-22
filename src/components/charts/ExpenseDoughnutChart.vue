<template>
  <div class="bg-base-100 p-6 rounded-lg shadow-sm border border-base-300">
    <h2 class="text-lg font-semibold text-base-content mb-4">Gastos por Categoría (Mes Actual)</h2>
    <div v-if="hasData" class="h-80">
      <v-chart class="chart" :option="chartOption" autoresize />
    </div>
    <div v-else class="h-80 flex items-center justify-center text-base-content/60">
      No hay datos de gastos para este mes.
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { PieChart } from 'echarts/charts';
import { TitleComponent, TooltipComponent, LegendComponent } from 'echarts/components';
import VChart from 'vue-echarts';
import { useDatabaseStore } from '@/stores/database';
import { storeToRefs } from 'pinia';

use([
  CanvasRenderer,
  PieChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
]);

const databaseStore = useDatabaseStore();
const { monthlyExpensesByCategory } = storeToRefs(databaseStore);

const hasData = computed(() => monthlyExpensesByCategory.value.length > 0);

const chartOption = computed(() => ({
  tooltip: {
    trigger: 'item',
    formatter: '{a} <br/>{b}: ${c} ({d}%)',
  },
  legend: {
    orient: 'vertical',
    left: 'left',
    textStyle: {
      color: 'rgb(var(--color-base-content))'
    }
  },
  series: [
    {
      name: 'Gastos',
      type: 'pie',
      radius: ['50%', '70%'],
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
      data: monthlyExpensesByCategory.value,
    },
  ],
}));
</script>
