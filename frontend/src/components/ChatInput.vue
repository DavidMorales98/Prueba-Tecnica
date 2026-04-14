<template>
  <div class="chat-input-container">
    <div class="chat-input-wrapper">
      <textarea
        ref="textareaRef"
        v-model="inputText"
        class="chat-input"
        placeholder="Escribe tu mensaje..."
        rows="1"
        :disabled="disabled"
        @keydown.enter.exact.prevent="handleSend"
        @keydown.shift.enter="() => {}"
        @input="autoResize"
      />
      <button
        class="send-button"
        :disabled="disabled || !inputText.trim()"
        @click="handleSend"
        title="Enviar mensaje (Enter)"
      >
        <Send :size="18" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { Send } from 'lucide-vue-next'

interface Props {
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), { disabled: false })

const emit = defineEmits<{
  send: [text: string]
}>()

const inputText = ref('')
const textareaRef = ref<HTMLTextAreaElement | null>(null)

function handleSend(): void {
  const text = inputText.value.trim()
  if (!text || props.disabled) return

  emit('send', text)
  inputText.value = ''

  nextTick(() => {
    if (textareaRef.value) {
      textareaRef.value.style.height = 'auto'
    }
  })
}

function autoResize(): void {
  const textarea = textareaRef.value
  if (!textarea) return
  textarea.style.height = 'auto'
  textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px'
}
</script>

<style scoped>
.chat-input-container {
  padding: 16px 20px 12px;
  background: #ffffff;
  border-top: 1px solid #e8ecf0;
}

.chat-input-wrapper {
  display: flex;
  align-items: flex-end;
  gap: 10px;
  background: #f7f9fc;
  border: 2px solid #e2e8f0;
  border-radius: 16px;
  padding: 8px 8px 8px 16px;
  transition: border-color 0.2s;
}

.chat-input-wrapper:focus-within {
  border-color: #2563eb;
  background: #fff;
}

.chat-input {
  flex: 1;
  border: none;
  background: transparent;
  outline: none;
  resize: none;
  font-family: 'Roboto', sans-serif;
  font-size: 14px;
  color: #2d3748;
  line-height: 1.5;
  max-height: 120px;
  overflow-y: auto;
  padding: 4px 0;
}

.chat-input::placeholder {
  color: #a0aec0;
}

.chat-input:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.send-button {
  width: 38px;
  height: 38px;
  border-radius: 12px;
  border: none;
  background: #2563eb;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
  transition: all 0.2s;
  box-shadow: 0 2px 8px rgba(37, 99, 235, 0.2);
}

.send-button:hover:not(:disabled) {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.5);
}

.send-button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

</style>
