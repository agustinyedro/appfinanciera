import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'
import router from './router'
import { useTheme } from './composables/useTheme'
import { useUser } from './composables/useUser'
import { useDatabaseStore } from './stores/database'

async function main() {
  const { initTheme } = useTheme()
  initTheme()

  const { initUser } = useUser()
  initUser()
  
  const pinia = createPinia()
  const app = createApp(App)
  
  app.use(pinia)
  app.use(router)

  const databaseStore = useDatabaseStore()
  await databaseStore.init()

  app.mount('#app')
}

main()
