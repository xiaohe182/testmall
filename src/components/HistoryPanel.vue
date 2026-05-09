<script setup lang="ts">
import { useGenerationStore, type HistoryItem } from '@/stores/generation'

const store = useGenerationStore()

function formatTime(ts: number): string {
  const d = new Date(ts)
  const hh = String(d.getHours()).padStart(2, '0')
  const mm = String(d.getMinutes()).padStart(2, '0')
  return `${hh}:${mm}`
}

function useHistoryItem(item: HistoryItem) {
  if (item.type === 'img') {
    store.sendToVideo(item.url)
  }
}
</script>

<template>
  <section class="history-panel" v-if="store.history.length > 0">
    <div class="panel-head">
      <div class="head-left">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <polyline points="12 6 12 12 16 14"/>
        </svg>
        <div class="title-wrap">
          <span class="panel-kicker">最近记录</span>
          <h3 class="panel-title">本次会话里的创作结果</h3>
        </div>
        <span class="panel-count">{{ store.history.length }}</span>
      </div>
      <button class="clear-btn" @click="store.clearHistory()">清空</button>
    </div>

    <div class="history-list">
      <div
        v-for="item in store.history"
        :key="item.id"
        class="history-item"
        @click="useHistoryItem(item)"
      >
        <div class="thumb-wrap">
          <img
            v-if="item.type === 'img'"
            :src="item.url"
            alt=""
            class="thumb"
            loading="lazy"
          />
          <div v-else class="thumb-video">
            <img v-if="item.cover_image_url" :src="item.cover_image_url" alt="" class="thumb" loading="lazy" />
            <div class="play-overlay">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                <polygon points="5 3 19 12 5 21 5 3"/>
              </svg>
            </div>
          </div>
        </div>

        <div class="item-info">
          <p class="item-prompt">{{ item.prompt.slice(0, 40) }}{{ item.prompt.length > 40 ? '…' : '' }}</p>
          <div class="item-meta">
            <span :class="['type-badge', item.type]">
              {{ item.type === 'img' ? '图片' : '视频' }}
            </span>
            <span class="item-time">{{ formatTime(item.timestamp) }}</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.history-panel {
  margin-top: 40px;
}
.panel-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 18px;
}
.head-left {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--text-secondary);
}
.title-wrap {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.panel-kicker {
  color: var(--text-muted);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
.panel-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--text-primary);
}
.panel-count {
  font-size: 11px;
  color: var(--text-muted);
  background: rgba(255,255,255,0.04);
  padding: 2px 8px;
  border-radius: 100px;
  border: none;
}
.clear-btn {
  padding: 4px 12px;
  border-radius: 8px;
  border: none;
  background: transparent;
  color: var(--text-muted);
  font-size: 12px;
  cursor: pointer;
  font-family: var(--font-main);
  transition: all var(--transition-fast);
}
.clear-btn:hover {
  color: #f87171;
  background: rgba(239,68,68,0.06);
}

.history-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 12px;
}
.history-item {
  display: flex;
  gap: 12px;
  padding: 12px;
  border-radius: 14px;
  background: rgba(255,255,255,0.02);
  border: none;
  cursor: pointer;
  transition: all var(--transition-fast);
}
.history-item:hover {
  background: rgba(255,255,255,0.03);
}

.thumb-wrap {
  width: 56px;
  height: 56px;
  flex-shrink: 0;
  border-radius: 10px;
  overflow: hidden;
  background: var(--bg-secondary);
}
.thumb {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.thumb-video {
  position: relative;
  width: 100%;
  height: 100%;
}
.play-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0,0,0,0.35);
}

.item-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 4px;
}
.item-prompt {
  font-size: 12px;
  color: var(--text-secondary);
  line-height: 1.5;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.item-meta {
  display: flex;
  align-items: center;
  gap: 6px;
}
.type-badge {
  font-size: 10px;
  font-weight: 600;
  padding: 1px 6px;
  border-radius: 4px;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}
.type-badge.img {
  color: var(--accent-indigo);
  background: rgba(99,102,241,0.1);
}
.type-badge.video {
  color: var(--accent-pink);
  background: rgba(236,72,153,0.1);
}
.item-time {
  font-size: 10px;
  color: var(--text-muted);
}

@media (max-width: 640px) {
  .panel-head {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
