<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-base-content">Cuentas</h1>
      <button 
        @click="showAddAccount = true"
        class="bg-primary text-primary-content px-4 py-2 rounded-lg hover:bg-primary-focus transition-colors flex items-center"
      >
        <Plus class="mr-2 h-4 w-4" />
        Nueva Cuenta
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div 
        v-for="account in accounts" 
        :key="account.id"
        class="bg-base-100 p-6 rounded-lg shadow-sm border border-base-300"
      >
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center">
            <div class="p-2 bg-info/10 rounded-lg">
              <component :is="getAccountIcon(account.type)" class="h-6 w-6 text-info" />
            </div>
            <div class="ml-3">
              <h3 class="font-semibold text-base-content">{{ account.name }}</h3>
              <p class="text-sm text-base-content/70 capitalize">{{ account.type }}</p>
            </div>
          </div>
          <button 
            @click="editAccount(account)"
            class="text-base-content/50 hover:text-base-content"
          >
            <Edit class="h-4 w-4" />
          </button>
        </div>
        
        <div class="text-right">
          <p class="text-2xl font-bold text-base-content">${{ account.balance.toFixed(2) }}</p>
          <p class="text-sm text-base-content/70">{{ account.currency }}</p>
        </div>
        
        <div class="mt-4 flex items-center justify-between">
          <span 
            class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
            :class="account.isActive ? 'bg-success/10 text-success' : 'bg-error/10 text-error'"
          >
            {{ account.isActive ? 'Activa' : 'Inactiva' }}
          </span>
          <button 
            @click="confirmDelete(account.id)"
            class="text-error/70 hover:text-error"
          >
            <Trash2 class="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>

    <!-- Add/Edit Account Modal -->
    <AccountModal 
      v-if="showAddAccount || editingAccount"
      :account="editingAccount"
      @close="closeModal"
      @save="handleSaveAccount"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useDatabaseStore } from '@/stores/database'
import { storeToRefs } from 'pinia'
import { 
  Plus, 
  Edit, 
  Trash2,
  Wallet,
  Building2,
  Smartphone,
  HelpCircle
} from 'lucide-vue-next'
import AccountModal from '../components/AccountModal.vue'
import type { Account } from '../types'

const databaseStore = useDatabaseStore()
const { accounts } = storeToRefs(databaseStore)

const showAddAccount = ref(false)
const editingAccount = ref<Account | null>(null)

const getAccountIcon = (type: string) => {
  switch (type) {
    case 'efectivo': return Wallet
    case 'banco': return Building2
    case 'mercadopago': return Smartphone
    default: return HelpCircle
  }
}

const editAccount = (account: Account) => {
  editingAccount.value = { ...account }
}

const closeModal = () => {
  showAddAccount.value = false
  editingAccount.value = null
}

const handleSaveAccount = (accountData: Omit<Account, 'id' | 'createdAt'>) => {
  if (editingAccount.value) {
    databaseStore.updateAccount(editingAccount.value.id, accountData)
  } else {
    databaseStore.addAccount(accountData)
  }
  closeModal()
}

const confirmDelete = (id: string) => {
  if (confirm('¿Estás seguro de que quieres eliminar esta cuenta?')) {
    databaseStore.deleteAccount(id)
  }
}
</script>
