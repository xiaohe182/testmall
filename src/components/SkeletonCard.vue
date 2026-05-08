<script setup lang="ts">
defineProps<{
  type?: 'img' | 'video'
  text?: string
}>()
</script>

<template>
  <div class="sk-wrap">
    <div class="sk-card">
      <div class="sk-header">
        <div class="sk-circle"></div>
        <div class="sk-lines">
          <div class="sk-line w60"></div>
          <div class="sk-line w40"></div>
        </div>
      </div>
      <div class="sk-block" :class="{ video: type === 'video' }">
        <div v-if="type === 'video'" class="sk-play">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="5 3 19 12 5 21 5 3"/>
          </svg>
        </div>
        <div v-else class="sk-img-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2"/>
            <circle cx="8.5" cy="8.5" r="1.5"/>
            <path d="m21 15-5-5L5 21"/>
          </svg>
        </div>
      </div>
      <div class="sk-footer">
        <div class="sk-line w80"></div>
        <div class="sk-line w50"></div>
      </div>
    </div>
    <p class="sk-text">{{ text || '正在创作中...' }}</p>
  </div>
</template>

<style scoped>
.sk-wrap {
  width: 100%;
  text-align: center;
}
.sk-card {
  border-radius: 16px;
  overflow: hidden;
  background: rgba(255,255,255,0.02);
  border: 1px solid rgba(255,255,255,0.04);
}
.sk-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
}
.sk-circle {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: linear-gradient(110deg, rgba(99,102,241,0.08) 30%, rgba(99,102,241,0.16) 50%, rgba(99,102,241,0.08) 70%);
  background-size: 200% 100%;
  animation: shimmer 1.5s ease-in-out infinite;
}
.sk-lines { flex: 1; display: flex; flex-direction: column; gap: 6px; }
.sk-line {
  height: 10px;
  border-radius: 5px;
  background: linear-gradient(110deg, rgba(255,255,255,0.04) 30%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.04) 70%);
  background-size: 200% 100%;
  animation: shimmer 1.5s ease-in-out infinite;
}
.sk-line.w60 { width: 60%; }
.sk-line.w40 { width: 40%; }
.sk-line.w80 { width: 80%; }
.sk-line.w50 { width: 50%; }
.sk-block {
  aspect-ratio: 4/3;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(110deg, rgba(99,102,241,0.04) 30%, rgba(99,102,241,0.1) 50%, rgba(99,102,241,0.04) 70%);
  background-size: 200% 100%;
  animation: shimmer 1.5s ease-in-out infinite;
  color: rgba(99,102,241,0.3);
}
.sk-block.video {
  aspect-ratio: 16/9;
}
.sk-play, .sk-img-icon {
  animation: pulse 2s ease-in-out infinite;
}
.sk-footer {
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.sk-text {
  margin-top: 16px;
  font-size: 13px;
  color: var(--text-muted);
  letter-spacing: 0.02em;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
@keyframes pulse {
  0%, 100% { opacity: 0.3; transform: scale(1); }
  50% { opacity: 0.6; transform: scale(1.05); }
}
</style>
