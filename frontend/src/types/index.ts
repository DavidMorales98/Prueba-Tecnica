export interface User {
  id: string
  username: string
  name: string
}

export interface AuthResponse {
  token: string
  user: User
}

export interface Appointment {
  id: string
  patientName: string
  date: string
  time: string
  reason: string
  doctor: string
  status: 'scheduled' | 'cancelled'
  createdAt: string
  updatedAt: string
}

export interface ChatMessage {
  id: string
  text: string
  timestamp: string
  isBot: boolean
  isError?: boolean
}

export interface BotTypingEvent {
  typing: boolean
}
