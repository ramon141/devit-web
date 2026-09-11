import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import type { AxiosError } from 'axios'
import {
  getPropertyFeeControllerFindQueryKey,
  usePropertyFeeControllerCreate,
  usePropertyFeeControllerDeleteById,
  usePropertyFeeControllerFind,
} from '@/api/generated/api'
import type { NewPropertyFeeFrequency } from '@/api/generated/models'
import { usePromisePopup } from '@/contexts/PromisePopupContext'
import { usePropertyDraft } from '@/pages/Imoveis/contexts/PropertyDraftContext'
import { getErrorMessageFromRequest, type ApiErrorResponse } from '@/utils/getErrorMessageFromRequest'

export function usePropertyFees(propertyId: string) {
  const { t } = useTranslation('imoveis')
  const queryClient = useQueryClient()
  const { promisePopup } = usePromisePopup()
  const { draft, setDraftBlock } = usePropertyDraft()
  const [name, setName] = useState('')
  const [amount, setAmount] = useState<string | undefined>(undefined)
  const [frequency, setFrequency] = useState<NewPropertyFeeFrequency | ''>('')
  const [note, setNote] = useState('')

  const { data: fees } = usePropertyFeeControllerFind(
    { filter: { where: { propertyId } } },
    { query: { enabled: !!propertyId } }
  )

  // No rascunho o índice faz as vezes de id para a lista poder remover itens
  const draftFees = draft.fees.map((fee, index) => ({ ...fee, id: String(index) }))
  const { mutateAsync: create } = usePropertyFeeControllerCreate()
  const { mutateAsync: remove } = usePropertyFeeControllerDeleteById()

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: getPropertyFeeControllerFindQueryKey() })
  }

  function addFee() {
    if (!name || !amount || !frequency) return

    const fee = { name, amount: Number(amount), frequency, note: note || null }

    const promise = propertyId
      ? create({ data: { ...fee, propertyId } }).then(() => undefined)
      : Promise.resolve(setDraftBlock('fees', [...draft.fees, fee]))

    promisePopup(promise, {
      pending: t('toasts.fees.addPending'),
      success: () => {
        invalidate()
        setName('')
        setAmount(undefined)
        setFrequency('')
        setNote('')
        return t('toasts.fees.addSuccess')
      },
      error: (error: AxiosError<ApiErrorResponse>) =>
        getErrorMessageFromRequest(error, t('toasts.fees.addError')),
    })
  }

  function removeFee(id: string) {
    const promise = propertyId
      ? remove({ id })
      : Promise.resolve(setDraftBlock('fees', draft.fees.filter((_, index) => String(index) !== id)))

    promisePopup(promise, {
      pending: t('toasts.fees.removePending'),
      success: () => {
        invalidate()
        return t('toasts.fees.removeSuccess')
      },
      error: (error: AxiosError<ApiErrorResponse>) =>
        getErrorMessageFromRequest(error, t('toasts.fees.removeError')),
    })
  }

  return {
    fees: propertyId ? (fees ?? []) : draftFees,
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
