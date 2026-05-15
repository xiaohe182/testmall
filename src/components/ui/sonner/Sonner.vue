<script lang="ts" setup>
import type { ToasterProps } from "vue-sonner"
import { CheckCircle2, Info, AlertTriangle, XCircle, Loader2, X } from 'lucide-vue-next'
import { Toaster as Sonner } from "vue-sonner"
import { cn } from "@/lib/utils"

const props = defineProps<ToasterProps>()
</script>

<template>
  <Sonner
    :class="cn('toaster group', props.class)"
    :style="{
      '--normal-bg': 'var(--popover)',
      '--normal-text': 'var(--popover-foreground)',
      '--normal-border': 'var(--border)',
      '--border-radius': 'var(--radius)',
    }"
    v-bind="props"
  >
    <template #success-icon>
      <CheckCircle2 class="size-4" />
    </template>
    <template #info-icon>
      <Info class="size-4" />
    </template>
    <template #warning-icon>
      <AlertTriangle class="size-4" />
    </template>
    <template #error-icon>
      <XCircle class="size-4" />
    </template>
    <template #loading-icon>
      <Loader2 class="size-4 animate-spin" />
    </template>
    <template #close-icon>
      <X class="size-3" />
    </template>
  </Sonner>
</template>
