import { useEffect, useRef, type BaseSyntheticEvent } from 'react'
import type { EditorRef } from 'react-email-editor'
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
import { CommunicationTemplateChannel } from '@/api/generated/models/communicationTemplateChannel'
import { exportEmail } from '@/components/EmailDesignEditor'
import { usePromisePopup } from '@/contexts/PromisePopupContext'
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
  design: null,
  active: true,
}

type UseTemplateFormProps = {
  template?: CommunicationTemplate | null
  onSaved: () => void
}

export function useTemplateForm({ template, onSaved }: UseTemplateFormProps) {
  const { t } = useTranslation('marketing')
  const queryClient = useQueryClient()
  const { promisePopup } = usePromisePopup()
  const { mutateAsync: create, isPending: creating } = useCommunicationTemplateControllerCreate()
  const { mutateAsync: update, isPending: updating } = useCommunicationTemplateControllerUpdateById()

  const editorRef = useRef<EditorRef>(null)

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
            design: template.design ?? null,
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
    const isEmail = values.channel === CommunicationTemplateChannel.email
    const cleaned = emptyStringsToNull({
      ...values,
      design: isEmail ? values.design : null,
    })
    const promise = template?.id
      ? update({ id: template.id, data: cleaned as Parameters<typeof update>[0]['data'] })
      : create({ data: cleaned as Parameters<typeof create>[0]['data'] })

    promisePopup(promise, {
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

  // No canal email o corpo vem do editor Unlayer: exporta HTML + design antes de validar
  async function submitWithEditor(event?: BaseSyntheticEvent) {
    event?.preventDefault()

    if (form.getValues('channel') === CommunicationTemplateChannel.email) {
      const exported = await exportEmail(editorRef)

      if (exported) {
        form.setValue('body', exported.html)
        form.setValue('design', exported.design)
      }
    }

    return form.handleSubmit(onSubmit)(event)
  }

  return {
    form,
    editorRef,
    isSubmitting: creating || updating,
    onSubmit: submitWithEditor,
  }
}
