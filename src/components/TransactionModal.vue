<template>
  <div class="fixed inset-0 z-50 overflow-y-auto">
    <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="$emit('close')"></div>
      
      <div class="inline-block align-bottom bg-base-100 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
        <form @submit.prevent="handleSubmit">
          <div class="bg-base-100 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="mb-4">
              <h3 class="text-lg font-medium text-base-content">
                {{ transaction ? 'Editar Transacción' : 'Nueva Transacción' }}
              </h3>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-base-content/70 mb-1">Tipo</label>
                <select 
                  v-model="form.type"
                  required
                  class="w-full border border-base-300 rounded-md px-3 py-2 bg-base-100 focus:outline-none focus:ring-2 focus:ring-primary"
                  @change="updateAvailableTags"
                >
                  <option value="ingreso">Ingreso</option>
                  <option value="gasto">Gasto</option>
                </select>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-base-content/70 mb-1">Monto</label>
                <input 
                  v-model.number="form.amount"
                  type="number" 
                  step="0.01"
                  min="0.01"
                  required
                  class="w-full border border-base-300 rounded-md px-3 py-2 bg-base-100 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="0.00"
                >
              </div>
              
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-base-content/70 mb-1">Descripción</label>
                <input 
                  v-model="form.description"
                  type="text" 
                  required
                  class="w-full border border-base-300 rounded-md px-3 py-2 bg-base-100 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Descripción de la transacción"
                >
              </div>
              
              <div>
                <label class="block text-sm font-medium text-base-content/70 mb-1">Cuenta</label>
                <select 
                  v-model="form.accountId"
                  required
                  class="w-full border border-base-300 rounded-md px-3 py-2 bg-base-100 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Seleccionar cuenta</option>
                  <option v-for="account in activeAccounts" :key="account.id" :value="account.id">
                    {{ account.name }}
                  </option>
                </select>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-base-content/70 mb-1">Categoría</label>
                <select 
                  v-model="form.tagId"
                  required
                  class="w-full border border-base-300 rounded-md px-3 py-2 bg-base-100 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Seleccionar categoría</option>
                  <option v-for="tag in availableTags" :key="tag.id" :value="tag.id">
                    {{ tag.name }}
                  </option>
                </select>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-base-content/70 mb-1">Fecha</label>
                <input 
                  v-model="form.date"
                  type="date" 
                  required
                  class="w-full border border-base-300 rounded-md px-3 py-2 bg-base-100 focus:outline-none focus:ring-2 focus:ring-primary"
                >
              </div>
              
              <div class="flex items-center pt-6">
                <input 
                  v-model="form.isRecurring"
                  type="checkbox" 
                  class="h-4 w-4 text-primary focus:ring-primary border-base-300 rounded"
                >
                <label class="ml-2 block text-sm text-base-content">Transacción recurrente</label>
              </div>
            </div>
            
            <!-- Recurring Configuration -->
            <div v-if="form.isRecurring" class="mt-4 p-4 bg-primary/10 rounded-lg">
              <h4 class="font-medium text-base-content mb-3">Configuración de Recurrencia</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-base-content/70 mb-1">Frecuencia</label>
                  <select 
                    v-model="form.recurringConfig.frequency"
                    class="w-full border border-base-300 rounded-md px-3 py-2 bg-base-100 focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="diario">Diario</option>
                    <option value="semanal">Semanal</option>
                    <option value="mensual">Mensual</option>
                    <option value="anual">Anual</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-base-content/70 mb-1">Fecha de fin (opcional)</label>
                  <input 
                    v-model="form.recurringConfig.endDate"
                    type="date"
                    class="w-full border border-base-300 rounded-md px-3 py-2 bg-base-100 focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                </div>
              </div>
            </div>
            
            <!-- Credit Card Configuration -->
            <div v-if="form.type === 'gasto'" class="mt-4">
              <div class="flex items-center mb-3">
                <input 
                  v-model="showCreditCard"
                  type="checkbox" 
                  class="h-4 w-4 text-primary focus:ring-primary border-base-300 rounded"
                >
                <label class="ml-2 block text-sm text-base-content">Pago con tarjeta de crédito en cuotas</label>
              </div>
              
              <div v-if="showCreditCard" class="p-4 bg-secondary/10 rounded-lg">
                <h4 class="font-medium text-base-content mb-3">Configuración de Tarjeta de Crédito</h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-base-content/70 mb-1">Nombre de la tarjeta</label>
                    <input 
                      v-model="form.creditCardConfig.cardName"
                      type="text"
                      class="w-full border border-base-300 rounded-md px-3 py-2 bg-base-100 focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Visa, Mastercard, etc."
                    >
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-base-content/70 mb-1">Cantidad de cuotas</label>
                    <input 
                      v-model.number="form.creditCardConfig.installments"
                      type="number"
                      min="1"
                      max="60"
                      class="w-full border border-base-300 rounded-md px-3 py-2 bg-base-100 focus:outline-none focus:ring-2 focus:ring-primary"
                      @input="calculateMonthlyAmount"
                    >
                  </div>
                  <div class="md:col-span-2">
                    <p class="text-sm text-base-content/70">
                      Monto por cuota: ${{ monthlyAmount.toFixed(2) }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="bg-base-200 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button 
              type="submit"
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary text-base font-medium text-primary-content hover:bg-primary-focus focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:ml-3 sm:w-auto sm:text-sm"
            >
              {{ transaction ? 'Actualizar' : 'Crear' }}
            </button>
            <button 
              type="button"
              @click="$emit('close')"
              class="mt-3 w-full inline-flex justify-center rounded-md border border-base-300 shadow-sm px-4 py-2 bg-base-100 text-base font-medium text-base-content hover:bg-base-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useDatabaseStore } from '@/stores/database'
import { storeToRefs } from 'pinia'
import type { Transaction } from '../types'

interface Props {
  transaction?: Transaction | null
}

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
  save: [transaction: Omit<Transaction, 'id' | 'createdAt'>]
}>()

