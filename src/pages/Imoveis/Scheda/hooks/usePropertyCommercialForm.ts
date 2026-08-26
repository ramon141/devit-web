import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import type { AxiosError } from 'axios'
import {
  usePropertyCommercialDetailControllerFind,
  usePropertyCommercialDetailControllerCreate,
  usePropertyCommercialDetailControllerUpdateById,
} from '@/api/generated/api'
import { useToast } from '@/contexts/ToastContext'
import { getErrorMessageFromRequest, type ApiErrorResponse } from '@/utils/getErrorMessageFromRequest'
import type { PropertyCommercialDetailPartialScope } from '@/api/generated/models'
import { emptyStringsToNull } from '@/utils/emptyStringsToNull'
import { toNumberOrNull } from '@/utils/toNumberOrNull'

export type CommercialFormValues = {
  scope: string
  mainActivity: string
  alternativeActivities: string
  activityValue: string
  averageRevenueFrom: string
  averageRevenueTo: string
  monthlyRent: string
  manageable: boolean
  weeklyRestDay: string
  showcaseCount: string
  showcaseExposure: string
  coveredAreaSqm: string
  uncoveredAreaSqm: string
  coverableAreaSqm: string
  roomSeparation: string
  context: string
}

const emptyValues: CommercialFormValues = {
  scope: '',
  mainActivity: '',
  alternativeActivities: '',
  activityValue: '',
  averageRevenueFrom: '',
  averageRevenueTo: '',
  monthlyRent: '',
  manageable: false,
  weeklyRestDay: '',
  showcaseCount: '',
  showcaseExposure: '',
  coveredAreaSqm: '',
  uncoveredAreaSqm: '',
  coverableAreaSqm: '',
  roomSeparation: '',
  context: '',
}

export function usePropertyCommercialForm(propertyId: string) {
  const { t } = useTranslation('imoveis')
  const { toastPromise } = useToast()
  const { data: rows, isLoading } = usePropertyCommercialDetailControllerFind({
    filter: { where: { propertyId }, limit: 1 },
  })
  const existing = rows?.[0]
  const { mutateAsync: create, isPending: creating } = usePropertyCommercialDetailControllerCreate()
  const { mutateAsync: update, isPending: updating } = usePropertyCommercialDetailControllerUpdateById()

  const form = useForm<CommercialFormValues>({ defaultValues: emptyValues })

  useEffect(() => {
    if (!existing) return
    form.reset({
      scope: existing.scope ?? '',
      mainActivity: existing.mainActivity ?? '',
      alternativeActivities: existing.alternativeActivities ?? '',
      activityValue: existing.activityValue != null ? String(existing.activityValue) : '',
      averageRevenueFrom: existing.averageRevenueFrom != null ? String(existing.averageRevenueFrom) : '',
      averageRevenueTo: existing.averageRevenueTo != null ? String(existing.averageRevenueTo) : '',
      monthlyRent: existing.monthlyRent != null ? String(existing.monthlyRent) : '',
      manageable: existing.manageable ?? false,
      weeklyRestDay: existing.weeklyRestDay ?? '',
      showcaseCount: existing.showcaseCount != null ? String(existing.showcaseCount) : '',
      showcaseExposure: existing.showcaseExposure ?? '',
      coveredAreaSqm: existing.coveredAreaSqm != null ? String(existing.coveredAreaSqm) : '',
      uncoveredAreaSqm: existing.uncoveredAreaSqm != null ? String(existing.uncoveredAreaSqm) : '',
      coverableAreaSqm: existing.coverableAreaSqm != null ? String(existing.coverableAreaSqm) : '',
      roomSeparation: existing.roomSeparation ?? '',
      context: existing.context ?? '',
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [existing])

  function onSubmit(values: CommercialFormValues) {
    const cleaned = emptyStringsToNull(values)
    const data = {
      ...cleaned,
      scope: cleaned.scope as PropertyCommercialDetailPartialScope,
      activityValue: toNumberOrNull(values.activityValue),
      averageRevenueFrom: toNumberOrNull(values.averageRevenueFrom),
      averageRevenueTo: toNumberOrNull(values.averageRevenueTo),
      monthlyRent: toNumberOrNull(values.monthlyRent),
      showcaseCount: toNumberOrNull(values.showcaseCount),
      coveredAreaSqm: toNumberOrNull(values.coveredAreaSqm),
      uncoveredAreaSqm: toNumberOrNull(values.uncoveredAreaSqm),
      coverableAreaSqm: toNumberOrNull(values.coverableAreaSqm),
      manageable: values.manageable,
      propertyId,
    }

    const promise = existing?.id ? update({ id: existing.id, data }) : create({ data })

    toastPromise(promise, {
      pending: t('toasts.commercialForm.pending'),
      success: t('toasts.commercialForm.success'),
      error: (error: AxiosError<ApiErrorResponse>) =>
        getErrorMessageFromRequest(error, t('toasts.commercialForm.error')),
    })
  }

  return { form, isLoading, isSubmitting: creating || updating, onSubmit: form.handleSubmit(onSubmit) }
}
