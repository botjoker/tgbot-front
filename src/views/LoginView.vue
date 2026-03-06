<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { login as apiLogin } from '../services/api'

const loginInput = ref('')
const passwordInput = ref('')
const error = ref('')
const loading = ref(false)

const auth = useAuthStore()
const router = useRouter()

async function handleSubmit() {
  error.value = ''
  loading.value = true
  try {
    const ok = await apiLogin(loginInput.value, passwordInput.value)
    if (ok) {
      auth.setCredentials(loginInput.value, passwordInput.value)
      router.push('/')
    } else {
      error.value = 'Неверный логин или пароль'
    }
  } catch {
    error.value = 'Ошибка подключения'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="login-container">
    <form @submit.prevent="handleSubmit">
      <h1>TG Bot Admin</h1>
      <input v-model="loginInput" type="text" placeholder="Логин" required />
      <input v-model="passwordInput" type="password" placeholder="Пароль" required />
      <button type="submit" :disabled="loading">
        {{ loading ? 'Вход...' : 'Войти' }}
      </button>
      <p v-if="error" class="error">{{ error }}</p>
    </form>
  </div>
</template>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}
form {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 300px;
}
input, button {
  padding: 10px;
  font-size: 16px;
}
.error { color: red; }
</style>
