import { useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useQueryClient } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import {
  getCommunicationTemplateControllerCountQueryKey,
  getCommunicationTemplateControllerFindQueryKey,
  useCommunicationTemplateControllerCreate,
  useCommunicationTemplateControllerUpdateById,
} from '@/api/generated/api'
import type { CommunicationTemplate } from '@/api/generated/models'
import { useToast } from '@/contexts/ToastContext'
import { getErrorMessageFromRequest, type ApiErrorResponse } from '@/utils/getErrorMessageFromRequest'
import { emptyStringsToNull } from '@/utils/emptyStringsToNull'
import {
  communicationTemplateSchema,
  type TemplateFormValues,
} from '@/pages/Marketing/schemas/communicationTemplateSchema'

const emptyValues: TemplateFormValues = {
  name: '',
  channel: 'email',
  category: 'generico',
  subject: '',
  body: '',
  active: true,
}

type UseTemplateFormProps = {
  template?: CommunicationTemplate | null
  onSaved: () => void
}

export function useTemplateForm({ template, onSaved }: UseTemplateFormProps) {
  const { t } = useTranslation('marketing')
  const queryClient = useQueryClient()
  const { toastPromise } = useToast()
  const { mutateAsync: create, isPending: creating } = useCommunicationTemplateControllerCreate()
  const { mutateAsync: update, isPending: updating } = useCommunicationTemplateControllerUpdateById()

  const form = useForm<TemplateFormValues>({
    resolver: zodResolver(communicationTemplateSchema(t)),
    defaultValues: emptyValues,
  })

  useEffect(() => {
    form.reset(
      template
        ? {
            name: template.name,
            channel: template.channel,
            category: template.category,
            subject: template.subject ?? '',
            body: template.body,
            active: template.active ?? true,
          }
        : emptyValues,
    )
  }, [template, form])

  function invalidateList() {
    queryClient.invalidateQueries({ queryKey: getCommunicationTemplateControllerFindQueryKey() })
    queryClient.invalidateQueries({ queryKey: getCommunicationTemplateControllerCountQueryKey() })
  }

  function onSubmit(values: TemplateFormValues) {
    const cleaned = emptyStringsToNull(values)
    const promise = template?.id
      ? update({ id: template.id, data: cleaned as Parameters<typeof update>[0]['data'] })
      : create({ data: cleaned as Parameters<typeof create>[0]['data'] })

    toastPromise(promise, {
      pending: template ? t('templateForm.pendingUpdate') : t('templateForm.pendingCreate'),
      success: () => {
        invalidateList()
        onSaved()
        return template ? t('templateForm.successUpdate') : t('templateForm.successCreate')
      },
      error: (error: AxiosError<ApiErrorResponse>) =>
        getErrorMessageFromRequest(error, t('templateForm.error')),
    })
  }

  return {
    form,
    isSubmitting: creating || updating,
    onSubmit: form.handleSubmit(onSubmit),
  }
}
