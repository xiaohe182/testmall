import http from './http'

// ──── 类型定义 ────

export interface VideoResult {
  url: string
  cover_image_url: string
}

export type TaskStatus = 'processing' | 'SUCCESS' | 'FAIL'

export interface VideoTask {
  task_status: TaskStatus
  video_result?: VideoResult[]
}

// ──── API 方法 ────

/** 提交视频生成任务，返回任务 ID */
export async function submitVideo(prompt: string, imageUrl?: string): Promise<string> {
  const body: Record<string, unknown> = { model: 'cogvideox-2', prompt }
  if (imageUrl) body.image_url = imageUrl

  const { data } = await http.post('/videos/generations', body)
  return data.id ?? data.task_id ?? data.data?.task_id
}

/** 查询单次任务状态 */
export async function fetchVideoTask(taskId: string): Promise<VideoTask> {
  const { data } = await http.get(`/async-result/${taskId}`)
  return data
}
