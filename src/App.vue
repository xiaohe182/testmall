<script setup lang="ts">
import { ref } from 'vue'
import logoUrl from '@/assets/logo.png'
import { useGenerationStore } from '@/stores/generation'
import TextToImg from '@/components/TextToImg.vue'
import ImgToVideo from '@/components/ImgToVideo.vue'
import HistoryPanel from '@/components/HistoryPanel.vue'
import BeamGallery from '@/components/BeamGallery.vue'

type Tab = 'img' | 'video'

const tab = ref<Tab>('img')
const store = useGenerationStore()

function onGallerySelect(prompt: string) {
  store.imgPrompt = prompt
  tab.value = 'img'
}
</script>

<template>
  <div class="app-root">
    <nav class="navbar fade-up">
      <div class="navbar-inner">
        <img :src="logoUrl" alt="小竹熊" class="nav-logo" />

        <div class="tab-track">
          <div class="tab-indicator" :class="{ right: tab === 'video' }"></div>
          <button
            :class="['tab-item', { on: tab === 'img' }]"
            @click="tab = 'img'"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2"
              stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <path d="m21 15-5-5L5 21"/>
            </svg>
            文生图
          </button>
          <button
            :class="['tab-item', { on: tab === 'video' }]"
            @click="tab = 'video'"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2"
              stroke-linecap="round" stroke-linejoin="round">
              <polygon points="5 3 19 12 5 21 5 3"/>
            </svg>
            图生视频
          </button>
        </div>
      </div>
    </nav>

    <main class="main-area fade-up" style="animation-delay:.1s">
      <TextToImg v-if="tab === 'img'" @switch-to-video="tab = 'video'" />
      <ImgToVideo v-else />
    </main>

    <HistoryPanel />

    <div class="bottom-gallery fade-up" style="animation-delay:.25s">
      <div class="section-head">
        <div>
          <span class="section-kicker">灵感参考</span>
          <h2>从示例中快速开始</h2>
        </div>
        <p>挑一个方向，直接带入提示词，减少空白输入带来的犹豫。</p>
      </div>
      <BeamGallery @select="onGallerySelect" />
    </div>

    <footer class="ft fade-up" style="animation-delay:.2s">
      <div class="ft-line"></div>
      <p>小竹熊 · AI 图片与视频创作台</p>
    </footer>
  </div>
</template>

<style scoped>
.app-root {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px 72px;
}

.navbar {
  position: sticky;
  top: 0;
  z-index: 100;
  padding: 14px 0;
  backdrop-filter: blur(20px) saturate(1.2);
  -webkit-backdrop-filter: blur(20px) saturate(1.2);
  border-bottom: 1px solid rgba(255,255,255,0.04);
  margin: 0 -24px;
  padding-left: 24px;
  padding-right: 24px;
}
.navbar-inner {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 24px;
}
.nav-logo {
  height: 32px;
  flex-shrink: 0;
  filter: drop-shadow(0 1px 4px rgba(99,102,241,0.2));
}

.tab-track {
  position: relative;
  display: flex;
  gap: 2px;
  padding: 3px;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 10px;
}
.tab-indicator {
  position: absolute;
  top: 3px;
  left: 3px;
  width: calc(50% - 3px);
  height: calc(100% - 6px);
  border-radius: 8px;
  background: linear-gradient(135deg, rgba(99,102,241,0.15), rgba(168,85,247,0.1));
  border: 1px solid rgba(99,102,241,0.2);
  box-shadow: 0 2px 12px rgba(99,102,241,0.12);
  transition: transform var(--transition-normal);
}
.tab-indicator.right {
  transform: translateX(calc(100% + 2px));
}
.tab-item {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 7px 20px;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: var(--text-muted);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: color var(--transition-fast);
  font-family: var(--font-main);
}
.tab-item:hover { color: var(--text-secondary); }
.tab-item.on { color: var(--text-primary); }

.section-kicker {
  display: inline-flex;
  align-items: center;
  padding: 5px 10px;
  border-radius: 999px;
  border: 1px solid rgba(99,102,241,0.18);
  background: rgba(99,102,241,0.08);
  color: #c7c9ff;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
.bottom-gallery {
  margin-top: 52px;
}
.section-head {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 18px;
}
.section-head h2 {
  margin-top: 12px;
  font-size: 24px;
  line-height: 1.2;
}
.section-head p {
  max-width: 420px;
  color: var(--text-secondary);
  font-size: 14px;
  line-height: 1.7;
}

.ft {
  text-align: center;
  margin-top: 68px;
}
.ft-line {
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(99,102,241,0.15), rgba(168,85,247,0.15), transparent);
  margin-bottom: 20px;
}
.ft p {
  font-size: 12px;
  color: var(--text-muted);
  letter-spacing: 0.01em;
}

@media (max-width: 960px) {
  .section-head {
    align-items: flex-start;
    flex-direction: column;
  }
  .section-head p {
    max-width: none;
  }
}

@media (max-width: 640px) {
  .app-root {
    padding: 0 16px 56px;
  }
  .navbar {
    margin: 0 -16px;
    padding-left: 16px;
    padding-right: 16px;
  }
  .navbar-inner {
    flex-direction: column;
    align-items: flex-start;
    gap: 14px;
  }
  .tab-item {
    padding: 7px 14px;
  }
  .section-head h2 {
    font-size: 22px;
  }
}
</style>
