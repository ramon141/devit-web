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

export function useWhatsappWebhook() {
  const { t } = useTranslation('marketing')
  const queryClient = useQueryClient()
  const { promisePopup } = usePromisePopup()

  const webhook = useMarketingWhatsappControllerWebhookStatus()
  const { mutateAsync: register, isPending } = useMarketingWhatsappControllerRegisterWebhook()

  function onRegister() {
    const promise = register()

    promisePopup(promise, {
      pending: t('whatsappConnection.webhookPending'),
      success: () => {
        queryClient.invalidateQueries({
          queryKey: getMarketingWhatsappControllerWebhookStatusQueryKey(),
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
