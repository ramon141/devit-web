import { useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useQueryClient } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import {
  getBranchControllerCountQueryKey,
  getBranchControllerFindQueryKey,
  useBranchControllerCreate,
  useBranchControllerUpdateById,
} from '@/api/generated/api'
import type { Branch } from '@/api/generated/models'
import { useToast } from '@/contexts/ToastContext'
import { getErrorMessageFromRequest, type ApiErrorResponse } from '@/utils/getErrorMessageFromRequest'
import { branchSchema, type BranchFormValues } from '@/pages/Amministrazione/Filiali/schemas/branchSchema'

const emptyValues: BranchFormValues = { name: '', active: true }

type UseBranchFormProps = {
  branch?: Branch | null
  onSaved: () => void
}

export function useBranchForm({ branch, onSaved }: UseBranchFormProps) {
  const queryClient = useQueryClient()
  const { toastPromise } = useToast()
  const { mutateAsync: create, isPending: creating } = useBranchControllerCreate()
  const { mutateAsync: update, isPending: updating } = useBranchControllerUpdateById()

  const form = useForm<BranchFormValues>({
    resolver: zodResolver(branchSchema),
    defaultValues: emptyValues,
  })

  useEffect(() => {
    form.reset(branch ? { name: branch.name, active: branch.active ?? true } : emptyValues)
  }, [branch, form])

  function invalidateList() {
    queryClient.invalidateQueries({ queryKey: getBranchControllerFindQueryKey() })
    queryClient.invalidateQueries({ queryKey: getBranchControllerCountQueryKey() })
  }

  function onSubmit(values: BranchFormValues) {
    const promise = branch?.id
      ? update({ id: branch.id, data: values })
      : create({ data: values })

    toastPromise(promise, {
      pending: branch ? 'Salvataggio filiale...' : 'Creazione filiale...',
      success: () => {
        invalidateList()
        onSaved()
        return branch ? 'Filiale aggiornata con successo!' : 'Filiale creata con successo!'
      },
      error: (error: AxiosError<ApiErrorResponse>) =>
        getErrorMessageFromRequest(error, 'Errore durante il salvataggio della filiale'),
    })
  }

  return {
    form,
    isSubmitting: creating || updating,
    onSubmit: form.handleSubmit(onSubmit),
  }
}
