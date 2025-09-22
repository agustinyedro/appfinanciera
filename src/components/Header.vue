<template>
  <header class="h-16 flex-shrink-0 flex items-center justify-between lg:justify-end px-4 sm:px-6 lg:px-8 bg-base-100/80 backdrop-blur-sm sticky top-0 z-30 border-b border-base-300">
    <div class="flex items-center lg:hidden">
      <button @click="sidebarOpen = !sidebarOpen" class="text-base-content">
        <Menu class="h-6 w-6" />
      </button>
      <h1 class="text-lg font-bold text-base-content ml-4">{{ pageTitle }}</h1>
    </div>

    <div class="flex items-center">
      <button @click="toggleTheme" class="p-2 rounded-full hover:bg-base-200">
        <Sun v-if="currentTheme.includes('light')" class="h-5 w-5 text-base-content"/>
        <Moon v-else class="h-5 w-5 text-base-content"/>
      </button>
      <div class="ml-4">
        <img 
          class="h-9 w-9 rounded-full object-cover" 
          src="https://i.pravatar.cc/150?u=a042581f4e29026704d" 
          alt="User avatar"
        >
      </div>
    </div>
  </header>

  <!-- Mobile Sidebar -->
  <div 
    v-if="sidebarOpen" 
    class="lg:hidden fixed inset-0 z-40"
    @click="sidebarOpen = false"
  >
    <div class="fixed inset-0 bg-black/30"></div>
    <div 
      class="fixed inset-y-0 left-0 w-64 bg-base-100 shadow-lg p-4"
      @click.stop
    >
      <div class="flex h-16 items-center justify-center px-6 -mt-4">
        <h1 class="text-xl font-bold text-primary flex items-center">
          <Wallet class="mr-2 h-6 w-6"/>
          <span>Finanzas</span>
        </h1>
      </div>
      <nav class="mt-6">
        <router-link
          v-for="item in navigation"
          :key="item.name"
          :to="item.path"
          @click="sidebarOpen = false"
          class="flex items-center px-3 py-2 mt-2 text-base font-medium rounded-lg transition-colors"
          :class="$route.path === item.path 
            ? 'bg-primary/10 text-primary' 
            : 'text-base-content/80 hover:bg-base-200 hover:text-base-content'"
        >
          <component :is="item.icon" class="mr-3 h-5 w-5" />
          {{ item.name }}
        </router-link>
      </nav>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useTheme } from '@/composables/useTheme'
import { 
  Menu, Sun, Moon, Wallet, LayoutDashboard, PiggyBank, 
  ArrowLeftRight, Tags as TagsIcon, Settings 
} from 'lucide-vue-next'

const route = useRoute()
const sidebarOpen = ref(false)
const { currentTheme, setTheme, availableThemes } = useTheme()

const pageTitle = computed(() => route.name?.toString() || 'Dashboard')

const navigation = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Cuentas', path: '/cuentas', icon: Wallet },
  { name: 'Jarros de Ahorro', path: '/ahorros', icon: PiggyBank },
  { name: 'Transacciones', path: '/transacciones', icon: ArrowLeftRight },
  { name: 'Categorías', path: '/categorias', icon: TagsIcon },
  { name: 'Ajustes', path: '/ajustes', icon: Settings }
]

const toggleTheme = () => {
  const isDark = currentTheme.value.includes('dark');
  const newTheme = isDark ? 'light-default' : 'dark-default';
  setTheme(newTheme);
}
</script>
