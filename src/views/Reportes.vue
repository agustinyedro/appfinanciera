<template>
  <div class="space-y-6">
    <h1 class="text-2xl font-bold text-base-content">Reportes y Análisis</h1>

    <!-- Category Distribution Chart -->
    <div class="bg-base-100 p-6 rounded-lg shadow-sm border border-base-300">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
        <h2 class="text-lg font-semibold text-base-content">Distribución por Categoría</h2>
        <div class="flex flex-col sm:flex-row items-start sm:items-center gap-2">
          <select v-model="pieChartMonth" class="w-full sm:w-auto border border-base-300 rounded-md px-3 py-1.5 bg-base-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
            <option v-for="(name, index) in monthNames" :key="index" :value="index">{{ name }}</option>
          </select>
          <select v-model="pieChartYear" class="w-full sm:w-auto border border-base-300 rounded-md px-3 py-1.5 bg-base-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
            <option v-for="year in availableYears" :key="year" :value="year">{{ year }}</option>
          </select>
          <div class="flex rounded-md bg-base-200 p-1">
            <button @click="pieChartType = 'gasto'" :class="pieChartType === 'gasto' ? 'bg-base-100 text-primary shadow-sm' : 'text-base-content/70'" class="px-3 py-1 text-sm font-medium rounded-md transition-colors">Gastos</button>
            <button @click="pieChartType = 'ingreso'" :class="pieChartType === 'ingreso' ? 'bg-base-100 text-primary shadow-sm' : 'text-base-content/70'" class="px-3 py-1 text-sm font-medium rounded-md transition-colors">Ingresos</button>
          </div>
        </div>
      </div>
      <CategoryPieChart :type="pieChartType" :year="pieChartYear" :month="pieChartMonth" />
    </div>

    <!-- Income vs Expense Trend Chart -->
    <div class="bg-base-100 p-6 rounded-lg shadow-sm border border-base-300">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
        <h2 class="text-lg font-semibold text-base-content">Ingresos vs Gastos</h2>
         <div class="flex rounded-md bg-base-200 p-1">
            <button @click="barChartRange = 3" :class="barChartRange === 3 ? 'bg-base-100 text-primary shadow-sm' : 'text-base-content/70'" class="px-3 py-1 text-sm font-medium rounded-md transition-colors">3M</button>
            <button @click="barChartRange = 6" :class="barChartRange === 6 ? 'bg-base-100 text-primary shadow-sm' : 'text-base-content/70'" class="px-3 py-1 text-sm font-medium rounded-md transition-colors">6M</button>
            <button @click="barChartRange = 12" :class="barChartRange === 12 ? 'bg-base-100 text-primary shadow-sm' : 'text-base-content/70'" class="px-3 py-1 text-sm font-medium rounded-md transition-colors">1A</button>
          </div>
      </div>
      <IncomeExpenseBarChart :range-in-months="barChartRange" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useDatabaseStore } from '@/stores/database';
import { storeToRefs } from 'pinia';
import CategoryPieChart from '@/components/charts/ExpenseDoughnutChart.vue';
import IncomeExpenseBarChart from '@/components/charts/IncomeExpenseBarChart.vue';

const databaseStore = useDatabaseStore();
const { transactions } = storeToRefs(databaseStore);

const today = new Date();

// State for Pie Chart filters
const pieChartType = ref<'ingreso' | 'gasto'>('gasto');
const pieChartMonth = ref(today.getMonth());
const pieChartYear = ref(today.getFullYear());

// State for Bar Chart filters
const barChartRange = ref(6);

const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

const availableYears = computed(() => {
  if (transactions.value.length === 0) {
    return [today.getFullYear()];
  }
  const firstYear = new Date(transactions.value.reduce((min, t) => new Date(t.date) < new Date(min) ? t.date : min, transactions.value[0].date)).getFullYear();
  const currentYear = today.getFullYear();
  const years = [];
  for (let y = currentYear; y >= firstYear; y--) {
    years.push(y);
  }
  return years;
});
</script>
