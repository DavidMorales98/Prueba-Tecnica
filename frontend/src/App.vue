<template>
  <RouterView />
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<style>
*,
*::before,
*::after {
  box-sizing: border-box;
}

html,
body,
#app {
  margin: 0;
  padding: 0;
  height: 100%;
  font-family: 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background: #f0f4f8;
}

:root {
  --color-primary: #2563eb;
  --color-primary-dark: #1d4ed8;
  --color-text: #2d3748;
  --color-text-muted: #718096;
  --color-border: #e2e8f0;
  --color-bg: #f7f9fc;
  --radius: 12px;
}
</style>
