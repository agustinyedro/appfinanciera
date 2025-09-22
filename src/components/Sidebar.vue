<template>
  <div class="hidden lg:flex flex-col fixed inset-y-0 left-0 z-50 w-64 bg-base-100 shadow-lg border-r border-base-300">
    <div class="flex h-16 items-center justify-center px-6 border-b border-base-300">
      <h1 class="text-xl font-bold text-primary flex items-center">
        <Wallet class="mr-2 h-6 w-6"/>
        <span>Finanzas</span>
      </h1>
    </div>
    
    <nav class="mt-6 px-3 flex-grow">
      <router-link
        v-for="item in navigation"
        :key="item.name"
        :to="item.path"
        class="flex items-center px-3 py-2 mt-2 text-base font-medium rounded-lg transition-colors"
        :class="$route.path.startsWith(item.path) && (item.path !== '/' || $route.path === '/')
          ? 'bg-primary/10 text-primary' 
          : 'text-base-content/80 hover:bg-base-200 hover:text-base-content'"
      >
        <component :is="item.icon" class="mr-3 h-5 w-5" />
        {{ item.name }}
      </router-link>
    </nav>
    
    <div class="px-4 pb-4">
      <ThemeSelector />
    </div>
  </div>
</template>

<script setup lang="ts">
import { 
  LayoutDashboard, 
  Wallet, 
  Settings,
  BarChart3,
  ArrowLeftRight
} from 'lucide-vue-next'
import ThemeSelector from './ThemeSelector.vue'

const navigation = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Gestión', path: '/gestion', icon: Wallet },
  { name: 'Transacciones', path: '/transacciones', icon: ArrowLeftRight },
  { name: 'Reportes', path: '/reportes', icon: BarChart3 },
  { name: 'Ajustes', path: '/ajustes', icon: Settings }
]
</script>
