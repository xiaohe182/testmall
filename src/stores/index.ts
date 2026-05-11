import { createPinia } from 'pinia'

export const pinia = createPinia()

export { useImageStore } from './image'
export { useVideoStore } from './video'
export { useHistoryStore, type HistoryItem } from './history'
