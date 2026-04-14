<template>
  <div class="login-page">
    <div class="bg-decoration">
      <div class="bg-circle bg-circle--1" />
      <div class="bg-circle bg-circle--2" />
      <div class="bg-circle bg-circle--3" />
    </div>

    <div class="login-container">
      <div class="login-card">
        <h2 class="login-title">Iniciar Sesion</h2>
        <p class="login-description">Accede para gestionar tus citas medicas</p>

        <form class="login-form" @submit.prevent="handleLogin">
          <div class="form-group">
            <label class="form-label" for="username">RUT</label>
            <div class="input-wrapper">
              <User :size="16" class="input-icon" />
              <input
                id="username"
                v-model="form.username"
                type="text"
                class="form-input"
                placeholder="Ingresa tu RUT sin puntos ni guion"
                autocomplete="username"
                :disabled="loading"
                required
              />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label" for="password">Contrasena</label>
            <div class="input-wrapper">
              <Lock :size="16" class="input-icon" />
              <input
                id="password"
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                class="form-input"
                placeholder="Ingresa tu contrasena"
                autocomplete="current-password"
                :disabled="loading"
                required
              />
              <button
                type="button"
                class="toggle-password"
                @click="showPassword = !showPassword"
                :title="showPassword ? 'Ocultar' : 'Mostrar'"
              >
                <EyeOff v-if="showPassword" :size="16" />
                <Eye v-else :size="16" />
              </button>
            </div>
          </div>

          <Transition name="fade">
            <div v-if="errorMsg" class="login-error">
              <AlertTriangle :size="15" />
              <span>{{ errorMsg }}</span>
            </div>
          </Transition>

          <button
            type="submit"
            class="login-btn"
            :disabled="loading || !form.username || !form.password"
          >
            <span v-if="loading" class="btn-spinner" />
            <span v-else>Ingresar</span>
          </button>
        </form>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { User, Lock, Eye, EyeOff, AlertTriangle } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/authStore'

const router = useRouter()
const authStore = useAuthStore()

const form = reactive({ username: '', password: '' })
const loading = ref(false)
const errorMsg = ref('')
const showPassword = ref(false)

async function handleLogin(): Promise<void> {
  loading.value = true
  errorMsg.value = ''

  try {
    await authStore.login(form.username, form.password)
    router.push({ name: 'Chat' })
  } catch (err: unknown) {
    errorMsg.value = err instanceof Error ? err.message : 'Error al iniciar sesion'
  } finally {
    loading.value = false
  }
}

</script>

<style scoped>
.login-page {
  min-height: 100vh;
  background: #2563eb;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  position: relative;
  overflow: hidden;
}

.bg-decoration {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.bg-circle {
  position: absolute;
  border-radius: 50%;
  opacity: 0.12;
  background: white;
}

.bg-circle--1 { width: 400px; height: 400px; top: -100px; right: -100px; }
.bg-circle--2 { width: 300px; height: 300px; bottom: -80px; left: -80px; }
.bg-circle--3 { width: 200px; height: 200px; top: 50%; left: 10%; transform: translateY(-50%); }

.login-container {
  width: 100%;
  max-width: 420px;
  position: relative;
  z-index: 1;
}


.login-card {
  background: white;
  border-radius: 24px;
  padding: 36px 32px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
}

.login-title {
  margin: 0 0 6px;
  font-size: 22px;
  font-weight: 700;
  color: #1a202c;
}

.login-description {
  margin: 0 0 28px;
  font-size: 14px;
  color: #718096;
  font-weight: 300;
}

.form-group {
  margin-bottom: 20px;
}

.form-label {
  display: block;
  font-size: 13px;
  font-weight: 500;
  color: #4a5568;
  margin-bottom: 8px;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 13px;
  color: #a0aec0;
  pointer-events: none;
  z-index: 1;
}

.form-input {
  width: 100%;
  padding: 11px 12px 11px 40px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 14px;
  font-family: 'Roboto', sans-serif;
  color: #2d3748;
  background: #f7f9fc;
  outline: none;
  transition: all 0.2s;
  box-sizing: border-box;
}

.form-input:focus {
  border-color: #2563eb;
  background: white;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);
}

.form-input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.toggle-password {
  position: absolute;
  right: 10px;
  background: none;
  border: none;
  cursor: pointer;
  color: #a0aec0;
  display: flex;
  align-items: center;
  padding: 4px;
  transition: color 0.2s;
}

.toggle-password:hover {
  color: #2563eb;
}

.login-error {
  background: #fff5f5;
  border: 1px solid #fc8181;
  border-radius: 10px;
  padding: 10px 14px;
  font-size: 13px;
  color: #c53030;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.login-btn {
  width: 100%;
  padding: 13px;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 500;
  font-family: 'Roboto', sans-serif;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(37, 99, 235, 0.2);
  min-height: 46px;
}

.login-btn:hover:not(:disabled) {
  background: #1d4ed8;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
}

.login-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.btn-spinner {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.4);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}


.fade-enter-active,
.fade-leave-active {
  transition: all 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
