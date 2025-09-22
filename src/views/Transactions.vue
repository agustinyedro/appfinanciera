<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-base-content">Transacciones</h1>
      <button 
        @click="showAddTransaction = true"
        class="bg-primary text-primary-content px-4 py-2 rounded-lg hover:bg-primary-focus transition-colors flex items-center"
      >
        <Plus class="mr-2 h-4 w-4" />
        Nueva Transacción
      </button>
    </div>

    <!-- Filters -->
    <div class="bg-base-100 p-4 rounded-lg shadow-sm border border-base-300">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-base-content/70 mb-1">Tipo</label>
          <select v-model="filters.type" class="w-full border border-base-300 rounded-md px-3 py-2 bg-base-100">
            <option value="">Todos</option>
            <option value="ingreso">Ingresos</option>
            <option value="gasto">Gastos</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-base-content/70 mb-1">Cuenta</label>
          <select v-model="filters.accountId" class="w-full border border-base-300 rounded-md px-3 py-2 bg-base-100">
            <option value="">Todas</option>
            <option v-for="account in accounts" :key="account.id" :value="account.id">
              {{ account.name }}
            </option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-base-content/70 mb-1">Categoría</label>
          <select v-model="filters.tagId" class="w-full border border-base-300 rounded-md px-3 py-2 bg-base-100">
            <option value="">Todas</option>
            <option v-for="tag in tags" :key="tag.id" :value="tag.id">
              {{ tag.name }}
            </option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-base-content/70 mb-1">Búsqueda</label>
          <input 
            v-model="filters.search"
            type="text" 
            placeholder="Buscar descripción..."
            class="w-full border border-base-300 rounded-md px-3 py-2 bg-base-100"
          >
        </div>
      </div>
    </div>

    <!-- Transactions List -->
    <div class="bg-base-100 rounded-lg shadow-sm border border-base-300">
      <div class="p-6">
        <div v-if="filteredTransactions.length === 0" class="text-center py-8 text-base-content/60">
          No hay transacciones que coincidan con los filtros
        </div>
        <div v-else class="space-y-4">
          <div 
            v-for="transaction in paginatedTransactions" 
            :key="transaction.id"
            class="flex items-center justify-between p-4 bg-base-200 rounded-lg hover:bg-base-300/50 transition-colors"
          >
            <div class="flex items-center flex-1">
              <div 
                class="w-10 h-10 rounded-full flex items-center justify-center"
                :class="transaction.type === 'ingreso' ? 'bg-success/10' : 'bg-error/10'"
              >
                <component 
                  :is="transaction.type === 'ingreso' ? TrendingUp : TrendingDown"
                  class="h-5 w-5"
                  :class="transaction.type === 'ingreso' ? 'text-success' : 'text-error'"
                />
              </div>
              <div class="ml-4 flex-1">
                <div class="flex items-center justify-between">
                  <p class="font-medium text-base-content">{{ transaction.description }}</p>
                  <div class="flex items-center space-x-2">
                    <button 
                      @click="editTransaction(transaction)"
                      class="text-base-content/50 hover:text-base-content"
                    >
                      <Edit class="h-4 w-4" />
                    </button>
                    <button 
                      @click="confirmDelete(transaction.id)"
                      class="text-error/70 hover:text-error"
                    >
                      <Trash2 class="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div class="flex items-center space-x-4 text-sm text-base-content/70 mt-1">
                  <span>{{ getAccountName(transaction.accountId) }}</span>
                  <span>•</span>
                  <span class="inline-flex items-center">
                    <div 
                      class="w-2 h-2 rounded-full mr-1"
                      :style="{ backgroundColor: getTagColor(transaction.tagId) }"
                    ></div>
                    {{ getTagName(transaction.tagId) }}
                  </span>
                  <span>•</span>
                  <span>{{ formatDate(transaction.date) }}</span>
                  <span v-if="transaction.isRecurring" class="inline-flex items-center px-2 py-1 rounded-full text-xs bg-info/10 text-info">
                    <Repeat class="h-3 w-3 mr-1" />
                    Recurrente
                  </span>
                  <span v-if="transaction.creditCardConfig" class="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary/10 text-primary">
                    <CreditCard class="h-3 w-3 mr-1" />
                    {{ transaction.creditCardConfig.currentInstallment }}/{{ transaction.creditCardConfig.installments }}
                  </span>
                </div>
              </div>
            </div>
            <div class="text-right ml-4">
              <p 
                class="font-semibold text-lg"
                :class="transaction.type === 'ingreso' ? 'text-success' : 'text-error'"
              >
                {{ transaction.type === 'ingreso' ? '+' : '-' }}${{ transaction.amount.toFixed(2) }}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Pagination -->
      <div v-if="totalPages > 1" class="px-6 py-4 border-t border-base-300">
        <div class="flex items-center justify-between">
          <p class="text-sm text-base-content/80">
            Mostrando {{ (currentPage - 1) * itemsPerPage + 1 }} a {{ Math.min(currentPage * itemsPerPage, filteredTransactions.length) }} de {{ filteredTransactions.length }} transacciones
          </p>
          <div class="flex space-x-2">
            <button 
              @click="currentPage--"
              :disabled="currentPage === 1"
              class="px-3 py-1 border border-base-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-base-200"
            >
              Anterior
            </button>
            <button 
              @click="currentPage++"
              :disabled="currentPage === totalPages"
              class="px-3 py-1 border border-base-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-base-200"
            >
              Siguiente
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Transaction Modal -->
    <TransactionModal 
      v-if="editingTransaction"
      :transaction="editingTransaction"
      @close="closeModal"
      @save="handleSaveTransaction"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useDatabaseStore } from '@/stores/database'
