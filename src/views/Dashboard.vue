<template>
  <div class="space-y-6">
    <!-- Balance Card -->
    <div class="bg-base-100 p-6 rounded-2xl shadow-md border border-base-300/50">
      <div class="flex justify-between items-start">
        <div>
          <p class="text-sm font-medium text-base-content/70">Balance Total</p>
          <p class="text-4xl font-bold text-base-content mt-1">${{ totalBalance.toFixed(2) }}</p>
        </div>
        <router-link to="/cuentas" class="text-sm font-semibold text-primary hover:text-primary-focus">
          Ver detalles
        </router-link>
      </div>
    </div>

    <!-- Income & Expenses Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
      <div class="bg-base-100 p-6 rounded-2xl shadow-md border border-base-300/50">
        <div class="flex items-center">
          <div class="p-3 bg-success/10 rounded-xl">
            <TrendingUp class="h-6 w-6 text-success" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-base-content/70">Ingresos del Mes</p>
            <p class="text-2xl font-bold text-base-content">${{ monthlyIncome.toFixed(2) }}</p>
          </div>
        </div>
      </div>

      <div class="bg-base-100 p-6 rounded-2xl shadow-md border border-base-300/50">
        <div class="flex items-center">
          <div class="p-3 bg-error/10 rounded-xl">
            <TrendingDown class="h-6 w-6 text-error" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-base-content/70">Gastos del Mes</p>
            <p class="text-2xl font-bold text-base-content">${{ monthlyExpenses.toFixed(2) }}</p>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Recent Transactions -->
    <div class="bg-base-100 rounded-2xl shadow-md border border-base-300/50">
      <div class="p-6 border-b border-base-300">
        <h2 class="text-lg font-semibold text-base-content">Transacciones Recientes</h2>
      </div>
      <div class="p-4 sm:p-6">
        <div v-if="recentTransactions.length === 0" class="text-center py-8 text-base-content/60">
          No hay transacciones recientes
        </div>
        <div v-else class="space-y-4">
          <div 
            v-for="transaction in recentTransactions" 
            :key="transaction.id"
            class="flex items-center justify-between"
          >
            <div class="flex items-center">
              <div 
                class="w-10 h-10 rounded-full flex items-center justify-center"
                :style="{ backgroundColor: getTagColor(transaction.tagId) + '1A' }"
              >
                <component 
                  :is="getIcon(getTagIcon(transaction.tagId))"
                  class="h-5 w-5"
                  :style="{ color: getTagColor(transaction.tagId) }"
                />
              </div>
              <div class="ml-4">
                <p class="font-medium text-base-content">{{ transaction.description }}</p>
                <p class="text-sm text-base-content/70">{{ getTagName(transaction.tagId) }}</p>
              </div>
            </div>
            <div class="text-right">
              <p 
                class="font-semibold"
                :class="transaction.type === 'ingreso' ? 'text-success' : 'text-error'"
              >
                {{ transaction.type === 'ingreso' ? '+' : '-' }}${{ transaction.amount.toFixed(2) }}
              </p>
              <p class="text-sm text-base-content/70">{{ formatDate(transaction.date) }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Transaction Modal -->
    <TransactionModal 
      v-if="showAddTransaction"
      @close="showAddTransaction = false"
      @save="handleAddTransaction"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useDatabaseStore } from '@/stores/database'
import { storeToRefs } from 'pinia'
import { useIcons } from '@/composables/useIcons'
import { 
  TrendingUp, 
  TrendingDown 
} from 'lucide-vue-next'
import TransactionModal from '../components/TransactionModal.vue'
import type { Transaction } from '../types'
import { showAddTransaction } from '@/composables/useModal'

const databaseStore = useDatabaseStore()
const { 
  totalBalance, 
  monthlyIncome, 
  monthlyExpenses,
  transactions,
  tags
} = storeToRefs(databaseStore)

const { getIcon } = useIcons()

const recentTransactions = computed(() => {
  return [...transactions.value]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)
})

const getTag = (tagId: string) => {
  return tags.value.find(t => t.id === tagId)
}

const getTagName = (tagId: string) => getTag(tagId)?.name || 'Sin categoría'
const getTagColor = (tagId: string) => getTag(tagId)?.color || '#6b7280'
const getTagIcon = (tagId: string) => {
  const tag = getTag(tagId)
  if (tag?.icon) return tag.icon
  return tag?.category === 'ingreso' ? 'TrendingUp' : 'TrendingDown'
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short'
  })
}

const handleAddTransaction = async (transaction: Omit<Transaction, 'id' | 'createdAt'>) => {
  await databaseStore.addTransaction(transaction)
  showAddTransaction.value = false
}
</script>
