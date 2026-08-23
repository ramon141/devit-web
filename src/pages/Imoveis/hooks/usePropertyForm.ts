import { useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useQueryClient } from '@tanstack/react-query'
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
import { useToast } from '@/contexts/ToastContext'
import { getErrorMessageFromRequest, type ApiErrorResponse } from '@/utils/getErrorMessageFromRequest'
import { emptyStringsToNull } from '@/utils/emptyStringsToNull'
import { toNumberOrNull } from '@/utils/toNumberOrNull'
import { propertySchema, type PropertyFormValues } from '@/pages/Imoveis/schemas/propertySchema'

const emptyValues: PropertyFormValues = {
  code: '',
  title: '',
  categoryId: '',
  ownerId: '',
  purpose: 'sale',
  status: 'available',
  featured: false,
  active: true,
  publishedOnSite: false,
  salePrice: undefined,
  rentPrice: undefined,
  condoFee: undefined,
  bedrooms: '',
  bathrooms: '',
  parkingSpots: '',
  areaSqm: '',
  description: '',
  country: '',
  street: '',
  number: '',
  complement: '',
  neighborhood: '',
  city: '',
  region: '',
  postalCode: '',
}

type UsePropertyFormProps = {
  property?: PropertyWithRelations | null
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
    active: property.active ?? true,
    publishedOnSite: property.publishedOnSite ?? false,
    salePrice: property.salePrice != null ? String(property.salePrice) : undefined,
    rentPrice: property.rentPrice != null ? String(property.rentPrice) : undefined,
    condoFee: property.condoFee != null ? String(property.condoFee) : undefined,
    bedrooms: property.bedrooms != null ? String(property.bedrooms) : '',
    bathrooms: property.bathrooms != null ? String(property.bathrooms) : '',
    parkingSpots: property.parkingSpots != null ? String(property.parkingSpots) : '',
    areaSqm: property.areaSqm != null ? String(property.areaSqm) : '',
    description: property.description ?? '',
    country: property.address?.country ?? '',
    street: property.address?.street ?? '',
    number: property.address?.number ?? '',
    complement: property.address?.complement ?? '',
    neighborhood: property.address?.neighborhood ?? '',
    city: property.address?.city ?? '',
    region: property.address?.region ?? '',
    postalCode: property.address?.postalCode ?? '',
  }
}

export function usePropertyForm({ property, onSaved }: UsePropertyFormProps) {
  const queryClient = useQueryClient()
  const { toastPromise } = useToast()
  const { mutateAsync: createAddress } = useAddressControllerCreate()
  const { mutateAsync: updateAddress } = useAddressControllerUpdateById()
  const { mutateAsync: createProperty, isPending: creating } = usePropertyControllerCreate()
  const { mutateAsync: updateProperty, isPending: updating } = usePropertyControllerUpdateById()

  const form = useForm<PropertyFormValues>({
    resolver: zodResolver(propertySchema),
    defaultValues: emptyValues,
  })

  useEffect(() => {
    form.reset(property ? propertyToFormValues(property) : emptyValues)
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
      active: values.active,
      publishedOnSite: values.publishedOnSite,
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
    const created = await createProperty({ data: { ...propertyData, addressId: address.id ?? '' } })
    return created.id ?? ''
  }

  function onSubmit(values: PropertyFormValues) {
    toastPromise(saveProperty(values), {
      pending: property ? 'Salvataggio immobile...' : 'Creazione immobile...',
      success: (savedId) => {
        invalidateList()
        onSaved(savedId)
        return property ? 'Immobile aggiornato con successo!' : 'Immobile creato con successo!'
      },
      error: (error: AxiosError<ApiErrorResponse>) =>
        getErrorMessageFromRequest(error, 'Errore durante il salvataggio dell’immobile'),
    })
  }

  return {
    form,
    isSubmitting: creating || updating,
    onSubmit: form.handleSubmit(onSubmit),
  }
}
