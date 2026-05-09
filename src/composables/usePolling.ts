import { ref } from 'vue'

export type PollDoneStatus = 'success' | 'fail' | 'pending'

export interface PollingOptions {
  /** 间隔 ms */
  interval?: number
  /** 最多尝试次数 */
  maxAttempts?: number
}

/** isDone：success / fail / pending；超时 reject */
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
        } catch (err) {
          stop()
          isLoading.value = false
          lastError.value = err instanceof Error ? err : new Error(String(err))
          return reject(lastError.value)
        }
      }, interval)
    })
  }

  function cleanup() {
    stop()
    isLoading.value = false
  }

  return { start, stop, cleanup, isLoading, attemptCount, lastError }
}
