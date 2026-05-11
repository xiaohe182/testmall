<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useVideoStore } from '@/stores/video'
import { useToast } from '@/composables/useToast'
import { priceLabel } from '@/config/videoModels'
import PromptInput from '@/components/PromptInput.vue'
import GenButton from '@/components/GenButton.vue'
import ChipSelect from '@/components/ChipSelect.vue'

const store = useVideoStore()
const toast = useToast()

const dropZone = ref<HTMLDivElement>()
const fileInput = ref<HTMLInputElement>()
const isDragging = ref(false)
const uploadTarget = ref<'main' | 'last' | 'r2' | 'r3'>('main')

const priceLine = computed(() => priceLabel(store.currentPreset))

const showPrimaryImage = computed(() => store.currentPreset.inputKind !== 'text_only')
const showLastFrame = computed(() => store.currentPreset.inputKind === 'two_frames')
const showRefExtras = computed(() => store.currentPreset.inputKind === 'one_to_three_refs')
const primaryImageLabel = computed(() => {
  const k = store.currentPreset.inputKind
  if (k === 'text_or_image') return '参考图像（可选，文生视频可不传）'
  if (k === 'one_to_three_refs') return '参考图 1'
  if (k === 'two_frames') return '首帧图像'
  return '参考图像'
})

const durationItems = computed(() =>
  (store.currentPreset.durations ?? []).map((d) => String(d))
)

const fpsItems = computed(() => (store.currentPreset.fps ?? []).map((f) => String(f)))

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('请选择图片文件'))
      return
    }
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(new Error('文件读取失败'))
    reader.readAsDataURL(file)
  })
}

async function handleFiles(files: FileList | File[]) {
  const file = files[0]
  if (!file) return
  try {
    const url = await fileToDataUrl(file)
    if (uploadTarget.value === 'main') store.imageUrl = url
    else if (uploadTarget.value === 'last') store.lastFrameUrl = url
    else if (uploadTarget.value === 'r2') store.ref2Url = url
    else store.ref3Url = url
  } catch (e: any) {
    toast.show(e.message || '图片读取失败', 'error')
  }
}

function onDrop(e: DragEvent) {
  isDragging.value = false
  e.preventDefault()
  uploadTarget.value = 'main'
  const files = e.dataTransfer?.files
  if (files?.length) handleFiles(files)
}

function onDragOver(e: DragEvent) {
  e.preventDefault()
  isDragging.value = true
}

function onDragLeave() {
  isDragging.value = false
}

function onFileChange(e: Event) {
  const input = e.target as HTMLInputElement
  if (input.files?.length) {
    handleFiles(input.files)
    input.value = ''
  }
}

function triggerFileInput(target: 'main' | 'last' | 'r2' | 'r3' = 'main') {
  uploadTarget.value = target
  fileInput.value?.click()
}

function onPaste(e: ClipboardEvent) {
  const target = e.target as HTMLElement
  if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return

  const items = e.clipboardData?.items
  if (!items) return
  for (const item of items) {
    if (item.type.startsWith('image/')) {
      e.preventDefault()
      uploadTarget.value = 'main'
      const file = item.getAsFile()
      if (file) handleFiles([file])
      return
    }
  }
}

onMounted(() => {
  document.addEventListener('paste', onPaste)
})

onUnmounted(() => {
  document.removeEventListener('paste', onPaste)
})
</script>

