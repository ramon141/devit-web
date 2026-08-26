import { useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import type { AxiosError } from 'axios'
import {
  getPersonControllerFindQueryKey,
  getPersonControllerCountQueryKey,
  useAddressControllerCreate,
  useAddressControllerUpdateById,
  usePersonControllerCreate,
  usePersonControllerUpdateById,
} from '@/api/generated/api'
import type { PersonWithRelations } from '@/api/generated/models'
import { useToast } from '@/contexts/ToastContext'
import { getErrorMessageFromRequest, type ApiErrorResponse } from '@/utils/getErrorMessageFromRequest'
import { emptyStringsToNull } from '@/utils/emptyStringsToNull'
import { createPersonSchema, type PersonFormValues } from '@/pages/Clientes/schemas/personSchema'

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
  active: true,
  country: '',
  street: '',
  number: '',
  complement: '',
  neighborhood: '',
  city: '',
  region: '',
  postalCode: '',
}

type UsePersonFormProps = {
  person?: PersonWithRelations | null
  onSaved: () => void
}

function personToFormValues(person: PersonWithRelations): PersonFormValues {
  return {
    name: person.name,
    role: person.role,
    email: person.email ?? '',
    phone: person.phone ?? '',
    secondaryPhone: person.secondaryPhone ?? '',
    documentType: person.documentType ?? '',
    documentNumber: person.documentNumber ?? '',
    birthDate: person.birthDate ?? '',
    notes: person.notes ?? '',
    active: person.active ?? true,
    country: person.address?.country ?? '',
    street: person.address?.street ?? '',
    number: person.address?.number ?? '',
    complement: person.address?.complement ?? '',
    neighborhood: person.address?.neighborhood ?? '',
    city: person.address?.city ?? '',
    region: person.address?.region ?? '',
    postalCode: person.address?.postalCode ?? '',
  }
}

function hasAddressData(values: PersonFormValues) {
  return Boolean(
    values.country ||
      values.street ||
      values.number ||
      values.complement ||
      values.neighborhood ||
      values.city ||
      values.region ||
      values.postalCode
  )
}

export function usePersonForm({ person, onSaved }: UsePersonFormProps) {
  const { t } = useTranslation('clientes')
  const queryClient = useQueryClient()
  const { toastPromise } = useToast()
  const { mutateAsync: createAddress } = useAddressControllerCreate()
  const { mutateAsync: updateAddress } = useAddressControllerUpdateById()
  const { mutateAsync: create, isPending: creating } = usePersonControllerCreate()
  const { mutateAsync: update, isPending: updating } = usePersonControllerUpdateById()

  const form = useForm<PersonFormValues>({
    resolver: zodResolver(createPersonSchema(t)),
    defaultValues: emptyValues,
  })

  useEffect(() => {
    form.reset(person ? personToFormValues(person) : emptyValues)
  }, [person, form])

  function invalidateList() {
    queryClient.invalidateQueries({ queryKey: getPersonControllerFindQueryKey() })
    queryClient.invalidateQueries({ queryKey: getPersonControllerCountQueryKey() })
  }

  async function resolveAddressId(values: PersonFormValues) {
    if (!hasAddressData(values)) {
      return person?.addressId ?? undefined
    }

    const addressData = {
      country: values.country || undefined,
      street: values.street || undefined,
      number: values.number || undefined,
      complement: values.complement || undefined,
      neighborhood: values.neighborhood || undefined,
      city: values.city as string,
      region: values.region || undefined,
      postalCode: values.postalCode || undefined,
    }

    if (person?.addressId) {
      await updateAddress({ id: person.addressId, data: addressData })
      return person.addressId
    }

    const address = await createAddress({ data: addressData })
    return address.id
  }

  async function savePerson(values: PersonFormValues) {
    const addressId = await resolveAddressId(values)
    const data = emptyStringsToNull({
      name: values.name,
      role: values.role,
      email: values.email,
      phone: values.phone,
      secondaryPhone: values.secondaryPhone,
      documentType: values.documentType,
      documentNumber: values.documentNumber,
      birthDate: values.birthDate,
      notes: values.notes,
      active: values.active,
      addressId,
    })

    return person?.id ? update({ id: person.id, data }) : create({ data })
  }

  function onSubmit(values: PersonFormValues) {
    toastPromise(savePerson(values), {
      pending: person ? t('usePersonForm.pendingUpdate') : t('usePersonForm.pendingCreate'),
      success: () => {
        invalidateList()
        onSaved()
        return person
          ? t('usePersonForm.successUpdate')
          : t('usePersonForm.successCreate')
      },
      error: (error: AxiosError<ApiErrorResponse>) =>
        getErrorMessageFromRequest(error, t('usePersonForm.error')),
    })
  }

  return {
    form,
    isSubmitting: creating || updating,
    onSubmit: form.handleSubmit(onSubmit),
  }
}
