import type { AxiosError } from 'axios'
import { useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import {
  getPropertyFeatureControllerFindQueryKey,
  usePropertyFeatureControllerCreate,
  usePropertyFeatureControllerDeleteById,
  usePropertyFeatureControllerFind,
} from '@/api/generated/api'
import type { PropertyFeatureCategory } from '@/api/generated/models'
import { usePromisePopup } from '@/contexts/PromisePopupContext'
import { usePropertyDraft, type PropertyDraftFeature } from '@/pages/Imoveis/contexts/PropertyDraftContext'
import { getErrorMessageFromRequest, type ApiErrorResponse } from '@/utils/getErrorMessageFromRequest'

// Liga/desliga a característica na lista do rascunho
function toggleDraftFeature(
  features: PropertyDraftFeature[],
  category: PropertyFeatureCategory,
  featureKey: string
) {
  const isActive = features.some(
    (feature) => feature.category === category && feature.featureKey === featureKey
  )

  if (isActive) {
    return features.filter(
      (feature) => !(feature.category === category && feature.featureKey === featureKey)
    )
  }

  return [...features, { category, featureKey }]
}

export function usePropertyFeatures(propertyId: string, category: PropertyFeatureCategory) {
  const { t } = useTranslation('imoveis')
  const queryClient = useQueryClient()
  const { promisePopup } = usePromisePopup()
  const { draft, setDraftBlock } = usePropertyDraft()

  const { data: features } = usePropertyFeatureControllerFind(
    { filter: { where: { propertyId, category } } },
    { query: { enabled: !!propertyId } }
  )

  const draftFeatures = draft.features.filter((feature) => feature.category === category)
  const { mutateAsync: create } = usePropertyFeatureControllerCreate()
  const { mutateAsync: remove } = usePropertyFeatureControllerDeleteById()

  const activeKeys = new Set(
    propertyId
      ? (features ?? []).map((feature) => feature.featureKey)
      : draftFeatures.map((feature) => feature.featureKey)
  )

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: getPropertyFeatureControllerFindQueryKey() })
  }

  function toggle(featureKey: string) {
    const existing = (features ?? []).find((feature) => feature.featureKey === featureKey)

    const promise = !propertyId
      ? Promise.resolve(setDraftBlock('features', toggleDraftFeature(draft.features, category, featureKey)))
      : existing?.id
        ? remove({ id: existing.id })
        : create({ data: { propertyId, category, featureKey } })

    promisePopup(promise, {
      pending: t('toasts.features.pending'),
      success: () => {
        invalidate()
        return undefined
      },
      error: (error: AxiosError<ApiErrorResponse>) =>
        getErrorMessageFromRequest(error, t('toasts.features.error')),
    })
  }

  return { activeKeys, toggle }
}
