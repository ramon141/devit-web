import { useNavigate } from 'react-router'
import { useQueryClient } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import {
  getPropertyControllerFindQueryKey,
  getPropertyControllerCountQueryKey,
  usePropertyControllerCreate,
} from '@/api/generated/api'
import type { PropertyWithRelations } from '@/api/generated/models'
import { useToast } from '@/contexts/ToastContext'
import { getErrorMessageFromRequest, type ApiErrorResponse } from '@/utils/getErrorMessageFromRequest'

// ponytail: duplica reaproveitando o mesmo addressId (não clona o endereço)
export function useDuplicateProperty() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { toastPromise } = useToast()
  const { mutateAsync: create } = usePropertyControllerCreate()

  function handleDuplicate(property: PropertyWithRelations) {
    const promise = create({
      data: {
        code: `${property.code}-COPIA`,
        title: `${property.title} (copia)`,
        purpose: property.purpose,
        status: property.status,
        categoryId: property.categoryId,
        addressId: property.addressId,
        ownerId: property.ownerId,
        rentPrice: property.rentPrice,
        salePrice: property.salePrice,
        condoFee: property.condoFee,
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        parkingSpots: property.parkingSpots,
        areaSqm: property.areaSqm,
        description: property.description,
      },
    })

    toastPromise(promise, {
      pending: 'Duplicazione immobile...',
      success: (created) => {
        queryClient.invalidateQueries({ queryKey: getPropertyControllerFindQueryKey() })
        queryClient.invalidateQueries({ queryKey: getPropertyControllerCountQueryKey() })
        if (created.id) navigate(`/proprieta/${created.id}`)
        return 'Immobile duplicato con successo!'
      },
      error: (error: AxiosError<ApiErrorResponse>) =>
        getErrorMessageFromRequest(error, 'Errore durante la duplicazione dell’immobile'),
    })
  }

  return { handleDuplicate }
}
