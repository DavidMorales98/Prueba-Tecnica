import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { ChatMessage } from '@/types'
import * as socketService from '@/services/socketService'
import { useAuthStore } from './authStore'

export const useChatStore = defineStore('chat', () => {
  const messages = ref<ChatMessage[]>([])
  const isTyping = ref(false)
  const isConnected = ref(false)
  const connectionError = ref<string | null>(null)

  function connect(): void {
    const authStore = useAuthStore()
    if (!authStore.token) return

    const socket = socketService.connectSocket(authStore.token)

    socket.on('connect', () => {
      isConnected.value = true
      connectionError.value = null
    })

    socket.on('disconnect', () => {
      isConnected.value = false
    })

    socket.on('connect_error', (err: Error) => {
      connectionError.value = err.message
      isConnected.value = false
    })

    socketService.onBotMessage((message: ChatMessage) => {
      messages.value.push(message)
    })

    socketService.onBotTyping(({ typing }) => {
      isTyping.value = typing
    })

    socketService.onHistoryCleared(() => {
      messages.value = []
    })
  }

  function disconnect(): void {
    socketService.disconnectSocket()
    isConnected.value = false
    messages.value = []
    isTyping.value = false
  }

  function sendMessage(text: string): void {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text,
      timestamp: new Date().toISOString(),
      isBot: false,
    }
    messages.value.push(userMessage)
    socketService.sendMessage(text)
  }

  function clearHistory(): void {
    socketService.clearHistory()
  }

  return {
    messages,
    isTyping,
    isConnected,
    connectionError,
    connect,
    disconnect,
    sendMessage,
    clearHistory,
  }
})
