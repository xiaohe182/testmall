<script setup lang="ts">
import { Button } from '@/components/ui/button'

defineProps<{ disabled: boolean; loading: boolean; text?: string }>()
defineEmits<{ click: [] }>()
</script>

<template>
  <Button
    class="gen-btn"
    :class="{ loading }"
    :disabled="disabled"
    @click="$emit('click')"
  >
    <span class="spinner" v-if="loading"></span>
    <slot>{{ loading ? '生成中...' : text || '生成' }}</slot>
  </Button>
</template>

<style scoped>
.gen-btn {
  width: 100%;
  padding: 14px;
  border-radius: 14px;
  background: linear-gradient(135deg, #4f46e5, #1496f3);
  color: white;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 14px 0 rgba(20, 150, 243, 0.39);
}

.gen-btn::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.18) 50%, transparent 70%);
  background-size: 200% 100%;
  background-position: 100% 0;
  opacity: 0;
  transition: background-position 0.5s ease, opacity 0.2s ease;
}
.gen-btn:hover:not(:disabled)::before {
  opacity: 1;
  background-position: -100% 0;
}
.gen-btn::after {
  content: '';
  position: absolute;
  inset: -3px;
  border-radius: inherit;
  border: 1.5px solid rgba(20, 150, 243, 0.3);
  opacity: 0;
  pointer-events: none;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.gen-btn:hover:not(:disabled)::after {
  opacity: 1;
  inset: -7px;
  border-color: rgba(20, 150, 243, 0);
}
.gen-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 32px rgba(99,102,241,0.45);
}
.gen-btn:active:not(:disabled) { transform: translateY(0); }
.gen-btn:disabled { opacity: 0.4; cursor: not-allowed; }
.gen-btn.loading {
  background: rgba(255,255,255,0.04);
  box-shadow: none;
}

.spinner {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
  border: none;
  border-radius: 50%;
  background: conic-gradient(from 0deg, rgba(255,255,255,0.95), rgba(255,255,255,0.08));
  mask: radial-gradient(farthest-side, transparent calc(100% - 2.5px), #000 calc(100% - 1.5px));
  -webkit-mask: radial-gradient(farthest-side, transparent calc(100% - 2.5px), #000 calc(100% - 1.5px));
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
