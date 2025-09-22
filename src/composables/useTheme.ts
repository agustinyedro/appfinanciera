import { ref, watch } from 'vue'

const THEME_KEY = 'app-theme'
const availableThemes = [
  { id: 'light-default', name: 'Claro (Defecto)' },
  { id: 'light-mint', name: 'Claro (Menta)' },
  { id: 'dark-default', name: 'Oscuro (Defecto)' },
  { id: 'dark-dracula', name: 'Oscuro (Dracula)' },
]

const currentTheme = ref(localStorage.getItem(THEME_KEY) || 'light-default')

export function useTheme() {
  const setTheme = (theme: string) => {
    currentTheme.value = theme
  }

  const initTheme = () => {
    const savedTheme = localStorage.getItem(THEME_KEY)
    if (savedTheme && availableThemes.some(t => t.id === savedTheme)) {
      currentTheme.value = savedTheme
    } else {
      // Check for user's system preference
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      currentTheme.value = prefersDark ? 'dark-default' : 'light-default'
    }
  }

  watch(currentTheme, (newTheme) => {
    localStorage.setItem(THEME_KEY, newTheme)
    document.documentElement.setAttribute('data-theme', newTheme)
  }, { immediate: true })

  return {
    currentTheme,
    setTheme,
    initTheme,
    availableThemes
  }
}
