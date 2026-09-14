import type { AxiosError } from 'axios'
import i18n from '@/i18n'

export type ApiErrorDetail = {
  path?: string
  message?: string
}

export type ApiErrorResponse = {
  error?: {
    statusCode?: number
    name?: string
    message?: string
    code?: string
    details?: ApiErrorDetail[]
  }
}

export function getErrorMessageFromRequest(
  error: AxiosError<ApiErrorResponse>,
  defaultMessage = 'Il sistema ha riscontrato un errore durante l’operazione.'
): string {
  const apiError = error.response?.data?.error
  const code = apiError?.code

  // Erro de validação com detalhes por campo: mostra a mensagem real do
  // backend em vez do texto genérico "Dados da requisição inválidos"
  const detailMessages = apiError?.details
    ?.map((detail) => detail.message)
    .filter((message): message is string => !!message)

  if (detailMessages?.length) {
    return detailMessages.join(' ')
  }

  if (code && i18n.exists(code, { ns: 'errors' })) {
    return i18n.t(code, { ns: 'errors' })
  }

  return apiError?.message ?? defaultMessage
}
