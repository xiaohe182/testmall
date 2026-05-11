import { DEFAULT_VIDEO_PRESET_ID, VIDEO_GEN_PRESETS, priceLabel } from './videoModels'

export type ModelScene = 'text-to-image' | 'image-to-video'

export type ModelProvider = 'zhipu'

export type ModelPricing = {
  /** 单次价格（元），null 表示未定价 */
  cnyPerCall: number | null
  unit: 'call'
  note?: string
}

export type ImageModelOptions = {
  recommendedSizes: string[]
  defaultSize: string
  customSizeRule: string
  qualityOptions?: Array<'hd' | 'standard'>
  defaultQuality?: 'hd' | 'standard'
  promptMaxLength?: number
  inputModalities?: string[]
  supportedRatios?: string[]
  watermarkEnabledDefault?: boolean
  userIdRule?: string
}

export type AiModelConfig = {
  /** 请求体 model */
  id: string
  /** 列表展示名 */
  name: string
  provider: ModelProvider
  scene: ModelScene
  endpoint: string
  pricing: ModelPricing
  /** 是否启用 */
  enabled: boolean
  /** 场景默认 */
  isDefault?: boolean
  /** 请求字段 */
  requestParams: string[]
  /** 简介 */
  description: string
  imageOptions?: ImageModelOptions
  /** 备注 */
  notes?: string[]
}

export const IMAGE_MODELS: AiModelConfig[] = [
  {
    id: 'cogview-3-plus',
    name: 'CogView-3 Plus',
    provider: 'zhipu',
    scene: 'text-to-image',
    endpoint: '/images/generations',
    pricing: {
      cnyPerCall: 0.05,
      unit: 'call',
      note: '按用户提供价格记录：0.05 元/次'
    },
    enabled: true,
    isDefault: true,
    requestParams: ['model', 'prompt', 'size'],
    description: '当前项目文生图默认模型。用于根据提示词生成图片，前端通过多次并发请求实现批量生成。',
    imageOptions: {
      recommendedSizes: ['1024x1024', '768x1344', '864x1152', '1344x768', '1152x864', '1440x720', '720x1440'],
      defaultSize: '1024x1024',
      customSizeRule: '长宽均需满足 512px-2048px，需被 16 整除，并保证最大像素数不超过 2^21px。',
      qualityOptions: ['standard'],
      defaultQuality: 'standard',
      inputModalities: ['文本'],
      promptMaxLength: 1000,
      watermarkEnabledDefault: true
    },
    notes: [
      'size 来自文生图页面尺寸选择，仅影响下一次生成请求。',
      '右侧预览区比例固定，与所选尺寸无关。'
    ]
  },
  {
    id: 'cogView-4-250304',
    name: 'CogView-4',
    provider: 'zhipu',
    scene: 'text-to-image',
    endpoint: '/images/generations',
    pricing: {
      cnyPerCall: 0.06,
      unit: 'call',
      note: 'API model 字段：cogView-4-250304；0.06 元/次'
    },
    enabled: true,
    requestParams: ['model', 'prompt', 'size'],
    description: 'CogView-4 文生图模型，请求体 model 使用 cogView-4-250304。',
    imageOptions: {
      recommendedSizes: ['1024x1024', '768x1344', '864x1152', '1344x768', '1152x864', '1440x720', '720x1440'],
      defaultSize: '1024x1024',
      customSizeRule: '长宽均需满足 512px-2048px，需被 16 整除，并保证最大像素数不超过 2^21px。',
      qualityOptions: ['standard', 'hd'],
      defaultQuality: 'standard',
      inputModalities: ['文本'],
      promptMaxLength: 1000,
      watermarkEnabledDefault: true
    },
    notes: [
      '模型 ID 大小写需与接口一致：cogView-4-250304。',
      '切换前仍需确认账号对该模型的权限与计费是否与文档一致。'
    ]
  },
  {
    id: 'glm-image',
    name: 'GLM-image',
    provider: 'zhipu',
    scene: 'text-to-image',
    endpoint: '/images/generations',
    pricing: {
      cnyPerCall: 0.1,
      unit: 'call',
      note: '按文档信息记录：0.1 元/次'
    },
    enabled: true,
    requestParams: ['model', 'prompt', 'size', 'quality', 'watermark_enabled', 'user_id'],
    description: '支持文本输入、多分辨率生成的文生图模型。glm-image 仅支持 hd 质量。',
    imageOptions: {
      recommendedSizes: ['1280x1280', '1568x1056', '1056x1568', '1472x1088', '1088x1472', '1728x960', '960x1728'],
      defaultSize: '1280x1280',
      customSizeRule: '长宽需在 512px-2048px 范围内，且长宽均需为 32 的整数倍；推荐 1024px-2048px，最大像素数不超过 2^22px。',
      qualityOptions: ['hd'],
      defaultQuality: 'hd',
      inputModalities: ['文本'],
      promptMaxLength: 1000,
      supportedRatios: ['1:1', '3:4', '4:3', '16:9', '9:16'],
      watermarkEnabledDefault: true,
      userIdRule: '终端用户唯一 ID，长度 6-128 个字符，用于风控追踪。'
    },
    notes: [
      'quality 默认为 hd，且 glm-image 仅支持 hd；耗时约 20 秒。',
      'standard 质量仅适用于其它图片模型，耗时约 5-10 秒。',
      'watermark_enabled 默认为 true；关闭水印仅允许已签署免责声明的客户使用。'
    ]
  }
]

export const VIDEO_MODELS: AiModelConfig[] = VIDEO_GEN_PRESETS.map((p) => ({
  id: p.id,
  name: p.label,
  provider: 'zhipu',
  scene: 'image-to-video',
  endpoint: '/videos/generations',
  pricing: {
    cnyPerCall: p.priceCny,
    unit: 'call',
    note: p.priceNote ?? priceLabel(p)
  },
  enabled: true,
  isDefault: p.id === DEFAULT_VIDEO_PRESET_ID,
  requestParams: [],
  description: p.modalitiesDesc,
  notes: [p.docRef, priceLabel(p)]
}))

export const AI_MODEL_CATALOG = [...IMAGE_MODELS, ...VIDEO_MODELS]

export const DEFAULT_IMAGE_MODEL = IMAGE_MODELS.find(model => model.isDefault)?.id ?? 'cogview-3-plus'

export const DEFAULT_VIDEO_MODEL = DEFAULT_VIDEO_PRESET_ID
