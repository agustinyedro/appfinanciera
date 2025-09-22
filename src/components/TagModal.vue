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
                  {{ tag ? 'Editar Categoría' : 'Nueva Categoría' }}
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
                    placeholder="Nombre de la categoría"
                  >
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-base-content/70 mb-1">Tipo</label>
                  <select 
                    v-model="form.category"
                    required
                    class="w-full border border-base-300 rounded-md px-3 py-2 bg-base-100 focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="ingreso">Ingreso</option>
                    <option value="gasto">Gasto</option>
                  </select>
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-base-content/70 mb-1">Icono y Color</label>
                  <div class="flex items-center space-x-2">
                    <button type="button" @click="showIconPicker = true" class="w-12 h-10 flex items-center justify-center border border-base-300 rounded-md bg-base-100">
                      <component :is="getIcon(form.icon || 'Tags')" class="h-6 w-6 text-base-content" />
                    </button>
                    <input 
                      v-model="form.color"
                      type="color"
                      class="h-10 w-20 border border-base-300 rounded-md cursor-pointer"
                    >
                    <input 
                      v-model="form.color"
                      type="text" 
                      class="flex-1 border border-base-300 rounded-md px-3 py-2 bg-base-100 focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="#ff0000"
                    >
                  </div>
                </div>
                
                <div class="flex items-center justify-center p-4 bg-base-200 rounded-lg">
                  <div class="flex items-center">
                    <div 
                      class="w-8 h-8 rounded-lg mr-3 flex items-center justify-center"
                      :style="{ backgroundColor: `${form.color}20` }"
                    >
                      <component :is="getIcon(form.icon || 'Tags')" class="h-5 w-5" :style="{ color: form.color }" />
                    </div>
                    <span class="text-base-content">{{ form.name || 'Vista previa' }}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="bg-base-200 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button 
                type="submit"
                class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary text-base font-medium text-primary-content hover:bg-primary-focus focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:ml-3 sm:w-auto sm:text-sm"
              >
                {{ tag ? 'Actualizar' : 'Crear' }}
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
import type { Tag } from '../types'

interface Props {
  tag?: Tag | null
}

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
  save: [tag: Omit<Tag, 'id' | 'createdAt'>]
}>()

const { getIcon } = useIcons()
const showIconPicker = ref(false)

const form = ref({
  name: '',
  category: 'gasto' as const,
  color: '#ef4444',
  icon: 'Tags'
})

onMounted(() => {
  if (props.tag) {
    form.value = {
      name: props.tag.name,
      category: props.tag.category,
      color: props.tag.color,
      icon: props.tag.icon || 'Tags'
    }
  }
})

const selectIcon = (iconName: string) => {
  form.value.icon = iconName
}

const handleSubmit = () => {
  emit('save', form.value)
}
</script>
