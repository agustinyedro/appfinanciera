<template>
  <div class="space-y-6">
    <h1 class="text-2xl font-bold text-base-content">Reportes y Análisis</h1>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Category Distribution Chart -->
      <div class="bg-base-100 p-6 rounded-2xl shadow-md border border-base-300/50">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
          <h2 class="text-lg font-semibold text-base-content">Distribución por Categoría</h2>
          <div class="flex items-center gap-2">
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

      <!-- Monthly Balance Chart -->
      <div class="bg-base-100 p-6 rounded-2xl shadow-md border border-base-300/50">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
          <h2 class="text-lg font-semibold text-base-content">Balance Mensual</h2>
          <div class="flex items-center gap-2">
            <select v-model="balanceChartMonth" class="w-full sm:w-auto border border-base-300 rounded-md px-3 py-1.5 bg-base-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
              <option v-for="(name, index) in monthNames" :key="index" :value="index">{{ name }}</option>
            </select>
            <select v-model="balanceChartYear" class="w-full sm:w-auto border border-base-300 rounded-md px-3 py-1.5 bg-base-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
              <option v-for="year in availableYears" :key="year" :value="year">{{ year }}</option>
            </select>
          </div>
        </div>
        <MonthlyBalanceChart :year="balanceChartYear" :month="balanceChartMonth" />
      </div>

      <!-- Category Ranking Chart -->
      <div class="bg-base-100 p-6 rounded-2xl shadow-md border border-base-300/50">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
          <h2 class="text-lg font-semibold text-base-content">Ranking de Categorías</h2>
          <div class="flex items-center gap-2">
            <div class="flex rounded-md bg-base-200 p-1">
              <button @click="rankingChartRange = 3" :class="rankingChartRange === 3 ? 'bg-base-100 text-primary shadow-sm' : 'text-base-content/70'" class="px-3 py-1 text-sm font-medium rounded-md transition-colors">3M</button>
              <button @click="rankingChartRange = 6" :class="rankingChartRange === 6 ? 'bg-base-100 text-primary shadow-sm' : 'text-base-content/70'" class="px-3 py-1 text-sm font-medium rounded-md transition-colors">6M</button>
              <button @click="rankingChartRange = 12" :class="rankingChartRange === 12 ? 'bg-base-100 text-primary shadow-sm' : 'text-base-content/70'" class="px-3 py-1 text-sm font-medium rounded-md transition-colors">1A</button>
            </div>
            <div class="flex rounded-md bg-base-200 p-1">
              <button @click="rankingChartType = 'gasto'" :class="rankingChartType === 'gasto' ? 'bg-base-100 text-primary shadow-sm' : 'text-base-content/70'" class="px-3 py-1 text-sm font-medium rounded-md transition-colors">Gastos</button>
              <button @click="rankingChartType = 'ingreso'" :class="rankingChartType === 'ingreso' ? 'bg-base-100 text-primary shadow-sm' : 'text-base-content/70'" class="px-3 py-1 text-sm font-medium rounded-md transition-colors">Ingresos</button>
            </div>
          </div>
        </div>
        <CategoryRankingChart :type="rankingChartType" :range-in-months="rankingChartRange" />
      </div>

      <!-- Savings Growth Chart -->
      <div class="bg-base-100 p-6 rounded-2xl shadow-md border border-base-300/50">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
          <h2 class="text-lg font-semibold text-base-content">Crecimiento de Ahorros</h2>
          <div class="flex rounded-md bg-base-200 p-1">
            <button @click="savingsChartRange = 3" :class="savingsChartRange === 3 ? 'bg-base-100 text-primary shadow-sm' : 'text-base-content/70'" class="px-3 py-1 text-sm font-medium rounded-md transition-colors">3M</button>
            <button @click="savingsChartRange = 6" :class="savingsChartRange === 6 ? 'bg-base-100 text-primary shadow-sm' : 'text-base-content/70'" class="px-3 py-1 text-sm font-medium rounded-md transition-colors">6M</button>
            <button @click="savingsChartRange = 12" :class="savingsChartRange === 12 ? 'bg-base-100 text-primary shadow-sm' : 'text-base-content/70'" class="px-3 py-1 text-sm font-medium rounded-md transition-colors">1A</button>
          </div>
        </div>
        <SavingsGrowthChart :rangeInMonths="savingsChartRange" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useDatabaseStore } from '@/stores/database';
import { storeToRefs } from 'pinia';
import CategoryPieChart from '@/components/charts/ExpenseDoughnutChart.vue';
import MonthlyBalanceChart from '@/components/charts/MonthlyBalanceChart.vue';
import CategoryRankingChart from '@/components/charts/CategoryRankingChart.vue';
import SavingsGrowthChart from '@/components/charts/SavingsGrowthChart.vue';

const databaseStore = useDatabaseStore();
const { transactions } = storeToRefs(databaseStore);

const today = new Date();
const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

// State for Pie Chart
const pieChartType = ref<'ingreso' | 'gasto'>('gasto');
const pieChartMonth = ref(today.getMonth());
const pieChartYear = ref(today.getFullYear());

// State for Balance Chart
const balanceChartMonth = ref(today.getMonth());
const balanceChartYear = ref(today.getFullYear());

// State for Ranking Chart
const rankingChartType = ref<'ingreso' | 'gasto'>('gasto');
const rankingChartRange = ref(6);

// State for Savings Chart
const savingsChartRange = ref(6);

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
  return years.length > 0 ? years : [today.getFullYear()];
});
</script>
