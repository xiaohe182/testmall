/**
 * 视频生成能力与请求体字段对齐智谱 OpenAPI：
 * https://docs.bigmodel.cn/api-reference/模型-api/视频生成异步
 * 各模型说明页：CogVideoX-3 / CogVideoX-2 / Vidu Q1 / Vidu 2 / CogVideoX-Flash
 */

export type VideoInputKind =
  | 'text_only'
  | 'text_or_image'
  | 'single_image'
  | 'two_frames'
  | 'one_to_three_refs'

export type VideoGenPreset = {
  id: string
  apiModel: string
  label: string
  family: string
  priceCny: number | null
  priceNote?: string
  /** 文档中的输入模态说明（展示用） */
  modalitiesDesc: string
  inputKind: VideoInputKind
  durations?: number[]
  sizes: string[]
  fps?: number[]
  quality?: Array<'speed' | 'quality'>
  style?: Array<'general' | 'anime'>
  aspectRatio?: string[]
  movementAmplitude?: Array<'auto' | 'small' | 'medium' | 'large'>
  withAudioConfigurable?: boolean
  watermarkConfigurable?: boolean
  promptMaxLen: number
  docRef: string
}

export const VIDEO_GEN_PRESETS: VideoGenPreset[] = [
  {
    id: 'cogvideox-3-t2v',
    apiModel: 'cogvideox-3',
    label: 'CogVideoX-3 · 文生视频',
    family: 'CogVideoX-3',
    priceCny: 1,
    priceNote: '文档：1 元/次；时长 5s/10s；最高 4K',
    modalitiesDesc: '文本（文生视频，prompt 必填）',
    inputKind: 'text_only',
    durations: [5, 10],
    sizes: ['1280x720', '720x1280', '1024x1024', '1920x1080', '1080x1920', '2048x1080', '3840x2160'],
    fps: [30, 60],
    quality: ['speed', 'quality'],
    withAudioConfigurable: true,
    watermarkConfigurable: true,
    promptMaxLen: 512,
    docRef: 'https://docs.bigmodel.cn/cn/guide/models/video-generation/cogvideox-3'
  },
  {
    id: 'cogvideox-3-i2v',
    apiModel: 'cogvideox-3',
    label: 'CogVideoX-3 · 图生视频',
    family: 'CogVideoX-3',
    priceCny: 1,
    modalitiesDesc: '图像 + 文本（prompt 与 image_url 不可同时为空）',
    inputKind: 'single_image',
    durations: [5, 10],
    sizes: ['1280x720', '720x1280', '1024x1024', '1920x1080', '1080x1920', '2048x1080', '3840x2160'],
    fps: [30, 60],
    quality: ['speed', 'quality'],
    withAudioConfigurable: true,
    watermarkConfigurable: true,
    promptMaxLen: 512,
    docRef: 'https://docs.bigmodel.cn/cn/guide/models/video-generation/cogvideox-3'
  },
  {
    id: 'cogvideox-3-f2v',
    apiModel: 'cogvideox-3',
    label: 'CogVideoX-3 · 首尾帧',
    family: 'CogVideoX-3',
    priceCny: 1,
    modalitiesDesc: '首尾两帧图像 + 文本',
    inputKind: 'two_frames',
    durations: [5, 10],
    sizes: ['1280x720', '720x1280', '1024x1024', '1920x1080', '1080x1920', '2048x1080', '3840x2160'],
    fps: [30, 60],
    quality: ['speed', 'quality'],
    withAudioConfigurable: true,
    watermarkConfigurable: true,
    promptMaxLen: 512,
    docRef: 'https://docs.bigmodel.cn/cn/guide/models/video-generation/cogvideox-3'
  },
  {
    id: 'cogvideox-2',
    apiModel: 'cogvideox-2',
    label: 'CogVideoX-2 · 文/图生视频',
    family: 'CogVideoX-2',
    priceCny: 0.5,
    modalitiesDesc: '图像、文本（须至少提供其一，可同时提供）',
    inputKind: 'text_or_image',
    sizes: ['720x480', '1024x1024', '1280x960', '960x1280', '1920x1080', '1080x1920', '2048x1080', '3840x2160'],
    fps: [30, 60],
    quality: ['speed', 'quality'],
    withAudioConfigurable: true,
    watermarkConfigurable: true,
    promptMaxLen: 512,
    docRef: 'https://docs.bigmodel.cn/cn/guide/models/video-generation/cogvideox-2'
  },
  {
    id: 'cogvideox-flash',
    apiModel: 'cogvideox-flash',
    label: 'CogVideoX-Flash · 文/图生视频（免费）',
    family: 'CogVideoX-Flash',
    priceCny: null,
    priceNote: '免费额度以控制台为准',
    modalitiesDesc: '图像、文本（须至少提供其一）',
    inputKind: 'text_or_image',
    sizes: ['720x480', '1024x1024', '1280x960', '960x1280', '1920x1080', '1080x1920', '2048x1080', '3840x2160'],
    fps: [30, 60],
    quality: ['speed', 'quality'],
    withAudioConfigurable: true,
    watermarkConfigurable: true,
    promptMaxLen: 512,
    docRef: 'https://docs.bigmodel.cn/cn/guide/models/free/cogvideox-flash'
  },
  {
    id: 'viduq1-text',
    apiModel: 'viduq1-text',
    label: 'Vidu Q1 · 文生视频',
    family: 'Vidu Q1',
    priceCny: 2.5,
    modalitiesDesc: '文本；固定 5s、1080P（size 仅 1920x1080）',
    inputKind: 'text_only',
    durations: [5],
    sizes: ['1920x1080'],
    style: ['general', 'anime'],
    aspectRatio: ['16:9', '9:16', '1:1'],
    movementAmplitude: ['auto', 'small', 'medium', 'large'],
    promptMaxLen: 512,
    docRef: 'https://docs.bigmodel.cn/cn/guide/models/video-generation/viduq1'
  },
  {
    id: 'viduq1-image',
    apiModel: 'viduq1-image',
    label: 'Vidu Q1 · 图生视频',
    family: 'Vidu Q1',
    priceCny: 2.5,
    modalitiesDesc: '首帧图像 + 文本',
    inputKind: 'single_image',
    durations: [5],
    sizes: ['1920x1080'],
    movementAmplitude: ['auto', 'small', 'medium', 'large'],
    withAudioConfigurable: true,
    promptMaxLen: 512,
    docRef: 'https://docs.bigmodel.cn/cn/guide/models/video-generation/viduq1'
  },
  {
    id: 'viduq1-start-end',
    apiModel: 'viduq1-start-end',
    label: 'Vidu Q1 · 首尾帧',
    family: 'Vidu Q1',
    priceCny: 2.5,
    modalitiesDesc: '两张图像（首帧、尾帧）+ 文本',
    inputKind: 'two_frames',
    durations: [5],
    sizes: ['1920x1080'],
    movementAmplitude: ['auto', 'small', 'medium', 'large'],
    withAudioConfigurable: true,
    promptMaxLen: 512,
    docRef: 'https://docs.bigmodel.cn/cn/guide/models/video-generation/viduq1'
  },
  {
    id: 'vidu2-image',
    apiModel: 'vidu2-image',
    label: 'Vidu 2 · 图生视频',
    family: 'Vidu 2',
    priceCny: 1.25,
    modalitiesDesc: '首帧图像 + 文本；4s、720P',
    inputKind: 'single_image',
    durations: [4],
    sizes: ['1280x720'],
    movementAmplitude: ['auto', 'small', 'medium', 'large'],
    withAudioConfigurable: true,
    promptMaxLen: 512,
    docRef: 'https://docs.bigmodel.cn/cn/guide/models/video-generation/vidu2'
  },
  {
    id: 'vidu2-start-end',
    apiModel: 'vidu2-start-end',
    label: 'Vidu 2 · 首尾帧',
    family: 'Vidu 2',
    priceCny: 1.25,
    modalitiesDesc: '两张图像 + 文本；4s；720P 或 480x360',
    inputKind: 'two_frames',
    durations: [4],
    sizes: ['1280x720', '480x360'],
    movementAmplitude: ['auto', 'small', 'medium', 'large'],
    withAudioConfigurable: true,
    promptMaxLen: 512,
    docRef: 'https://docs.bigmodel.cn/cn/guide/models/video-generation/vidu2'
  },
  {
    id: 'vidu2-reference',
    apiModel: 'vidu2-reference',
    label: 'Vidu 2 · 参考生视频',
    family: 'Vidu 2',
    priceCny: 2.5,
    modalitiesDesc: '1～3 张参考图 + 文本',
    inputKind: 'one_to_three_refs',
    durations: [4],
    sizes: ['1280x720'],
    aspectRatio: ['16:9', '9:16', '1:1'],
    movementAmplitude: ['auto', 'small', 'medium', 'large'],
    withAudioConfigurable: true,
    promptMaxLen: 512,
    docRef: 'https://docs.bigmodel.cn/cn/guide/models/video-generation/vidu2'
  }
]

