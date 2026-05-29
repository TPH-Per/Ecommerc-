import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User } from '@/types/auth.types'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)
  const refreshToken = ref<string | null>(null)

  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const isCustomer = computed(() => user.value?.role === 'customer')
  const isStaff = computed(() => user.value?.role === 'staff')
  const isAdmin = computed(() => user.value?.role === 'admin')

  function login(userData: User, accessToken: string, refresh: string) {
    user.value = userData
    token.value = accessToken
    refreshToken.value = refresh
  }

  function logout() {
    user.value = null
    token.value = null
    refreshToken.value = null
  }

  return {
    user,
    token,
    refreshToken,
    isAuthenticated,
    isCustomer,
    isStaff,
    isAdmin,
    login,
    logout
  }
}, {
  persist: {
    key: 'luminary-auth',
    storage: localStorage,
    // @ts-ignore
    paths: ['token', 'refreshToken', 'user']
  }
})
