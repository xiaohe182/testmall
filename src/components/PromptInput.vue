<script setup lang="ts">
import { Textarea } from '@/components/ui/textarea'

const props = defineProps<{
  modelValue: string
  placeholder?: string
  maxLength?: number
}>()

const emit = defineEmits<{
  'update:modelValue': [v: string]
}>()

function onInput(value: string | number) {
  emit('update:modelValue', String(value))
}
</script>

<template>
  <div class="prompt-box">
    <Textarea
      :model-value="modelValue"
      :placeholder="placeholder || '描述你想生成的内容...'"
      :maxlength="maxLength"
      class="prompt-input"
      rows="4"
      @update:model-value="onInput"
    />
  </div>
</template>

<style scoped>
.prompt-box {
  margin-bottom: 16px;
}

.prompt-input {
  min-height: 110px;
  padding: 14px 16px;
  border-radius: 14px;
  border: none;
  background: rgba(255,255,255,0.02);
  color: var(--text-primary);
  font-size: 14px;
  line-height: 1.6;
  resize: vertical;
  transition: box-shadow 0.2s ease, background-color 0.2s ease;
}

.prompt-input:focus {
  outline: none;
  background: rgba(255,255,255,0.05);
  box-shadow: 0 8px 28px rgba(20, 150, 243, 0.12);
  border-color: transparent;
}

.prompt-input::placeholder {
  color: var(--text-muted);
}
</style>
