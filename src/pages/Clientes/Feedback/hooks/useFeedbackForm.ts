import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import type { AxiosError } from 'axios'
import {
  getClientFeedbackControllerCountQueryKey,
  getClientFeedbackControllerFindQueryKey,
  useClientFeedbackControllerCreate,
  useClientFeedbackControllerUpdateById,
} from '@/api/generated/api'
import type { ClientFeedbackWithRelations } from '@/api/generated/models'
import { usePromisePopup } from '@/contexts/PromisePopupContext'
import { getErrorMessageFromRequest, type ApiErrorResponse } from '@/utils/getErrorMessageFromRequest'
import {
  createFeedbackSchema,
  type FeedbackFormValues,
} from '@/pages/Clientes/Feedback/schemas/feedbackSchema'

export function getEmptyFeedbackValues(personId?: string): FeedbackFormValues {
  return {
    type: 'preference',
    content: '',
    personId: personId ?? '',
    propertyId: '',
    leadId: '',
  }
}

export function feedbackToFormValues(feedback: ClientFeedbackWithRelations): FeedbackFormValues {
  return {
    type: feedback.type,
    content: feedback.content,
    personId: feedback.personId,
    propertyId: feedback.propertyId ?? '',
    leadId: feedback.leadId ?? '',
  }
}

type UseFeedbackFormProps = {
  feedback?: ClientFeedbackWithRelations | null
  fixedPersonId?: string
  onSaved: () => void
}

export function useFeedbackForm({ feedback, fixedPersonId, onSaved }: UseFeedbackFormProps) {
  const { t } = useTranslation('clientes')
  const queryClient = useQueryClient()
  const { promisePopup } = usePromisePopup()
  const { mutateAsync: create, isPending: creating } = useClientFeedbackControllerCreate()
  const { mutateAsync: update, isPending: updating } = useClientFeedbackControllerUpdateById()

  const form = useForm<FeedbackFormValues>({
    resolver: zodResolver(createFeedbackSchema(t)),
    defaultValues: getEmptyFeedbackValues(fixedPersonId),
    values: feedback ? feedbackToFormValues(feedback) : getEmptyFeedbackValues(fixedPersonId),
  })

  function invalidateList() {
    queryClient.invalidateQueries({ queryKey: getClientFeedbackControllerFindQueryKey() })
    queryClient.invalidateQueries({ queryKey: getClientFeedbackControllerCountQueryKey() })
  }

  function saveFeedback(values: FeedbackFormValues) {
    // a API aceita null para desligar imóvel/solicitação; string vazia não
    const links = {
      propertyId: values.propertyId || null,
      leadId: values.leadId || null,
    }

    if (feedback?.id) {
      return update({
        id: feedback.id,
        data: { type: values.type, content: values.content, ...links },
      })
    }

    return create({ data: { ...values, ...links } })
  }

  function onSubmit(values: FeedbackFormValues) {
    promisePopup(saveFeedback(values), {
      pending: feedback ? t('useFeedbackForm.pendingUpdate') : t('useFeedbackForm.pendingCreate'),
      success: () => {
        invalidateList()
        onSaved()
        return feedback ? t('useFeedbackForm.successUpdate') : t('useFeedbackForm.successCreate')
      },
      error: (error: AxiosError<ApiErrorResponse>) =>
        getErrorMessageFromRequest(error, t('useFeedbackForm.error')),
    })
  }

  return { form, isSubmitting: creating || updating, onSubmit: form.handleSubmit(onSubmit) }
}
