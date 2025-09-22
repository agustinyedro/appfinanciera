<template>
  <div>
    <label for="theme-select" class="block text-sm font-medium text-base-content/70 mb-2">
      Tema Visual
    </label>
    <div class="grid grid-cols-2 gap-2">
      <button 
        v-for="theme in availableThemes" 
        :key="theme.id"
        @click="setTheme(theme.id)"
        class="px-3 py-2 text-sm rounded-lg border-2 transition-colors"
        :class="currentTheme === theme.id ? 'border-primary bg-primary/10' : 'border-base-300 hover:border-primary/50'"
      >
        {{ theme.name }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useTheme } from '@/composables/useTheme'

const { currentTheme, setTheme, availableThemes, initTheme } = useTheme()

onMounted(() => {
  initTheme()
})
</script>
