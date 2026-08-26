import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import type { AxiosError } from 'axios'
import {
  usePropertyHeatingDetailControllerFind,
  usePropertyHeatingDetailControllerCreate,
  usePropertyHeatingDetailControllerUpdateById,
} from '@/api/generated/api'
import { useToast } from '@/contexts/ToastContext'
import { getErrorMessageFromRequest, type ApiErrorResponse } from '@/utils/getErrorMessageFromRequest'
import { emptyStringsToNull } from '@/utils/emptyStringsToNull'
import { toNumberOrNull } from '@/utils/toNumberOrNull'
import type { PropertyHeatingDetailPartialHeatingType } from '@/api/generated/models'

export type HeatingFormValues = {
  heatingType: string
  fuel: string
  system: string
  hasRadiators: boolean
  monthlyCost: string
}

const emptyValues: HeatingFormValues = {
  heatingType: '',
  fuel: '',
  system: '',
  hasRadiators: false,
  monthlyCost: '',
}

export function usePropertyHeatingForm(propertyId: string) {
  const { t } = useTranslation('imoveis')
  const { toastPromise } = useToast()
  const { data: rows, isLoading } = usePropertyHeatingDetailControllerFind({
    filter: { where: { propertyId }, limit: 1 },
  })
  const existing = rows?.[0]
  const { mutateAsync: create, isPending: creating } = usePropertyHeatingDetailControllerCreate()
  const { mutateAsync: update, isPending: updating } = usePropertyHeatingDetailControllerUpdateById()

  const form = useForm<HeatingFormValues>({ defaultValues: emptyValues })

  useEffect(() => {
    if (!existing) return
    form.reset({
      heatingType: existing.heatingType ?? '',
      fuel: existing.fuel ?? '',
      system: existing.system ?? '',
      hasRadiators: existing.hasRadiators ?? false,
      monthlyCost: existing.monthlyCost != null ? String(existing.monthlyCost) : '',
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [existing])

  function onSubmit(values: HeatingFormValues) {
    const cleaned = emptyStringsToNull(values)
    const data = {
      ...cleaned,
      heatingType: cleaned.heatingType as PropertyHeatingDetailPartialHeatingType,
      monthlyCost: toNumberOrNull(values.monthlyCost),
      propertyId,
    }

    const promise = existing?.id ? update({ id: existing.id, data }) : create({ data })

    toastPromise(promise, {
      pending: t('toasts.heatingForm.pending'),
      success: t('toasts.heatingForm.success'),
      error: (error: AxiosError<ApiErrorResponse>) =>
        getErrorMessageFromRequest(error, t('toasts.heatingForm.error')),
    })
  }

  return { form, isLoading, isSubmitting: creating || updating, onSubmit: form.handleSubmit(onSubmit) }
}
