import { ref } from 'vue'

export type PollDoneStatus = 'success' | 'fail' | 'pending'

export interface PollingOptions {
  interval?: number
  maxAttempts?: number
}

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

  function stop() {
    if (timer !== null) {
      clearTimeout(timer)
      timer = null
    }
  }

  async function poll(resolve: (value: T) => void, reject: (reason: Error) => void) {
    attemptCount.value++

    if (attemptCount.value > maxAttempts) {
      stop()
      isLoading.value = false
      lastError.value = new Error(`轮询超时（已尝试 ${maxAttempts} 次）`)
      reject(lastError.value)
      return
    }

    try {
      const result = await fetcher()
      const status = isDone(result)

      if (status === 'success') {
        stop()
        isLoading.value = false
        resolve(result)
        return
      }
      if (status === 'fail') {
        stop()
        isLoading.value = false
        lastError.value = new Error('任务执行失败')
        reject(lastError.value)
        return
      }

      timer = setTimeout(() => poll(resolve, reject), interval)
    } catch (err) {
      stop()
      isLoading.value = false
      lastError.value = err instanceof Error ? err : new Error(String(err))
      reject(lastError.value)
    }
  }

  function start(): Promise<T> {
    stop()
    isLoading.value = true
    attemptCount.value = 0
    lastError.value = null

    return new Promise<T>((resolve, reject) => {
      poll(resolve, reject)
    })
  }

  function cleanup() {
    stop()
    isLoading.value = false
  }

  return { start, stop, cleanup, isLoading, attemptCount, lastError }
}
