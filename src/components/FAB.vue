<template>
  <div class="lg:hidden fixed bottom-6 right-6 z-40">
    <button 
      @click="showAddTransaction = true"
      class="w-14 h-14 bg-primary text-primary-content rounded-full shadow-lg flex items-center justify-center hover:bg-primary-focus focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-focus transition-transform active:scale-95"
    >
      <Plus class="h-7 w-7" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { Plus } from 'lucide-vue-next'
import { showAddTransaction } from '@/composables/useModal'
</script>
