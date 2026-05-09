<script setup lang="ts">
defineProps<{ label: string; items: string[]; modelValue: string }>()
defineEmits<{
  'update:modelValue': [v: string]
}>()
</script>

<template>
  <div class="size-row">
    <div class="label-row">
      <span class="label">{{ label }}</span>
    </div>
    <div class="opts">
      <button
        v-for="s in items" :key="s"
        :class="['chip', { active: modelValue === s }]"
        @click="$emit('update:modelValue', s)"
      >{{ s }}</button>
    </div>
  </div>
</template>

<style scoped>
.size-row {
  --color-label-grey: rgba(255, 255, 255, 0.6);
  --color-bg-chip: rgb(18, 18, 20);
  --color-text-chip-muted: rgba(255, 255, 255, 0.6);
  --color-active-blue: #1496f3;

  margin-bottom: 24px;
}

.label-row {
  margin-bottom: 10px;
}
.label {
  font-size: 13px;
  color: var(--color-label-grey);
  font-weight: 600;
  letter-spacing: 0.02em;
}

.opts {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.chip {
  padding: 6px 14px;
  border-radius: 8px;
  border: none;
  background: var(--color-bg-chip);
  color: var(--color-text-chip-muted);
  font-size: 13px;
  font-weight: 500;
  font-variant-numeric: tabular-nums;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  outline: none;
  -webkit-font-smoothing: antialiased;
}

.chip:hover:not(.active) {
  background-color: rgba(255, 255, 255, 0.05);
}

.chip.active {
  background: rgba(20, 150, 243, 0.1);
  color: var(--color-active-blue);
  font-weight: 600;
  box-shadow: 0 0 10px rgba(20, 150, 243, 0.1); 
}

.chip:focus-visible {
  box-shadow: 0 8px 28px rgba(20, 150, 243, 0.18);
}
</style>