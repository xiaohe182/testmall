<script setup lang="ts">
import { useGenerationStore } from '@/stores/generation'
import PromptInput from '@/components/PromptInput.vue'
import GenButton from '@/components/GenButton.vue'
import ChipSelect from '@/components/ChipSelect.vue'
import SkeletonCard from '@/components/SkeletonCard.vue'

const store = useGenerationStore()
const emit = defineEmits<{ switchToVideo: [] }>()

const sizes = ['768x1344', '864x1152', '1024x1024', '1152x864', '1344x768']

const presets = [
  '一只戴着墨镜的猫，赛博朋克风格，霓虹灯光',
  '水墨山水画，云雾缭绕，古风仙境',
  '宇宙深处，星云爆发，超现实主义',
  '未来城市天际线，日落余晖，赛博朋克',
  '花园中的精灵，魔法光芒，童话风格',
  '机械蝴蝶，蒸汽朋克，金属质感'
]

function fillPreset(t: string) {
  store.imgPrompt = t
}
</script>

<template>
  <div class="t2i-wrap">
    <!-- INPUT AREA -->
    <div class="input-area">
      <div class="card">
        <div class="card-head">
          <div class="card-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
            </svg>
          </div>
          <div class="head-text">
            <h2 class="card-title">描述你想要的图片</h2>
            <span class="card-hint">{{ store.imgPrompt.length }} 字</span>
          </div>
        </div>

        <PromptInput
          v-model="store.imgPrompt"
          placeholder="描述你想生成的图片内容，越详细效果越好..."
        />

        <div class="presets" v-if="!store.imgLoading">
          <span class="label">灵感提示</span>
          <div class="presets-list">
            <button v-for="p in presets" :key="p" class="chip" @click="fillPreset(p)">
              {{ p.slice(0, 14) }}...
            </button>
          </div>
        </div>

        <ChipSelect label="尺寸" v-model="store.imgSize" :items="sizes" />

        <!-- 批量数量 -->
        <div class="batch-row">
          <span class="label">生成数量</span>
          <div class="batch-opts">
            <button
              v-for="n in [1, 2, 4]"
              :key="n"
              :class="['batch-chip', { active: store.imgBatchSize === n }]"
              @click="store.imgBatchSize = n"
            >{{ n }} 张</button>
          </div>
        </div>

        <GenButton
          :disabled="!store.canGenImg || store.imgLoading"
          :loading="store.imgLoading"
          text="生成图片"
          @click="store.generateImage()"
        />
      </div>
    </div>

    <!-- RESULT AREA -->
    <div class="result-area">
      <!-- loading -->
      <div v-if="store.imgLoading" class="skeleton-grid">
        <SkeletonCard
          v-for="i in store.imgBatchSize"
          :key="i"
          type="img"
          :text="`正在生成第 ${i} 张...`"
        />
      </div>

      <!-- results grid -->
      <div v-else-if="store.imgResults.length > 0" class="result-grid" :class="{ single: store.imgResults.length === 1 }">
        <div v-for="(item, idx) in store.imgResults" :key="idx" class="img-wrap">
          <img :src="item.url" alt="生成图片" class="result-img" />
          <div class="img-hover">
            <a :href="item.url" target="_blank" class="hover-btn">查看原图</a>
            <button class="hover-btn accent" @click="store.sendToVideo(item.url); emit('switchToVideo')">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polygon points="5 3 19 12 5 21 5 3"/>
              </svg>
              生成视频
            </button>
          </div>
        </div>
      </div>

      <div v-else class="empty-wrap">
        <div class="empty-inner">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2"/>
            <circle cx="8.5" cy="8.5" r="1.5"/>
            <path d="m21 15-5-5L5 21"/>
          </svg>
          <p>输入描述，开始创作</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.t2i-wrap {
  display: grid;
  grid-template-columns: 380px 1fr;
  gap: 28px;
  align-items: stretch;
}
@media (max-width: 860px) {
  .t2i-wrap { grid-template-columns: 1fr; }
}

