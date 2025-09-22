<template>
  <header class="h-16 flex-shrink-0 flex items-center justify-between px-4 sm:px-6 lg:px-8 bg-base-100 sticky top-0 z-30 border-b border-base-300">
    <div class="flex items-center lg:hidden">
      <h1 class="text-lg font-bold text-base-content">{{ pageTitle }}</h1>
    </div>
    
    <div class="hidden lg:block"></div>

    <div class="flex items-center">
      <button @click="toggleTheme" class="p-2 rounded-full hover:bg-base-200">
        <Sun v-if="currentTheme.includes('light')" class="h-5 w-5 text-base-content"/>
        <Moon v-else class="h-5 w-5 text-base-content"/>
      </button>
      <Menu as="div" class="relative ml-4">
        <MenuButton class="flex text-sm bg-gray-800 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
          <span class="sr-only">Open user menu</span>
          <img 
            class="h-9 w-9 rounded-full object-cover" 
            :src="user.avatarUrl" 
            alt="User avatar"
          >
        </MenuButton>
        <transition
          enter-active-class="transition duration-100 ease-out"
          enter-from-class="transform scale-95 opacity-0"
          enter-to-class="transform scale-100 opacity-100"
          leave-active-class="transition duration-75 ease-in"
          leave-from-class="transform scale-100 opacity-100"
          leave-to-class="transform scale-95 opacity-0"
        >
          <MenuItems class="absolute right-0 w-48 py-1 mt-2 origin-top-right bg-base-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <MenuItem v-slot="{ active }">
              <router-link 
                to="/ajustes" 
                :class="[active ? 'bg-base-200' : '', 'block px-4 py-2 text-sm text-base-content']"
              >
                Ajustes
              </router-link>
            </MenuItem>
          </MenuItems>
        </transition>
      </Menu>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useTheme } from '@/composables/useTheme'
import { useUser } from '@/composables/useUser'
import { Sun, Moon } from 'lucide-vue-next'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'

const route = useRoute()
const { currentTheme, setTheme } = useTheme()
const { user } = useUser()

const pageTitle = computed(() => route.name?.toString() || 'Dashboard')

const toggleTheme = () => {
  const isDark = currentTheme.value.includes('dark');
  const newTheme = isDark ? 'light-default' : 'dark-default';
  setTheme(newTheme);
}
</script>
