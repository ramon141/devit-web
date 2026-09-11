import { useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { DEFAULT_COUNTRY } from '@/constants/cities'
import type { AxiosError } from 'axios'
import {
  getPropertyControllerCountQueryKey,
  getPropertyControllerFindQueryKey,
  useAddressControllerCreate,
  useAddressControllerUpdateById,
  usePropertyControllerCreate,
  usePropertyControllerUpdateById,
} from '@/api/generated/api'
import type { PropertyWithRelations } from '@/api/generated/models'
import { usePromisePopup } from '@/contexts/PromisePopupContext'
import { usePropertyDraft } from '@/pages/Imoveis/contexts/PropertyDraftContext'
import { usePropertyFeatureControllerCreate } from '@/api/generated/api'
import type { PropertyFeatureCategory } from '@/api/generated/models'
import { getErrorMessageFromRequest, type ApiErrorResponse } from '@/utils/getErrorMessageFromRequest'
import { emptyStringsToNull } from '@/utils/emptyStringsToNull'
import { toNumberOrNull } from '@/utils/toNumberOrNull'
import { createPropertySchema, type PropertyFormValues } from '@/pages/Imoveis/schemas/propertySchema'

const emptyValues: PropertyFormValues = {
  code: '',
  title: '',
  categoryId: '',
  ownerId: '',
  purpose: 'sale',
  status: 'available',
  featured: false,
  featuredOrder: '',
  active: true,
  publishedOnSite: false,
  useInChatbot: false,
  salePrice: undefined,
  rentPrice: undefined,
  condoFee: undefined,
  bedrooms: '',
  bathrooms: '',
  parkingSpots: '',
  areaSqm: '',
  description: '',
  country: DEFAULT_COUNTRY,
  street: '',
  number: '',
  complement: '',
  neighborhood: '',
  neighborhoodId: '',
  city: '',
  region: '',
  postalCode: '',
}

type UsePropertyFormProps = {
  property?: PropertyWithRelations | null
  initialCategoryId?: string
  onSaved: (id: string) => void
}

function propertyToFormValues(property: PropertyWithRelations): PropertyFormValues {
  return {
    code: property.code,
    title: property.title,
    categoryId: property.categoryId,
    ownerId: property.ownerId,
    purpose: property.purpose,
    status: property.status ?? 'available',
    featured: property.featured ?? false,
    featuredOrder: property.featuredOrder != null ? String(property.featuredOrder) : '',
    active: property.active ?? true,
    publishedOnSite: property.publishedOnSite ?? false,
    useInChatbot: property.useInChatbot ?? false,
    salePrice: property.salePrice != null ? String(property.salePrice) : undefined,
    rentPrice: property.rentPrice != null ? String(property.rentPrice) : undefined,
    condoFee: property.condoFee != null ? String(property.condoFee) : undefined,
    bedrooms: property.bedrooms != null ? String(property.bedrooms) : '',
    bathrooms: property.bathrooms != null ? String(property.bathrooms) : '',
    parkingSpots: property.parkingSpots != null ? String(property.parkingSpots) : '',
    areaSqm: property.areaSqm != null ? String(property.areaSqm) : '',
    description: property.description ?? '',
    country: property.address?.country ?? DEFAULT_COUNTRY,
    street: property.address?.street ?? '',
    number: property.address?.number ?? '',
    complement: property.address?.complement ?? '',
    neighborhood: property.address?.neighborhood ?? '',
    neighborhoodId: property.address?.neighborhoodId ?? '',
    city: property.address?.city ?? '',
    region: property.address?.region ?? '',
    postalCode: property.address?.postalCode ?? '',
  }
}

export function usePropertyForm({ property, initialCategoryId, onSaved }: UsePropertyFormProps) {
  const { t } = useTranslation('imoveis')
  const queryClient = useQueryClient()
  const { promisePopup } = usePromisePopup()
  const { draft, resetDraft } = usePropertyDraft()
  const { mutateAsync: createFeature } = usePropertyFeatureControllerCreate()
  const { mutateAsync: createAddress } = useAddressControllerCreate()
  const { mutateAsync: updateAddress } = useAddressControllerUpdateById()
  const { mutateAsync: createProperty, isPending: creating } = usePropertyControllerCreate()
  const { mutateAsync: updateProperty, isPending: updating } = usePropertyControllerUpdateById()

  const form = useForm<PropertyFormValues>({
    resolver: zodResolver(createPropertySchema(t)),
    defaultValues: { ...emptyValues, categoryId: initialCategoryId ?? emptyValues.categoryId },
  })

  useEffect(() => {
    if (property) form.reset(propertyToFormValues(property))
  }, [property, form])

  function invalidateList() {
    queryClient.invalidateQueries({ queryKey: getPropertyControllerFindQueryKey() })
    queryClient.invalidateQueries({ queryKey: getPropertyControllerCountQueryKey() })
  }

  async function saveProperty(values: PropertyFormValues) {
    const cleaned = emptyStringsToNull(values)
    const addressData = {
      country: cleaned.country,
      street: cleaned.street,
      number: cleaned.number,
      complement: cleaned.complement,
      neighborhood: cleaned.neighborhood,
      neighborhoodId: cleaned.neighborhoodId,
      city: values.city,
      region: cleaned.region,
      postalCode: cleaned.postalCode,
    }

    const propertyData = {
      code: values.code,
      title: values.title,
      categoryId: values.categoryId,
      ownerId: values.ownerId,
      purpose: values.purpose,
      status: values.status,
      featured: values.featured,
      featuredOrder: toNumberOrNull(values.featuredOrder),
      active: values.active,
      publishedOnSite: values.publishedOnSite,
      useInChatbot: values.useInChatbot,
      salePrice: toNumberOrNull(values.salePrice),
      rentPrice: toNumberOrNull(values.rentPrice),
      condoFee: toNumberOrNull(values.condoFee),
      bedrooms: toNumberOrNull(values.bedrooms),
      bathrooms: toNumberOrNull(values.bathrooms),
      parkingSpots: toNumberOrNull(values.parkingSpots),
      areaSqm: toNumberOrNull(values.areaSqm),
      description: cleaned.description,
    }

    if (property?.id) {
      await updateAddress({ id: property.addressId, data: addressData })
      await updateProperty({ id: property.id, data: propertyData })
      return property.id
    }

    const address = await createAddress({ data: addressData })
    const created = await createProperty({
      data: {
        ...propertyData,
        addressId: address.id ?? '',
        detail: draft.detail,
        additionalDetail: draft.additionalDetail,
        heatingDetail: draft.heatingDetail,
        commercialDetail: draft.commercialDetail,
        industrialDetail: draft.industrialDetail,
        landDetail: draft.landDetail,
        cadastralInfo: draft.cadastralInfo,
        locationDetail: draft.locationDetail,
        fees: draft.fees,
        rooms: draft.rooms,
        industrialAreas: draft.industrialAreas,
        photos: draft.photos,
        documents: draft.documents,
        owners: draft.owners,
      },
    })

    const createdId = created.id ?? ''

    // Características não entram no POST aninhado; vão logo depois, com o id em mãos
    await Promise.all(
      draft.features.map((feature) =>
        createFeature({
          data: {
            propertyId: createdId,
            category: feature.category as PropertyFeatureCategory,
            featureKey: feature.featureKey,
          },
        })
      )
    )

    resetDraft()
    return createdId
  }

  function onSubmit(values: PropertyFormValues) {
    promisePopup(saveProperty(values), {
      pending: property ? t('toasts.saveProperty.pendingUpdate') : t('toasts.saveProperty.pendingCreate'),
      success: (savedId) => {
        invalidateList()
        onSaved(savedId)
        return property ? t('toasts.saveProperty.successUpdate') : t('toasts.saveProperty.successCreate')
      },
      error: (error: AxiosError<ApiErrorResponse>) =>
        getErrorMessageFromRequest(error, t('toasts.saveProperty.error')),
    })
  }

  return {
    form,
    isSubmitting: creating || updating,
    onSubmit: form.handleSubmit(onSubmit),
  }
}
