<template>
  <div class="min-h-screen bg-base-200 text-base-content font-sans">
    <Sidebar />
    <div class="lg:pl-64 flex flex-col min-h-screen">
      <Header />
      <main class="flex-grow p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8">
        <router-view />
      </main>
    </div>
    <BottomNav />
    <TransactionModal
      v-if="showAddTransaction"
      @close="showAddTransaction = false"
      @save="handleSaveTransaction"
    />
    <DebugTheme />
  </div>
</template>

<script setup lang="ts">
import Sidebar from './components/Sidebar.vue'
import Header from './components/Header.vue'
import BottomNav from './components/BottomNav.vue'
import TransactionModal from './components/TransactionModal.vue'
import DebugTheme from './components/DebugTheme.vue'
import { showAddTransaction } from '@/composables/useModal'
import { useDatabaseStore } from '@/stores/database'
import type { Transaction } from './types'

const databaseStore = useDatabaseStore()

const handleSaveTransaction = (transactionData: Omit<Transaction, 'id' | 'createdAt'>) => {
  databaseStore.addTransaction(transactionData)
  showAddTransaction.value = false
}
</script>

<style>
  .font-sans {
    font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
  }
</style>