<template>
  <div class="i2v-wrap">
    <div class="input-area">
      <div class="card">
        <div class="card-head">
          <div class="card-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="5 3 19 12 5 21 5 3"/>
            </svg>
          </div>
          <div class="head-text">
            <h2 class="card-title">视频生成</h2>
            <span class="card-hint">按智谱文档选择模型与参数；异步任务完成后在右侧预览</span>
          </div>
        </div>

        <div class="form-group">
          <label class="label">模型</label>
          <select v-model="store.presetId" class="video-model-select">
            <option
              v-for="p in store.VIDEO_GEN_PRESETS"
              :key="p.id"
              :value="p.id"
            >
              {{ p.label }} · {{ priceLabel(p) }}
            </option>
          </select>
          <p class="model-meta">
            <span>价格：{{ priceLine }}</span>
            <span class="meta-sep">·</span>
            <span>输入：{{ store.currentPreset.modalitiesDesc }}</span>
          </p>
        </div>

        <ChipSelect
          v-if="store.currentPreset.durations && store.currentPreset.durations.length > 1"
          label="时长（秒）"
          :model-value="String(store.duration)"
          :items="durationItems"
          @update:model-value="(v) => (store.duration = Number(v))"
        />
        <p
          v-else-if="store.currentPreset.durations?.length === 1"
          class="fixed-param"
        >时长：{{ store.currentPreset.durations[0] }} 秒（文档固定）</p>

        <ChipSelect
          label="分辨率（size）"
          :model-value="store.size"
          :items="store.currentPreset.sizes"
          @update:model-value="(v) => (store.size = v)"
        />

        <ChipSelect
          v-if="store.currentPreset.fps?.length"
          label="帧率（fps）"
          :model-value="String(store.fps)"
          :items="fpsItems"
          @update:model-value="(v) => (store.fps = Number(v))"
        />

        <div v-if="store.currentPreset.quality?.length" class="form-group">
          <label class="label">输出模式（quality）</label>
          <select v-model="store.quality" class="param-select">
            <option value="speed">speed · 速度优先（默认）</option>
            <option value="quality">quality · 质量优先</option>
          </select>
        </div>

        <div v-if="store.currentPreset.style?.length" class="form-group">
          <label class="label">风格（style）</label>
          <select v-model="store.style" class="param-select">
            <option value="general">general · 通用</option>
            <option value="anime">anime · 动漫优化</option>
          </select>
        </div>

        <div v-if="store.currentPreset.aspectRatio?.length" class="form-group">
          <label class="label">宽高比（aspect_ratio）</label>
          <select v-model="store.aspectRatio" class="param-select">
            <option v-for="a in store.currentPreset.aspectRatio" :key="a" :value="a">{{ a }}</option>
          </select>
        </div>

        <div v-if="store.currentPreset.movementAmplitude?.length" class="form-group">
          <label class="label">运动幅度（movement_amplitude）</label>
          <select v-model="store.movementAmplitude" class="param-select">
            <option value="auto">auto</option>
            <option value="small">small</option>
            <option value="medium">medium</option>
            <option value="large">large</option>
          </select>
        </div>

        <div v-if="store.currentPreset.withAudioConfigurable" class="check-row">
          <label class="check-label">
            <input v-model="store.withAudio" type="checkbox" />
            生成音效 / 配乐（with_audio，以接口与模型支持为准）
          </label>
        </div>
        <div v-if="store.currentPreset.watermarkConfigurable" class="check-row">
          <label class="check-label">
            <input v-model="store.watermarkEnabled" type="checkbox" />
            启用水印（watermark_enabled）
          </label>
        </div>

        <div v-if="showPrimaryImage" class="form-group">
          <label class="label">{{ primaryImageLabel }}</label>

          <div v-if="store.imageUrl" class="source-preview">
            <img :src="store.imageUrl" alt="参考图片" class="source-img" />
            <button type="button" class="clear-btn" @click="store.imageUrl = ''">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          <div
            v-else
            ref="dropZone"
            class="drop-zone"
            :class="{ active: isDragging }"
            @drop="onDrop"
            @dragover="onDragOver"
            @dragleave="onDragLeave"
            @click="triggerFileInput('main')"
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="17 8 12 3 7 8"/>
              <line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
            <p class="drop-title">拖拽图片到此处，或点击上传</p>
            <p class="drop-hint">支持 Ctrl+V 粘贴 · 拖拽 · 点击选择 · URL 输入</p>
            <div class="url-row">
              <input
                v-model="store.imageUrl"
                class="url-input"
                placeholder="或粘贴图片 URL..."
                @click.stop
              />
            </div>
          </div>
        </div>

        <div v-if="showLastFrame" class="form-group">
          <label class="label">尾帧图像</label>
          <div v-if="store.lastFrameUrl" class="source-preview">
            <img :src="store.lastFrameUrl" alt="尾帧" class="source-img" />
            <button type="button" class="clear-btn" @click="store.lastFrameUrl = ''">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
          <button type="button" class="secondary-upload" @click="triggerFileInput('last')">
            {{ store.lastFrameUrl ? '更换尾帧' : '上传尾帧' }}
          </button>
        </div>

        <div v-if="showRefExtras" class="form-group">
          <label class="label">参考图 2、3（可选；参考图 1 见上方）</label>
          <div class="ref-url-row">
            <input v-model="store.ref2Url" class="url-input" placeholder="参考图 2 URL 或留空" @click.stop />
            <button type="button" class="secondary-upload" @click="triggerFileInput('r2')">上传图2</button>
          </div>
          <div class="ref-url-row">
            <input v-model="store.ref3Url" class="url-input" placeholder="参考图 3 URL 或留空" @click.stop />
            <button type="button" class="secondary-upload" @click="triggerFileInput('r3')">上传图3</button>
          </div>
        </div>

        <div class="form-group">
          <label class="label">提示词（prompt）</label>
          <PromptInput
            v-model="store.prompt"
            :max-length="store.currentPreset.promptMaxLen"
            placeholder="描述视频中的运动和变化；部分模型允许仅图或仅文，见上方输入模态说明"
          />
        </div>

        <input
          ref="fileInput"
          type="file"
          accept="image/*"
          class="hidden-input"
          @change="onFileChange"
        />

        <div class="card-actions">
          <GenButton
            :disabled="!store.canGenerate || store.loading"
            :loading="store.loading"
            :text="store.loading ? store.status || '生成中...' : '生成视频'"
            @click="store.generate()"
          />
        </div>
      </div>
    </div>

    <div class="result-area">
      <div v-if="store.loading" class="result-fill skeleton-grid">
        <div class="video-preview">
          <div class="video-wrap loading-media">
            <div class="loading-spinner"></div>
          </div>
        </div>
        <div class="video-actions loading-actions">
          <span class="action-placeholder"></span>
        </div>
      </div>

      <div v-else-if="store.result" class="result-fill video-result animate-enter">
        <div class="video-preview">
          <div class="video-wrap">
            <video
              :src="store.result.url"
              :poster="store.result.cover_image_url"
              controls
              loop
              class="result-video"
            >
              <source :src="store.result.url" type="video/mp4" />
            </video>
          </div>
        </div>
        <div class="video-actions">
          <a :href="store.result.url" target="_blank" class="action-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            下载视频
          </a>
        </div>
      </div>

      <div v-else-if="store.error" class="result-fill error-wrap">
        <div class="error-inner">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="15" y1="9" x2="9" y2="15"/>
            <line x1="9" y1="9" x2="15" y2="15"/>
          </svg>
          <h3>生成失败</h3>
          <p>{{ store.error }}</p>
          <button class="retry-btn" @click="store.error = null">重试</button>
        </div>
      </div>

      <div v-else class="result-fill empty-wrap">
        <div class="empty-inner">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="5 3 19 12 5 21 5 3"/>
          </svg>
          <p>选择模型与参数，填写提示词或按模态上传图像后开始生成</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.i2v-wrap {
  display: flex;
  flex-direction: row;
  align-items: stretch;
  gap: 28px;
}
.input-area {
  flex: 0 0 380px;
  width: 380px;
  max-width: 100%;
  display: flex;
  flex-direction: column;
  min-height: 0;
}
@media (max-width: 860px) {
  .i2v-wrap {
    flex-direction: column;
  }
  .input-area {
    flex: none;
    width: 100%;
  }
  .card { flex: none; }
  .result-area {
    flex: none;
    width: 100%;
  }
}