export const DEFAULT_VIDEO_PRESET_ID = 'cogvideox-2'

export function getVideoPreset(id: string): VideoGenPreset | undefined {
  return VIDEO_GEN_PRESETS.find((p) => p.id === id)
}

export function priceLabel(p: VideoGenPreset): string {
  if (p.priceCny === null) return p.priceNote ?? '免费'
  return `${p.priceCny} 元/次`
}

export type VideoGenFormState = {
  presetId: string
  prompt: string
  imageUrl: string
  lastFrameUrl: string
  ref2Url: string
  ref3Url: string
  duration: number
  size: string
  fps: number
  quality: 'speed' | 'quality'
  withAudio: boolean
  watermarkEnabled: boolean
  style: 'general' | 'anime'
  aspectRatio: string
  movementAmplitude: 'auto' | 'small' | 'medium' | 'large'
}

export function defaultFormForPreset(preset: VideoGenPreset): Partial<VideoGenFormState> {
  return {
    presetId: preset.id,
    duration: preset.durations?.[0] ?? 5,
    size: preset.sizes[0] ?? '1920x1080',
    fps: preset.fps?.[0] ?? 30,
    quality: 'speed',
    withAudio: false,
    watermarkEnabled: true,
    style: 'general',
    aspectRatio: preset.aspectRatio?.[0] ?? '16:9',
    movementAmplitude: 'auto'
  }
}

