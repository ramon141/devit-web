import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import type { AxiosError } from 'axios'
import {
  usePropertyDetailControllerFind,
  usePropertyDetailControllerCreate,
  usePropertyDetailControllerUpdateById,
} from '@/api/generated/api'
import { usePromisePopup } from '@/contexts/PromisePopupContext'
import { usePropertyDraft } from '@/pages/Imoveis/contexts/PropertyDraftContext'
import { getErrorMessageFromRequest, type ApiErrorResponse } from '@/utils/getErrorMessageFromRequest'
import { toNumberOrNull } from '@/utils/toNumberOrNull'

export type PriceDetailFormValues = {
  estimatedValue: string
  negotiable: boolean
  priceFrom: boolean
  hiddenOnPrint: boolean
  hiddenOnInternet: boolean
  boxIncludedInPrice: boolean
  auction: boolean
}

const emptyValues: PriceDetailFormValues = {
  estimatedValue: '',
  negotiable: false,
  priceFrom: false,
  hiddenOnPrint: false,
  hiddenOnInternet: false,
  boxIncludedInPrice: false,
  auction: false,
}

export function usePropertyPriceDetailForm(propertyId: string) {
  const { t } = useTranslation('imoveis')
  const { promisePopup } = usePromisePopup()
  const { draft, setDraftBlock } = usePropertyDraft()
  const { data: rows, isLoading } = usePropertyDetailControllerFind({
    filter: { where: { propertyId }, limit: 1 },
  }, { query: { enabled: !!propertyId } })
  const existingRow = rows?.[0]
  const existing = propertyId ? existingRow : draft.detail
  const { mutateAsync: create, isPending: creating } = usePropertyDetailControllerCreate()
  const { mutateAsync: update, isPending: updating } = usePropertyDetailControllerUpdateById()

  const form = useForm<PriceDetailFormValues>({ defaultValues: emptyValues })

  useEffect(() => {
    if (!existing) return
    form.reset({
      estimatedValue: existing.estimatedValue != null ? String(existing.estimatedValue) : '',
      negotiable: existing.negotiable ?? false,
      priceFrom: existing.priceFrom ?? false,
      hiddenOnPrint: existing.hiddenOnPrint ?? false,
      hiddenOnInternet: existing.hiddenOnInternet ?? false,
      boxIncludedInPrice: existing.boxIncludedInPrice ?? false,
      auction: existing.auction ?? false,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [existing])

  function onSubmit(values: PriceDetailFormValues) {
    const data = { ...values, estimatedValue: toNumberOrNull(values.estimatedValue) }

    // Sem imóvel ainda: guarda no rascunho para ir junto no POST /properties
    const promise = !propertyId
      ? Promise.resolve(setDraftBlock('detail', { ...draft.detail, ...data }))
      : existingRow?.id
        ? update({ id: existingRow.id, data: { ...data, propertyId } })
        : create({ data: { ...data, propertyId } })

    promisePopup(promise, {
      pending: t('toasts.priceDetailForm.pending'),
      success: t('toasts.priceDetailForm.success'),
      error: (error: AxiosError<ApiErrorResponse>) =>
        getErrorMessageFromRequest(error, t('toasts.priceDetailForm.error')),
    })
  }

  return { form, isLoading, isSubmitting: creating || updating, onSubmit: form.handleSubmit(onSubmit) }
}
