import { io, Socket } from 'socket.io-client'
import type { ChatMessage, BotTypingEvent } from '@/types'

const SOCKET_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001'

let socket: Socket | null = null

export function connectSocket(token: string): Socket {
  if (socket?.connected) {
    return socket
  }

  socket = io(`${SOCKET_URL}/chat`, {
    auth: { token },
    transports: ['websocket', 'polling'],
  })

  return socket
}

export function disconnectSocket(): void {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}

export function getSocket(): Socket | null {
  return socket
}

export function sendMessage(text: string): void {
  if (!socket?.connected) {
    throw new Error('Socket no conectado')
  }
  socket.emit('user_message', { text })
}

export function clearHistory(): void {
  if (socket?.connected) {
    socket.emit('clear_history')
  }
}

export function onBotMessage(callback: (message: ChatMessage) => void): void {
  socket?.on('bot_message', callback)
}

export function onBotTyping(callback: (event: BotTypingEvent) => void): void {
  socket?.on('bot_typing', callback)
}

export function onHistoryCleared(callback: () => void): void {
  socket?.on('history_cleared', callback)
}

export function offBotMessage(): void {
  socket?.off('bot_message')
}

export function offBotTyping(): void {
  socket?.off('bot_typing')
}
