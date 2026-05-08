import { ref } from 'vue'

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
