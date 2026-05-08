<script setup lang="ts">
defineProps<{ text?: string }>()
</script>

<template>
  <div class="empty-state">
    <div class="icon-wrap">
      <slot name="icon">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"/><path d="M8 15h8"/><path d="M9 9h.01"/><path d="M15 9h.01"/>
        </svg>
      </slot>
    </div>
    <p>{{ text || '等待创作' }}</p>
  </div>
</template>

<style scoped>
.empty-state {
  text-align: center;
  color: var(--text-muted);
}
.icon-wrap { margin-bottom: 12px; opacity: 0.3; }
.empty-state p { font-size: 14px; }
</style>
