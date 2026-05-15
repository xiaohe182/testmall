import { ref, computed, watch, onScopeDispose } from 'vue'
import { defineStore } from 'pinia'
import { submitVideoTask, fetchVideoTask, type VideoResult } from '@/api/video'
import { usePolling } from '@/composables/usePolling'
import { toast } from 'vue-sonner'
import { useHistoryStore } from './history'
import {
  DEFAULT_VIDEO_PRESET_ID,
  VIDEO_GEN_PRESETS,
  buildVideoGenerationPayload,
  defaultFormForPreset,
  getVideoPreset
} from '@/config/videoModels'

export const useVideoStore = defineStore('video', () => {
  const historyStore = useHistoryStore()

  const presetId = ref(DEFAULT_VIDEO_PRESET_ID)
  const prompt = ref('')
  const imageUrl = ref('')
  const lastFrameUrl = ref('')
  const ref2Url = ref('')
  const ref3Url = ref('')

  const duration = ref(5)
  const size = ref('1920x1080')
  const fps = ref(30)
  const quality = ref<'speed' | 'quality'>('speed')
  const withAudio = ref(false)
  const watermarkEnabled = ref(true)
  const style = ref<'general' | 'anime'>('general')
  const aspectRatio = ref('16:9')
  const movementAmplitude = ref<'auto' | 'small' | 'medium' | 'large'>('auto')

  const result = ref<VideoResult | null>(null)
  const loading = ref(false)
  const status = ref('')
  const error = ref<string | null>(null)

  let currentAbort: AbortController | null = null
  let currentPoll: ReturnType<typeof usePolling> | null = null

  const currentPreset = computed(() => getVideoPreset(presetId.value) ?? VIDEO_GEN_PRESETS[0]!)

  watch(
    presetId,
    (id) => {
      const p = getVideoPreset(id)
      if (!p) return
      const d = defaultFormForPreset(p)
      duration.value = d.duration ?? 5
      size.value = d.size ?? p.sizes[0]!
      fps.value = d.fps ?? 30
      quality.value = d.quality ?? 'speed'
      withAudio.value = d.withAudio ?? false
      watermarkEnabled.value = d.watermarkEnabled ?? true
      style.value = d.style ?? 'general'
      aspectRatio.value = d.aspectRatio ?? '16:9'
      movementAmplitude.value = d.movementAmplitude ?? 'auto'
    },
    { immediate: true }
  )

  onScopeDispose(() => {
    currentAbort?.abort()
    currentPoll?.stop()
  })

  const canGenerate = computed(() => {
    const preset = currentPreset.value
    const p = prompt.value.trim()
    const img = imageUrl.value.trim()
    const last = lastFrameUrl.value.trim()
    const r2 = ref2Url.value.trim()
    const r3 = ref3Url.value.trim()

    switch (preset.inputKind) {
      case 'text_only':
        return p.length > 0
      case 'text_or_image':
        return p.length > 0 || img.length > 0
      case 'single_image':
        return img.length > 0
      case 'two_frames':
        return img.length > 0 && last.length > 0
      case 'one_to_three_refs':
        return img.length > 0
      default:
        return false
    }
  })

  function cancel() {
    currentAbort?.abort()
    currentPoll?.stop()
    currentAbort = null
    currentPoll = null
    loading.value = false
    status.value = ''
  }

  async function generate() {
    if (!canGenerate.value) return
    cancel()

    const preset = currentPreset.value

    loading.value = true
    error.value = null
    result.value = null
    status.value = '提交任务中...'

    const ac = new AbortController()
    currentAbort = ac

    try {
      const body = buildVideoGenerationPayload(preset, {
        prompt: prompt.value,
        imageUrl: imageUrl.value,
        lastFrameUrl: lastFrameUrl.value,
        ref2Url: ref2Url.value,
        ref3Url: ref3Url.value,
        duration: duration.value,
        size: size.value,
        fps: fps.value,
        quality: quality.value,
        withAudio: withAudio.value,
        watermarkEnabled: watermarkEnabled.value,
        style: style.value,
        aspectRatio: aspectRatio.value,
        movementAmplitude: movementAmplitude.value
      })

      const taskId = await submitVideoTask(body, ac.signal)

      if (ac.signal.aborted) return

      const poll = usePolling(
        () => fetchVideoTask(taskId, ac.signal),
        (res) => {
          if (res.task_status === 'SUCCESS') return 'success'
          if (res.task_status === 'FAIL') return 'fail'
          return 'pending'
        },
        { interval: 3000, initialDelay: 2000 }
      )
      currentPoll = poll

      status.value = '视频生成中...'
      const finalTask = await poll.start()

      if (ac.signal.aborted) return

      const res = finalTask.video_result?.[0]
      if (!res) throw new Error('未获取到视频结果')

      result.value = res

      historyStore.add({
        type: 'video',
        url: res.url,
        cover_image_url: res.cover_image_url,
        prompt: prompt.value
      })
    } catch (err: any) {
      if (ac.signal.aborted) return
      const msg = err.message || '生成视频失败'
      error.value = msg
      toast.error(msg)
    } finally {
      loading.value = false
      status.value = ''
      currentAbort = null
      currentPoll = null
    }
  }

  return {
    presetId,
    prompt,
    imageUrl,
    lastFrameUrl,
    ref2Url,
    ref3Url,
    duration,
    size,
    fps,
    quality,
    withAudio,
    watermarkEnabled,
    style,
    aspectRatio,
    movementAmplitude,
    currentPreset,
    VIDEO_GEN_PRESETS,
    result,
    loading,
    status,
    error,
    canGenerate,
    generate,
    cancel
  }
})
