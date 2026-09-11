import { useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useQueryClient } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import {
  getZoneControllerCountQueryKey,
  getZoneControllerFindQueryKey,
  useZoneControllerCreate,
  useZoneControllerUpdateById,
} from '@/api/generated/api'
import type { Zone } from '@/api/generated/models'
import { usePromisePopup } from '@/contexts/PromisePopupContext'
import { getErrorMessageFromRequest, type ApiErrorResponse } from '@/utils/getErrorMessageFromRequest'
import { emptyStringsToNull } from '@/utils/emptyStringsToNull'
import { zoneSchema, type ZoneFormValues } from '@/pages/Amministrazione/Zone/schemas/zoneSchema'

const emptyValues: ZoneFormValues = { name: '', city: '', region: '', active: true }

type UseZoneFormProps = {
  zone?: Zone | null
  onSaved: () => void
}

export function useZoneForm({ zone, onSaved }: UseZoneFormProps) {
  const { t } = useTranslation('amministrazione')
  const queryClient = useQueryClient()
  const { promisePopup } = usePromisePopup()
  const { mutateAsync: create, isPending: creating } = useZoneControllerCreate()
  const { mutateAsync: update, isPending: updating } = useZoneControllerUpdateById()

  const form = useForm<ZoneFormValues>({
    resolver: zodResolver(zoneSchema),
    defaultValues: emptyValues,
  })

  useEffect(() => {
    form.reset(
      zone
        ? {
            name: zone.name,
            city: zone.city,
            region: zone.region ?? '',
            active: zone.active ?? true,
          }
        : emptyValues
    )
  }, [zone, form])

  function invalidateList() {
    queryClient.invalidateQueries({ queryKey: getZoneControllerFindQueryKey() })
    queryClient.invalidateQueries({ queryKey: getZoneControllerCountQueryKey() })
  }

  function onSubmit(values: ZoneFormValues) {
    const data = emptyStringsToNull(values)
    const promise = zone?.id ? update({ id: zone.id, data }) : create({ data })

    promisePopup(promise, {
      pending: zone ? t('zoneForm.pendingUpdate') : t('zoneForm.pendingCreate'),
      success: () => {
        invalidateList()
        onSaved()
        return zone ? t('zoneForm.successUpdate') : t('zoneForm.successCreate')
      },
      error: (error: AxiosError<ApiErrorResponse>) =>
        getErrorMessageFromRequest(error, t('zoneForm.error')),
    })
  }

  return {
    form,
    isSubmitting: creating || updating,
    onSubmit: form.handleSubmit(onSubmit),
  }
}
