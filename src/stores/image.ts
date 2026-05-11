import { ref, computed, onScopeDispose } from 'vue'
import { defineStore } from 'pinia'
import { genImg, type ImgResult } from '@/api/img'
import { DEFAULT_IMAGE_MODEL, IMAGE_MODELS } from '@/config/models'
import { useToast } from '@/composables/useToast'
import { useHistoryStore } from './history'

export const useImageStore = defineStore('image', () => {
  const toast = useToast()
  const historyStore = useHistoryStore()

  const prompt = ref('')
  const model = ref(DEFAULT_IMAGE_MODEL)
  const size = ref('1024x1024')
  const batchSize = ref(1)
  const results = ref<ImgResult[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  let abortController: AbortController | null = null

  onScopeDispose(() => {
    abortController?.abort()
  })

  const currentModel = computed(() =>
    IMAGE_MODELS.find(m => m.id === model.value) ?? IMAGE_MODELS[0]
  )
  const sizeOptions = computed(() =>
    currentModel.value.imageOptions?.recommendedSizes ?? ['1024x1024']
  )
  const quality = computed(() =>
    currentModel.value.imageOptions?.defaultQuality
  )
  const modelOptions = computed(() =>
    IMAGE_MODELS.filter(m => m.enabled)
  )
  const priceText = computed(() => {
    const price = currentModel.value.pricing.cnyPerCall
    return price === null ? '价格待确认' : `${price} 元/次`
  })
  const canGenerate = computed(() => {
    const p = prompt.value.trim()
    const max = currentModel.value.imageOptions?.promptMaxLength
    return p.length > 0 && (!max || p.length <= max)
  })

  function syncSize() {
    const opts = sizeOptions.value
    if (!opts.includes(size.value)) {
      size.value = currentModel.value.imageOptions?.defaultSize ?? opts[0] ?? '1024x1024'
    }
  }

  function cancel() {
    abortController?.abort()
    abortController = null
    loading.value = false
  }

  async function generate() {
    if (!canGenerate.value) return
    syncSize()
    cancel()

    loading.value = true
    error.value = null
    results.value = []

    const ac = new AbortController()
    abortController = ac

    const tasks = Array.from({ length: batchSize.value }).map(() =>
      genImg(prompt.value, {
        model: model.value,
        size: size.value,
        quality: quality.value,
        watermarkEnabled: currentModel.value.imageOptions?.watermarkEnabledDefault
      })
    )

    const settled = await Promise.allSettled(tasks)

    if (ac.signal.aborted) return

    const succeeded: ImgResult[] = []
    const failedReasons: string[] = []

    settled.forEach((r) => {
      if (r.status === 'fulfilled') {
        succeeded.push(r.value)
      } else {
        failedReasons.push(r.reason?.message ?? '未知错误')
      }
    })

    results.value = succeeded

    succeeded.forEach(res => {
      historyStore.add({ type: 'img', url: res.url, prompt: prompt.value })
    })

    if (failedReasons.length > 0) {
      const msg = failedReasons.length === tasks.length
        ? `全部生成失败：${failedReasons[0]}`
        : `${failedReasons.length} 张生成失败`
      error.value = msg
      toast.show(msg, 'error')
    }

    loading.value = false
    abortController = null
  }

  return {
    prompt, model, size, batchSize, results, loading, error,
    canGenerate, currentModel, sizeOptions, modelOptions, priceText,
    syncSize, generate, cancel
  }
})
