import { useNavigate } from 'react-router'
import { useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import type { AxiosError } from 'axios'
import {
  getPropertyControllerFindQueryKey,
  getPropertyControllerCountQueryKey,
  usePropertyControllerCreate,
} from '@/api/generated/api'
import type { PropertyWithRelations } from '@/api/generated/models'
import { usePromisePopup } from '@/contexts/PromisePopupContext'
import { CRM_BASE_PATH } from '@/lib/crmBasePath'
import { getErrorMessageFromRequest, type ApiErrorResponse } from '@/utils/getErrorMessageFromRequest'

// ponytail: duplica reaproveitando o mesmo addressId (não clona o endereço)
export function useDuplicateProperty() {
  const { t } = useTranslation('imoveis')
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { promisePopup } = usePromisePopup()
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

    promisePopup(promise, {
      pending: t('toasts.duplicateProperty.pending'),
      success: (created) => {
        queryClient.invalidateQueries({ queryKey: getPropertyControllerFindQueryKey() })
        queryClient.invalidateQueries({ queryKey: getPropertyControllerCountQueryKey() })
        if (created.id) navigate(`${CRM_BASE_PATH}/proprieta/${created.id}`)
        return t('toasts.duplicateProperty.success')
      },
      error: (error: AxiosError<ApiErrorResponse>) =>
        getErrorMessageFromRequest(error, t('toasts.duplicateProperty.error')),
    })
  }

  return { handleDuplicate }
}
