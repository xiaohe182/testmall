import axios from 'axios'

const http = axios.create({
  baseURL: '/api/zhipu',
  timeout: 120000,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${import.meta.env.VITE_ZHIPU_API_KEY}`
  }
})

export default http
