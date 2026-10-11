import { useState } from 'react'
import type { AxiosError } from 'axios'
import { useTranslation } from 'react-i18next'
import {
  getRentalAdjustmentControllerFindQueryKey,
  getRentalContractControllerFindQueryKey,
  useRentalAdjustmentControllerFind,
  useRentalAdjustmentControllerGenerate,
  useRentalContractControllerFind,
} from '@/api/generated/api'
import { useQueryClient } from '@tanstack/react-query'
import { usePromisePopup } from '@/contexts/PromisePopupContext'
import { getErrorMessageFromRequest, type ApiErrorResponse } from '@/utils/getErrorMessageFromRequest'

export function useRentalAdjustments() {
  const { t } = useTranslation('operazioni')
  const queryClient = useQueryClient()
  const { promisePopup } = usePromisePopup()
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [indexPercent, setIndexPercent] = useState('')

  const percentValue = Number(indexPercent)
  const hasIndexPercent = indexPercent !== ''
  const isIndexPercentValid = percentValue > 0 && percentValue <= 100

  const { data: contracts, isLoading } = useRentalContractControllerFind({
    filter: {
      where: { situation: 'active' },
      include: [{ relation: 'property' }, { relation: 'tenant' }, { relation: 'owner' }],
      order: ['startDate DESC'],
    },
  })

  const { data: generated } = useRentalAdjustmentControllerFind({
    filter: { include: [{ relation: 'rentalContract' }], order: ['createdAt DESC'], limit: 20 },
  })

  const { mutateAsync: generate, isPending } = useRentalAdjustmentControllerGenerate()

  function toggleSelected(id: string) {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  function generateAdjustments() {
    if (!isIndexPercentValid) return

    const promise = generate({
      data: {
        indexPercent: percentValue,
        rentalContractIds: selectedIds.length > 0 ? selectedIds : undefined,
      },
    })

    promisePopup(promise, {
      pending: t('locazioni.adeguamenti.toasts.pending'),
      success: () => {
        queryClient.invalidateQueries({ queryKey: getRentalAdjustmentControllerFindQueryKey() })
        queryClient.invalidateQueries({ queryKey: getRentalContractControllerFindQueryKey() })
        setSelectedIds([])
        setIndexPercent('')
        return t('locazioni.adeguamenti.toasts.success')
      },
      error: (error: AxiosError<ApiErrorResponse>) =>
        getErrorMessageFromRequest(error, t('locazioni.adeguamenti.toasts.error')),
    })
  }

  return {
    contracts: contracts ?? [],
    isLoading,
    generated: generated ?? [],
    selectedIds,
    toggleSelected,
    indexPercent,
    setIndexPercent,
    indexPercentError: hasIndexPercent && !isIndexPercentValid,
    isIndexPercentValid,
    generateAdjustments,
    isGenerating: isPending,
  }
}