.card-actions {
  margin-top: auto;
  flex-shrink: 0;
  padding-top: 4px;
}

.card {
  background: rgba(255,255,255,0.02);
  border: none;
  border-radius: 20px;
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
.card-title { font-size: 14px; font-weight: 700; line-height: 1.2; margin: 0; }
.card-hint { font-size: 11px; color: var(--text-muted); }

.form-group { margin-bottom: 24px; }
.label {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.6);
  font-weight: 600;
  letter-spacing: 0.02em;
  margin-bottom: 10px;
  display: block;
}

.source-preview {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  border: none;
}
.source-img {
  width: 100%;
  max-height: 200px;
  object-fit: cover;
  display: block;
}
.clear-btn {
  position: absolute;
  top: 6px; right: 6px;
  width: 24px; height: 24px;
  border-radius: 6px;
  border: none;
  background: rgba(0,0,0,0.5);
  color: rgba(255,255,255,0.7);
  display: flex; align-items: center; justify-content: center;
  cursor: pointer;
  transition: all var(--transition-fast);
}
.clear-btn:hover {
  background: rgba(255,60,60,0.7);
  color: #fff;
}

.drop-zone {
  display: flex; flex-direction: column; align-items: center;
  gap: 8px; padding: 28px 20px 18px;
  border-radius: 12px;
  border: none;
  background: rgba(255,255,255,0.01);
  text-align: center;
  cursor: pointer;
  transition: all var(--transition-fast);
}
.drop-zone:hover {
  background: rgba(20, 150, 243, 0.03);
}
.drop-zone.active {
  background: rgba(20, 150, 243, 0.06);
  box-shadow: 0 8px 28px rgba(20, 150, 243, 0.12);
}
.drop-zone svg {
  color: var(--text-muted); opacity: 0.4;
  transition: all var(--transition-fast);
}
.drop-zone:hover svg { opacity: 0.7; color: #1496f3; }
.drop-zone.active svg { opacity: 1; color: #1496f3; }

.drop-title {
  font-size: 13px; color: var(--text-secondary);
  margin: 0; font-weight: 600;
}
.drop-hint {
  font-size: 11px; color: var(--text-muted);
  margin: 0; opacity: 0.7;
}

.url-row { width: 100%; margin-top: 6px; }
.url-input {
  width: 100%;
  padding: 8px 12px;
  border-radius: 8px;
  border: none;
  background: rgba(0,0,0,0.2);
  color: var(--text-primary);
  font-size: 12px;
  transition: box-shadow var(--transition-fast), background-color var(--transition-fast);
}
.url-input:focus {
  outline: none;
  background: rgba(0,0,0,0.28);
  box-shadow: 0 8px 28px rgba(20, 150, 243, 0.12);
}
.url-input::placeholder { color: var(--text-muted); }

.hidden-input { display: none; }

.video-model-select {
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
.model-meta {
  margin-top: 8px;
  font-size: 11px;
  color: var(--text-muted);
  line-height: 1.45;
}
.meta-sep { margin: 0 6px; opacity: 0.5; }
.param-select {
  width: 100%;
  height: 42px;
  border-radius: 12px;
  border: none;
  background: rgb(18, 18, 20);
  color: var(--text-secondary);
  font-size: 13px;
  font-family: var(--font-main);
  font-weight: 600;
  padding: 0 12px;
}
.check-row {
  margin-bottom: 14px;
}
.check-label {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 12px;
  color: var(--text-muted);
  cursor: pointer;
}
.check-label input {
  margin-top: 3px;
}
.secondary-upload {
  margin-top: 8px;
  padding: 8px 14px;
  border-radius: 10px;
  border: none;
  background: rgba(255,255,255,0.06);
  color: var(--text-secondary);
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  font-family: var(--font-main);
}
.secondary-upload:hover {
  background: rgba(20, 150, 243, 0.12);
  color: #1496f3;
}
.ref-url-row {
  display: flex;
  gap: 8px;
  align-items: center;
  margin-bottom: 8px;
}
.ref-url-row .url-input { flex: 1; margin-top: 0; }
.fixed-param {
  font-size: 12px;
  color: var(--text-muted);
  margin-bottom: 16px;
}

.result-area {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  min-height: 0;
}
.result-fill {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  min-height: 0;
  width: 100%;
}

.skeleton-grid { width: 100%; }

.video-result.result-fill {
  justify-content: flex-start;
}
.animate-enter {
  animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
@keyframes slideUp {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.video-result { width: 100%; flex-shrink: 0; }

.video-preview {
  width: 100%;
  border-radius: 16px;
  overflow: hidden;
  border: none;
  box-shadow: 0 6px 32px rgba(0,0,0,0.2);
  background: #000;
}
.video-wrap {
  width: 100%;
  aspect-ratio: 16 / 9;
  display: flex;
  align-items: center;
  justify-content: center;
}
.result-video {
  width: 100%;
  height: 100%;
  max-height: 100%;
  display: block;
  object-fit: contain;
}

.loading-media {
  display: flex;
  align-items: center;
  justify-content: center;
  background:
    linear-gradient(110deg, rgba(99,102,241,0.04) 30%, rgba(99,102,241,0.1) 50%, rgba(99,102,241,0.04) 70%);
  background-size: 200% 100%;
  animation: shimmer 1.5s ease-in-out infinite;
}
.loading-spinner {
  width: 28px;
  height: 28px;
  border-radius: 999px;
  border: none;
  background: conic-gradient(from 0deg, rgba(20, 150, 243, 0.9), rgba(20, 150, 243, 0.1));
  mask: radial-gradient(farthest-side, transparent calc(100% - 2.5px), #000 calc(100% - 1.5px));
  -webkit-mask: radial-gradient(farthest-side, transparent calc(100% - 2.5px), #000 calc(100% - 1.5px));
  animation: spin 0.8s linear infinite;
}
.action-placeholder {
  height: 36px;
  width: 120px;
  border-radius: 10px;
  background: rgba(255,255,255,0.04);
  border: none;
}

.video-actions {
  margin-top: 14px;
  display: flex; gap: 8px;
}
.action-btn {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 8px 16px; border-radius: 10px;
  border: none;
  background: rgba(255,255,255,0.08);
  color: white; font-size: 12px; font-weight: 600;
  cursor: pointer; text-decoration: none;
  transition: all var(--transition-fast);
}
.action-btn:hover {
  background: rgba(255,255,255,0.15);
}

.error-wrap {
  width: 100%;
  min-height: 0;
  flex: 1;
  display: flex; align-items: center; justify-content: center;
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

.result-fill.empty-wrap {
  justify-content: center;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
