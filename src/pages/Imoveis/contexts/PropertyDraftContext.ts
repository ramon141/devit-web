import { createContext, useContext } from 'react'
import type {
  NewPropertyDocumentsItem,
  NewPropertyOwnersItem,
  NewPropertyPhotosItem,
  PropertyNestedAdditionalDetail,
  PropertyNestedCadastralInfo,
  PropertyNestedCommercialDetail,
  PropertyNestedDetail,
  PropertyNestedFee,
  PropertyNestedHeatingDetail,
  PropertyNestedIndustrialArea,
  PropertyNestedIndustrialDetail,
  PropertyNestedLandDetail,
  PropertyNestedLocationDetail,
  PropertyNestedRoom,
} from '@/api/generated/models'

export type PropertyDraftFeature = { category: string; featureKey: string }

// Tudo que as etapas avançadas preenchem antes do imóvel existir; vai junto no
// POST /properties como relações aninhadas
export type PropertyDraft = {
  detail?: PropertyNestedDetail
  additionalDetail?: PropertyNestedAdditionalDetail
  heatingDetail?: PropertyNestedHeatingDetail
  commercialDetail?: PropertyNestedCommercialDetail
  industrialDetail?: PropertyNestedIndustrialDetail
  landDetail?: PropertyNestedLandDetail
  cadastralInfo?: PropertyNestedCadastralInfo
  locationDetail?: PropertyNestedLocationDetail
  fees: PropertyNestedFee[]
  rooms: PropertyNestedRoom[]
  industrialAreas: PropertyNestedIndustrialArea[]
  photos: NewPropertyPhotosItem[]
  documents: NewPropertyDocumentsItem[]
  owners: NewPropertyOwnersItem[]
  features: PropertyDraftFeature[]
}

export const emptyPropertyDraft: PropertyDraft = {
  fees: [],
  rooms: [],
  industrialAreas: [],
  photos: [],
  documents: [],
  owners: [],
  features: [],
}

export type PropertyDraftContextValue = {
  draft: PropertyDraft
  setDraftBlock: <K extends keyof PropertyDraft>(key: K, value: PropertyDraft[K]) => void
  resetDraft: () => void
}

export const PropertyDraftContext = createContext<PropertyDraftContextValue | undefined>(undefined)

export function usePropertyDraft() {
  const context = useContext(PropertyDraftContext)
  if (!context) throw new Error('usePropertyDraft precisa estar dentro de PropertyDraftProvider')

  return context
}
