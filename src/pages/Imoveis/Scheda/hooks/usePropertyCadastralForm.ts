import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import type { AxiosError } from 'axios'
import {
  usePropertyCadastralInfoControllerFind,
  usePropertyCadastralInfoControllerCreate,
  usePropertyCadastralInfoControllerUpdateById,
} from '@/api/generated/api'
import { usePromisePopup } from '@/contexts/PromisePopupContext'
import { getErrorMessageFromRequest, type ApiErrorResponse } from '@/utils/getErrorMessageFromRequest'
import { emptyStringsToNull } from '@/utils/emptyStringsToNull'
import { toNumberOrNull } from '@/utils/toNumberOrNull'

export type CadastralFormValues = {
  registeredAt: string
  partita: string
  mappali: string
  category: string
  foglio: string
  particella: string
  subalterno: string
  rendita: string
}

const emptyValues: CadastralFormValues = {
  registeredAt: '',
  partita: '',
  mappali: '',
  category: '',
  foglio: '',
  particella: '',
  subalterno: '',
  rendita: '',
}

export function usePropertyCadastralForm(propertyId: string) {
  const { t } = useTranslation('imoveis')
  const { promisePopup } = usePromisePopup()
  const { data: rows, isLoading } = usePropertyCadastralInfoControllerFind({
    filter: { where: { propertyId }, limit: 1 },
  })
  const existing = rows?.[0]
  const { mutateAsync: create, isPending: creating } = usePropertyCadastralInfoControllerCreate()
  const { mutateAsync: update, isPending: updating } = usePropertyCadastralInfoControllerUpdateById()

  const form = useForm<CadastralFormValues>({ defaultValues: emptyValues })

  useEffect(() => {
    if (!existing) return
    form.reset({
      registeredAt: existing.registeredAt ?? '',
      partita: existing.partita ?? '',
      mappali: existing.mappali ?? '',
      category: existing.category ?? '',
      foglio: existing.foglio ?? '',
      particella: existing.particella ?? '',
      subalterno: existing.subalterno ?? '',
      rendita: existing.rendita != null ? String(existing.rendita) : '',
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [existing])

  function onSubmit(values: CadastralFormValues) {
    const cleaned = emptyStringsToNull(values)
    const data = { ...cleaned, rendita: toNumberOrNull(values.rendita), propertyId }

    const promise = existing?.id ? update({ id: existing.id, data }) : create({ data })

    promisePopup(promise, {
      pending: t('toasts.cadastralForm.pending'),
      success: t('toasts.cadastralForm.success'),
      error: (error: AxiosError<ApiErrorResponse>) =>
        getErrorMessageFromRequest(error, t('toasts.cadastralForm.error')),
    })
  }

  return { form, isLoading, isSubmitting: creating || updating, onSubmit: form.handleSubmit(onSubmit) }
}
