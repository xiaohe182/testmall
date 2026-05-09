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
/* Define color variables within the component scope for clarity and consistency.
  Colors are strictly based on analysis of image_0.png
*/
.size-row {
  --color-label-grey: rgba(255, 255, 255, 0.6);
  --color-bg-chip: rgb(18, 18, 20);
  --color-border-chip: rgba(255, 255, 255, 0.1);
  --color-text-chip-muted: rgba(255, 255, 255, 0.6);
  --color-active-blue: #1496f3;

  margin-bottom: 24px;
}

/* Label Layout and Styling: Darker grey, bold font */
.label-row {
  margin-bottom: 10px;
}
.label {
  font-size: 13px;
  color: var(--color-label-grey);
  font-weight: 600;
  letter-spacing: 0.02em;
}

/* Options Layout: Flex row */
.opts {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

/* Option Chips (General & Muted/Inactive): 
  Deep background, tight padding, bold text.
*/
.chip {
  padding: 6px 14px;
  border-radius: 8px;
  border: 1px solid var(--color-border-chip);
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

/* Hover Interaction (Inactive): Slightly lighten border and background for lift */
.chip:hover:not(.active) {
  border-color: rgba(255, 255, 255, 0.2);
  background-color: rgba(255, 255, 255, 0.05);
}

/* Active Interaction */
.chip.active {
  border-color: var(--color-active-blue);
  background: rgba(20, 150, 243, 0.1);
  color: var(--color-active-blue);
  font-weight: 600;
  box-shadow: 0 0 10px rgba(20, 150, 243, 0.1); 
}

/* Focus Visually (Keyboard navigation optimization) */
.chip:focus-visible {
  border-color: var(--color-active-blue);
  box-shadow: 0 0 0 2px rgba(20, 150, 243, 0.25);
}
</style>