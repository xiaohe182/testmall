import { ref } from 'vue'

export type PollDoneStatus = 'success' | 'fail' | 'pending'

export interface PollingOptions {
  /** 间隔 ms */
  interval?: number
  /** 最多尝试次数 */
  maxAttempts?: number
}

/** isDone：success / fail / pending；超时 reject；首次立即执行 */
export function usePolling<T>(
  fetcher: () => Promise<T>,
  isDone: (result: T) => PollDoneStatus,
  options: PollingOptions = {}
) {
  const { interval = 3000, maxAttempts = 100 } = options

  const isLoading = ref(false)
  const attemptCount = ref(0)
  const lastError = ref<Error | null>(null)

  let timer: ReturnType<typeof setTimeout> | null = null
  let aborted = false

  function stop() {
    if (timer !== null) {
      clearTimeout(timer)
      timer = null
    }
    aborted = true
  }

  function reset() {
    stop()
    isLoading.value = false
    attemptCount.value = 0
    lastError.value = null
    aborted = false
  }

  function start(): Promise<T> {
    reset()
    isLoading.value = true

    return new Promise<T>((resolve, reject) => {
      const poll = async () => {
        if (aborted) return

        attemptCount.value++

        if (attemptCount.value > maxAttempts) {
          isLoading.value = false
          lastError.value = new Error(`轮询超时（已尝试 ${maxAttempts} 次）`)
          return reject(lastError.value)
        }

        try {
          const result = await fetcher()
          if (aborted) return

          const status = isDone(result)

          if (status === 'success') {
            isLoading.value = false
            return resolve(result)
          }
          if (status === 'fail') {
            isLoading.value = false
            lastError.value = new Error('任务执行失败')
            return reject(lastError.value)
          }

          timer = setTimeout(poll, interval)
        } catch (err) {
          isLoading.value = false
          lastError.value = err instanceof Error ? err : new Error(String(err))
          return reject(lastError.value)
        }
      }

      poll()
    })
  }

  function cleanup() {
    reset()
  }

  return { start, stop, cleanup, isLoading, attemptCount, lastError }
}
