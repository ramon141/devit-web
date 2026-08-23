import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import {
  getPropertyIndustrialAreaControllerFindQueryKey,
  usePropertyIndustrialAreaControllerCreate,
  usePropertyIndustrialAreaControllerDeleteById,
  usePropertyIndustrialAreaControllerFind,
} from '@/api/generated/api'
import type { PropertyIndustrialAreaAreaType } from '@/api/generated/models'
import { useToast } from '@/contexts/ToastContext'
import { getErrorMessageFromRequest, type ApiErrorResponse } from '@/utils/getErrorMessageFromRequest'
import { toNumberOrNull } from '@/utils/toNumberOrNull'

export function usePropertyIndustrialAreas(propertyId: string) {
  const queryClient = useQueryClient()
  const { toastPromise } = useToast()
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

    toastPromise(promise, {
      pending: 'Aggiunta area...',
      success: () => {
        invalidate()
        setAreaType('')
        setAreaSqm('')
        setHeightM('')
        return 'Area aggiunta con successo!'
      },
      error: (error: AxiosError<ApiErrorResponse>) =>
        getErrorMessageFromRequest(error, 'Errore durante l’aggiunta dell’area'),
    })
  }

  function removeArea(id: string) {
    toastPromise(remove({ id }), {
      pending: 'Rimozione area...',
      success: () => {
        invalidate()
        return 'Area rimossa con successo!'
      },
      error: (error: AxiosError<ApiErrorResponse>) =>
        getErrorMessageFromRequest(error, 'Errore durante la rimozione dell’area'),
    })
  }

  return { areas: areas ?? [], areaType, setAreaType, areaSqm, setAreaSqm, heightM, setHeightM, addArea, removeArea }
}
