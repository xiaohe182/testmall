<script setup lang="ts">
interface Props {
  loading?: boolean
  error?: string | null
  emptyText?: string
  loadingCols?: 1 | 2
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  error: null,
  emptyText: '暂无内容',
  loadingCols: 1
})

const emit = defineEmits<{ retry: [] }>()
</script>

<template>
  <div class="result-container">
    <template v-if="loading">
      <div class="skeleton-grid" :class="{ 'cols-2': loadingCols === 2 }">
        <div v-for="i in loadingCols" :key="i" class="loading-item">
          <div class="media-placeholder loading-media">
            <div class="spinner" />
          </div>
          <div class="action-placeholder-bar">
            <span class="action-ph" />
            <span class="action-ph accent" />
          </div>
        </div>
      </div>
    </template>

    <template v-else-if="error">
      <div class="error-wrap">
        <div class="error-inner">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="15" y1="9" x2="9" y2="15"/>
            <line x1="9" y1="9" x2="15" y2="15"/>
          </svg>
          <h3>生成失败</h3>
          <p>{{ error }}</p>
          <button class="retry-btn" @click="emit('retry')">重试</button>
        </div>
      </div>
    </template>

    <template v-else-if="$slots.default">
      <slot />
    </template>

    <template v-else>
      <div class="empty-wrap">
        <div class="empty-inner">
          <slot name="empty-icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <path d="m21 15-5-5L5 21"/>
            </svg>
          </slot>
          <p>{{ emptyText }}</p>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.result-container {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  min-height: 0;
  width: 100%;
}

.skeleton-grid {
  width: 100%;
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
  align-content: start;
  justify-items: stretch;
}
.skeleton-grid.cols-2 {
  grid-template-columns: repeat(2, 1fr);
}

.loading-item {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.media-placeholder {
  width: 100%;
  border-radius: 16px;
  border: none;
  background: rgba(255,255,255,0.03);
  overflow: hidden;
  aspect-ratio: 1 / 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.loading-media {
  background:
    linear-gradient(110deg, rgba(99,102,241,0.04) 30%, rgba(99,102,241,0.1) 50%, rgba(99,102,241,0.04) 70%);
  background-size: 200% 100%;
  animation: shimmer 1.5s ease-in-out infinite;
}

.spinner {
  width: 28px;
  height: 28px;
  border-radius: 999px;
  border: none;
  background: conic-gradient(from 0deg, rgba(20, 150, 243, 0.9), rgba(20, 150, 243, 0.1));
  mask: radial-gradient(farthest-side, transparent calc(100% - 2.5px), #000 calc(100% - 1.5px));
  -webkit-mask: radial-gradient(farthest-side, transparent calc(100% - 2.5px), #000 calc(100% - 1.5px));
  animation: spin 0.8s linear infinite;
}

.action-placeholder-bar {
  display: flex;
  gap: 8px;
}
.action-ph {
  flex: 1;
  height: 36px;
  border-radius: 8px;
  background: rgba(255,255,255,0.04);
  border: none;
}
.action-ph.accent {
  background: rgba(20, 150, 243, 0.08);
}

.error-wrap {
  width: 100%;
  flex: 1;
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
  border: none;
  background: rgba(255,80,80,0.03);
}
.error-inner { text-align: center; color: var(--text-muted); }
.error-inner svg { color: rgba(255,80,80,0.5); margin-bottom: 12px; }
.error-inner h3 {
  margin: 0 0 8px;
  color: rgba(255,150,150,0.9);
  font-size: 16px; font-weight: 700;
}
.error-inner p {
  margin: 0 0 16px;
  font-size: 13px; line-height: 1.5;
  max-width: 320px;
}
.retry-btn {
  padding: 6px 18px; border-radius: 8px;
  border: none;
  background: rgba(255,255,255,0.05);
  color: var(--text-secondary);
  font-size: 12px; font-weight: 600;
  cursor: pointer; transition: all var(--transition-fast);
}
.retry-btn:hover {
  background: rgba(255,255,255,0.1);
}

.empty-wrap {
  width: 100%;
  flex: 1;
  min-height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 20px;
  border: none;
  background: rgba(255,255,255,0.01);
}
.empty-inner { text-align: center; color: var(--text-muted); }
.empty-inner svg { opacity: 0.4; }
.empty-inner p { margin-top: 12px; font-size: 14px; }

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
