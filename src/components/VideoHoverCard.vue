<script setup lang="ts">
import { ref } from 'vue'

defineProps<{
  cover: string
  video: string
  title: string
}>()

const videoRef = ref<HTMLVideoElement>()

function handleMouseEnter() {
  const el = videoRef.value
  if (!el) return
  el.currentTime = 0
  el.play().catch(() => {})
}

/** 移出后回到初始态（poster / 未播放），而不是停在某一帧上像「暂停」 */
function handleMouseLeave() {
  const el = videoRef.value
  if (!el) return
  el.pause()
  el.currentTime = 0
  el.load()
}
</script>

<template>
  <div
    class="video-hover-card"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <div class="media-shell">
      <div class="media-container">
        <video
          ref="videoRef"
          :src="video"
          :poster="cover"
          muted
          loop
          playsinline
          preload="metadata"
          class="preview-video"
        />
      </div>
    </div>
    <div class="card-info">
      <span class="card-tag">动态演示</span>
      <h3 class="card-title">{{ title }}</h3>
    </div>
  </div>
</template>

<style scoped>
.video-hover-card {
  position: relative;
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: var(--card-radius);
  overflow: hidden;
  cursor: pointer;
  backdrop-filter: blur(16px);
}

/* 在 16:10 的基础上，media-container 总高度再多 10px */
.media-shell {
  position: relative;
  width: 100%;
}
.media-shell::before {
  content: '';
  display: block;
  padding-bottom: calc(100% * 10 / 16 + 10px);
}

.media-container {
  position: absolute;
  inset: 0;
  background: #000;
}

.preview-video {
  display: block;
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 1;
}

.card-info {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20px;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
  z-index: 4;
  pointer-events: none;
}

.card-tag {
  font-size: 10px;
  color: #1496f3;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 4px;
  display: block;
}

.card-title {
  font-size: 14px;
  font-weight: 600;
  color: white;
  margin: 0;
}
</style>
