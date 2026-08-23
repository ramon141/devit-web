import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import type { AxiosError } from 'axios'
import {
  usePropertyAdditionalDetailControllerFind,
  usePropertyAdditionalDetailControllerCreate,
  usePropertyAdditionalDetailControllerUpdateById,
} from '@/api/generated/api'
import { useToast } from '@/contexts/ToastContext'
import { getErrorMessageFromRequest, type ApiErrorResponse } from '@/utils/getErrorMessageFromRequest'
import { emptyStringsToNull } from '@/utils/emptyStringsToNull'
import { toNumberOrNull } from '@/utils/toNumberOrNull'

export type AdditionalFormValues = {
  roomsCount: string
  quality: string
  habitability: string
  windowFrames: string
}

const emptyValues: AdditionalFormValues = { roomsCount: '', quality: '', habitability: '', windowFrames: '' }

export function usePropertyAdditionalForm(propertyId: string) {
  const { toastPromise } = useToast()
  const { data: rows, isLoading } = usePropertyAdditionalDetailControllerFind({
    filter: { where: { propertyId }, limit: 1 },
  })
  const existing = rows?.[0]
  const { mutateAsync: create, isPending: creating } = usePropertyAdditionalDetailControllerCreate()
  const { mutateAsync: update, isPending: updating } = usePropertyAdditionalDetailControllerUpdateById()

  const form = useForm<AdditionalFormValues>({ defaultValues: emptyValues })

  useEffect(() => {
    if (!existing) return
    form.reset({
      roomsCount: existing.roomsCount != null ? String(existing.roomsCount) : '',
      quality: existing.quality ?? '',
      habitability: existing.habitability ?? '',
      windowFrames: existing.windowFrames ?? '',
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [existing])

  function onSubmit(values: AdditionalFormValues) {
    const cleaned = emptyStringsToNull(values)
    const data = { ...cleaned, roomsCount: toNumberOrNull(values.roomsCount), propertyId }

    const promise = existing?.id ? update({ id: existing.id, data }) : create({ data })

    toastPromise(promise, {
      pending: 'Salvataggio caratteristiche...',
      success: 'Caratteristiche aggiornate con successo!',
      error: (error: AxiosError<ApiErrorResponse>) =>
        getErrorMessageFromRequest(error, 'Errore durante il salvataggio delle caratteristiche'),
    })
  }

  return { form, isLoading, isSubmitting: creating || updating, onSubmit: form.handleSubmit(onSubmit) }
}
