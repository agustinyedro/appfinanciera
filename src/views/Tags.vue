<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-base-content">Categorías</h1>
      <button 
        @click="showAddTag = true"
        class="bg-primary text-primary-content px-4 py-2 rounded-lg hover:bg-primary-focus transition-colors flex items-center"
      >
        <Plus class="mr-2 h-4 w-4" />
        Nueva Categoría
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Income Tags -->
      <div class="bg-base-100 rounded-lg shadow-sm border border-base-300">
        <div class="p-6 border-b border-base-300">
          <h2 class="text-lg font-semibold text-base-content flex items-center">
            <TrendingUp class="mr-2 h-5 w-5 text-success" />
            Categorías de Ingresos
          </h2>
        </div>
        <div class="p-6">
          <div v-if="incomeTags.length === 0" class="text-center py-8 text-base-content/60">
            No hay categorías de ingresos
          </div>
          <div v-else class="space-y-3">
            <div 
              v-for="tag in incomeTags" 
              :key="tag.id"
              class="flex items-center justify-between p-3 bg-base-200 rounded-lg"
            >
              <div class="flex items-center">
                <div 
                  class="w-8 h-8 rounded-lg mr-3 flex items-center justify-center"
                  :style="{ backgroundColor: `${tag.color}20` }"
                >
                  <component :is="getIcon(tag.icon || 'TrendingUp')" class="h-5 w-5" :style="{ color: tag.color }" />
                </div>
                <span class="font-medium text-base-content">{{ tag.name }}</span>
              </div>
              <div class="flex items-center space-x-2">
                <button 
                  @click="editTag(tag)"
                  class="text-base-content/50 hover:text-base-content"
                >
                  <Edit class="h-4 w-4" />
                </button>
                <button 
                  @click="confirmDelete(tag.id)"
                  class="text-error/70 hover:text-error"
                >
                  <Trash2 class="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Expense Tags -->
      <div class="bg-base-100 rounded-lg shadow-sm border border-base-300">
        <div class="p-6 border-b border-base-300">
          <h2 class="text-lg font-semibold text-base-content flex items-center">
            <TrendingDown class="mr-2 h-5 w-5 text-error" />
            Categorías de Gastos
          </h2>
        </div>
        <div class="p-6">
          <div v-if="expenseTags.length === 0" class="text-center py-8 text-base-content/60">
            No hay categorías de gastos
          </div>
          <div v-else class="space-y-3">
            <div 
              v-for="tag in expenseTags" 
              :key="tag.id"
              class="flex items-center justify-between p-3 bg-base-200 rounded-lg"
            >
              <div class="flex items-center">
                <div 
                  class="w-8 h-8 rounded-lg mr-3 flex items-center justify-center"
                  :style="{ backgroundColor: `${tag.color}20` }"
                >
                  <component :is="getIcon(tag.icon || 'TrendingDown')" class="h-5 w-5" :style="{ color: tag.color }" />
                </div>
                <span class="font-medium text-base-content">{{ tag.name }}</span>
              </div>
              <div class="flex items-center space-x-2">
                <button 
                  @click="editTag(tag)"
                  class="text-base-content/50 hover:text-base-content"
                >
                  <Edit class="h-4 w-4" />
                </button>
                <button 
                  @click="confirmDelete(tag.id)"
                  class="text-error/70 hover:text-error"
                >
                  <Trash2 class="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit Tag Modal -->
    <TagModal 
      v-if="showAddTag || editingTag"
      :tag="editingTag"
      @close="closeModal"
      @save="handleSaveTag"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useDatabaseStore } from '@/stores/database'
import { storeToRefs } from 'pinia'
import { useIcons } from '@/composables/useIcons'
import { Plus, Edit, Trash2, TrendingUp, TrendingDown } from 'lucide-vue-next'
import TagModal from '../components/TagModal.vue'
import type { Tag } from '../types'

const databaseStore = useDatabaseStore()
const { tags } = storeToRefs(databaseStore)
const { getIcon } = useIcons()

const showAddTag = ref(false)
const editingTag = ref<Tag | null>(null)

const incomeTags = computed(() => {
  return tags.value.filter(t => t.category === 'ingreso')
})

const expenseTags = computed(() => {
  return tags.value.filter(t => t.category === 'gasto')
})

const editTag = (tag: Tag) => {
  editingTag.value = { ...tag }
}

const closeModal = () => {
  showAddTag.value = false
  editingTag.value = null
}

const handleSaveTag = (tagData: Omit<Tag, 'id' | 'createdAt'>) => {
  if (editingTag.value) {
    databaseStore.updateTag(editingTag.value.id, tagData)
  } else {
    databaseStore.addTag(tagData)
  }
  closeModal()
}

const confirmDelete = (id: string) => {
  if (confirm('¿Estás seguro de que quieres eliminar esta categoría?')) {
    databaseStore.deleteTag(id)
  }
}
</script>
