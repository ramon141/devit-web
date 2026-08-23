import { useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useQueryClient } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import {
  getSaleControllerCountQueryKey,
  getSaleControllerFindQueryKey,
  useSaleControllerCreate,
  useSaleControllerUpdateById,
} from '@/api/generated/api'
import type { SaleWithRelations } from '@/api/generated/models'
import { useToast } from '@/contexts/ToastContext'
import { getErrorMessageFromRequest, type ApiErrorResponse } from '@/utils/getErrorMessageFromRequest'
import { emptyStringsToNull } from '@/utils/emptyStringsToNull'
import { toNumberOrNull } from '@/utils/toNumberOrNull'
import { toISODateOrNull } from '@/utils/toISODateOrNull'
import { saleSchema, type SaleFormValues } from '@/pages/Operazioni/Vendite/schemas/saleSchema'

const emptyValues: SaleFormValues = {
  number: '',
  propertyId: '',
  buyerId: '',
  sellerId: '',
  finalAmount: '',
  saleDate: '',
  deedDate: '',
  paymentMethod: 'cash',
  financialInstitution: '',
  downPayment: '',
  installmentsCount: '',
  commissionAmount: '',
  status: 'negotiating',
  cancellationReason: '',
  notes: '',
}

function saleToFormValues(sale: SaleWithRelations): SaleFormValues {
  return {
    number: sale.number,
    propertyId: sale.propertyId,
    buyerId: sale.buyerId,
    sellerId: sale.sellerId,
    finalAmount: String(sale.finalAmount),
    saleDate: sale.saleDate?.slice(0, 10) ?? '',
    deedDate: sale.deedDate?.slice(0, 10) ?? '',
    paymentMethod: sale.paymentMethod,
    financialInstitution: sale.financialInstitution ?? '',
    downPayment: sale.downPayment != null ? String(sale.downPayment) : '',
    installmentsCount: sale.installmentsCount != null ? String(sale.installmentsCount) : '',
    commissionAmount: sale.commissionAmount != null ? String(sale.commissionAmount) : '',
    status: sale.status ?? 'negotiating',
    cancellationReason: sale.cancellationReason ?? '',
    notes: sale.notes ?? '',
  }
}

type UseSaleFormProps = {
  sale?: SaleWithRelations | null
  onSaved: () => void
}

export function useSaleForm({ sale, onSaved }: UseSaleFormProps) {
  const queryClient = useQueryClient()
  const { toastPromise } = useToast()
  const { mutateAsync: create, isPending: creating } = useSaleControllerCreate()
  const { mutateAsync: update, isPending: updating } = useSaleControllerUpdateById()

  const form = useForm<SaleFormValues>({
    resolver: zodResolver(saleSchema),
    defaultValues: emptyValues,
  })

  useEffect(() => {
    form.reset(sale ? saleToFormValues(sale) : emptyValues)
  }, [sale, form])

  function invalidateList() {
    queryClient.invalidateQueries({ queryKey: getSaleControllerFindQueryKey() })
    queryClient.invalidateQueries({ queryKey: getSaleControllerCountQueryKey() })
  }

  function onSubmit(values: SaleFormValues) {
    const cleaned = emptyStringsToNull(values)
    const data = {
      ...cleaned,
      finalAmount: toNumberOrNull(values.finalAmount) ?? 0,
      downPayment: toNumberOrNull(values.downPayment),
      installmentsCount: toNumberOrNull(values.installmentsCount),
      commissionAmount: toNumberOrNull(values.commissionAmount),
      saleDate: toISODateOrNull(values.saleDate)!,
      deedDate: toISODateOrNull(values.deedDate),
    }

    const promise = sale?.id ? update({ id: sale.id, data }) : create({ data })

    toastPromise(promise, {
      pending: sale ? 'Salvataggio vendita...' : 'Creazione vendita...',
      success: () => {
        invalidateList()
        onSaved()
        return sale ? 'Vendita aggiornata con successo!' : 'Vendita creata con successo!'
      },
      error: (error: AxiosError<ApiErrorResponse>) =>
        getErrorMessageFromRequest(error, 'Errore durante il salvataggio della vendita'),
    })
  }

  return {
    form,
    isSubmitting: creating || updating,
    onSubmit: form.handleSubmit(onSubmit),
  }
}
