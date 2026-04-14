<template>
  <aside class="sidebar">
    <div class="sidebar-header">
      <h3 class="sidebar-title">
        <Calendar :size="18" class="sidebar-icon" />
        Citas Agendadas
      </h3>
      <button
        class="refresh-btn"
        :class="{ 'refresh-btn--loading': loading }"
        @click="fetchAppointments"
        title="Actualizar"
      >
        <RefreshCw :size="15" />
      </button>
    </div>

    <div class="sidebar-content">
      <div v-if="loading" class="sidebar-loading">
        <div class="loading-spinner" />
        <span>Cargando citas...</span>
      </div>

      <div v-else-if="error" class="sidebar-error">
        <AlertCircle :size="20" />
        <span>{{ error }}</span>
      </div>

      <div v-else-if="appointments.length === 0" class="sidebar-empty">
        <CalendarOff :size="40" class="empty-icon" />
        <p>No hay citas agendadas</p>
        <small>Usa el chat para agendar una cita</small>
      </div>

      <TransitionGroup v-else name="list" tag="ul" class="appointments-list">
        <li
          v-for="appointment in appointments"
          :key="appointment.id"
          class="appointment-card"
        >
          <div class="appointment-header">
            <span class="appointment-patient">{{ appointment.patientName }}</span>
            <span
              class="appointment-status"
              :class="`status--${appointment.status}`"
            >
              {{ appointment.status === 'scheduled' ? 'Agendada' : 'Cancelada' }}
            </span>
          </div>

          <div class="appointment-details">
            <div class="detail-row">
              <CalendarDays :size="13" class="detail-icon" />
              <span>{{ formatDate(appointment.date) }}</span>
            </div>
            <div class="detail-row">
              <Clock :size="13" class="detail-icon" />
              <span>{{ appointment.time }}</span>
            </div>
            <div class="detail-row">
              <FileText :size="13" class="detail-icon" />
              <span>{{ appointment.reason }}</span>
            </div>
            <div class="detail-row">
              <Stethoscope :size="13" class="detail-icon" />
              <span>{{ appointment.doctor }}</span>
            </div>
          </div>

          <div class="appointment-id">ID: {{ appointment.id.slice(0, 8) }}...</div>
        </li>
      </TransitionGroup>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useUiStore } from '@/stores/uiStore'
import { useChatStore } from '@/stores/chatStore'
import {
  Calendar,
  CalendarDays,
  CalendarOff,
  Clock,
  FileText,
  RefreshCw,
  Stethoscope,
  AlertCircle,
} from 'lucide-vue-next'
import type { Appointment } from '@/types'
import { getToken } from '@/services/authService'

const uiStore = useUiStore()
const chatStore = useChatStore()
const appointments = ref<Appointment[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

async function fetchAppointments(): Promise<void> {
  loading.value = true
  error.value = null

  try {
    const token = getToken()
    const response = await fetch('/api/appointments', {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!response.ok) throw new Error('Error al cargar citas')
    appointments.value = await response.json()
  } catch {
    error.value = 'Error al cargar las citas'
  } finally {
    loading.value = false
  }
}

function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split('-')
  const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
  return `${day} ${months[parseInt(month) - 1]} ${year}`
}

// Refresh cuando el bot termina de responder (puede haber creado/modificado citas)
watch(() => chatStore.isTyping, (typing) => {
  if (!typing && chatStore.messages.length > 0) fetchAppointments()
})

// Refresh disparado desde el header via uiStore
watch(() => uiStore.appointmentsRefreshCount, () => fetchAppointments())

defineExpose({ fetchAppointments })

onMounted(fetchAppointments)
</script>

<style scoped>
.sidebar {
  width: 280px;
  min-width: 280px;
  background: #f7f9fc;
  border-left: 1px solid #e8ecf0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.sidebar-header {
  padding: 20px 16px 16px;
  background: white;
  border-bottom: 1px solid #e8ecf0;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.sidebar-title {
  margin: 0;
  font-size: 15px;
  font-weight: 500;
  color: #2d3748;
  display: flex;
  align-items: center;
  gap: 8px;
}

.sidebar-icon {
  color: #2563eb;
}

.refresh-btn {
  width: 30px;
  height: 30px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  background: white;
  color: #718096;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.refresh-btn:hover {
  background: #eff6ff;
  color: #2563eb;
}

.refresh-btn--loading :deep(svg) {
  animation: spin 1s linear infinite;
}

.sidebar-content {
  flex: 1;
  overflow-y: auto;
  padding: 12px;
}

.sidebar-loading,
.sidebar-error,
.sidebar-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px 16px;
  text-align: center;
  color: #a0aec0;
  font-size: 13px;
  gap: 8px;
}

.sidebar-error {
  color: #e53e3e;
}

.loading-spinner {
  width: 24px;
  height: 24px;
  border: 2px solid #e2e8f0;
  border-top-color: #2563eb;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.empty-icon {
  color: #cbd5e0;
}

.sidebar-empty p {
  margin: 0;
  font-weight: 500;
  color: #718096;
}

.sidebar-empty small {
  color: #a0aec0;
}

.appointments-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.appointment-card {
  background: white;
  border: 1px solid #e8ecf0;
  border-radius: 12px;
  padding: 12px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
  transition: box-shadow 0.2s;
}

.appointment-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.appointment-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.appointment-patient {
  font-weight: 500;
  font-size: 13px;
  color: #2d3748;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 140px;
}

.appointment-status {
  font-size: 10px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 20px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.status--scheduled {
  background: #e6fffa;
  color: #234e52;
}

.status--cancelled {
  background: #fff5f5;
  color: #742a2a;
}

.appointment-details {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.detail-row {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #4a5568;
}

.detail-icon {
  color: #a0aec0;
  flex-shrink: 0;
}

.appointment-id {
  margin-top: 8px;
  font-size: 10px;
  color: #a0aec0;
  font-family: monospace;
  border-top: 1px solid #f0f4f8;
  padding-top: 6px;
}

.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
