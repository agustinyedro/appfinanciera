import { ref, watch } from 'vue'

const USER_KEY = 'app-user'

interface User {
  name: string
  avatarUrl: string
}

const defaultUser: User = {
  name: 'Usuario',
  avatarUrl: 'https://img-wrapper.vercel.app/image?url=https://placehold.co/150x150/3B82F6/FFFFFF/png?text=U'
}

const user = ref<User>(defaultUser)

export function useUser() {
  const initUser = () => {
    const savedUser = localStorage.getItem(USER_KEY)
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser)
        // Merge to ensure all properties exist and avatarUrl is not empty
        user.value = { 
          ...defaultUser, 
          ...parsedUser,
          avatarUrl: parsedUser.avatarUrl || defaultUser.avatarUrl 
        }
      } catch (e) {
        console.error("Failed to parse user from localStorage", e)
        user.value = defaultUser
      }
    } else {
      user.value = defaultUser
    }
  }

  const updateUser = (newUserData: Partial<User>) => {
    user.value = { ...user.value, ...newUserData }
  }

  watch(user, (newUser) => {
    localStorage.setItem(USER_KEY, JSON.stringify(newUser))
  }, { deep: true })

  return {
    user,
    updateUser,
    initUser
  }
}
