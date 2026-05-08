<script setup lang="ts">
const props = defineProps<{
  modelValue: string
  placeholder?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [v: string]
}>()

function onInput(e: Event) {
  emit('update:modelValue', (e.target as HTMLTextAreaElement).value)
}
</script>

<template>
  <div class="prompt-box">
    <textarea
      :value="modelValue"
      :placeholder="placeholder || '描述你想生成的内容...'"
      class="prompt-input"
      rows="4"
      @input="onInput"
    ></textarea>
  </div>
</template>

<style scoped>
.prompt-box { margin-bottom: 16px; }
.prompt-input {
  width: 100%;
  min-height: 110px;
  padding: 14px 16px;
  border-radius: 14px;
  border: 1px solid rgba(255,255,255,0.06);
  background: rgba(255,255,255,0.02);
  color: var(--text-primary);
  font-size: 14px;
  line-height: 1.6;
  resize: vertical;
  transition: all var(--transition-fast);
  font-family: var(--font-main);
}
.prompt-input:focus {
  outline: none;
  border-color: rgba(99,102,241,0.4);
  box-shadow: 0 0 0 3px rgba(99,102,241,0.08);
  background: rgba(255,255,255,0.04);
}
.prompt-input::placeholder { color: var(--text-muted); }
</style>
