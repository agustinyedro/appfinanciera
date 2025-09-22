<template>
  <div v-if="debugEnabled" class="fixed bottom-24 lg:bottom-4 left-4 z-[100] bg-neutral text-neutral-content p-4 rounded-lg shadow-2xl text-xs font-mono max-w-xs w-full">
    <div class="flex justify-between items-center mb-2">
      <h4 class="font-bold text-sm">Theme Debugger</h4>
      <button @click="debugEnabled = false" class="text-neutral-content/50 hover:text-neutral-content text-lg leading-none">&times;</button>
    </div>
    <p><strong>Current Theme:</strong> {{ currentTheme }}</p>
    <p><strong>HTML Attr:</strong> data-theme="{{ htmlTheme }}"</p>
    <div class="mt-2 pt-2 border-t border-neutral-focus">
      <p>--color-base-100: <span class="font-bold">{{ base100Color }}</span></p>
      <div class="w-full h-4 mt-1 rounded border border-neutral-focus" :style="{ backgroundColor: `rgb(${base100Color})` }"></div>
    </div>
    <div class="mt-2 pt-2 border-t border-neutral-focus">
      <p>--color-base-200: <span class="font-bold">{{ base200Color }}</span></p>
      <div class="w-full h-4 mt-1 rounded border border-neutral-focus" :style="{ backgroundColor: `rgb(${base200Color})` }"></div>
    </div>
     <div class="mt-2 pt-2 border-t border-neutral-focus">
      <p>--color-base-content: <span class="font-bold">{{ baseContentColor }}</span></p>
      <div class="w-full h-4 mt-1 rounded border border-neutral-focus" :style="{ backgroundColor: `rgb(${baseContentColor})` }"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useTheme } from '@/composables/useTheme';
import { ref, onMounted, watch } from 'vue';

const { currentTheme } = useTheme();
const debugEnabled = ref(true);
const htmlTheme = ref('');
const base100Color = ref('');
const base200Color = ref('');
const baseContentColor = ref('');

const updateDebugInfo = () => {
  if (typeof window === 'undefined') return;
  htmlTheme.value = document.documentElement.getAttribute('data-theme') || 'not set';
  const styles = getComputedStyle(document.documentElement);
  base100Color.value = styles.getPropertyValue('--color-base-100').trim();
  base200Color.value = styles.getPropertyValue('--color-base-200').trim();
  baseContentColor.value = styles.getPropertyValue('--color-base-content').trim();
};

onMounted(() => {
  updateDebugInfo();
  const observer = new MutationObserver(updateDebugInfo);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  watch(currentTheme, updateDebugInfo, { immediate: true });
});
</script>
