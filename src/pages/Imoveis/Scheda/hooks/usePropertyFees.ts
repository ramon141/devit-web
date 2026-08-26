import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import {
  getPropertyFeeControllerFindQueryKey,
  usePropertyFeeControllerCreate,
  usePropertyFeeControllerDeleteById,
  usePropertyFeeControllerFind,
} from '@/api/generated/api'
import type { NewPropertyFeeFrequency } from '@/api/generated/models'
import { useToast } from '@/contexts/ToastContext'
import { getErrorMessageFromRequest, type ApiErrorResponse } from '@/utils/getErrorMessageFromRequest'

export function usePropertyFees(propertyId: string) {
  const queryClient = useQueryClient()
  const { toastPromise } = useToast()
  const [name, setName] = useState('')
  const [amount, setAmount] = useState<string | undefined>(undefined)
  const [frequency, setFrequency] = useState<NewPropertyFeeFrequency | ''>('')
  const [note, setNote] = useState('')

  const { data: fees } = usePropertyFeeControllerFind({ filter: { where: { propertyId } } })
  const { mutateAsync: create } = usePropertyFeeControllerCreate()
  const { mutateAsync: remove } = usePropertyFeeControllerDeleteById()

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: getPropertyFeeControllerFindQueryKey() })
  }

  function addFee() {
    if (!name || !amount || !frequency) return

    const promise = create({
      data: {
        propertyId,
        name,
        amount: Number(amount),
        frequency,
        note: note || null,
      },
    })

    toastPromise(promise, {
      pending: 'Aggiunta tassa...',
      success: () => {
        invalidate()
        setName('')
        setAmount(undefined)
        setFrequency('')
        setNote('')
        return 'Tassa aggiunta con successo!'
      },
      error: (error: AxiosError<ApiErrorResponse>) =>
        getErrorMessageFromRequest(error, 'Errore durante l’aggiunta della tassa'),
    })
  }

  function removeFee(id: string) {
    toastPromise(remove({ id }), {
      pending: 'Rimozione tassa...',
      success: () => {
        invalidate()
        return 'Tassa rimossa con successo!'
      },
      error: (error: AxiosError<ApiErrorResponse>) =>
        getErrorMessageFromRequest(error, 'Errore durante la rimozione della tassa'),
    })
  }

  return {
    fees: fees ?? [],
    name,
    setName,
    amount,
    setAmount,
    frequency,
    setFrequency,
    note,
    setNote,
    addFee,
    removeFee,
  }
}
