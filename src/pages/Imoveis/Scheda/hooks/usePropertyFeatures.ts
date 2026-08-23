import type { AxiosError } from 'axios'
import { useQueryClient } from '@tanstack/react-query'
import {
  getPropertyFeatureControllerFindQueryKey,
  usePropertyFeatureControllerCreate,
  usePropertyFeatureControllerDeleteById,
  usePropertyFeatureControllerFind,
} from '@/api/generated/api'
import type { PropertyFeatureCategory } from '@/api/generated/models'
import { useToast } from '@/contexts/ToastContext'
import { getErrorMessageFromRequest, type ApiErrorResponse } from '@/utils/getErrorMessageFromRequest'

export function usePropertyFeatures(propertyId: string, category: PropertyFeatureCategory) {
  const queryClient = useQueryClient()
  const { toastPromise } = useToast()

  const { data: features } = usePropertyFeatureControllerFind({
    filter: { where: { propertyId, category } },
  })
  const { mutateAsync: create } = usePropertyFeatureControllerCreate()
  const { mutateAsync: remove } = usePropertyFeatureControllerDeleteById()

  const activeKeys = new Set((features ?? []).map((feature) => feature.featureKey))

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: getPropertyFeatureControllerFindQueryKey() })
  }

  function toggle(featureKey: string) {
    const existing = (features ?? []).find((feature) => feature.featureKey === featureKey)
    const promise = existing?.id
      ? remove({ id: existing.id })
      : create({ data: { propertyId, category, featureKey } })

    toastPromise(promise, {
      pending: 'Aggiornamento caratteristiche...',
      success: () => {
        invalidate()
        return undefined
      },
      error: (error: AxiosError<ApiErrorResponse>) =>
        getErrorMessageFromRequest(error, 'Errore durante l’aggiornamento delle caratteristiche'),
    })
  }

  return { activeKeys, toggle }
}
