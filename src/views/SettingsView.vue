<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import { fetchSettings, updateSetting } from '../services/api'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const router = useRouter()
const prompt = ref('')
const saved = ref(false)
const loading = ref(false)
const error = ref('')

onMounted(async () => {
  try {
    const settings = await fetchSettings(auth.credentials.login, auth.credentials.password)
    prompt.value = settings.prompt || ''
  } catch {
    error.value = 'Не удалось загрузить настройки'
  }
})

async function handleSave() {
  error.value = ''
  saved.value = false
  loading.value = true
  try {
    await updateSetting('prompt', prompt.value, auth.credentials)
    saved.value = true
    setTimeout(() => (saved.value = false), 2000)
  } catch {
    error.value = 'Не удалось сохранить'
  } finally {
    loading.value = false
  }
}

function handleLogout() {
  auth.logout()
  router.push('/login')
}
</script>

<template>
  <div class="settings-container">
    <div class="header">
      <h1>Настройки бота</h1>
      <button @click="handleLogout" class="logout">Выйти</button>
    </div>

    <label>Системный промпт</label>
    <textarea v-model="prompt" rows="10" placeholder="Введите системный промпт..."></textarea>

    <button @click="handleSave" :disabled="loading">
      {{ loading ? 'Сохранение...' : 'Сохранить' }}
    </button>

    <p v-if="saved" class="success">Сохранено!</p>
    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<style scoped>
.settings-container {
  max-width: 700px;
  margin: 40px auto;
  padding: 0 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
textarea {
  width: 100%;
  padding: 10px;
  font-size: 15px;
  resize: vertical;
}
button {
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  align-self: flex-start;
}
.logout {
  background: none;
  border: 1px solid #ccc;
}
.success { color: green; }
.error { color: red; }
</style>