const databaseStore = useDatabaseStore()
const { tags, activeAccounts } = storeToRefs(databaseStore)

const form = ref({
  type: 'gasto' as const,
  amount: 0,
  description: '',
  accountId: '',
  tagId: '',
  date: new Date().toISOString().split('T')[0],
  isRecurring: false,
  recurringConfig: {
    frequency: 'mensual' as const,
    endDate: '',
    occurrences: undefined
  },
  creditCardConfig: {
    cardName: '',
    installments: 1,
    currentInstallment: 1,
    monthlyAmount: 0
  }
})

const showCreditCard = ref(false)

const availableTags = computed(() => {
  return tags.value.filter(t => t.category === form.value.type)
})

const monthlyAmount = computed(() => {
  if (showCreditCard.value && form.value.creditCardConfig.installments > 0) {
    return form.value.amount / form.value.creditCardConfig.installments
  }
  return 0
})

const updateAvailableTags = () => {
  form.value.tagId = ''
}

const calculateMonthlyAmount = () => {
  if (form.value.creditCardConfig.installments > 0) {
    form.value.creditCardConfig.monthlyAmount = form.value.amount / form.value.creditCardConfig.installments
  }
}

watch(() => form.value.amount, calculateMonthlyAmount)

onMounted(() => {
  if (props.transaction) {
    form.value = {
      type: props.transaction.type,
      amount: props.transaction.amount,
      description: props.transaction.description,
      accountId: props.transaction.accountId,
      tagId: props.transaction.tagId,
      date: props.transaction.date,
      isRecurring: props.transaction.isRecurring,
      recurringConfig: props.transaction.recurringConfig || {
        frequency: 'mensual',
        endDate: '',
        occurrences: undefined
      },
      creditCardConfig: props.transaction.creditCardConfig || {
        cardName: '',
        installments: 1,
        currentInstallment: 1,
        monthlyAmount: 0
      }
    }
    showCreditCard.value = !!props.transaction.creditCardConfig
  }
})

const handleSubmit = () => {
  const transactionData: Omit<Transaction, 'id' | 'createdAt'> = {
    type: form.value.type,
    amount: form.value.amount,
    description: form.value.description,
    accountId: form.value.accountId,
    tagId: form.value.tagId,
    date: form.value.date,
    isRecurring: form.value.isRecurring
  }

  if (form.value.isRecurring) {
    transactionData.recurringConfig = {
      frequency: form.value.recurringConfig.frequency,
      endDate: form.value.recurringConfig.endDate || undefined,
      occurrences: form.value.recurringConfig.occurrences
    }
  }

  if (showCreditCard.value && form.value.type === 'gasto') {
    transactionData.creditCardConfig = {
      cardName: form.value.creditCardConfig.cardName,
      installments: form.value.creditCardConfig.installments,
      currentInstallment: 1,
      monthlyAmount: monthlyAmount.value
    }
  }

  emit('save', transactionData)
}
</script>
