<script setup lang="ts">
const emit = defineEmits<{ select: [prompt: string] }>()

const examples = [
  { prompt: '一只戴着墨镜的猫，赛博朋克风格，霓虹灯光', icon: '🐱', color: 'linear-gradient(135deg, #6366f1, #a855f7)' },
  { prompt: '水墨山水画，云雾缭绕，古风仙境', icon: '🏔️', color: 'linear-gradient(135deg, #334155, #64748b)' },
  { prompt: '宇宙深处，星云爆发，超现实主义', icon: '🌌', color: 'linear-gradient(135deg, #1e1b4b, #312e81)' },
  { prompt: '未来城市天际线，日落余晖，赛博朋克', icon: '🌆', color: 'linear-gradient(135deg, #be185d, #f97316)' },
  { prompt: '花园中的精灵，魔法光芒，童话风格', icon: '🧚', color: 'linear-gradient(135deg, #059669, #34d399)' },
  { prompt: '机械蝴蝶，蒸汽朋克，金属质感', icon: '🦋', color: 'linear-gradient(135deg, #78350f, #eab308)' }
]
</script>

<template>
  <div class="gallery">
    <div class="gallery-head">
      <div class="title-row">
        <div class="head-icon">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <rect x="3" y="3" width="7" height="7" />
            <rect x="14" y="3" width="7" height="7" />
            <rect x="14" y="14" width="7" height="7" />
            <rect x="3" y="14" width="7" height="7" />
          </svg>
        </div>
        <span>试试这些灵感</span>
      </div>
    </div>

    <div class="grid">
      <button
        v-for="item in examples"
        :key="item.prompt"
        class="example-card"
        @click="emit('select', item.prompt)"
      >
        <div class="card-bg-wrap">
          <div class="gradient-layer" :style="{ background: item.color }"></div>
          <span class="card-emoji">{{ item.icon }}</span>
        </div>
        <p class="card-text">{{ item.prompt.slice(0, 20) }}...</p>
      </button>
    </div>
  </div>
</template>

<style scoped>
.gallery {
  --text-main: #ffffff;
  --text-sub: #a1a1aa;
  --text-muted: #71717a;

  width: 100%;
}

.gallery-head {
  margin-bottom: 20px;
}
.title-row {
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--text-sub);
}
.head-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-main);
}
.gallery-head span {
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
}
@media (max-width: 600px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.example-card {
  border: none;
  padding: 0;
  cursor: pointer;
  background: none;
  text-align: left;
  outline: none;
  position: relative;
}

.example-card:hover {
  transform: translateY(-4px);
  transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}
.example-card:focus-visible .card-bg-wrap {
  box-shadow: 0 8px 28px rgba(99, 102, 241, 0.2);
}

.card-bg-wrap {
  aspect-ratio: 1/1;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #000;
  border: none;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.5);
  overflow: hidden;
  position: relative;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.gradient-layer {
  position: absolute;
  inset: 0;
  opacity: 0;
  transition: opacity 0.2s ease;
  filter: blur(8px);
}
.example-card:hover .gradient-layer {
  opacity: 1;
  filter: blur(0px);
}

.example-card:hover .card-bg-wrap {
  box-shadow:
    0 16px 32px -12px rgba(0, 0, 0, 0.6),
    0 4px 8px -4px rgba(255, 255, 255, 0.05);
}

.card-emoji {
  font-size: 38px;
  z-index: 2;
  filter: drop-shadow(0 0 12px rgba(255, 255, 255, 0.15));
  transition: transform 0.3s ease;
}
.example-card:hover .card-emoji {
  transform: scale(1.08) rotate(2deg);
}

.card-text {
  margin-top: 10px;
  font-size: 13px;
  color: var(--text-sub);
  line-height: 1.5;
  font-weight: 500;
  font-family:
    ui-sans-serif,
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    Roboto,
    Arial,
    sans-serif;
  transition: color 0.15s ease;
}
.example-card:hover .card-text {
  color: var(--text-main);
}
</style>
