import { useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useQueryClient } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import {
  getPersonControllerFindQueryKey,
  getPersonControllerCountQueryKey,
  usePersonControllerCreate,
  usePersonControllerUpdateById,
} from '@/api/generated/api'
import type { Person } from '@/api/generated/models'
import { useToast } from '@/contexts/ToastContext'
import { getErrorMessageFromRequest, type ApiErrorResponse } from '@/utils/getErrorMessageFromRequest'
import { emptyStringsToNull } from '@/utils/emptyStringsToNull'
import { personSchema, type PersonFormValues } from '@/pages/Clientes/schemas/personSchema'

const emptyValues: PersonFormValues = {
  name: '',
  role: 'contact',
  email: '',
  phone: '',
  secondaryPhone: '',
  documentType: '',
  documentNumber: '',
  birthDate: '',
  notes: '',
}

type UsePersonFormProps = {
  person?: Person | null
  onSaved: () => void
}

export function usePersonForm({ person, onSaved }: UsePersonFormProps) {
  const queryClient = useQueryClient()
  const { toastPromise } = useToast()
  const { mutateAsync: create, isPending: creating } = usePersonControllerCreate()
  const { mutateAsync: update, isPending: updating } = usePersonControllerUpdateById()

  const form = useForm<PersonFormValues>({
    resolver: zodResolver(personSchema),
    defaultValues: emptyValues,
  })

  useEffect(() => {
    form.reset(person ? { ...emptyValues, ...person } : emptyValues)
  }, [person, form])

  function invalidateList() {
    queryClient.invalidateQueries({ queryKey: getPersonControllerFindQueryKey() })
    queryClient.invalidateQueries({ queryKey: getPersonControllerCountQueryKey() })
  }

  function onSubmit(values: PersonFormValues) {
    const data = emptyStringsToNull(values)
    const promise = person?.id
      ? update({ id: person.id, data })
      : create({ data })

    toastPromise(promise, {
      pending: person ? 'Salvataggio cliente...' : 'Creazione cliente...',
      success: () => {
        invalidateList()
        onSaved()
        return person ? 'Cliente aggiornato con successo!' : 'Cliente creato con successo!'
      },
      error: (error: AxiosError<ApiErrorResponse>) =>
        getErrorMessageFromRequest(error, 'Errore durante il salvataggio del cliente'),
    })
  }

  return {
    form,
    isSubmitting: creating || updating,
    onSubmit: form.handleSubmit(onSubmit),
  }
}
