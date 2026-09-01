import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import type { AxiosError } from 'axios'
import {
  usePropertyLocationDetailControllerFind,
  usePropertyLocationDetailControllerCreate,
  usePropertyLocationDetailControllerUpdateById,
} from '@/api/generated/api'
import { usePromisePopup } from '@/contexts/PromisePopupContext'
import { getErrorMessageFromRequest, type ApiErrorResponse } from '@/utils/getErrorMessageFromRequest'
import { emptyStringsToNull } from '@/utils/emptyStringsToNull'
import { toNumberOrNull } from '@/utils/toNumberOrNull'

export type LocationDetailFormValues = {
  latitude: string
  longitude: string
  position: string
  distanceToWaterM: string
  floorNumber: string
  totalFloors: string
  hasElevator: boolean
  hasArchitecturalBarriers: boolean
  builtYear: string
  totalUnitsInBuilding: string
  usableAreaSqm: string
}

const emptyValues: LocationDetailFormValues = {
  latitude: '',
  longitude: '',
  position: '',
  distanceToWaterM: '',
  floorNumber: '',
  totalFloors: '',
  hasElevator: false,
  hasArchitecturalBarriers: false,
  builtYear: '',
  totalUnitsInBuilding: '',
  usableAreaSqm: '',
}

export function usePropertyLocationDetailForm(propertyId: string) {
  const { t } = useTranslation('imoveis')
  const { promisePopup } = usePromisePopup()
  const { data: rows, isLoading } = usePropertyLocationDetailControllerFind({
    filter: { where: { propertyId }, limit: 1 },
  })
  const existing = rows?.[0]
  const { mutateAsync: create, isPending: creating } = usePropertyLocationDetailControllerCreate()
  const { mutateAsync: update, isPending: updating } = usePropertyLocationDetailControllerUpdateById()

  const form = useForm<LocationDetailFormValues>({ defaultValues: emptyValues })

  useEffect(() => {
    if (!existing) return
    form.reset({
      latitude: existing.latitude != null ? String(existing.latitude) : '',
      longitude: existing.longitude != null ? String(existing.longitude) : '',
      position: existing.position ?? '',
      distanceToWaterM: existing.distanceToWaterM != null ? String(existing.distanceToWaterM) : '',
      floorNumber: existing.floorNumber != null ? String(existing.floorNumber) : '',
      totalFloors: existing.totalFloors != null ? String(existing.totalFloors) : '',
      hasElevator: existing.hasElevator ?? false,
      hasArchitecturalBarriers: existing.hasArchitecturalBarriers ?? false,
      builtYear: existing.builtYear != null ? String(existing.builtYear) : '',
      totalUnitsInBuilding: existing.totalUnitsInBuilding != null ? String(existing.totalUnitsInBuilding) : '',
      usableAreaSqm: existing.usableAreaSqm != null ? String(existing.usableAreaSqm) : '',
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [existing])

  function onSubmit(values: LocationDetailFormValues) {
    const cleaned = emptyStringsToNull(values)
    const data = {
      ...cleaned,
      latitude: toNumberOrNull(values.latitude),
      longitude: toNumberOrNull(values.longitude),
      distanceToWaterM: toNumberOrNull(values.distanceToWaterM),
      floorNumber: toNumberOrNull(values.floorNumber),
      totalFloors: toNumberOrNull(values.totalFloors),
      builtYear: toNumberOrNull(values.builtYear),
      totalUnitsInBuilding: toNumberOrNull(values.totalUnitsInBuilding),
      usableAreaSqm: toNumberOrNull(values.usableAreaSqm),
      hasElevator: values.hasElevator,
      hasArchitecturalBarriers: values.hasArchitecturalBarriers,
      propertyId,
    }

    const promise = existing?.id ? update({ id: existing.id, data }) : create({ data })

    promisePopup(promise, {
      pending: t('toasts.locationDetailForm.pending'),
      success: t('toasts.locationDetailForm.success'),
      error: (error: AxiosError<ApiErrorResponse>) =>
        getErrorMessageFromRequest(error, t('toasts.locationDetailForm.error')),
    })
  }

  return { form, isLoading, isSubmitting: creating || updating, onSubmit: form.handleSubmit(onSubmit) }
}
