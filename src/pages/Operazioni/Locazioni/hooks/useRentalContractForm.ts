import { useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useQueryClient } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import {
  getRentalContractControllerCountQueryKey,
  getRentalContractControllerFindQueryKey,
  useRentalContractControllerCreate,
  useRentalContractControllerUpdateById,
} from '@/api/generated/api'
import type { RentalContractWithRelations } from '@/api/generated/models'
import { useToast } from '@/contexts/ToastContext'
import { getErrorMessageFromRequest, type ApiErrorResponse } from '@/utils/getErrorMessageFromRequest'
import { emptyStringsToNull } from '@/utils/emptyStringsToNull'
import { toNumberOrNull } from '@/utils/toNumberOrNull'
import { toISODateOrNull } from '@/utils/toISODateOrNull'
import {
  rentalContractSchema,
  type RentalContractFormValues,
} from '@/pages/Operazioni/Locazioni/schemas/rentalContractSchema'

const emptyValues: RentalContractFormValues = {
  number: '',
  propertyId: '',
  tenantId: '',
  ownerId: '',
  startDate: '',
  endDate: '',
  dueDay: '',
  rentAmount: '',
  condoFee: '',
  depositAmount: '',
  adjustmentIndex: '',
  situation: 'active',
  noticeDays: '',
  notes: '',
}

function contractToFormValues(contract: RentalContractWithRelations): RentalContractFormValues {
  return {
    number: contract.number,
    propertyId: contract.propertyId,
    tenantId: contract.tenantId,
    ownerId: contract.ownerId,
    startDate: contract.startDate?.slice(0, 10) ?? '',
    endDate: contract.endDate?.slice(0, 10) ?? '',
    dueDay: String(contract.dueDay),
    rentAmount: String(contract.rentAmount),
    condoFee: contract.condoFee != null ? String(contract.condoFee) : '',
    depositAmount: contract.depositAmount != null ? String(contract.depositAmount) : '',
    adjustmentIndex: contract.adjustmentIndex ?? '',
    situation: contract.situation ?? 'active',
    noticeDays: contract.noticeDays != null ? String(contract.noticeDays) : '',
    notes: contract.notes ?? '',
  }
}

type UseRentalContractFormProps = {
  contract?: RentalContractWithRelations | null
  onSaved: () => void
}

export function useRentalContractForm({ contract, onSaved }: UseRentalContractFormProps) {
  const queryClient = useQueryClient()
  const { toastPromise } = useToast()
  const { mutateAsync: create, isPending: creating } = useRentalContractControllerCreate()
  const { mutateAsync: update, isPending: updating } = useRentalContractControllerUpdateById()

  const form = useForm<RentalContractFormValues>({
    resolver: zodResolver(rentalContractSchema),
    defaultValues: emptyValues,
  })

  useEffect(() => {
    form.reset(contract ? contractToFormValues(contract) : emptyValues)
  }, [contract, form])

  function invalidateList() {
    queryClient.invalidateQueries({ queryKey: getRentalContractControllerFindQueryKey() })
    queryClient.invalidateQueries({ queryKey: getRentalContractControllerCountQueryKey() })
  }

  function onSubmit(values: RentalContractFormValues) {
    const cleaned = emptyStringsToNull(values)
    const data = {
      ...cleaned,
      dueDay: toNumberOrNull(values.dueDay) ?? 1,
      rentAmount: toNumberOrNull(values.rentAmount) ?? 0,
      condoFee: toNumberOrNull(values.condoFee),
      depositAmount: toNumberOrNull(values.depositAmount),
      noticeDays: toNumberOrNull(values.noticeDays),
      startDate: toISODateOrNull(values.startDate) ?? undefined,
      endDate: toISODateOrNull(values.endDate),
    }

    const promise = contract?.id ? update({ id: contract.id, data }) : create({ data })

    toastPromise(promise, {
      pending: contract ? 'Salvataggio contratto...' : 'Creazione contratto...',
      success: () => {
        invalidateList()
        onSaved()
        return contract ? 'Contratto aggiornato con successo!' : 'Contratto creato con successo!'
      },
      error: (error: AxiosError<ApiErrorResponse>) =>
        getErrorMessageFromRequest(error, 'Errore durante il salvataggio del contratto'),
    })
  }

  return {
    form,
    isSubmitting: creating || updating,
    onSubmit: form.handleSubmit(onSubmit),
  }
}
