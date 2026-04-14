<template>
  <div class="app-layout">
    <header class="app-header">
      <div class="header-left">
        <div class="header-logo">
          <Hospital :size="22" />
        </div>
        <div class="header-info">
          <h1 class="header-title">Agendamiento Medico</h1>
          <div class="header-status">
            <span class="status-dot" :class="{ 'status-dot--online': chatStore.isConnected }" />
            <span class="status-text">
              {{ chatStore.isConnected ? 'En linea' : 'Conectando...' }}
            </span>
          </div>
        </div>
      </div>

      <div class="user-menu" ref="userMenuRef">
        <button class="user-menu-trigger" @click="menuOpen = !menuOpen">
          <div class="user-avatar">
            <User :size="15" />
          </div>
          <span class="user-menu-name">{{ authStore.user?.name }}</span>
          <ChevronDown
            :size="14"
            class="user-menu-chevron"
            :class="{ 'chevron--open': menuOpen }"
          />
        </button>

        <Transition name="dropdown">
          <div v-if="menuOpen" class="user-dropdown">
            <button class="dropdown-item" @click="handleRefresh">
              <RefreshCw :size="14" />
              Actualizar citas
            </button>
            <button class="dropdown-item" @click="handleClearHistory">
              <Trash2 :size="14" />
              Limpiar conversacion
            </button>
            <div class="dropdown-divider" />
            <button class="dropdown-item dropdown-item--danger" @click="handleLogout">
              <LogOut :size="14" />
              Cerrar sesion
            </button>
          </div>
        </Transition>
      </div>
    </header>

    <div class="layout-body">
      <RouterView />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter, RouterView } from 'vue-router'
import {
  Hospital,
  User,
  ChevronDown,
  RefreshCw,
  Trash2,
  LogOut,
} from 'lucide-vue-next'
import { useAuthStore } from '@/stores/authStore'
import { useChatStore } from '@/stores/chatStore'
import { useUiStore } from '@/stores/uiStore'

const router = useRouter()
const authStore = useAuthStore()
const chatStore = useChatStore()
const uiStore = useUiStore()

const userMenuRef = ref<HTMLElement | null>(null)
const menuOpen = ref(false)

function handleRefresh(): void {
  menuOpen.value = false
  uiStore.triggerAppointmentsRefresh()
}

function handleClearHistory(): void {
  menuOpen.value = false
  if (confirm('Deseas limpiar el historial de conversacion?')) {
    chatStore.clearHistory()
  }
}

function handleLogout(): void {
  menuOpen.value = false
  chatStore.disconnect()
  authStore.logout()
  router.push({ name: 'Login' })
}

function onClickOutside(event: MouseEvent): void {
  if (userMenuRef.value && !userMenuRef.value.contains(event.target as Node)) {
    menuOpen.value = false
  }
}

onMounted(() => document.addEventListener('click', onClickOutside))
onUnmounted(() => document.removeEventListener('click', onClickOutside))
</script>

<style scoped>
.app-layout {
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.app-header {
  background: white;
  border-bottom: 1px solid #e8ecf0;
  padding: 0 20px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  z-index: 20;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-logo {
  width: 38px;
  height: 38px;
  border-radius: 11px;
  background: #2563eb;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.header-info {
  display: flex;
  flex-direction: column;
}

.header-title {
  margin: 0;
  font-size: 17px;
  font-weight: 700;
  color: #1a202c;
  line-height: 1.2;
}

.header-status {
  display: flex;
  align-items: center;
  gap: 5px;
}

.status-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #fc8181;
  transition: background 0.3s;
}

.status-dot--online {
  background: #48bb78;
  box-shadow: 0 0 0 2px rgba(72, 187, 120, 0.25);
}

.status-text {
  font-size: 12px;
  color: #718096;
}

/* ── Menú de usuario ── */
.user-menu {
  position: relative;
}

.user-menu-trigger {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 5px 11px 5px 5px;
  background: #f7f9fc;
  border: 1px solid #e2e8f0;
  border-radius: 24px;
  cursor: pointer;
  transition: all 0.2s;
  font-family: 'Roboto', sans-serif;
}

.user-menu-trigger:hover {
  background: #eff6ff;
  border-color: #2563eb;
}

.user-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #2563eb;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.user-menu-name {
  font-size: 13px;
  font-weight: 500;
  color: #2d3748;
}

.user-menu-chevron {
  color: #a0aec0;
  transition: transform 0.2s;
}

.chevron--open {
  transform: rotate(180deg);
}

.user-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  min-width: 200px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  padding: 6px;
  z-index: 100;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 9px 12px;
  border: none;
  background: none;
  border-radius: 8px;
  font-size: 13px;
  color: #4a5568;
  cursor: pointer;
  transition: background 0.15s;
  font-family: 'Roboto', sans-serif;
  text-align: left;
}

.dropdown-item:hover {
  background: #f7f9fc;
  color: #2d3748;
}

.dropdown-item--danger {
  color: #e53e3e;
}

.dropdown-item--danger:hover {
  background: #fff5f5;
  color: #c53030;
}

.dropdown-divider {
  height: 1px;
  background: #f0f4f8;
  margin: 4px 0;
}

.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.15s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-6px) scale(0.97);
}

/* ── Contenido ── */
.layout-body {
  flex: 1;
  overflow: hidden;
  display: flex;
}
</style>
