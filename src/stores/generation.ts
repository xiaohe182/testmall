import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { genImg, type ImgResult } from '@/api/img'
import { submitVideo, fetchVideoTask, type VideoResult } from '@/api/video'
import { DEFAULT_IMAGE_MODEL, IMAGE_MODELS } from '@/config/models'
import { usePolling } from '@/composables/usePolling'

export type HistoryItem = {
  id: string
  type: 'img' | 'video'
  url: string
  cover_image_url?: string
  prompt: string
  timestamp: number
}

const genId = () => crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`

export const useGenerationStore = defineStore('generation', () => {
  const imgPrompt = ref('')
  const imgModel = ref(DEFAULT_IMAGE_MODEL)
  const imgSize = ref('1024x1024')
  const imgBatchSize = ref(1)
  const imgResults = ref<ImgResult[]>([])
  const imgLoading = ref(false)
  const imgError = ref<string | null>(null)

  const videoPrompt = ref('')
  const videoImageUrl = ref('')
  const videoResult = ref<VideoResult | null>(null)
  const videoLoading = ref(false)
  const videoStatus = ref('')
  const videoError = ref<string | null>(null)

  const history = ref<HistoryItem[]>([])

  const currentImageModel = computed(() =>
    IMAGE_MODELS.find(model => model.id === imgModel.value) ?? IMAGE_MODELS[0]
  )
  const currentImageSizeOptions = computed(() =>
    currentImageModel.value.imageOptions?.recommendedSizes ?? ['1024x1024']
  )
  const currentImageQuality = computed(() =>
    currentImageModel.value.imageOptions?.defaultQuality
  )
  const imageModelOptions = computed(() =>
    IMAGE_MODELS.filter(model => model.enabled)
  )
  const imageModelPriceText = computed(() => {
    const price = currentImageModel.value.pricing.cnyPerCall
    return price === null ? '价格待确认' : `${price} 元/次`
  })
  const canGenImg = computed(() => {
    const prompt = imgPrompt.value.trim()
    const maxLength = currentImageModel.value.imageOptions?.promptMaxLength
    return prompt.length > 0 && (!maxLength || prompt.length <= maxLength)
  })
  const canGenVideo = computed(() => videoImageUrl.value.length > 0)

  function syncImageSizeWithModel() {
    const options = currentImageSizeOptions.value
    if (!options.includes(imgSize.value)) {
      imgSize.value = currentImageModel.value.imageOptions?.defaultSize ?? options[0] ?? '1024x1024'
    }
  }

  async function generateImage() {
    if (!canGenImg.value) return
    syncImageSizeWithModel()
    imgLoading.value = true
    imgError.value = null
    imgResults.value = []

    try {
      const tasks = Array.from({ length: imgBatchSize.value }).map(() => genImg(imgPrompt.value, {
        model: imgModel.value,
        size: imgSize.value,
        quality: currentImageQuality.value,
        watermarkEnabled: currentImageModel.value.imageOptions?.watermarkEnabledDefault
      }))
      const results = await Promise.all(tasks)
      imgResults.value = results

      results.forEach(res => {
        history.value.unshift({
          id: genId(),
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

      history.value.unshift({
        id: genId(),
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
    imgPrompt, imgModel, imgSize, imgBatchSize, imgResults, imgLoading, imgError, canGenImg,
    currentImageModel, currentImageSizeOptions, imageModelOptions, imageModelPriceText,
    videoPrompt, videoImageUrl, videoResult, videoLoading, videoStatus, videoError, canGenVideo,
    history,
    syncImageSizeWithModel, generateImage, generateVideo, sendToVideo, clearHistory
  }
})
