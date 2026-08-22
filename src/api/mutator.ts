import axios from 'axios'
import type { AxiosRequestConfig, AxiosError } from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API_URL,
})

export const mutator = <T,>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig,
): Promise<T> => {
  return api({ ...config, ...options }).then((response) => response.data)
}

export type ErrorType<Error> = AxiosError<Error>
export type BodyType<BodyData> = BodyData
