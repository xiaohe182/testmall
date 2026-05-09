import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { genImg, type ImgResult } from '@/api/img'
import { submitVideo, fetchVideoTask, type VideoResult } from '@/api/video'

export type HistoryItem = {
  id: string
  type: 'img' | 'video'
  url: string
  cover_image_url?: string
  prompt: string
  timestamp: number
}

export const useGenerationStore = defineStore('generation', () => {
  // --- Image States ---
  const imgPrompt = ref('')
  const imgSize = ref('1024x1024')
  const imgBatchSize = ref(1)
  const imgResults = ref<ImgResult[]>([])
  const imgLoading = ref(false)
  const imgError = ref<string | null>(null)

  // --- Video States ---
  const videoPrompt = ref('')
  const videoImageUrl = ref('')
  const videoResult = ref<VideoResult | null>(null)
  const videoLoading = ref(false)
  const videoStatus = ref('')
  const videoError = ref<string | null>(null)

  // --- Common States ---
  const history = ref<HistoryItem[]>([])

  // --- Getters ---
  const canGenImg = computed(() => imgPrompt.value.trim().length > 0)
  const canGenVideo = computed(() => videoImageUrl.value.length > 0)

  // --- Actions ---
  async function generateImage() {
    if (!canGenImg.value) return
    imgLoading.value = true
    imgError.value = null
    imgResults.value = []

    try {
      // 模拟批量生成逻辑，实际 API 可能是单次调用
      const tasks = Array.from({ length: imgBatchSize.value }).map(() => genImg(imgPrompt.value, imgSize.value))
      const results = await Promise.all(tasks)
      imgResults.value = results

      // Add to history
      results.forEach(res => {
        history.value.unshift({
          id: Math.random().toString(36).slice(2),
          type: 'img',
          url: res.url,
          prompt: imgPrompt.value,
          timestamp: Date.now()
        })
      })
    } catch (err: any) {
      imgError.value = err.message || '生成图片失败'
    } finally {
      imgLoading.value = false
    }
  }

  async function generateVideo() {
    if (!canGenVideo.value) return
    videoLoading.value = true
    videoError.value = null
    videoResult.value = null
    videoStatus.value = '提交任务中...'

    try {
      const taskId = await submitVideo(videoPrompt.value, videoImageUrl.value)
      
      const poll = usePolling(
        () => fetchVideoTask(taskId),
        (res) => res.task_status === 'SUCCESS' ? 'success' : (res.task_status === 'FAIL' ? 'fail' : 'pending'),
        { interval: 3000 }
      )

      videoStatus.value = '视频生成中...'
      const finalTask = await poll.start()
      const res = finalTask.video_result?.[0]

      if (!res) throw new Error('未获取到视频结果')
      
      videoResult.value = res

      // Add to history
      history.value.unshift({
        id: Math.random().toString(36).slice(2),
        type: 'video',
        url: res.url,
        cover_image_url: res.cover_image_url,
        prompt: videoPrompt.value,
        timestamp: Date.now()
      })
    } catch (err: any) {
      videoError.value = err.message || '生成视频失败'
    } finally {
      videoLoading.value = false
      videoStatus.value = ''
    }
  }

  function sendToVideo(url: string) {
    videoImageUrl.value = url
  }

  function clearHistory() {
    history.value = []
  }

  return {
    imgPrompt, imgSize, imgBatchSize, imgResults, imgLoading, imgError, canGenImg,
    videoPrompt, videoImageUrl, videoResult, videoLoading, videoStatus, videoError, canGenVideo,
    history,
    generateImage, generateVideo, sendToVideo, clearHistory
  }
})

export type PollDoneStatus = 'success' | 'fail' | 'pending'

export interface PollingOptions {
  /** 轮询间隔（ms），默认 3000 */
  interval?: number
  /** 最大轮询次数，默认 100 */
  maxAttempts?: number
}

/**
 * 通用轮询 composable
 *
 * @param fetcher   每次轮询执行的请求函数
 * @param isDone    判断结果状态：success / fail / pending
 * @param options   interval & maxAttempts
 *
 * 提供 isLoading / attemptCount / lastError 响应式状态，
 * 到达 maxAttempts 自动停止并 reject。
 */
export function usePolling<T>(
  fetcher: () => Promise<T>,
  isDone: (result: T) => PollDoneStatus,
  options: PollingOptions = {}
) {
  const { interval = 3000, maxAttempts = 100 } = options

  const isLoading = ref(false)
  const attemptCount = ref(0)
  const lastError = ref<Error | null>(null)

  let timer: ReturnType<typeof setInterval> | null = null

  function stop() {
    if (timer !== null) {
      clearInterval(timer)
      timer = null
    }
  }

  /** 开始轮询，返回 Promise<T>（最终成功的那次结果） */
  function start(): Promise<T> {
    stop()
    isLoading.value = true
    attemptCount.value = 0
    lastError.value = null

    return new Promise<T>((resolve, reject) => {
      timer = setInterval(async () => {
        attemptCount.value++

        if (attemptCount.value > maxAttempts) {
          stop()
          isLoading.value = false
          lastError.value = new Error(`轮询超时（已尝试 ${maxAttempts} 次）`)
          return reject(lastError.value)
        }

        try {
          const result = await fetcher()
          const status = isDone(result)

          if (status === 'success') {
            stop()
            isLoading.value = false
            return resolve(result)
          }
          if (status === 'fail') {
            stop()
            isLoading.value = false
            lastError.value = new Error('任务执行失败')
            return reject(lastError.value)
          }
          // 'pending' → 继续
        } catch (err) {
          stop()
          isLoading.value = false
          lastError.value = err instanceof Error ? err : new Error(String(err))
          return reject(lastError.value)
        }
      }, interval)
    })
  }

  /** 手动停止并重置状态 */
  function cleanup() {
    stop()
    isLoading.value = false
  }

  return { start, stop, cleanup, isLoading, attemptCount, lastError }
}
