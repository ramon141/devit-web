import { useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useQueryClient } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import {
  getPropertyCategoryControllerCountQueryKey,
  getPropertyCategoryControllerFindQueryKey,
  usePropertyCategoryControllerCreate,
  usePropertyCategoryControllerUpdateById,
} from '@/api/generated/api'
import type { PropertyCategory } from '@/api/generated/models'
import { useToast } from '@/contexts/ToastContext'
import { getErrorMessageFromRequest, type ApiErrorResponse } from '@/utils/getErrorMessageFromRequest'
import { emptyStringsToNull } from '@/utils/emptyStringsToNull'
import { toNumberOrNull } from '@/utils/toNumberOrNull'
import { categorySchema, type CategoryFormValues } from '@/pages/Amministrazione/Categorie/schemas/categorySchema'

const emptyValues: CategoryFormValues = { name: '', slug: '', icon: '', displayOrder: '', active: true }

type UseCategoryFormProps = {
  category?: PropertyCategory | null
  onSaved: () => void
}

export function useCategoryForm({ category, onSaved }: UseCategoryFormProps) {
  const queryClient = useQueryClient()
  const { toastPromise } = useToast()
  const { mutateAsync: create, isPending: creating } = usePropertyCategoryControllerCreate()
  const { mutateAsync: update, isPending: updating } = usePropertyCategoryControllerUpdateById()

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: emptyValues,
  })

  useEffect(() => {
    form.reset(
      category
        ? {
            name: category.name,
            slug: category.slug,
            icon: category.icon ?? '',
            displayOrder: category.displayOrder != null ? String(category.displayOrder) : '',
            active: category.active ?? true,
          }
        : emptyValues
    )
  }, [category, form])

  function invalidateList() {
    queryClient.invalidateQueries({ queryKey: getPropertyCategoryControllerFindQueryKey() })
    queryClient.invalidateQueries({ queryKey: getPropertyCategoryControllerCountQueryKey() })
  }

  function onSubmit(values: CategoryFormValues) {
    const cleaned = emptyStringsToNull(values)
    const data = { ...cleaned, displayOrder: toNumberOrNull(values.displayOrder) }

    const promise = category?.id ? update({ id: category.id, data }) : create({ data })

    toastPromise(promise, {
      pending: category ? 'Salvataggio categoria...' : 'Creazione categoria...',
      success: () => {
        invalidateList()
        onSaved()
        return category ? 'Categoria aggiornata con successo!' : 'Categoria creata con successo!'
      },
      error: (error: AxiosError<ApiErrorResponse>) =>
        getErrorMessageFromRequest(error, 'Errore durante il salvataggio della categoria'),
    })
  }

  return {
    form,
    isSubmitting: creating || updating,
    onSubmit: form.handleSubmit(onSubmit),
  }
}
