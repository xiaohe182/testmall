<script setup lang="ts">
import { useGenerationStore } from '@/stores/generation'
import PromptInput from '@/components/PromptInput.vue'
import GenButton from '@/components/GenButton.vue'
import ChipSelect from '@/components/ChipSelect.vue'
import ResultContainer from '@/components/ResultContainer.vue'

const store = useGenerationStore()
const emit = defineEmits<{ switchToVideo: [] }>()

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
            <span class="card-hint">
              {{ store.imgPrompt.length }} / {{ store.currentImageModel.imageOptions?.promptMaxLength || 1000 }} 字
            </span>
          </div>
        </div>

        <PromptInput
          v-model="store.imgPrompt"
          placeholder="描述你想生成的图片内容，越详细效果越好..."
          :max-length="store.currentImageModel.imageOptions?.promptMaxLength || 1000"
        />

        <div class="presets">
          <span class="label">灵感提示</span>
          <div class="presets-list">
            <button v-for="p in presets" :key="p" class="chip" @click="fillPreset(p)" :disabled="store.imgLoading">
              {{ p }}
            </button>
          </div>
        </div>

        <ChipSelect label="尺寸" v-model="store.imgSize" :items="store.currentImageSizeOptions" />

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

        <div class="card-actions">
          <div class="generate-action">
            <GenButton
              :disabled="!store.canGenImg || store.imgLoading"
              :loading="store.imgLoading"
              text="生成图片"
              @click="store.generateImage()"
            />
          </div>

          <label class="model-picker">
            <select
              v-model="store.imgModel"
              class="model-select"
              :disabled="store.imgLoading"
              @change="store.syncImageSizeWithModel()"
            >
              <option
                v-for="model in store.imageModelOptions"
                :key="model.id"
                :value="model.id"
              >
                {{ model.name }} · {{ model.pricing.cnyPerCall === null ? '价格待确认' : `${model.pricing.cnyPerCall}元/次` }}
              </option>
            </select>
          </label>
        </div>
      </div>
    </div>

    <div class="result-area">
      <ResultContainer
        :loading="store.imgLoading"
        :error="store.imgError"
        empty-text="输入描述，开始创作"
        :loading-cols="store.imgBatchSize > 1 ? 2 : 1"
        @retry="store.generateImage()"
      >
        <div class="result-grid" :class="{ single: store.imgResults.length === 1 }">
          <div v-for="(item, idx) in store.imgResults" :key="idx" class="result-item">
            <div class="img-preview">
              <div class="img-wrap">
                <img :src="item.url" alt="生成图片" class="result-img" />
              </div>
            </div>
            <div class="action-bar">
              <a :href="item.url" target="_blank" download class="action-btn">下载原图</a>
              <button class="action-btn accent" @click="store.sendToVideo(item.url); emit('switchToVideo')">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polygon points="5 3 19 12 5 21 5 3"/>
                </svg>
                生成视频
              </button>
            </div>
          </div>
        </div>
      </ResultContainer>
    </div>
  </div>
</template>

<style scoped>
.t2i-wrap {
  display: flex;
  flex-direction: row;
  align-items: stretch;
  gap: 28px;
}
.input-area {
  flex: 0 0 380px;
  width: 380px;
  max-width: 380px;
  display: flex;
  flex-direction: column;
  min-height: 0;
}
@media (max-width: 860px) {
  .t2i-wrap {
    flex-direction: column;
  }
  .input-area {
    flex: none;
    width: 100%;
    max-width: 100%;
  }
  .card { flex: none; }
  .result-area {
    flex: none;
    width: 100%;
  }
  .card-actions {
    flex-direction: column;
  }
  .model-picker {
    width: 100%;
  }
}

