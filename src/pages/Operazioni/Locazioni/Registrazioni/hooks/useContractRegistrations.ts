import dayjs from 'dayjs'
import { useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import type { AxiosError } from 'axios'
import {
  getRentalContractControllerFindQueryKey,
  useRentalContractControllerFind,
  useRentalContractControllerUpdateById,
} from '@/api/generated/api'
import { useToast } from '@/contexts/ToastContext'
import { getErrorMessageFromRequest, type ApiErrorResponse } from '@/utils/getErrorMessageFromRequest'

export function useContractRegistrations() {
  const today = dayjs().toISOString()
  const { t } = useTranslation('operazioni')
  const queryClient = useQueryClient()
  const { toastPromise } = useToast()
  const { mutateAsync: update, isPending: isMarking } = useRentalContractControllerUpdateById()

  const { data, isLoading } = useRentalContractControllerFind({
    filter: {
      where: {
        or: [{ registeredAt: null }, { renewalDueDate: { lt: today } }],
      },
      include: [{ relation: 'property' }, { relation: 'tenant' }],
      order: ['startDate DESC'],
    },
  })

  function markRegistered(id: string) {
    const promise = update({ id, data: { registeredAt: new Date().toISOString().slice(0, 10) } })

    toastPromise(promise, {
      pending: t('locazioni.registrazioni.table.marking'),
      success: () => {
        queryClient.invalidateQueries({ queryKey: getRentalContractControllerFindQueryKey() })
        return t('locazioni.registrazioni.table.markSuccess')
      },
      error: (error: AxiosError<ApiErrorResponse>) =>
        getErrorMessageFromRequest(error, t('locazioni.registrazioni.table.markError')),
    })
  }

  return {
    contracts: data ?? [],
    isLoading,
    markRegistered,
    isMarking,
  }
}
