import axios from 'axios'
import type { AxiosRequestConfig, AxiosError, AxiosResponse } from 'axios'
import { Auth } from '@/auth'

type ParamValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | ParamValue[]
  | { [key: string]: ParamValue }

const api = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API_URL,
  paramsSerializer: {
    serialize: (params: Record<string, ParamValue>) => {
      const searchParams = new URLSearchParams()

      Object.keys(params).forEach((key) => {
        const value = params[key]

        if (value === undefined || value === null) return

        if (typeof value === 'object') {
          searchParams.append(key, JSON.stringify(value))
        } else {
          searchParams.append(key, String(value))
        }
      })

      return searchParams.toString()
    },
  },
})

api.interceptors.request.use((config) => {
  const token = Auth.getToken()

  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    const requestUrl = error.request?.responseURL ?? ''
    const status = error.response?.status

    if (status === 401 && !requestUrl.endsWith('/login')) {
      Auth.logout()
    }

    if (error.code === 'ERR_NETWORK') {
      const message = `L'API non risponde. Verifica che sia attiva all'indirizzo: ${error.config?.baseURL ?? ''}`

      error.response = {
        data: { error: { message } },
        status: 0,
        statusText: 'Network Error',
        headers: {},
        config: error.config ?? {},
      } as AxiosResponse
    }

    return Promise.reject(error)
  }
)

export const mutator = <T,>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig,
): Promise<T> => {
  return api({ ...config, ...options }).then((response) => response.data)
}

export type ErrorType<Error> = AxiosError<Error>
export type BodyType<BodyData> = BodyData
