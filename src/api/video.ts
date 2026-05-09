import http from './http'
import { DEFAULT_VIDEO_MODEL } from '@/config/models'

export interface VideoResult {
  url: string
  cover_image_url: string
}

export type TaskStatus = 'processing' | 'SUCCESS' | 'FAIL'

export interface VideoTask {
  task_status: TaskStatus
  video_result?: VideoResult[]
}

/** 提交任务，返回 task id */
export async function submitVideo(prompt: string, imageUrl?: string): Promise<string> {
  const body: Record<string, unknown> = { model: DEFAULT_VIDEO_MODEL, prompt }
  if (imageUrl) body.image_url = imageUrl

  const { data } = await http.post('/videos/generations', body)
  return data.id ?? data.task_id ?? data.data?.task_id
}

/** 查询任务状态 */
export async function fetchVideoTask(taskId: string): Promise<VideoTask> {
  const { data } = await http.get(`/async-result/${taskId}`)
  return data
}
