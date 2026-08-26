import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
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
  const { t } = useTranslation('imoveis')
  const queryClient = useQueryClient()
  const { toastPromise } = useToast()
  const [roomType, setRoomType] = useState<PropertyRoomRoomType | ''>('')
  const [quantity, setQuantity] = useState('')
  const [widthM, setWidthM] = useState('')
  const [lengthM, setLengthM] = useState('')
  const [equipment, setEquipment] = useState('')

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
    const quantityValue = toNumberOrNull(quantity)

    const promise = create({
      data: {
        propertyId,
        roomType,
        quantity: quantityValue ?? undefined,
        widthM: width,
        lengthM: length,
        areaSqm,
        equipment: equipment || null,
      },
    })

    toastPromise(promise, {
      pending: t('toasts.rooms.addPending'),
      success: () => {
        invalidate()
        setRoomType('')
        setQuantity('')
        setWidthM('')
        setLengthM('')
        setEquipment('')
        return t('toasts.rooms.addSuccess')
      },
      error: (error: AxiosError<ApiErrorResponse>) =>
        getErrorMessageFromRequest(error, t('toasts.rooms.addError')),
    })
  }

  function removeRoom(id: string) {
    toastPromise(remove({ id }), {
      pending: t('toasts.rooms.removePending'),
      success: () => {
        invalidate()
        return t('toasts.rooms.removeSuccess')
      },
      error: (error: AxiosError<ApiErrorResponse>) =>
        getErrorMessageFromRequest(error, t('toasts.rooms.removeError')),
    })
  }

  return {
    rooms: rooms ?? [],
    roomType,
    setRoomType,
    quantity,
    setQuantity,
    widthM,
    setWidthM,
    lengthM,
    setLengthM,
    equipment,
    setEquipment,
    addRoom,
    removeRoom,
  }
}
