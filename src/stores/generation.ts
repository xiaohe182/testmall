import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { genImg, type ImgResult } from '@/api/img'
import { submitVideo, fetchVideoTask, type VideoResult } from '@/api/video'
import { usePolling } from '@/composables/usePolling'

// ──── 历史记录类型 ────

export interface HistoryItem {
  id: string
  type: 'img' | 'video'
  prompt: string
  url: string
  coverUrl?: string
  timestamp: number
}

export const useGenerationStore = defineStore('generation', () => {

  // ──── 文生图状态 ────

  const imgPrompt = ref('')
  const imgSize = ref('1024x1024')
  const imgLoading = ref(false)
  const imgResults = ref<ImgResult[]>([])
  const imgError = ref<string | null>(null)
  const imgBatchSize = ref(1)

  const canGenImg = computed(() => imgPrompt.value.trim().length > 0)

  async function generateImage() {
    if (!canGenImg.value || imgLoading.value) return
    imgLoading.value = true
    imgResults.value = []
    imgError.value = null

    try {
      const tasks = Array.from({ length: imgBatchSize.value }, () =>
        genImg(imgPrompt.value, imgSize.value)
      )
      const results = await Promise.allSettled(tasks)

      const succeeded = results
        .filter((r): r is PromiseFulfilledResult<ImgResult> => r.status === 'fulfilled')
        .map(r => r.value)

      if (succeeded.length === 0) {
        const firstFail = results.find(r => r.status === 'rejected')
        throw (firstFail as PromiseRejectedResult)?.reason
      }

      imgResults.value = succeeded

      // 写入历史
      succeeded.forEach(r => {
        history.value.unshift({
          id: crypto.randomUUID(),
          type: 'img',
          prompt: imgPrompt.value,
          url: r.url,
          timestamp: Date.now()
        })
      })
    } catch (e: any) {
      imgError.value = extractErrorMsg(e, '图片生成失败')
    } finally {
      imgLoading.value = false
    }
  }

  // ──── 图生视频状态 ────

  const videoPrompt = ref('')
  const videoImageUrl = ref('')
  const videoStatus = ref('')
  const videoResult = ref<VideoResult | null>(null)
  const videoError = ref<string | null>(null)

  let currentTaskId = ''

  const canGenVideo = computed(
    () => videoImageUrl.value.trim().length > 0 && videoPrompt.value.trim().length > 0
  )

  const videoPolling = usePolling(
    () => fetchVideoTask(currentTaskId),
    (res) => {
      if (res.task_status === 'SUCCESS') return 'success'
      if (res.task_status === 'FAIL') return 'fail'
      return 'pending'
    },
    { interval: 3000, maxAttempts: 100 }
  )

  const videoLoading = computed(() => videoPolling.isLoading.value)

  async function generateVideo() {
    if (!canGenVideo.value || videoPolling.isLoading.value) return
    videoResult.value = null
    videoError.value = null
    videoStatus.value = '提交任务中...'

    try {
      currentTaskId = await submitVideo(videoPrompt.value, videoImageUrl.value)
      videoStatus.value = '视频生成中，请耐心等待...'

      const taskResult = await videoPolling.start()
      videoResult.value = taskResult.video_result![0]

      // 写入历史
      history.value.unshift({
        id: crypto.randomUUID(),
        type: 'video',
        prompt: videoPrompt.value,
        url: taskResult.video_result![0].url,
        coverUrl: taskResult.video_result![0].cover_image_url,
        timestamp: Date.now()
      })
    } catch (e: any) {
      videoError.value = extractErrorMsg(e, '视频生成失败')
    } finally {
      videoStatus.value = ''
    }
  }

  // ──── 历史记录 ────

  const history = ref<HistoryItem[]>([])

  function clearHistory() {
    history.value = []
  }

  // ──── 跨模块 ────

  function sendToVideo(url: string) {
    videoImageUrl.value = url
  }

  // ──── 工具函数 ────

  function extractErrorMsg(e: any, fallback: string): string {
    return e?.response?.data?.error?.message || e?.message || fallback
  }

  return {
    imgPrompt, imgSize, imgLoading, imgResults, imgError, imgBatchSize,
    canGenImg, generateImage,

    videoPrompt, videoImageUrl, videoStatus, videoResult, videoError,
    videoLoading, canGenVideo, generateVideo,

    history, clearHistory,
    sendToVideo
  }
})
