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
/* 核心布局与基础变量：与图生视频、文生图保持一致的高对比风格 */
.gallery {
  --color-border: #27272a; /* 硬朗边框色 */
  --color-border-active: #3f3f46;
  --text-main: #ffffff;
  --text-sub: #a1a1aa;
  --text-muted: #71717a;

  width: 100%;
}

/* 头部排版：精准左对齐，强化字重 */
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

/* 灵感网格布局 */
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

/* 强结构感卡片（与之前 UI 保持高度一致） */
.example-card {
  border: none;
  padding: 0;
  cursor: pointer;
  background: none;
  text-align: left;
  outline: none; /* 强制取消 Focus 时的默认轮廓，改为内部实现 */
  position: relative;
}

/* 卡片 Hover/Focus 时的交互：体现深度和力量感 */
.example-card:hover {
  transform: translateY(-4px);
  transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}
.example-card:focus-visible .card-bg-wrap {
  border-color: #6366f1;
  box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.25);
}

/* 精致的卡片背景容器（硬朗边框 + 内嵌质感） */
.card-bg-wrap {
  aspect-ratio: 1/1; /* 统一为正方形，更有块面力量感 */
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #000; /* 默认全黑背景 */
  border: 1px solid var(--color-border); /* 硬朗细边框 */
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.5); /* 微妙内阴影 */
  overflow: hidden;
  position: relative;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

/* 渐变层：仅在 Hover 时呈现，体现强烈的视觉反差 */
.gradient-layer {
  position: absolute;
  inset: 0;
  opacity: 0;
  transition: opacity 0.2s ease;
  filter: blur(8px); /* Subtle blur makes the color look less 'pasted' */
}
.example-card:hover .gradient-layer {
  opacity: 1;
  filter: blur(0px); /* Cancel blur on hover for clean colors */
}

/* 悬浮时的 Diffused（弥散）投影：增加高级感 */
.example-card:hover .card-bg-wrap {
  border-color: var(--color-border-active);
  box-shadow:
    0 16px 32px -12px rgba(0, 0, 0, 0.6),
    /* 主要深度投影 */ 0 4px 8px -4px rgba(255, 255, 255, 0.05); /* 微妙内阴影修正 */
}

/* Emoji 质感：弥散投影 + 居中对齐 */
.card-emoji {
  font-size: 38px;
  z-index: 2; /* 确保 Emoji 在渐变层之上 */
  filter: drop-shadow(0 0 12px rgba(255, 255, 255, 0.15)); /* 微妙的弥散发光 */
  transition: transform 0.3s ease;
}
.example-card:hover .card-emoji {
  transform: scale(1.08) rotate(2deg);
} /* Subtle scaling and rotation for playfulness on hover */

/* 精致的 typography（符合你的力量感要求） */
.card-text {
  margin-top: 10px;
  font-size: 13px; /* 微调字号 */
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
  color: var(--text-main); /* Hover 时文字变亮 */
}
</style>
