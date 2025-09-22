<template>
  <div class="fixed inset-0 z-50 overflow-y-auto">
    <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <div class="fixed inset-0 bg-base-content/30 backdrop-blur-sm transition-opacity" @click="$emit('close')"></div>
      
      <div class="inline-block align-bottom bg-base-100 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
        <form @submit.prevent="handleSubmit">
          <div class="bg-base-100 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="mb-4">
              <h3 class="text-lg font-medium text-base-content">
                {{ account ? 'Editar Cuenta' : 'Nueva Cuenta' }}
              </h3>
            </div>
            
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-base-content/70 mb-1">Nombre</label>
                <input 
                  v-model="form.name"
                  type="text" 
                  required
                  class="w-full border border-base-300 rounded-md px-3 py-2 bg-base-100 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Nombre de la cuenta"
                >
              </div>
              
              <div>
                <label class="block text-sm font-medium text-base-content/70 mb-1">Tipo</label>
                <select 
                  v-model="form.type"
                  required
                  class="w-full border border-base-300 rounded-md px-3 py-2 bg-base-100 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="efectivo">Efectivo</option>
                  <option value="banco">Banco</option>
                  <option value="mercadopago">MercadoPago</option>
                  <option value="otro">Otro</option>
                </select>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-base-content/70 mb-1">Balance Inicial</label>
                <input 
                  v-model.number="form.balance"
                  type="number" 
                  step="0.01"
                  required
                  class="w-full border border-base-300 rounded-md px-3 py-2 bg-base-100 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="0.00"
                >
              </div>
              
              <div>
                <label class="block text-sm font-medium text-base-content/70 mb-1">Moneda</label>
                <input 
                  v-model="form.currency"
                  type="text" 
                  required
                  class="w-full border border-base-300 rounded-md px-3 py-2 bg-base-100 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="USD, EUR, ARS, etc."
                >
              </div>
              
              <div class="flex items-center">
                <input 
                  v-model="form.isActive"
                  type="checkbox" 
                  class="h-4 w-4 text-primary focus:ring-primary border-base-300 rounded"
                >
                <label class="ml-2 block text-sm text-base-content">Cuenta activa</label>
              </div>
            </div>
          </div>
          
          <div class="bg-base-200 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button 
              type="submit"
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary text-base font-medium text-primary-content hover:bg-primary-focus focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:ml-3 sm:w-auto sm:text-sm"
            >
              {{ account ? 'Actualizar' : 'Crear' }}
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
import { ref, onMounted } from 'vue'
import type { Account } from '../types'

interface Props {
  account?: Account | null
}

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
  save: [account: Omit<Account, 'id' | 'createdAt'>]
}>()

const form = ref({
  name: '',
  type: 'efectivo' as const,
  balance: 0,
  currency: 'USD',
  isActive: true
})

onMounted(() => {
  if (props.account) {
    form.value = {
      name: props.account.name,
      type: props.account.type,
      balance: props.account.balance,
      currency: props.account.currency,
      isActive: props.account.isActive
    }
  }
})

const handleSubmit = () => {
  emit('save', form.value)
}
</script>
