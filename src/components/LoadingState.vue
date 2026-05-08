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
  width: 48px; height: 48px; margin: 0 auto;
  border: 3px solid var(--border-color);
  border-top-color: var(--accent-indigo);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}
</style>
