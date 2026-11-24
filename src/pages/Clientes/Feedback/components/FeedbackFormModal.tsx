import { useEffect } from 'react'
import { Controller, useFormState } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import ModalRegister from '@/components/ModalRegister'
import FormModalFooter from '@/components/FormModalFooter'
import FormFieldWrapper from '@/components/FormFieldWrapper'
import ControlledSelectField from '@/components/ControlledSelectField'
import ControlledTextarea from '@/components/ControlledTextarea'
import { LeadSelect, PersonSelect, PropertySelect } from '@/components/RemoteSelects'
import type { ClientFeedbackWithRelations } from '@/api/generated/models'
import {
  feedbackToFormValues,
  getEmptyFeedbackValues,
  useFeedbackForm,
} from '@/pages/Clientes/Feedback/hooks/useFeedbackForm'
import { getFeedbackTypeOptions } from '@/pages/Clientes/Feedback/schemas/feedbackSchema'

type FeedbackFormModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  feedback?: ClientFeedbackWithRelations | null
  // Quando informado (ficha do cliente), o cliente não pode ser trocado
  fixedPersonId?: string
}

function FeedbackFormModal({ open, onOpenChange, feedback, fixedPersonId }: FeedbackFormModalProps) {
  const { t } = useTranslation('clientes')
  const { form, isSubmitting, onSubmit } = useFeedbackForm({
    feedback,
    fixedPersonId,
    onSaved: () => onOpenChange(false),
  })
  const { errors } = useFormState({ control: form.control })

  useEffect(() => {
    // o modal fica montado entre aberturas; sem isso, reabrir depois de
    // "Annulla" mostraria o texto digitado antes
    if (open) {
      form.reset(feedback ? feedbackToFormValues(feedback) : getEmptyFeedbackValues(fixedPersonId))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])
  // o cliente de um feedback já criado não muda (a API não aceita)
  const personLocked = !!fixedPersonId || !!feedback

  return (
    <ModalRegister
      open={open}
      onOpenChange={onOpenChange}
      title={feedback ? t('feedbackFormModal.editTitle') : t('feedbackFormModal.newTitle')}
      description={t('feedbackFormModal.description')}
    >
      <form noValidate onSubmit={onSubmit} className="grid w-full gap-4">
        <ControlledSelectField
          control={form.control}
          name="type"
          label={t('feedbackFormModal.type')}
          options={getFeedbackTypeOptions(t)}
          error={errors.type?.message}
          required
        />

        <FormFieldWrapper label={t('feedbackFormModal.person')} error={errors.personId?.message} required>
          <Controller
            control={form.control}
            name="personId"
            render={({ field }) => (
              <PersonSelect
                value={field.value}
                onValueChange={field.onChange}
                disabled={personLocked}
                placeholder={t('feedbackFormModal.personPlaceholder')}
                searchPlaceholder={t('feedbackFormModal.personSearch')}
              />
            )}
          />
        </FormFieldWrapper>

        <FormFieldWrapper label={t('feedbackFormModal.property')}>
          <Controller
            control={form.control}
            name="propertyId"
            render={({ field }) => (
              <PropertySelect
                value={field.value}
                onValueChange={field.onChange}
                placeholder={t('feedbackFormModal.propertyPlaceholder')}
                searchPlaceholder={t('feedbackFormModal.propertySearch')}
              />
            )}
          />
        </FormFieldWrapper>

        <FormFieldWrapper label={t('feedbackFormModal.lead')}>
          <Controller
            control={form.control}
            name="leadId"
            render={({ field }) => (
              <LeadSelect
                value={field.value}
                onValueChange={field.onChange}
                placeholder={t('feedbackFormModal.leadPlaceholder')}
                searchPlaceholder={t('feedbackFormModal.leadSearch')}
              />
            )}
          />
        </FormFieldWrapper>

        <FormFieldWrapper label={t('feedbackFormModal.content')} error={errors.content?.message} required>
          <ControlledTextarea control={form.control} name="content" rows={5} />
        </FormFieldWrapper>

        <FormModalFooter onCancel={() => onOpenChange(false)} isSubmitting={isSubmitting} />
      </form>
    </ModalRegister>
  )
}

export default FeedbackFormModal
