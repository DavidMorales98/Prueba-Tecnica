<template>
  <div class="chat-layout">
    <main class="chat-main">
      <div ref="messagesContainer" class="messages-area">
        <div v-if="chatStore.messages.length === 0" class="welcome-screen">
          <div class="welcome-icon">
            <Bot :size="56" />
          </div>
          <h2>Hola, {{ authStore.user?.name }}</h2>
          <p>Soy tu asistente de agendamiento medico</p>
          <div class="quick-actions">
            <button
              v-for="action in quickActions"
              :key="action.label"
              class="quick-action-btn"
              @click="sendQuickAction(action.message)"
            >
              <component :is="action.icon" :size="15" />
              {{ action.label }}
            </button>
          </div>
        </div>

        <template v-else>
          <ChatMessage
            v-for="message in chatStore.messages"
            :key="message.id"
            :message="message"
          />
        </template>

        <TypingIndicator v-if="chatStore.isTyping" />

        <div ref="messagesEnd" />
      </div>

      <ChatInput
        :disabled="!chatStore.isConnected || chatStore.isTyping"
        @send="handleSend"
      />
    </main>

    <AppointmentsSidebar />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { Bot, CalendarPlus, ClipboardList, Pencil, CalendarX } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/authStore'
import { useChatStore } from '@/stores/chatStore'
import ChatMessage from '@/components/ChatMessage.vue'
import ChatInput from '@/components/ChatInput.vue'
import TypingIndicator from '@/components/TypingIndicator.vue'
import AppointmentsSidebar from '@/components/AppointmentsSidebar.vue'

const authStore = useAuthStore()
const chatStore = useChatStore()

const messagesContainer = ref<HTMLElement | null>(null)
const messagesEnd = ref<HTMLElement | null>(null)

const quickActions = [
  { label: 'Agendar cita',   message: 'Quiero agendar una cita medica',  icon: CalendarPlus },
  { label: 'Ver mis citas',  message: 'Muestrame mis citas agendadas',    icon: ClipboardList },
  { label: 'Modificar cita', message: 'Quiero modificar una cita',        icon: Pencil },
  { label: 'Cancelar cita',  message: 'Quiero cancelar una cita',         icon: CalendarX },
]

function scrollToBottom(): void {
  nextTick(() => {
    messagesEnd.value?.scrollIntoView({ behavior: 'smooth' })
  })
}

function handleSend(text: string): void {
  chatStore.sendMessage(text)
}

function sendQuickAction(message: string): void {
  chatStore.sendMessage(message)
}

watch(() => chatStore.messages.length, () => scrollToBottom())

onMounted(() => chatStore.connect())
onUnmounted(() => chatStore.disconnect())
</script>

<style scoped>
.chat-layout {
  flex: 1;
  display: flex;
  overflow: hidden;
  background: #f0f4f8;
}

.chat-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.messages-area {
  flex: 1;
  overflow-y: auto;
  padding: 20px 24px;
  scroll-behavior: smooth;
}

.messages-area::-webkit-scrollbar { width: 4px; }
.messages-area::-webkit-scrollbar-track { background: transparent; }
.messages-area::-webkit-scrollbar-thumb { background: #cbd5e0; border-radius: 2px; }

.welcome-screen {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;
  padding: 40px 20px;
}

.welcome-icon {
  width: 96px;
  height: 96px;
  border-radius: 28px;
  background: #2563eb;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  margin-bottom: 20px;
  box-shadow: 0 4px 16px rgba(37, 99, 235, 0.2);
}

.welcome-screen h2 {
  margin: 0 0 8px;
  font-size: 24px;
  font-weight: 700;
  color: #2d3748;
}

.welcome-screen p {
  margin: 0 0 28px;
  font-size: 15px;
  color: #718096;
  font-weight: 300;
}

.quick-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
  max-width: 460px;
}

.quick-action-btn {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 10px 18px;
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
  color: #4a5568;
  cursor: pointer;
  transition: all 0.2s;
  font-family: 'Roboto', sans-serif;
}

.quick-action-btn:hover {
  border-color: #2563eb;
  color: #2563eb;
  background: #eff6ff;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.15);
}
</style>
