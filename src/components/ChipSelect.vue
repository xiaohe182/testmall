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
  --color-label-grey: rgba(255, 255, 255, 0.6); /* Darker, muted grey for the label, matching image */
  --color-bg-chip: rgb(18, 18, 20); /* A very deep grey for the chip background, almost black, independent look */
  --color-border-chip: rgba(255, 255, 255, 0.1); /* Subtle, dark grey border for option borders */
  --color-text-chip-muted: rgba(255, 255, 255, 0.6); /* Lighter-grey for text in muted/inactive options */
  --color-active-purple: rgb(115, 103, 240); /* Indigo/Purple for the active border and text, matching image precisely */

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
  border-radius: 8px; /* Clean, tight radius, matching image_0.png */
  border: 1px solid var(--color-border-chip);
  background: var(--color-bg-chip);
  color: var(--color-text-chip-muted);
  font-size: 13px;
  font-weight: 500;
  /* Tabular nums keep numbers aligned for 'size selection' (e.g., 768x1344 vs 1024x1024) */
  font-variant-numeric: tabular-nums;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  outline: none;
  -webkit-font-smoothing: antialiased; /* Better font rendering on deep background */
}

/* Hover Interaction (Inactive): Slightly lighten border and background for lift */
.chip:hover:not(.active) {
  border-color: rgba(255, 255, 255, 0.2);
  background-color: rgba(255, 255, 255, 0.05); /* Very subtle lift */
}

/* Active Interaction:
  Matches image_0.png precisely with purple border and text, deep background.
*/
.chip.active {
  border-color: var(--color-active-purple);
  background: var(--color-bg-chip); /* Explicitly keep deep grey background */
  color: var(--color-active-purple);
  font-weight: 600; /* Bold active text */
  /* Subtle purple shadow, border and text are the main focus */
  box-shadow: 0 0 10px rgba(115, 103, 240, 0.1); 
}

/* Focus Visually (Keyboard navigation optimization) */
.chip:focus-visible {
  border-color: var(--color-active-purple);
  box-shadow: 0 0 0 2px rgba(115, 103, 240, 0.25);
}
</style>