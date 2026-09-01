import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { AxiosError } from 'axios'
import { api } from '@/api/mutator'
import { usePromisePopup } from '@/contexts/PromisePopupContext'
import { getErrorMessageFromRequest, type ApiErrorResponse } from '@/utils/getErrorMessageFromRequest'
import type { OwnerPortalAccessCreated } from '@/pages/Amministrazione/Proprietari/types'

const ENDPOINT = '/owner-portal-accesses'

export function useOwnerAccessActions(onDone: () => void) {
  const { t } = useTranslation('amministrazione')
  const { promisePopup } = usePromisePopup()
  const [revealedPin, setRevealedPin] = useState<string | null>(null)

  function createAccess(personId: string, email: string) {
    promisePopup(
      api.post<OwnerPortalAccessCreated>(ENDPOINT, { personId, email }),
      {
        pending: t('proprietari.actions.creating'),
        success: (response) => {
          setRevealedPin(response.data.pin)
          onDone()
          return t('proprietari.actions.createSuccess')
        },
        error: (error: AxiosError<ApiErrorResponse>) =>
          getErrorMessageFromRequest(error, t('proprietari.actions.createError')),
      },
    )
  }

  function resetPin(id: string) {
    promisePopup(
      api.post<{ pin: string }>(`${ENDPOINT}/${id}/reset-pin`),
      {
        pending: t('proprietari.actions.resettingPin'),
        success: (response) => {
          setRevealedPin(response.data.pin)
          return t('proprietari.actions.resetPinSuccess')
        },
        error: (error: AxiosError<ApiErrorResponse>) =>
          getErrorMessageFromRequest(error, t('proprietari.actions.resetPinError')),
      },
    )
  }

  function toggleActive(id: string, active: boolean) {
    promisePopup(api.patch(`${ENDPOINT}/${id}`, { active }), {
      pending: t('proprietari.actions.updating'),
      success: () => {
        onDone()
        return t('proprietari.actions.updateSuccess')
      },
      error: (error: AxiosError<ApiErrorResponse>) =>
        getErrorMessageFromRequest(error, t('proprietari.actions.updateError')),
    })
  }

  return { createAccess, resetPin, toggleActive, revealedPin, clearRevealedPin: () => setRevealedPin(null) }
}
