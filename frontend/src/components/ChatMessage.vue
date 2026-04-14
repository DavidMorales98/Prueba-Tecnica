<template>
  <div class="message-wrapper" :class="{ 'message-wrapper--user': !message.isBot }">
    <div class="message-avatar" :class="{ 'message-avatar--user': !message.isBot }">
      <Bot v-if="message.isBot" :size="18" />
      <User v-else :size="18" />
    </div>

    <div
      class="message-bubble"
      :class="{
        'message-bubble--bot': message.isBot,
        'message-bubble--user': !message.isBot,
        'message-bubble--error': message.isError,
      }"
    >
      <p class="message-text" v-html="formattedText" />
      <span class="message-time">{{ formattedTime }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Bot, User } from 'lucide-vue-next'
import type { ChatMessage } from '@/types'

interface Props {
  message: ChatMessage
}

const props = defineProps<Props>()

const formattedText = computed(() => {
  return props.message.text.replace(/\n/g, '<br />')
})

const formattedTime = computed(() => {
  return new Date(props.message.timestamp).toLocaleTimeString('es-CL', {
    hour: '2-digit',
    minute: '2-digit',
  })
})
</script>

<style scoped>
.message-wrapper {
  display: flex;
  align-items: flex-end;
  gap: 8px;
  margin-bottom: 16px;
  animation: fadeIn 0.25s ease-in-out;
}

.message-wrapper--user {
  flex-direction: row-reverse;
}

.message-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #2563eb;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(37, 99, 235, 0.2);
}

.message-avatar--user {
  background: #2563eb;
}

.message-bubble {
  max-width: 75%;
  padding: 12px 16px;
  border-radius: 18px;
  position: relative;
}

.message-bubble--bot {
  background: #ffffff;
  border: 1px solid #e8ecf0;
  border-bottom-left-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.message-bubble--user {
  background: #2563eb;
  color: white;
  border-bottom-right-radius: 4px;
  box-shadow: 0 2px 8px rgba(37, 99, 235, 0.2);
}

.message-bubble--error {
  background: #fff5f5;
  border-color: #fc8181;
}

.message-text {
  margin: 0 0 4px 0;
  font-size: 14px;
  line-height: 1.6;
  color: inherit;
  word-wrap: break-word;
}

.message-bubble--bot .message-text {
  color: #2d3748;
}

.message-time {
  font-size: 11px;
  opacity: 0.6;
  display: block;
  text-align: right;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
</style>
