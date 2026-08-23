import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import {
  getPropertyRoomControllerFindQueryKey,
  usePropertyRoomControllerCreate,
  usePropertyRoomControllerDeleteById,
  usePropertyRoomControllerFind,
} from '@/api/generated/api'
import type { PropertyRoomRoomType } from '@/api/generated/models'
import { useToast } from '@/contexts/ToastContext'
import { getErrorMessageFromRequest, type ApiErrorResponse } from '@/utils/getErrorMessageFromRequest'
import { toNumberOrNull } from '@/utils/toNumberOrNull'

export function usePropertyRooms(propertyId: string) {
  const queryClient = useQueryClient()
  const { toastPromise } = useToast()
  const [roomType, setRoomType] = useState<PropertyRoomRoomType | ''>('')
  const [widthM, setWidthM] = useState('')
  const [lengthM, setLengthM] = useState('')

  const { data: rooms } = usePropertyRoomControllerFind({ filter: { where: { propertyId } } })
  const { mutateAsync: create } = usePropertyRoomControllerCreate()
  const { mutateAsync: remove } = usePropertyRoomControllerDeleteById()

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: getPropertyRoomControllerFindQueryKey() })
  }

  function addRoom() {
    if (!roomType) return

    const width = toNumberOrNull(widthM)
    const length = toNumberOrNull(lengthM)
    const areaSqm = width && length ? width * length : null

    const promise = create({ data: { propertyId, roomType, widthM: width, lengthM: length, areaSqm } })

    toastPromise(promise, {
      pending: 'Aggiunta ambiente...',
      success: () => {
        invalidate()
        setRoomType('')
        setWidthM('')
        setLengthM('')
        return 'Ambiente aggiunto con successo!'
      },
      error: (error: AxiosError<ApiErrorResponse>) =>
        getErrorMessageFromRequest(error, 'Errore durante l’aggiunta dell’ambiente'),
    })
  }

  function removeRoom(id: string) {
    toastPromise(remove({ id }), {
      pending: 'Rimozione ambiente...',
      success: () => {
        invalidate()
        return 'Ambiente rimosso con successo!'
      },
      error: (error: AxiosError<ApiErrorResponse>) =>
        getErrorMessageFromRequest(error, 'Errore durante la rimozione dell’ambiente'),
    })
  }

  return { rooms: rooms ?? [], roomType, setRoomType, widthM, setWidthM, lengthM, setLengthM, addRoom, removeRoom }
}
