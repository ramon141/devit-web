import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import type { AxiosError } from 'axios'
import {
  usePropertyIndustrialDetailControllerFind,
  usePropertyIndustrialDetailControllerCreate,
  usePropertyIndustrialDetailControllerUpdateById,
} from '@/api/generated/api'
import { useToast } from '@/contexts/ToastContext'
import { getErrorMessageFromRequest, type ApiErrorResponse } from '@/utils/getErrorMessageFromRequest'
import { emptyStringsToNull } from '@/utils/emptyStringsToNull'
import { toNumberOrNull } from '@/utils/toNumberOrNull'

export type IndustrialFormValues = {
  heightM: string
  heightUnderBeamM: string
  hasOverheadCrane: boolean
  floorsCount: string
  hasAlarm: boolean
  entrancesCount: string
  loadingBaysCount: string
  allowedActivities: string
}

const emptyValues: IndustrialFormValues = {
  heightM: '',
  heightUnderBeamM: '',
  hasOverheadCrane: false,
  floorsCount: '',
  hasAlarm: false,
  entrancesCount: '',
  loadingBaysCount: '',
  allowedActivities: '',
}

export function usePropertyIndustrialForm(propertyId: string) {
  const { t } = useTranslation('imoveis')
  const { toastPromise } = useToast()
  const { data: rows, isLoading } = usePropertyIndustrialDetailControllerFind({
    filter: { where: { propertyId }, limit: 1 },
  })
  const existing = rows?.[0]
  const { mutateAsync: create, isPending: creating } = usePropertyIndustrialDetailControllerCreate()
  const { mutateAsync: update, isPending: updating } = usePropertyIndustrialDetailControllerUpdateById()

  const form = useForm<IndustrialFormValues>({ defaultValues: emptyValues })

  useEffect(() => {
    if (!existing) return
    form.reset({
      heightM: existing.heightM != null ? String(existing.heightM) : '',
      heightUnderBeamM: existing.heightUnderBeamM != null ? String(existing.heightUnderBeamM) : '',
      hasOverheadCrane: existing.hasOverheadCrane ?? false,
      floorsCount: existing.floorsCount != null ? String(existing.floorsCount) : '',
      hasAlarm: existing.hasAlarm ?? false,
      entrancesCount: existing.entrancesCount != null ? String(existing.entrancesCount) : '',
      loadingBaysCount: existing.loadingBaysCount != null ? String(existing.loadingBaysCount) : '',
      allowedActivities: existing.allowedActivities ?? '',
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [existing])

  function onSubmit(values: IndustrialFormValues) {
    const cleaned = emptyStringsToNull(values)
    const data = {
      ...cleaned,
      heightM: toNumberOrNull(values.heightM),
      heightUnderBeamM: toNumberOrNull(values.heightUnderBeamM),
      floorsCount: toNumberOrNull(values.floorsCount),
      entrancesCount: toNumberOrNull(values.entrancesCount),
      loadingBaysCount: toNumberOrNull(values.loadingBaysCount),
      hasOverheadCrane: values.hasOverheadCrane,
      hasAlarm: values.hasAlarm,
      propertyId,
    }

    const promise = existing?.id ? update({ id: existing.id, data }) : create({ data })

    toastPromise(promise, {
      pending: t('toasts.industrialForm.pending'),
      success: t('toasts.industrialForm.success'),
      error: (error: AxiosError<ApiErrorResponse>) =>
        getErrorMessageFromRequest(error, t('toasts.industrialForm.error')),
    })
  }

  return { form, isLoading, isSubmitting: creating || updating, onSubmit: form.handleSubmit(onSubmit) }
}
