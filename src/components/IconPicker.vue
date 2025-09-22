<template>
  <div class="fixed inset-0 z-[60] overflow-y-auto">
    <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <div class="fixed inset-0 bg-base-content/30 backdrop-blur-sm transition-opacity" @click="$emit('close')"></div>
      
      <div class="inline-block align-bottom bg-base-100 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
        <div class="bg-base-100 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div class="mb-4">
            <h3 class="text-lg font-medium text-base-content">
              Seleccionar Icono
            </h3>
          </div>
          
          <div class="max-h-96 overflow-y-auto">
            <div class="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-2">
              <button 
                v-for="iconName in iconList" 
                :key="iconName"
                @click="selectIcon(iconName)"
                class="flex items-center justify-center p-3 rounded-lg hover:bg-base-200 transition-colors"
                :class="{ 'bg-primary/20 ring-2 ring-primary': selectedIcon === iconName }"
              >
                <component :is="iconMap[iconName]" class="h-6 w-6 text-base-content" />
              </button>
            </div>
          </div>
        </div>
        
        <div class="bg-base-200 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button 
            type="button"
            @click="$emit('close')"
            class="mt-3 w-full inline-flex justify-center rounded-md border border-base-300 shadow-sm px-4 py-2 bg-base-100 text-base font-medium text-base-content hover:bg-base-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useIcons } from '@/composables/useIcons'

const props = defineProps<{
  currentIcon?: string
}>()

const emit = defineEmits<{
  close: []
  select: [iconName: string]
}>()

const { iconList, iconMap } = useIcons()
const selectedIcon = ref(props.currentIcon)

const selectIcon = (iconName: string) => {
  selectedIcon.value = iconName
  emit('select', iconName)
  emit('close')
}
</script>
