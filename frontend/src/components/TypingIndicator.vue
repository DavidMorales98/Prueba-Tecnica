<template>
  <div class="typing-wrapper">
    <div class="typing-avatar">
      <Bot :size="18" />
    </div>
    <div class="typing-bubble">
      <span class="typing-dot" />
      <span class="typing-dot" />
      <span class="typing-dot" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Bot } from 'lucide-vue-next'
</script>

<style scoped>
.typing-wrapper {
  display: flex;
  align-items: flex-end;
  gap: 8px;
  margin-bottom: 16px;
  animation: fadeIn 0.25s ease-in-out;
}

.typing-avatar {
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

.typing-bubble {
  background: #ffffff;
  border: 1px solid #e8ecf0;
  border-radius: 18px;
  border-bottom-left-radius: 4px;
  padding: 14px 18px;
  display: flex;
  gap: 5px;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.typing-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #a0aec0;
  animation: bounce 1.4s infinite;
}

.typing-dot:nth-child(1) { animation-delay: 0s; }
.typing-dot:nth-child(2) { animation-delay: 0.2s; }
.typing-dot:nth-child(3) { animation-delay: 0.4s; }

@keyframes bounce {
  0%, 60%, 100% { transform: translateY(0); }
  30%           { transform: translateY(-6px); }
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
</style>
