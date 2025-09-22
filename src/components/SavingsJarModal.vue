<template>
  <div>
    <div class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="$emit('close')"></div>
        
        <div class="inline-block align-bottom bg-base-100 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <form @submit.prevent="handleSubmit">
            <div class="bg-base-100 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div class="mb-4">
                <h3 class="text-lg font-medium text-base-content">
                  {{ jar ? 'Editar Jarro de Ahorro' : 'Nuevo Jarro de Ahorro' }}
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
                    placeholder="Nombre del jarro"
                  >
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-base-content/70 mb-1">Descripción</label>
                  <textarea 
                    v-model="form.description"
                    rows="3"
                    class="w-full border border-base-300 rounded-md px-3 py-2 bg-base-100 focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Descripción opcional"
                  ></textarea>
                </div>

                <div class="flex items-center space-x-4">
                  <div class="flex-1">
                    <label class="block text-sm font-medium text-base-content/70 mb-1">Icono</label>
                    <button type="button" @click="showIconPicker = true" class="w-full h-10 flex items-center justify-center border border-base-300 rounded-md bg-base-100">
                      <component :is="getIcon(form.icon || 'PiggyBank')" class="h-6 w-6 text-base-content" />
                    </button>
                  </div>
                  <div class="flex-1">
                    <label class="block text-sm font-medium text-base-content/70 mb-1">Color</label>
                    <input 
                      v-model="form.color"
                      type="color"
                      class="w-full h-10 border border-base-300 rounded-md cursor-pointer"
                    >
                  </div>
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-base-content/70 mb-1">Meta de Ahorro</label>
                  <input 
                    v-model.number="form.targetAmount"
                    type="number" 
                    step="0.01"
                    required
                    class="w-full border border-base-300 rounded-md px-3 py-2 bg-base-100 focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="0.00"
                  >
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-base-content/70 mb-1">Monto Inicial</label>
                  <input 
                    v-model.number="form.currentAmount"
                    type="number" 
                    step="0.01"
                    min="0"
                    class="w-full border border-base-300 rounded-md px-3 py-2 bg-base-100 focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="0.00"
                  >
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-base-content/70 mb-1">Fecha Límite (Opcional)</label>
                  <input 
                    v-model="form.deadline"
                    type="date" 
                    class="w-full border border-base-300 rounded-md px-3 py-2 bg-base-100 focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                </div>
                
                <div class="flex items-center">
                  <input 
                    v-model="form.isActive"
                    type="checkbox" 
                    class="h-4 w-4 text-primary focus:ring-primary border-base-300 rounded"
                  >
                  <label class="ml-2 block text-sm text-base-content">Jarro activo</label>
                </div>
              </div>
            </div>
            
            <div class="bg-base-200 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button 
                type="submit"
                class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary text-base font-medium text-primary-content hover:bg-primary-focus focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:ml-3 sm:w-auto sm:text-sm"
              >
                {{ jar ? 'Actualizar' : 'Crear' }}
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
    <IconPicker 
      v-if="showIconPicker"
      :current-icon="form.icon"
      @close="showIconPicker = false"
      @select="selectIcon"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useIcons } from '@/composables/useIcons'
import IconPicker from './IconPicker.vue'
import type { SavingsJar } from '../types'

interface Props {
  jar?: SavingsJar | null
}

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
  save: [jar: Omit<SavingsJar, 'id' | 'createdAt'>]
}>()

const { getIcon } = useIcons()
const showIconPicker = ref(false)

const form = ref({
  name: '',
  description: '',
  targetAmount: 0,
  currentAmount: 0,
  deadline: '',
  isActive: true,
  icon: 'PiggyBank',
  color: '#10b981'
})

onMounted(() => {
  if (props.jar) {
    form.value = {
      name: props.jar.name,
      description: props.jar.description || '',
      targetAmount: props.jar.targetAmount,
      currentAmount: props.jar.currentAmount,
      deadline: props.jar.deadline || '',
      isActive: props.jar.isActive,
      icon: props.jar.icon || 'PiggyBank',
      color: props.jar.color || '#10b981'
    }
  }
})

const selectIcon = (iconName: string) => {
  form.value.icon = iconName
}

const handleSubmit = () => {
  const jarData = {
    ...form.value,
    description: form.value.description || undefined,
    deadline: form.value.deadline || undefined,
  }
  emit('save', jarData)
}
</script>
