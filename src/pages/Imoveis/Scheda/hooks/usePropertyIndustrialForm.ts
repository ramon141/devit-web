import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import type { AxiosError } from 'axios'
import {
  usePropertyIndustrialDetailControllerFind,
  usePropertyIndustrialDetailControllerCreate,
  usePropertyIndustrialDetailControllerUpdateById,
} from '@/api/generated/api'
import { usePromisePopup } from '@/contexts/PromisePopupContext'
import { usePropertyDraft } from '@/pages/Imoveis/contexts/PropertyDraftContext'
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
  const { promisePopup } = usePromisePopup()
  const { draft, setDraftBlock } = usePropertyDraft()
  const { data: rows, isLoading } = usePropertyIndustrialDetailControllerFind({
    filter: { where: { propertyId }, limit: 1 },
  }, { query: { enabled: !!propertyId } })
  const existingRow = rows?.[0]
  const existing = propertyId ? existingRow : draft.industrialDetail
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
      hasAlarm: values.hasAlarm
    }

    // Sem imóvel ainda: guarda no rascunho para ir junto no POST /properties
    const promise = !propertyId
      ? Promise.resolve(setDraftBlock('industrialDetail', { ...draft.industrialDetail, ...data }))
      : existingRow?.id
        ? update({ id: existingRow.id, data: { ...data, propertyId } })
        : create({ data: { ...data, propertyId } })

    promisePopup(promise, {
      pending: t('toasts.industrialForm.pending'),
      success: t('toasts.industrialForm.success'),
      error: (error: AxiosError<ApiErrorResponse>) =>
        getErrorMessageFromRequest(error, t('toasts.industrialForm.error')),
    })
  }

  return { form, isLoading, isSubmitting: creating || updating, onSubmit: form.handleSubmit(onSubmit) }
}
