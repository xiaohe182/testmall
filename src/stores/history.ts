import { ref, watch } from 'vue'
import { defineStore } from 'pinia'

export type HistoryItem = {
  id: string
  type: 'img' | 'video'
  url: string
  cover_image_url?: string
  prompt: string
  timestamp: number
}

const STORAGE_KEY = 'tsb_history'

function loadHistory(): HistoryItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export const useHistoryStore = defineStore('history', () => {
  const items = ref<HistoryItem[]>(loadHistory())

  watch(items, (val) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(val.slice(0, 200)))
    } catch { /* quota exceeded — ignore */ }
  }, { deep: true })

  function add(item: Omit<HistoryItem, 'id' | 'timestamp'>) {
    items.value.unshift({
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      ...item
    })
  }

  function clear() {
    items.value = []
  }

  return { items, add, clear }
})
