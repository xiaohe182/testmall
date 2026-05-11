import axios from 'axios'

const http = axios.create({
  baseURL: '/api/zhipu',
  timeout: 120000,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${import.meta.env.VITE_ZHIPU_API_KEY}`
  }
})

http.interceptors.response.use(
  res => res,
  err => {
    const status = err.response?.status
    const msg = err.response?.data?.message ?? err.response?.data?.error?.message ?? err.message
    const friendly = status === 401 ? '鉴权失败，请检查 API Key'
      : status === 429 ? '请求过于频繁，请稍后重试'
      : status === 500 ? '服务器异常，请稍后重试'
      : msg
    return Promise.reject(new Error(friendly))
  }
)

export default http
