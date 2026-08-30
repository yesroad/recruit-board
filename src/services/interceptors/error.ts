import axios from 'axios'
import type { AxiosInstance } from 'axios'

export function errorInterceptor(instance: AxiosInstance) {
  instance.interceptors.response.use(
    (res) => res,
    (error) => {
      if (!axios.isAxiosError(error)) return Promise.reject(error)

      const status = error.response?.status

      if (status === 403) console.error('[API] 접근 권한 없음')
      if (status === 500) console.error('[API] 서버 오류')

      return Promise.reject(error)
    }
  )
}
