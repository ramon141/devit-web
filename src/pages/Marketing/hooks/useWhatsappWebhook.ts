import { useTranslation } from 'react-i18next'
import { useQueryClient } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import {
  getMarketingWhatsappControllerWebhookStatusQueryKey,
  useMarketingWhatsappControllerRegisterWebhook,
  useMarketingWhatsappControllerWebhookStatus,
} from '@/api/generated/api'
import { usePromisePopup } from '@/contexts/PromisePopupContext'
import { getErrorMessageFromRequest, type ApiErrorResponse } from '@/utils/getErrorMessageFromRequest'

export type WhatsappTarget = 'marketing' | 'chatbot'

export function useWhatsappWebhook(target: WhatsappTarget) {
  const { t } = useTranslation('marketing')
  const queryClient = useQueryClient()
  const { promisePopup } = usePromisePopup()

  const webhook = useMarketingWhatsappControllerWebhookStatus({ target })
  const { mutateAsync: register, isPending } = useMarketingWhatsappControllerRegisterWebhook()

  function onRegister() {
    const promise = register({ params: { target } })

    promisePopup(promise, {
      pending: t('whatsappConnection.webhookPending'),
      success: () => {
        queryClient.invalidateQueries({
          queryKey: getMarketingWhatsappControllerWebhookStatusQueryKey({ target }),
        })

        return t('whatsappConnection.webhookSuccess')
      },
      error: (error: AxiosError<ApiErrorResponse>) =>
        getErrorMessageFromRequest(error, t('whatsappConnection.webhookError')),
    })
  }

  return {
    configured: webhook.data?.configured ?? false,
    expectedUrl: webhook.data?.expectedUrl,
    isLoading: webhook.isLoading,
    isError: webhook.isError,
    isRegistering: isPending,
    onRegister,
  }
}