.card-actions {
  margin-top: auto;
  flex-shrink: 0;
  padding-top: 4px;
  display: flex;
  align-items: center;
  gap: 10px;
}
.generate-action {
  flex: 0 0 128px;
  min-width: 0;
}
.model-picker {
  flex: 1;
  min-width: 0;
  display: block;
}
.model-select {
  width: 100%;
  height: 46px;
  border-radius: 14px;
  border: none;
  background: rgb(18, 18, 20);
  color: var(--text-secondary);
  font-size: 13px;
  font-family: var(--font-main);
  font-weight: 600;
  padding: 0 12px;
  outline: none;
}
.model-select:focus {
  background: rgb(22, 22, 26);
  box-shadow: 0 8px 28px rgba(20, 150, 243, 0.12);
}
.model-select:disabled {
  opacity: 0.5;
}

@media (max-width: 860px) {
  .model-picker {
    width: 100%;
  }
  .generate-action {
    flex-basis: auto;
  }
}

.card {
  background: var(--card-bg);
  border: none;
  border-radius: var(--card-radius);
  padding: 24px;
  backdrop-filter: blur(16px);
  transition: background-color var(--transition-fast), transform var(--transition-normal);
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  width: 100%;
}
.card:hover { background: rgba(255, 255, 255, 0.035); }
.card-head {
  display: flex; align-items: center; gap: 10px; margin-bottom: 18px;
}
.card-icon {
  width: 34px; height: 34px; border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  background: linear-gradient(135deg, rgba(20, 150, 243, 0.15), rgba(168, 85, 247, 0.1));
  color: #1496f3; flex-shrink: 0;
}
.head-text { flex: 1; }
.card-title { font-size: 14px; font-weight: 700; line-height: 1.2; }
.card-hint { font-size: 11px; color: var(--text-muted); }

.presets { margin-bottom: 24px; width: 100%; }
.label {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.6);
  font-weight: 600;
  letter-spacing: 0.02em;
  margin-bottom: 10px;
  display: block;
}
.presets-list { 
  display: flex; 
  flex-direction: column;
  gap: 4px;
  width: 100%;
}
.chip {
  width: 100%;
  padding: 5px 12px; border-radius: 10px;
  border: none;
  background: rgba(255,255,255,0.02);
  color: var(--text-secondary);
  font-size: 12px;
  line-height: 1.35;
  cursor: pointer;
  transition: all var(--transition-fast);
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.chip:hover {
  color: #1496f3;
  background: rgba(20, 150, 243, 0.1);
}

.batch-row { margin-bottom: 18px; }
.batch-opts { display: flex; gap: 8px; }
.batch-chip {
  padding: 6px 14px; border-radius: 8px;
  border: none;
  background: rgb(18, 18, 20);
  color: rgba(255, 255, 255, 0.6);
  font-size: 13px; cursor: pointer;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  font-family: var(--font-main);
  font-weight: 500;
}
.batch-chip:hover:not(.active) {
  background-color: rgba(255, 255, 255, 0.05);
}
.batch-chip.active {
  background: rgba(20, 150, 243, 0.1);
  color: #1496f3;
  font-weight: 600;
  box-shadow: 0 0 10px rgba(20, 150, 243, 0.1);
}

.result-area {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.result-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  align-content: start;
}
.result-grid.single {
  grid-template-columns: 1fr;
}
.result-item {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.img-preview {
  width: 100%;
  border-radius: 16px;
  border: none;
  background: rgba(255,255,255,0.03);
  overflow: hidden;
}
.img-wrap {
  position: relative;
  width: 100%;
  aspect-ratio: 1 / 1;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}
.result-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: center;
  display: block;
}

.action-bar {
  display: flex;
  gap: 8px;
}
.action-btn {
  flex: 1;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  background: rgba(255,255,255,0.05);
  border: none;
  border-radius: 8px;
  color: var(--text-secondary);
  font-size: 13px;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  transition: all var(--transition-fast);
}
.action-btn:hover {
  background: rgba(255,255,255,0.08);
  color: var(--text-primary);
}
.action-btn.accent {
  background: var(--accent-blue-soft);
  color: var(--accent-indigo);
}
.action-btn.accent:hover {
  background: rgba(20, 150, 243, 0.15);
}
</style>
