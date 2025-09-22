<template>
  <div class="space-y-6">
    <h1 class="text-2xl font-bold text-base-content">Gestión</h1>

    <!-- Tabs -->
    <div class="border-b border-base-300">
      <nav class="-mb-px flex space-x-6" aria-label="Tabs">
        <button
          v-for="tab in tabs"
          :key="tab.name"
          @click="activeTab = tab.id"
          :class="[
            activeTab === tab.id
              ? 'border-primary text-primary'
              : 'border-transparent text-base-content/60 hover:text-base-content hover:border-base-content/30',
            'whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors'
          ]"
        >
          {{ tab.name }}
        </button>
      </nav>
    </div>

    <!-- Tab Content -->
    <div>
      <keep-alive>
        <component :is="activeTab === 'accounts' ? AccountsView : SavingsJarsView" />
      </keep-alive>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import AccountsView from './Accounts.vue';
import SavingsJarsView from './SavingsJars.vue';

const activeTab = ref('accounts');

const tabs = [
  { id: 'accounts', name: 'Cuentas' },
  { id: 'savingsJars', name: 'Jarros de Ahorro' },
];
</script>