/* card */
.card {
  background: rgba(255,255,255,0.02);
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 20px;
  padding: 24px;
  backdrop-filter: blur(16px);
  transition: all var(--transition-normal);
  position: sticky;
  top: 70px;
  align-self: start;
}
.card:hover { border-color: rgba(99,102,241,0.12); }
.card-head {
  display: flex; align-items: center; gap: 10px; margin-bottom: 18px;
}
.card-icon {
  width: 34px; height: 34px; border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  background: linear-gradient(135deg, rgba(99,102,241,0.15), rgba(168,85,247,0.1));
  color: var(--accent-indigo); flex-shrink: 0;
}
.head-text { flex: 1; }
.card-title { font-size: 14px; font-weight: 700; line-height: 1.2; }
.card-hint { font-size: 11px; color: var(--text-muted); }

/* presets */
.presets { margin-bottom: 14px; }
.label {
  font-size: 11px; color: var(--text-muted);
  font-weight: 600; text-transform: uppercase;
  letter-spacing: 0.06em; margin-bottom: 8px; display: block;
}
.presets-list { display: flex; flex-wrap: wrap; gap: 5px; }
.chip {
  padding: 4px 10px; border-radius: 100px;
  border: 1px solid rgba(255,255,255,0.06);
  background: rgba(255,255,255,0.02);
  color: var(--text-secondary);
  font-size: 11px; cursor: pointer;
  transition: all var(--transition-fast);
}
.chip:hover {
  border-color: rgba(99,102,241,0.3);
  color: var(--accent-indigo);
  background: rgba(99,102,241,0.06);
}

/* batch */
.batch-row { margin-bottom: 18px; }
.batch-opts { display: flex; gap: 6px; }
.batch-chip {
  padding: 5px 14px; border-radius: 8px;
  border: 1px solid rgba(255,255,255,0.06);
  background: rgba(255,255,255,0.02);
  color: var(--text-secondary);
  font-size: 12px; cursor: pointer;
  transition: all var(--transition-fast);
  font-family: var(--font-main);
}
.batch-chip:hover {
  border-color: rgba(99,102,241,0.3);
  color: var(--accent-indigo);
}
.batch-chip.active {
  background: linear-gradient(135deg, rgba(99,102,241,0.15), rgba(168,85,247,0.1));
  border-color: rgba(99,102,241,0.3);
  color: var(--accent-indigo);
}

/* result area */
.result-area {
  display: flex;
  align-items: flex-start;
  justify-content: center;
}

/* skeleton grid */
.skeleton-grid {
  width: 100%;
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}

/* result grid */
.result-grid {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}
.result-grid.single {
  grid-template-columns: 1fr;
}

.img-wrap {
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  background: var(--bg-secondary);
  box-shadow: 0 6px 32px rgba(0,0,0,0.2);
  border: 1px solid rgba(255,255,255,0.04);
  transition: transform var(--transition-fast), box-shadow var(--transition-fast);
}
.img-wrap:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 40px rgba(0,0,0,0.3);
}
.result-img { width: 100%; display: block; }
.img-hover {
  position: absolute; inset: 0;
  background: rgba(0,0,0,0.5);
  backdrop-filter: blur(6px);
  display: flex; gap: 8px;
  align-items: center; justify-content: center;
  opacity: 0; transition: opacity var(--transition-normal);
}
.img-wrap:hover .img-hover { opacity: 1; }
.hover-btn {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 8px 16px; border-radius: 10px;
  border: 1px solid rgba(255,255,255,0.2);
  background: rgba(255,255,255,0.08);
  color: white; font-size: 12px; font-weight: 600;
  cursor: pointer; text-decoration: none;
  transition: all var(--transition-fast);
  font-family: var(--font-main);
}
.hover-btn:hover {
  background: rgba(255,255,255,0.15);
  border-color: rgba(255,255,255,0.4);
}
.hover-btn.accent {
  background: linear-gradient(135deg, rgba(99,102,241,0.5), rgba(168,85,247,0.5));
  border-color: rgba(99,102,241,0.4);
}
.hover-btn.accent:hover {
  background: linear-gradient(135deg, rgba(99,102,241,0.7), rgba(168,85,247,0.7));
}

.empty-wrap {
  width: 100%;
  height: 100%;
  min-height: 480px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 20px;
  border: 1px dashed rgba(255,255,255,0.06);
  background: rgba(255,255,255,0.01);
}
.empty-inner {
  text-align: center;
  color: var(--text-muted);
}
.empty-inner p {
  margin-top: 12px;
  font-size: 14px;
}
</style>
