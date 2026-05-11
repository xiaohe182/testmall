import { ref } from 'vue'

export interface Toast {
  id: string
  message: string
  type: 'error' | 'success' | 'info'
}

const toasts = ref<Toast[]>([])

let _timer: ReturnType<typeof setTimeout> | null = null

function scheduleCleanup() {
  if (_timer !== null) clearTimeout(_timer)
  _timer = setTimeout(() => { toasts.value = [] }, 3500)
}

export function useToast() {
  function show(message: string, type: Toast['type'] = 'error') {
    toasts.value.push({ id: crypto.randomUUID(), message, type })
    scheduleCleanup()
  }

  function dismiss(id: string) {
    toasts.value = toasts.value.filter(t => t.id !== id)
  }

  return { toasts, show, dismiss }
}
