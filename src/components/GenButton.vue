<script setup lang="ts">
defineProps<{ disabled: boolean; loading: boolean; text?: string }>()
defineEmits<{ click: [] }>()
</script>

<template>
  <button
    class="gen-btn"
    :class="{ loading }"
    :disabled="disabled"
    @click="$emit('click')"
  >
    <span class="spinner" v-if="loading"></span>
    <slot>{{ loading ? '生成中...' : text || '生成' }}</slot>
  </button>
</template>

<style scoped>
.gen-btn {
  width: 100%;
  padding: 14px;
  border: none;
  border-radius: 14px;
  background: var(--accent-indigo);
  color: white;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: all var(--transition-normal);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-family: var(--font-main);
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 14px 0 rgba(20, 150, 243, 0.39);
}
.gen-btn::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(255,255,255,0.1), transparent);
  opacity: 0;
  transition: opacity var(--transition-fast);
}
.gen-btn:hover:not(:disabled)::before { opacity: 1; }
.gen-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 32px rgba(99,102,241,0.4), 0 0 0 1px rgba(99,102,241,0.2);
}
.gen-btn:active:not(:disabled) { transform: translateY(0); }
.gen-btn:disabled { opacity: 0.4; cursor: not-allowed; }
.gen-btn.loading {
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.08);
}
.spinner {
  width: 18px; height: 18px;
  border: 2px solid rgba(255,255,255,0.15);
  border-top-color: var(--accent-indigo);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
</style>
