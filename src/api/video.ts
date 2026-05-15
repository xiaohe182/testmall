import http from './http'

export interface VideoResult {
  url: string
  cover_image_url: string
}

/** 智谱 API 返回值大小写不统一：processing 小写，SUCCESS/FAIL 大写 */
export type TaskStatus = 'processing' | 'SUCCESS' | 'FAIL'

export interface VideoTask {
  task_status: TaskStatus
  video_result?: VideoResult[]
}

export async function submitVideoTask(body: Record<string, unknown>, signal?: AbortSignal): Promise<string> {
  const { data } = await http.post('/videos/generations', body, { signal })
  const taskId = data.id ?? data.task_id ?? data.data?.task_id
  if (!taskId) throw new Error('提交视频任务失败：未返回任务 ID')
  return taskId
}

export async function fetchVideoTask(taskId: string, signal?: AbortSignal): Promise<VideoTask> {
  const { data } = await http.get(`/async-result/${taskId}`, { signal })
  if (!data || !data.task_status) {
    throw new Error('查询视频任务失败：返回数据异常')
  }
  return data
}
