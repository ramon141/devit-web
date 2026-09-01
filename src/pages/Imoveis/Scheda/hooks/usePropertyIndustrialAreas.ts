import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import type { AxiosError } from 'axios'
import {
  getPropertyIndustrialAreaControllerFindQueryKey,
  usePropertyIndustrialAreaControllerCreate,
  usePropertyIndustrialAreaControllerDeleteById,
  usePropertyIndustrialAreaControllerFind,
} from '@/api/generated/api'
import type { PropertyIndustrialAreaAreaType } from '@/api/generated/models'
import { usePromisePopup } from '@/contexts/PromisePopupContext'
import { getErrorMessageFromRequest, type ApiErrorResponse } from '@/utils/getErrorMessageFromRequest'
import { toNumberOrNull } from '@/utils/toNumberOrNull'

export function usePropertyIndustrialAreas(propertyId: string) {
  const { t } = useTranslation('imoveis')
  const queryClient = useQueryClient()
  const { promisePopup } = usePromisePopup()
  const [areaType, setAreaType] = useState<PropertyIndustrialAreaAreaType | ''>('')
  const [areaSqm, setAreaSqm] = useState('')
  const [heightM, setHeightM] = useState('')

  const { data: areas } = usePropertyIndustrialAreaControllerFind({ filter: { where: { propertyId } } })
  const { mutateAsync: create } = usePropertyIndustrialAreaControllerCreate()
  const { mutateAsync: remove } = usePropertyIndustrialAreaControllerDeleteById()

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: getPropertyIndustrialAreaControllerFindQueryKey() })
  }

  function addArea() {
    if (!areaType) return

    const promise = create({
      data: { propertyId, areaType, areaSqm: toNumberOrNull(areaSqm), heightM: toNumberOrNull(heightM) },
    })

    promisePopup(promise, {
      pending: t('toasts.industrialAreas.addPending'),
      success: () => {
        invalidate()
        setAreaType('')
        setAreaSqm('')
        setHeightM('')
        return t('toasts.industrialAreas.addSuccess')
      },
      error: (error: AxiosError<ApiErrorResponse>) =>
        getErrorMessageFromRequest(error, t('toasts.industrialAreas.addError')),
    })
  }

  function removeArea(id: string) {
    promisePopup(remove({ id }), {
      pending: t('toasts.industrialAreas.removePending'),
      success: () => {
        invalidate()
        return t('toasts.industrialAreas.removeSuccess')
      },
      error: (error: AxiosError<ApiErrorResponse>) =>
        getErrorMessageFromRequest(error, t('toasts.industrialAreas.removeError')),
    })
  }

  return { areas: areas ?? [], areaType, setAreaType, areaSqm, setAreaSqm, heightM, setHeightM, addArea, removeArea }
}
