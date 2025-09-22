<template>
  <div class="fixed inset-0 z-50 overflow-y-auto">
    <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="$emit('close')"></div>
      
      <div class="inline-block align-bottom bg-base-100 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md sm:w-full">
        <form @submit.prevent="handleSubmit">
          <div class="bg-base-100 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="mb-4">
              <h3 class="text-lg font-medium text-base-content">{{ title }}</h3>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-base-content/70 mb-1">Cantidad</label>
              <input 
                v-model.number="amount"
                type="number" 
                step="0.01"
                min="0.01"
                required
                class="w-full border border-base-300 rounded-md px-3 py-2 bg-base-100 focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="0.00"
                autofocus
              >
            </div>
          </div>
          
          <div class="bg-base-200 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button 
              type="submit"
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary text-base font-medium text-primary-content hover:bg-primary-focus focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:ml-3 sm:w-auto sm:text-sm"
            >
              Confirmar
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
import { ref } from 'vue'

interface Props {
  title: string
}

defineProps<Props>()
const emit = defineEmits<{
  close: []
  save: [amount: number]
}>()

const amount = ref(0)

const handleSubmit = () => {
  if (amount.value > 0) {
    emit('save', amount.value)
  }
}
</script>
