import { useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useQueryClient } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import {
  getNeighborhoodControllerCountQueryKey,
  getNeighborhoodControllerFindQueryKey,
  useNeighborhoodControllerCreate,
  useNeighborhoodControllerUpdateById,
} from '@/api/generated/api'
import type { Neighborhood } from '@/api/generated/models'
import { usePromisePopup } from '@/contexts/PromisePopupContext'
import { getErrorMessageFromRequest, type ApiErrorResponse } from '@/utils/getErrorMessageFromRequest'
import {
  neighborhoodSchema,
  type NeighborhoodFormValues,
} from '@/pages/Amministrazione/Zone/schemas/zoneSchema'

type UseNeighborhoodFormProps = {
  neighborhood?: Neighborhood | null
  zoneId: string
  onSaved: () => void
}

export function useNeighborhoodForm({ neighborhood, zoneId, onSaved }: UseNeighborhoodFormProps) {
  const { t } = useTranslation('amministrazione')
  const queryClient = useQueryClient()
  const { promisePopup } = usePromisePopup()
  const { mutateAsync: create, isPending: creating } = useNeighborhoodControllerCreate()
  const { mutateAsync: update, isPending: updating } = useNeighborhoodControllerUpdateById()

  const form = useForm<NeighborhoodFormValues>({
    resolver: zodResolver(neighborhoodSchema),
    defaultValues: { name: '', zoneId, active: true },
  })

  useEffect(() => {
    form.reset({
      name: neighborhood?.name ?? '',
      zoneId: neighborhood?.zoneId ?? zoneId,
      active: neighborhood?.active ?? true,
    })
  }, [neighborhood, zoneId, form])

  function onSubmit(values: NeighborhoodFormValues) {
    const promise = neighborhood?.id
      ? update({ id: neighborhood.id, data: values })
      : create({ data: values })

    promisePopup(promise, {
      pending: neighborhood ? t('neighborhoodForm.pendingUpdate') : t('neighborhoodForm.pendingCreate'),
      success: () => {
        queryClient.invalidateQueries({ queryKey: getNeighborhoodControllerFindQueryKey() })
        queryClient.invalidateQueries({ queryKey: getNeighborhoodControllerCountQueryKey() })
        onSaved()
        return neighborhood ? t('neighborhoodForm.successUpdate') : t('neighborhoodForm.successCreate')
      },
      error: (error: AxiosError<ApiErrorResponse>) =>
        getErrorMessageFromRequest(error, t('neighborhoodForm.error')),
    })
  }

  return {
    form,
    isSubmitting: creating || updating,
    onSubmit: form.handleSubmit(onSubmit),
  }
}
