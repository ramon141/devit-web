import { useState } from 'react'
import type { AxiosError } from 'axios'
import {
  getRentalAdjustmentControllerFindQueryKey,
  getRentalContractControllerFindQueryKey,
  useRentalAdjustmentControllerFind,
  useRentalAdjustmentControllerGenerate,
  useRentalContractControllerFind,
} from '@/api/generated/api'
import { useQueryClient } from '@tanstack/react-query'
import { useToast } from '@/contexts/ToastContext'
import { getErrorMessageFromRequest, type ApiErrorResponse } from '@/utils/getErrorMessageFromRequest'

export function useRentalAdjustments() {
  const queryClient = useQueryClient()
  const { toastPromise } = useToast()
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [indexPercent, setIndexPercent] = useState('')

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
    const percent = Number(indexPercent)
    if (!percent) return

    const promise = generate({
      data: {
        indexPercent: percent,
        rentalContractIds: selectedIds.length > 0 ? selectedIds : undefined,
      },
    })

    toastPromise(promise, {
      pending: 'Generazione documenti...',
      success: () => {
        queryClient.invalidateQueries({ queryKey: getRentalAdjustmentControllerFindQueryKey() })
        queryClient.invalidateQueries({ queryKey: getRentalContractControllerFindQueryKey() })
        setSelectedIds([])
        setIndexPercent('')
        return 'Documenti di adeguamento generati con successo!'
      },
      error: (error: AxiosError<ApiErrorResponse>) =>
        getErrorMessageFromRequest(error, 'Errore durante la generazione dei documenti'),
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
    generateAdjustments,
    isGenerating: isPending,
  }
}
