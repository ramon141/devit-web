import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import type { AxiosError } from 'axios'
import {
  usePropertyDetailControllerFind,
  usePropertyDetailControllerCreate,
  usePropertyDetailControllerUpdateById,
} from '@/api/generated/api'
import { useToast } from '@/contexts/ToastContext'
import { getErrorMessageFromRequest, type ApiErrorResponse } from '@/utils/getErrorMessageFromRequest'
import { emptyStringsToNull } from '@/utils/emptyStringsToNull'
import { toNumberOrNull } from '@/utils/toNumberOrNull'
import { toISODateOrNull } from '@/utils/toISODateOrNull'
import type {
  PropertyDetailPartialRating,
  PropertyDetailPartialMediationType,
  PropertyDetailPartialAvailability,
  PropertyDetailPartialCondition,
  PropertyDetailPartialFurnished,
} from '@/api/generated/models'

export type DettagliFormValues = {
  acquisitionDate: string
  listingStage: string
  rating: string
  agentId: string
  mediationType: string
  mediationFeeClientPct: string
  mediationFeeOwnerPct: string
  subtype: string
  bareOwnership: boolean
  prestige: boolean
  newConstruction: boolean
  availability: string
  availableImmediately: boolean
  condition: string
  furnished: string
  exposure: string
  internalNote: string
  sharedNote: string
}

const emptyValues: DettagliFormValues = {
  acquisitionDate: '',
  listingStage: '',
  rating: 'standard',
  agentId: '',
  mediationType: '',
  mediationFeeClientPct: '',
  mediationFeeOwnerPct: '',
  subtype: '',
  bareOwnership: false,
  prestige: false,
  newConstruction: false,
  availability: '',
  availableImmediately: false,
  condition: '',
  furnished: '',
  exposure: '',
  internalNote: '',
  sharedNote: '',
}

export function usePropertyDetailForm(propertyId: string) {
  const { t } = useTranslation('imoveis')
  const { toastPromise } = useToast()
  const { data: rows, isLoading } = usePropertyDetailControllerFind({
    filter: { where: { propertyId }, limit: 1 },
  })
  const existing = rows?.[0]
  const { mutateAsync: create, isPending: creating } = usePropertyDetailControllerCreate()
  const { mutateAsync: update, isPending: updating } = usePropertyDetailControllerUpdateById()

  const form = useForm<DettagliFormValues>({ defaultValues: emptyValues })

  useEffect(() => {
    if (!existing) return
    form.reset({
      acquisitionDate: existing.acquisitionDate?.slice(0, 10) ?? '',
      listingStage: existing.listingStage ?? '',
      rating: existing.rating ?? 'standard',
      agentId: existing.agentId ?? '',
      mediationType: existing.mediationType ?? '',
      mediationFeeClientPct: existing.mediationFeeClientPct != null ? String(existing.mediationFeeClientPct) : '',
      mediationFeeOwnerPct: existing.mediationFeeOwnerPct != null ? String(existing.mediationFeeOwnerPct) : '',
      subtype: existing.subtype ?? '',
      bareOwnership: existing.bareOwnership ?? false,
      prestige: existing.prestige ?? false,
      newConstruction: existing.newConstruction ?? false,
      availability: existing.availability ?? '',
      availableImmediately: existing.availableImmediately ?? false,
      condition: existing.condition ?? '',
      furnished: existing.furnished ?? '',
      exposure: existing.exposure ?? '',
      internalNote: existing.internalNote ?? '',
      sharedNote: existing.sharedNote ?? '',
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [existing])

  function onSubmit(values: DettagliFormValues) {
    const cleaned = emptyStringsToNull(values)
    const data = {
      ...cleaned,
      rating: cleaned.rating as PropertyDetailPartialRating,
      mediationType: cleaned.mediationType as PropertyDetailPartialMediationType,
      availability: cleaned.availability as PropertyDetailPartialAvailability,
      condition: cleaned.condition as PropertyDetailPartialCondition,
      furnished: cleaned.furnished as PropertyDetailPartialFurnished,
      acquisitionDate: toISODateOrNull(values.acquisitionDate),
      mediationFeeClientPct: toNumberOrNull(values.mediationFeeClientPct),
      mediationFeeOwnerPct: toNumberOrNull(values.mediationFeeOwnerPct),
      propertyId,
    }

    const promise = existing?.id ? update({ id: existing.id, data }) : create({ data })

    toastPromise(promise, {
      pending: t('toasts.detailForm.pending'),
      success: t('toasts.detailForm.success'),
      error: (error: AxiosError<ApiErrorResponse>) =>
        getErrorMessageFromRequest(error, t('toasts.detailForm.error')),
    })
  }

  return { form, isLoading, isSubmitting: creating || updating, onSubmit: form.handleSubmit(onSubmit) }
}
