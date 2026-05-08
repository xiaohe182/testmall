<script setup lang="ts">
import imgWhiteRoom from '@/images/whiteRoom.png'
import imgRedRoom from '@/images/redRoom.png'
import imgWhiteBall from '@/images/whiteBacketball.png'
import imgYellowBall from '@/images/yellowBacketball.png'
import imgWhiteHouse from '@/images/whiteHouse.png'
import imgRedHouse from '@/images/redHouse.png'
import imgGreenTree from '@/images/greenTree.png'
import imgYellowTree from '@/images/yellowTree.png'

const emit = defineEmits<{ select: [prompt: string] }>()

const pairs = [
  { before: imgWhiteRoom, after: imgRedRoom, prompt: '温馨房间，暖色调，柔和灯光，精致装修' },
  { before: imgWhiteBall, after: imgYellowBall, prompt: '篮球运动，动感抓拍，光影效果，体育摄影' },
  { before: imgWhiteHouse, after: imgRedHouse, prompt: '精致小屋，建筑美学，自然光影，写实风格' },
  { before: imgGreenTree, after: imgYellowTree, prompt: '大树风景，四季变换，自然色彩，高清摄影' }
]
</script>

<template>
  <div class="gallery">
    <p class="gallery-note">左右画面对比展示风格变化，点击任意卡片即可把提示词带入文生图。</p>
    <div class="row">
      <div
        v-for="pair in pairs"
        :key="pair.prompt"
        class="card"
        @click="emit('select', pair.prompt)"
      >
        <img :src="pair.after" alt="" class="img-base" loading="lazy" />
        <img :src="pair.before" alt="" class="img-base img-before" loading="lazy" />
        <div class="beam">
          <div class="beam-core"></div>
          <div class="beam-halo"></div>
        </div>
        <div class="card-copy">
          <span>一键带入</span>
          <p>{{ pair.prompt }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.gallery {
  width: 100%;
}
.gallery-note {
  margin-bottom: 14px;
  color: var(--text-secondary);
  font-size: 14px;
  line-height: 1.7;
}

.row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
}

/* ──── card ──── */

.card {
  --dur: 2.2s;
  position: relative;
  aspect-ratio: 4 / 3;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  border: 1px solid rgba(255,255,255,0.06);
  background: var(--bg-secondary);
  transition: border-color var(--transition-fast);
}

.card:hover {
  border-color: rgba(99,102,241,0.15);
}
.card-copy {
  position: absolute;
  right: 10px;
  bottom: 10px;
  left: 10px;
  z-index: 12;
  padding: 12px;
  border-radius: 12px;
  background: linear-gradient(180deg, rgba(10,10,15,0), rgba(10,10,15,0.82));
  color: white;
}
.card-copy span {
  display: inline-flex;
  margin-bottom: 6px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.72);
}
.card-copy p {
  font-size: 12px;
  line-height: 1.5;
}

/* ──── img layers ──── */

.img-base {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  user-select: none;
  -webkit-user-drag: none;
}

.img-before {
  z-index: 2;
  clip-path: inset(0 50% 0 0);
}

/* ──── beam ──── */

.beam {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 50%;
  z-index: 10;
  transform: translateX(-50%);
  pointer-events: none;
}

.beam-core {
  position: absolute;
  top: 0;
  bottom: 0;
  left: -1.5px;
  width: 3px;
  background: white;
  box-shadow:
    0 0 4px 1px rgba(255,255,255,0.8),
    0 0 12px 2px rgba(99,102,241,0.5),
    0 0 28px 6px rgba(168,85,247,0.2);
}

.beam-halo {
  position: absolute;
  top: 0;
  bottom: 0;
  left: -24px;
  width: 48px;
  background: linear-gradient(90deg,
    transparent,
    rgba(255,255,255,0.04) 30%,
    rgba(255,255,255,0.07) 50%,
    rgba(255,255,255,0.04) 70%,
    transparent
  );
}

/* ──── hover animation ──── */

.card:hover .img-before {
  animation: clip-sweep var(--dur) ease-in-out forwards;
}

.card:hover .beam {
  animation: beam-sweep var(--dur) ease-in-out forwards;
}

/* 光束：中间 → 左 → 右 → 中间 */
@keyframes beam-sweep {
  0%   { left: 50%; }
  35%  { left: 3%; }
  65%  { left: 97%; }
  100% { left: 50%; }
}

/* clip-path：与光束同步，控制 before 图可见区域 */
@keyframes clip-sweep {
  0%   { clip-path: inset(0 50% 0 0); }
  35%  { clip-path: inset(0 97% 0 0); }
  65%  { clip-path: inset(0 0%  0 0); }
  100% { clip-path: inset(0 50% 0 0); }
}

@media (max-width: 960px) {
  .row {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .row {
    grid-template-columns: 1fr;
  }
}
</style>
