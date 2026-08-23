import { useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useQueryClient } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import {
  getPurchaseProposalControllerCountQueryKey,
  getPurchaseProposalControllerFindQueryKey,
  usePurchaseProposalControllerCreate,
  usePurchaseProposalControllerUpdateById,
} from '@/api/generated/api'
import type { PurchaseProposalWithRelations } from '@/api/generated/models'
import { useToast } from '@/contexts/ToastContext'
import { getErrorMessageFromRequest, type ApiErrorResponse } from '@/utils/getErrorMessageFromRequest'
import { emptyStringsToNull } from '@/utils/emptyStringsToNull'
import { toNumberOrNull } from '@/utils/toNumberOrNull'
import { toISODateOrNull } from '@/utils/toISODateOrNull'
import { proposalSchema, type ProposalFormValues } from '@/pages/Proposte/schemas/proposalSchema'

const emptyValues: ProposalFormValues = {
  number: '',
  propertyId: '',
  buyerId: '',
  proposalAmount: '',
  paymentMethod: 'cash',
  paymentTerms: '',
  status: 'received',
  financed: false,
  proposalDate: '',
  validUntil: '',
  rejectionReason: '',
  notes: '',
}

function proposalToFormValues(proposal: PurchaseProposalWithRelations): ProposalFormValues {
  return {
    number: proposal.number,
    propertyId: proposal.propertyId,
    buyerId: proposal.buyerId,
    proposalAmount: String(proposal.proposalAmount),
    paymentMethod: proposal.paymentMethod,
    paymentTerms: proposal.paymentTerms ?? '',
    status: proposal.status ?? 'received',
    financed: proposal.financed ?? false,
    proposalDate: proposal.proposalDate?.slice(0, 10) ?? '',
    validUntil: proposal.validUntil?.slice(0, 10) ?? '',
    rejectionReason: proposal.rejectionReason ?? '',
    notes: proposal.notes ?? '',
  }
}

type UseProposalFormProps = {
  proposal?: PurchaseProposalWithRelations | null
  onSaved: () => void
}

export function useProposalForm({ proposal, onSaved }: UseProposalFormProps) {
  const queryClient = useQueryClient()
  const { toastPromise } = useToast()
  const { mutateAsync: create, isPending: creating } = usePurchaseProposalControllerCreate()
  const { mutateAsync: update, isPending: updating } = usePurchaseProposalControllerUpdateById()

  const form = useForm<ProposalFormValues>({
    resolver: zodResolver(proposalSchema),
    defaultValues: emptyValues,
  })

  useEffect(() => {
    form.reset(proposal ? proposalToFormValues(proposal) : emptyValues)
  }, [proposal, form])

  function invalidateList() {
    queryClient.invalidateQueries({ queryKey: getPurchaseProposalControllerFindQueryKey() })
    queryClient.invalidateQueries({ queryKey: getPurchaseProposalControllerCountQueryKey() })
  }

  function onSubmit(values: ProposalFormValues) {
    const cleaned = emptyStringsToNull(values)
    const data = {
      ...cleaned,
      proposalAmount: toNumberOrNull(values.proposalAmount) ?? 0,
      proposalDate: toISODateOrNull(values.proposalDate)!,
      validUntil: toISODateOrNull(values.validUntil),
    }

    const promise = proposal?.id
      ? update({ id: proposal.id, data })
      : create({ data })

    toastPromise(promise, {
      pending: proposal ? 'Salvataggio proposta...' : 'Creazione proposta...',
      success: () => {
        invalidateList()
        onSaved()
        return proposal ? 'Proposta aggiornata con successo!' : 'Proposta creata con successo!'
      },
      error: (error: AxiosError<ApiErrorResponse>) =>
        getErrorMessageFromRequest(error, 'Errore durante il salvataggio della proposta'),
    })
  }

  return {
    form,
    isSubmitting: creating || updating,
    onSubmit: form.handleSubmit(onSubmit),
  }
}
