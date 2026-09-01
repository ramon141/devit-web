import type { AxiosError } from 'axios'
import i18n from '@/i18n'

export type ApiErrorResponse = {
  error?: {
    statusCode?: number
    name?: string
    message?: string
    code?: string
  }
}

export function getErrorMessageFromRequest(
  error: AxiosError<ApiErrorResponse>,
  defaultMessage = 'Il sistema ha riscontrato un errore durante l’operazione.'
): string {
  const apiError = error.response?.data?.error
  const code = apiError?.code

  if (code && i18n.exists(code, { ns: 'errors' })) {
    return i18n.t(code, { ns: 'errors' })
  }

  return apiError?.message ?? defaultMessage
}
