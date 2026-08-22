import type { AxiosError } from 'axios'

type ApiErrorResponse = {
  error?: {
    statusCode?: number
    name?: string
    message?: string
  }
}

export function getErrorMessageFromRequest(
  error: AxiosError<ApiErrorResponse>,
  defaultMessage = 'Il sistema ha riscontrato un errore durante l’operazione.'
): string {
  return error.response?.data?.error?.message ?? defaultMessage
}