import { storeToRefs } from 'pinia'
import { showAddTransaction } from '@/composables/useModal'
import { 
  Plus, 
  Edit, 
  Trash2,
  TrendingUp, 
  TrendingDown,
  Repeat,
  CreditCard
} from 'lucide-vue-next'
import TransactionModal from '../components/TransactionModal.vue'
import type { Transaction } from '../types'

const databaseStore = useDatabaseStore()
const { transactions, accounts, tags } = storeToRefs(databaseStore)

const editingTransaction = ref<Transaction | null>(null)
const currentPage = ref(1)
const itemsPerPage = 10

const filters = ref({
  type: '',
  accountId: '',
  tagId: '',
  search: ''
})

const filteredTransactions = computed(() => {
  return [...transactions.value]
    .filter(t => {
      if (filters.value.type && t.type !== filters.value.type) return false
      if (filters.value.accountId && t.accountId !== filters.value.accountId) return false
      if (filters.value.tagId && t.tagId !== filters.value.tagId) return false
      if (filters.value.search && !t.description.toLowerCase().includes(filters.value.search.toLowerCase())) return false
      return true
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
})

const totalPages = computed(() => {
  return Math.ceil(filteredTransactions.value.length / itemsPerPage)
})

const paginatedTransactions = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredTransactions.value.slice(start, end)
})

const getAccountName = (accountId: string) => {
  return accounts.value.find(a => a.id === accountId)?.name || 'N/A'
}

const getTagName = (tagId: string) => {
  return tags.value.find(t => t.id === tagId)?.name || 'N/A'
}

const getTagColor = (tagId: string) => {
  return tags.value.find(t => t.id === tagId)?.color || '#6b7280'
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('es-ES')
}

const editTransaction = (transaction: Transaction) => {
  editingTransaction.value = { ...transaction }
  showAddTransaction.value = false; // Ensure add modal is not open
  setTimeout(() => editingTransaction.value = { ...transaction }, 0); // Re-assign to trigger modal
}

const closeModal = () => {
  editingTransaction.value = null
}

const handleSaveTransaction = (transactionData: Omit<Transaction, 'id' | 'createdAt'>) => {
  if (editingTransaction.value) {
    databaseStore.updateTransaction(editingTransaction.value.id, transactionData)
  }
  closeModal()
}

const confirmDelete = (id: string) => {
  if (confirm('¿Estás seguro de que quieres eliminar esta transacción?')) {
    databaseStore.deleteTransaction(id)
  }
}
</script>
