import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const STORAGE_KEY = 'tgbot_auth'

export const useAuthStore = defineStore('auth', () => {
  const stored = localStorage.getItem(STORAGE_KEY)
  const _login = ref(stored ? JSON.parse(stored).login : '')
  const _password = ref(stored ? JSON.parse(stored).password : '')

  const isAuthenticated = computed(() => !!_login.value && !!_password.value)
  const credentials = computed(() => ({ login: _login.value, password: _password.value }))

  function setCredentials(login: string, password: string) {
    _login.value = login
    _password.value = password
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ login, password }))
  }

  function logout() {
    _login.value = ''
    _password.value = ''
    localStorage.removeItem(STORAGE_KEY)
  }

  return { isAuthenticated, credentials, setCredentials, logout }
})
