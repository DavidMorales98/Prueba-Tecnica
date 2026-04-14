import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUiStore = defineStore('ui', () => {
  // Incrementar este contador dispara el refresh del sidebar desde cualquier componente
  const appointmentsRefreshCount = ref(0)

  function triggerAppointmentsRefresh(): void {
    appointmentsRefreshCount.value++
  }

  return { appointmentsRefreshCount, triggerAppointmentsRefresh }
})
