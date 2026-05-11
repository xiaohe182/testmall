<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useGenerationStore } from '@/stores/generation'
import PromptInput from '@/components/PromptInput.vue'
import GenButton from '@/components/GenButton.vue'
import ResultContainer from '@/components/ResultContainer.vue'

const store = useGenerationStore()

const dropZone = ref<HTMLDivElement>()
const fileInput = ref<HTMLInputElement>()
const isDragging = ref(false)

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
    store.videoImageUrl = await fileToDataUrl(file)
  } catch (e: any) {
    alert(e.message || '图片读取失败')
  }
}

function onDrop(e: DragEvent) {
  isDragging.value = false
  e.preventDefault()
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

function triggerFileInput() {
  fileInput.value?.click()
}

function onPaste(e: ClipboardEvent) {
  const items = e.clipboardData?.items
  if (!items) return
  for (const item of items) {
    if (item.type.startsWith('image/')) {
      e.preventDefault()
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
            <h2 class="card-title">图生视频</h2>
            <span class="card-hint">上传图片并描述运动方式</span>
          </div>
        </div>

        <div class="form-group">
          <label class="label">参考图片</label>

          <div v-if="store.videoImageUrl" class="source-preview">
            <img :src="store.videoImageUrl" alt="参考图片" class="source-img" />
            <button class="clear-btn" @click="store.videoImageUrl = ''">
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
            @click="triggerFileInput"
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
                v-model="store.videoImageUrl"
                class="url-input"
                placeholder="或粘贴图片 URL..."
                @click.stop
              />
            </div>
            <input
              ref="fileInput"
              type="file"
              accept="image/*"
              class="hidden-input"
              @change="onFileChange"
            />
          </div>
        </div>

        <div class="form-group">
          <label class="label">视频描述</label>
          <PromptInput
            v-model="store.videoPrompt"
            placeholder="描述视频中的运动和变化，例如：镜头缓缓推进，花瓣随风飘落..."
          />
        </div>

        <div class="card-actions">
          <GenButton
            :disabled="!store.canGenVideo || store.videoLoading"
            :loading="store.videoLoading"
            :text="store.videoLoading ? store.videoStatus || '生成中...' : '生成视频'"
            @click="store.generateVideo()"
          />
        </div>
      </div>
    </div>

    <div class="result-area">
      <ResultContainer
        :loading="store.videoLoading"
        :error="store.videoError"
        empty-text="上传图片并描述运动，开始生成视频"
        @retry="store.generateVideo()"
      >
        <template #empty-icon>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="5 3 19 12 5 21 5 3"/>
          </svg>
        </template>

        <div class="video-result result-fill animate-enter">
          <div class="video-preview">
            <div class="video-wrap">
              <video
                :src="store.videoResult!.url"
                :poster="store.videoResult!.cover_image_url"
                controls
                loop
                class="result-video"
              />
            </div>
          </div>
          <div class="video-actions">
            <a :href="store.videoResult!.url" target="_blank" class="action-btn">
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
      </ResultContainer>
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
</style>
