<template>
  <div class="lg:hidden fixed bottom-0 left-0 right-0 h-20 bg-base-100 border-t border-base-300 z-40">
    <div class="grid grid-cols-5 items-center h-full">
      <!-- First two items -->
      <router-link
        v-for="item in navigation.slice(0, 2)"
        :key="item.name"
        :to="item.path"
        class="flex flex-col items-center justify-center w-full h-full transition-colors"
        :class="$route.path.startsWith(item.path) && (item.path !== '/' || $route.path === '/') ? 'text-primary' : 'text-base-content/60 hover:text-base-content'"
      >
        <component :is="item.icon" class="h-6 w-6 mb-1" />
        <span class="text-xs font-medium">{{ item.name }}</span>
      </router-link>

      <!-- Central FAB -->
      <div class="flex items-center justify-center w-full h-full">
        <button
          @click="showAddTransaction = true"
          class="bg-primary text-primary-content rounded-full w-16 h-16 flex items-center justify-center shadow-lg -mt-8 border-4 border-base-100 hover:bg-primary-focus transition-transform active:scale-95"
        >
          <Plus class="h-8 w-8" />
        </button>
      </div>

      <!-- Last two items -->
      <router-link
        v-for="item in navigation.slice(2)"
        :key="item.name"
        :to="item.path"
        class="flex flex-col items-center justify-center w-full h-full transition-colors"
        :class="$route.path.startsWith(item.path) && (item.path !== '/' || $route.path === '/') ? 'text-primary' : 'text-base-content/60 hover:text-base-content'"
      >
        <component :is="item.icon" class="h-6 w-6 mb-1" />
        <span class="text-xs font-medium">{{ item.name }}</span>
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { showAddTransaction } from '@/composables/useModal'
import { 
  LayoutDashboard, 
  Wallet,
  BarChart3, 
  Settings,
  Plus
} from 'lucide-vue-next'

const navigation = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Gestión', path: '/gestion', icon: Wallet },
  { name: 'Reportes', path: '/reportes', icon: BarChart3 },
  { name: 'Ajustes', path: '/ajustes', icon: Settings },
];
</script>
