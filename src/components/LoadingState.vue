<script setup lang="ts">
defineProps<{ text?: string; hint?: string }>()
</script>

<template>
  <div class="loading-state">
    <div class="loader-ring"></div>
    <p>{{ text || '正在创作中...' }}</p>
    <span v-if="hint" class="hint">{{ hint }}</span>
  </div>
</template>

<style scoped>
.loading-state {
  text-align: center;
  color: var(--text-secondary);
}
.loading-state p { margin-top: 16px; font-size: 14px; }
.hint { display: block; margin-top: 8px; font-size: 12px; color: var(--text-muted); }
.loader-ring {
  width: 48px;
  height: 48px;
  margin: 0 auto;
  border: none;
  border-radius: 50%;
  background: conic-gradient(from 0deg, var(--accent-indigo), rgba(99, 102, 241, 0.12));
  mask: radial-gradient(farthest-side, transparent calc(100% - 4px), #000 calc(100% - 3px));
  -webkit-mask: radial-gradient(farthest-side, transparent calc(100% - 4px), #000 calc(100% - 3px));
  animation: spin 1s linear infinite;
}
</style>
