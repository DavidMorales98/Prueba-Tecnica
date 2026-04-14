import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User } from '@/types'
import { login as apiLogin, getToken, getStoredUser, clearSession } from '@/services/authService'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(getToken())
  const user = ref<User | null>(getStoredUser())

  const isAuthenticated = computed(() => !!token.value)

  async function login(username: string, password: string): Promise<void> {
    const data = await apiLogin(username, password)
    token.value = data.token
    user.value = data.user
  }

  function logout(): void {
    clearSession()
    token.value = null
    user.value = null
  }

  return { token, user, isAuthenticated, login, logout }
})