/** 按 OpenAPI 组装 POST /videos/generations 的 JSON 体 */
export function buildVideoGenerationPayload(
  preset: VideoGenPreset,
  form: Pick<
    VideoGenFormState,
    | 'prompt'
    | 'imageUrl'
    | 'lastFrameUrl'
    | 'ref2Url'
    | 'ref3Url'
    | 'duration'
    | 'size'
    | 'fps'
    | 'quality'
    | 'withAudio'
    | 'watermarkEnabled'
    | 'style'
    | 'aspectRatio'
    | 'movementAmplitude'
  >
): Record<string, unknown> {
  const model = preset.apiModel
  const prompt = form.prompt.trim()

  if (preset.apiModel === 'cogvideox-3') {
    const body: Record<string, unknown> = {
      model,
      duration: form.duration,
      size: form.size,
      fps: form.fps,
      quality: form.quality,
      with_audio: form.withAudio,
      watermark_enabled: form.watermarkEnabled
    }
    if (preset.inputKind === 'text_only') {
      body.prompt = prompt
    } else if (preset.inputKind === 'single_image') {
      body.image_url = form.imageUrl.trim()
      if (prompt) body.prompt = prompt
    } else {
      body.image_url = [form.imageUrl.trim(), form.lastFrameUrl.trim()]
      if (prompt) body.prompt = prompt
    }
    return body
  }

  if (preset.apiModel === 'cogvideox-2' || preset.apiModel === 'cogvideox-flash') {
    const body: Record<string, unknown> = {
      model,
      size: form.size,
      fps: form.fps,
      quality: form.quality,
      with_audio: form.withAudio,
      watermark_enabled: form.watermarkEnabled
    }
    const img = form.imageUrl.trim()
    if (img) body.image_url = img
    if (prompt) body.prompt = prompt
    return body
  }

  if (preset.apiModel === 'viduq1-text') {
    return {
      model,
      prompt,
      style: form.style,
      duration: form.duration,
      aspect_ratio: form.aspectRatio,
      movement_amplitude: form.movementAmplitude
    }
  }

  if (preset.apiModel === 'viduq1-image') {
    const body: Record<string, unknown> = {
      model,
      image_url: form.imageUrl.trim(),
      duration: form.duration,
      size: form.size,
      movement_amplitude: form.movementAmplitude
    }
    if (prompt) body.prompt = prompt
    if (form.withAudio) body.with_audio = true
    return body
  }

  if (preset.apiModel === 'viduq1-start-end') {
    const body: Record<string, unknown> = {
      model,
      image_url: [form.imageUrl.trim(), form.lastFrameUrl.trim()],
      duration: form.duration,
      size: form.size,
      movement_amplitude: form.movementAmplitude
    }
    if (prompt) body.prompt = prompt
    if (form.withAudio) body.with_audio = true
    return body
  }

  if (preset.apiModel === 'vidu2-image') {
    const body: Record<string, unknown> = {
      model,
      image_url: form.imageUrl.trim(),
      duration: form.duration,
      size: form.size,
      movement_amplitude: form.movementAmplitude
    }
    if (prompt) body.prompt = prompt
    if (form.withAudio) body.with_audio = true
    return body
  }

  if (preset.apiModel === 'vidu2-start-end') {
    const body: Record<string, unknown> = {
      model,
      image_url: [form.imageUrl.trim(), form.lastFrameUrl.trim()],
      duration: form.duration,
      size: form.size,
      movement_amplitude: form.movementAmplitude
    }
    if (prompt) body.prompt = prompt
    if (form.withAudio) body.with_audio = true
    return body
  }

  if (preset.apiModel === 'vidu2-reference') {
    const refs = [form.imageUrl.trim(), form.ref2Url.trim(), form.ref3Url.trim()].filter(Boolean)
    const body: Record<string, unknown> = {
      model,
      image_url: refs,
      duration: form.duration,
      aspect_ratio: form.aspectRatio,
      movement_amplitude: form.movementAmplitude
    }
    if (prompt) body.prompt = prompt
    if (form.withAudio) body.with_audio = true
    return body
  }

  throw new Error(`未实现的视频模型: ${preset.apiModel}`)
}
