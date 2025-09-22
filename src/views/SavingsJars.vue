<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h2 class="text-xl font-bold text-base-content">Mis Jarros de Ahorro</h2>
      <button 
        @click="showAddJar = true"
        class="bg-primary text-primary-content px-4 py-2 rounded-lg hover:bg-primary-focus transition-colors flex items-center"
      >
        <Plus class="mr-2 h-4 w-4" />
        Nuevo Jarro
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div 
        v-for="jar in savingsJars" 
        :key="jar.id"
        class="bg-base-100 p-6 rounded-lg shadow-sm border border-base-300"
      >
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center">
            <div 
              class="p-2 rounded-lg"
              :style="{ backgroundColor: jar.color ? `${jar.color}20` : 'rgba(var(--color-accent), 0.1)' }"
            >
              <component 
                :is="getIcon(jar.icon || 'PiggyBank')" 
                class="h-6 w-6"
                :style="{ color: jar.color || 'rgb(var(--color-accent))' }"
              />
            </div>
            <div class="ml-3">
              <h3 class="font-semibold text-base-content">{{ jar.name }}</h3>
              <p class="text-sm text-base-content/70">{{ jar.description || 'Sin descripción' }}</p>
            </div>
          </div>
          <button 
            @click="editJar(jar)"
            class="text-base-content/50 hover:text-base-content"
          >
            <Edit class="h-4 w-4" />
          </button>
        </div>
        
        <div class="mb-4">
          <div class="flex justify-between items-center mb-2">
            <span class="text-sm text-base-content/70">Progreso</span>
            <span class="text-sm font-medium">{{ getProgressPercentage(jar) }}%</span>
          </div>
          <div class="w-full bg-base-300 rounded-full h-2">
            <div 
              class="h-2 rounded-full transition-all duration-300"
              :style="{ width: getProgressPercentage(jar) + '%', backgroundColor: jar.color || 'rgb(var(--color-accent))' }"
            ></div>
          </div>
        </div>
        
        <div class="text-center mb-4">
          <p class="text-2xl font-bold text-base-content">${{ jar.currentAmount.toFixed(2) }}</p>
          <p class="text-sm text-base-content/70">de ${{ jar.targetAmount.toFixed(2) }}</p>
          <p v-if="jar.deadline" class="text-xs text-base-content/60 mt-1">
            Fecha límite: {{ formatDate(jar.deadline) }}
          </p>
        </div>
        
        <div class="flex space-x-2">
          <button 
            @click="addMoney(jar)"
            class="flex-1 bg-success/10 text-success px-3 py-2 rounded text-sm hover:bg-success/20 transition-colors"
          >
            Agregar
          </button>
          <button 
            @click="withdrawMoney(jar)"
            class="flex-1 bg-warning/10 text-warning px-3 py-2 rounded text-sm hover:bg-warning/20 transition-colors"
          >
            Retirar
          </button>
          <button 
            @click="confirmDelete(jar.id)"
            class="bg-error/10 text-error px-3 py-2 rounded text-sm hover:bg-error/20 transition-colors"
          >
            <Trash2 class="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>

    <!-- Add/Edit Jar Modal -->
    <SavingsJarModal 
      v-if="showAddJar || editingJar"
      :jar="editingJar"
      @close="closeModal"
      @save="handleSaveJar"
    />

    <!-- Money Transaction Modal -->
    <MoneyModal 
      v-if="showMoneyModal"
      :title="moneyModalTitle"
      @close="showMoneyModal = false"
      @save="handleMoneyTransaction"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useDatabaseStore } from '@/stores/database'
import { storeToRefs } from 'pinia'
import { useIcons } from '@/composables/useIcons'
import { Plus, Edit, Trash2 } from 'lucide-vue-next'
import SavingsJarModal from '../components/SavingsJarModal.vue'
import MoneyModal from '../components/MoneyModal.vue'
import type { SavingsJar } from '../types'

const databaseStore = useDatabaseStore()
const { savingsJars } = storeToRefs(databaseStore)
const { getIcon } = useIcons()

const showAddJar = ref(false)
const editingJar = ref<SavingsJar | null>(null)
const showMoneyModal = ref(false)
const moneyModalTitle = ref('')
const selectedJar = ref<SavingsJar | null>(null)
const isWithdrawing = ref(false)

const getProgressPercentage = (jar: SavingsJar) => {
  if (jar.targetAmount === 0) return 0
  return Math.min(Math.round((jar.currentAmount / jar.targetAmount) * 100), 100)
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('es-ES')
}

const editJar = (jar: SavingsJar) => {
  editingJar.value = { ...jar }
}

const closeModal = () => {
  showAddJar.value = false
  editingJar.value = null
}

const handleSaveJar = (jarData: Omit<SavingsJar, 'id' | 'createdAt'>) => {
  if (editingJar.value) {
    databaseStore.updateSavingsJar(editingJar.value.id, jarData)
  } else {
    databaseStore.addSavingsJar(jarData)
  }
  closeModal()
}

const addMoney = (jar: SavingsJar) => {
  selectedJar.value = jar
  moneyModalTitle.value = `Agregar dinero a ${jar.name}`
  isWithdrawing.value = false
  showMoneyModal.value = true
}

const withdrawMoney = (jar: SavingsJar) => {
  selectedJar.value = jar
  moneyModalTitle.value = `Retirar dinero de ${jar.name}`
  isWithdrawing.value = true
  showMoneyModal.value = true
}

const handleMoneyTransaction = (amount: number) => {
  if (selectedJar.value) {
    const newAmount = isWithdrawing.value 
      ? Math.max(0, selectedJar.value.currentAmount - amount)
      : selectedJar.value.currentAmount + amount
    
    databaseStore.updateSavingsJar(selectedJar.value.id, { currentAmount: newAmount })
  }
  showMoneyModal.value = false
  selectedJar.value = null
}

const confirmDelete = (id: string) => {
  if (confirm('¿Estás seguro de que quieres eliminar este jarro de ahorro?')) {
    databaseStore.deleteSavingsJar(id)
  }
}
</script>
