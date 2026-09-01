import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import type { AxiosError } from 'axios'
import {
  usePropertyLandDetailControllerFind,
  usePropertyLandDetailControllerCreate,
  usePropertyLandDetailControllerUpdateById,
} from '@/api/generated/api'
import { usePromisePopup } from '@/contexts/PromisePopupContext'
import { getErrorMessageFromRequest, type ApiErrorResponse } from '@/utils/getErrorMessageFromRequest'
import { emptyStringsToNull } from '@/utils/emptyStringsToNull'
import { toNumberOrNull } from '@/utils/toNumberOrNull'
import type { PropertyLandDetailPartialTerrainType } from '@/api/generated/models'

export type LandFormValues = {
  terrainType: string
  buildabilityIndex: string
  buildableAreaSqm: string
  agriculturalAreaSqm: string
  hasExistingConstruction: boolean
  projectApproved: boolean
  possibleConstruction: string
  rightOfWay: string
  preemptionRights: string
  plantations: string
}

const emptyValues: LandFormValues = {
  terrainType: '',
  buildabilityIndex: '',
  buildableAreaSqm: '',
  agriculturalAreaSqm: '',
  hasExistingConstruction: false,
  projectApproved: false,
  possibleConstruction: '',
  rightOfWay: '',
  preemptionRights: '',
  plantations: '',
}

export function usePropertyLandForm(propertyId: string) {
  const { t } = useTranslation('imoveis')
  const { promisePopup } = usePromisePopup()
  const { data: rows, isLoading } = usePropertyLandDetailControllerFind({
    filter: { where: { propertyId }, limit: 1 },
  })
  const existing = rows?.[0]
  const { mutateAsync: create, isPending: creating } = usePropertyLandDetailControllerCreate()
  const { mutateAsync: update, isPending: updating } = usePropertyLandDetailControllerUpdateById()

  const form = useForm<LandFormValues>({ defaultValues: emptyValues })

  useEffect(() => {
    if (!existing) return
    form.reset({
      terrainType: existing.terrainType ?? '',
      buildabilityIndex: existing.buildabilityIndex != null ? String(existing.buildabilityIndex) : '',
      buildableAreaSqm: existing.buildableAreaSqm != null ? String(existing.buildableAreaSqm) : '',
      agriculturalAreaSqm: existing.agriculturalAreaSqm != null ? String(existing.agriculturalAreaSqm) : '',
      hasExistingConstruction: existing.hasExistingConstruction ?? false,
      projectApproved: existing.projectApproved ?? false,
      possibleConstruction: existing.possibleConstruction ?? '',
      rightOfWay: existing.rightOfWay ?? '',
      preemptionRights: existing.preemptionRights ?? '',
      plantations: existing.plantations ?? '',
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [existing])

  function onSubmit(values: LandFormValues) {
    const cleaned = emptyStringsToNull(values)
    const data = {
      ...cleaned,
      terrainType: cleaned.terrainType as PropertyLandDetailPartialTerrainType,
      buildabilityIndex: toNumberOrNull(values.buildabilityIndex),
      buildableAreaSqm: toNumberOrNull(values.buildableAreaSqm),
      agriculturalAreaSqm: toNumberOrNull(values.agriculturalAreaSqm),
      hasExistingConstruction: values.hasExistingConstruction,
      projectApproved: values.projectApproved,
      propertyId,
    }

    const promise = existing?.id ? update({ id: existing.id, data }) : create({ data })

    promisePopup(promise, {
      pending: t('toasts.landForm.pending'),
      success: t('toasts.landForm.success'),
      error: (error: AxiosError<ApiErrorResponse>) =>
        getErrorMessageFromRequest(error, t('toasts.landForm.error')),
    })
  }

  return { form, isLoading, isSubmitting: creating || updating, onSubmit: form.handleSubmit(onSubmit) }
}
