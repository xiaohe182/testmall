import http from './http'
import { DEFAULT_IMAGE_MODEL, IMAGE_MODELS } from '@/config/models'

export interface ImgResult { url: string }

export type ImgGenerationOptions = {
  model?: string
  size?: string
  quality?: 'hd' | 'standard'
  watermarkEnabled?: boolean
  userId?: string
  signal?: AbortSignal
}

export async function genImg(prompt: string, options: ImgGenerationOptions = {}): Promise<ImgResult> {
  const model = options.model ?? DEFAULT_IMAGE_MODEL
  const modelConfig = IMAGE_MODELS.find(item => item.id === model)
  const body: Record<string, unknown> = {
    model,
    prompt,
    size: options.size ?? modelConfig?.imageOptions?.defaultSize ?? '1024x1024'
  }

  const quality = options.quality ?? modelConfig?.imageOptions?.defaultQuality
  if (quality) body.quality = quality

  if (typeof options.watermarkEnabled === 'boolean') {
    body.watermark_enabled = options.watermarkEnabled
  }

  if (options.userId) {
    body.user_id = options.userId
  }

  const { data } = await http.post('/images/generations', body, { signal: options.signal })
  return data.data?.[0] ?? data
}
