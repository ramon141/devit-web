import { Controller } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import ModalRegister from '@/components/ModalRegister'
import FormModalFooter from '@/components/FormModalFooter'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import FormFieldWrapper from '@/components/FormFieldWrapper'
import SelectField from '@/components/SelectField'
import type { CommunicationTemplate } from '@/api/generated/models'
import { useTemplateForm } from '@/pages/Marketing/hooks/useTemplateForm'
import {
  getTemplateChannelOptions,
  getTemplateCategoryOptions,
} from '@/pages/Marketing/schemas/communicationTemplateSchema'

type TemplateFormModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  template?: CommunicationTemplate | null
}

function TemplateFormModal({ open, onOpenChange, template }: TemplateFormModalProps) {
  const { t } = useTranslation('marketing')
  const { form, isSubmitting, onSubmit } = useTemplateForm({
    template,
    onSaved: () => onOpenChange(false),
  })
  const {
    register,
    control,
    formState: { errors },
  } = form

  return (
    <ModalRegister
      open={open}
      onOpenChange={onOpenChange}
      title={template ? t('templateFormModal.editTitle') : t('templateFormModal.newTitle')}
    >
      <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
        <FormFieldWrapper label={t('templateFormModal.nameLabel')} required error={errors.name?.message}>
          <Input {...register('name')} placeholder={t('templateFormModal.namePlaceholder')} />
        </FormFieldWrapper>

        <Controller
          control={control}
          name="channel"
          render={({ field }) => (
            <FormFieldWrapper label={t('templateFormModal.channelLabel')} required error={errors.channel?.message}>
              <SelectField value={field.value} onValueChange={field.onChange} options={getTemplateChannelOptions(t)} />
            </FormFieldWrapper>
          )}
        />

        <Controller
          control={control}
          name="category"
          render={({ field }) => (
            <FormFieldWrapper label={t('templateFormModal.categoryLabel')} required error={errors.category?.message}>
              <SelectField value={field.value} onValueChange={field.onChange} options={getTemplateCategoryOptions(t)} />
            </FormFieldWrapper>
          )}
        />

        <FormFieldWrapper label={t('templateFormModal.subjectLabel')} error={errors.subject?.message}>
          <Input {...register('subject')} placeholder={t('templateFormModal.subjectPlaceholder')} />
        </FormFieldWrapper>

        <div className="sm:col-span-2">
          <FormFieldWrapper label={t('templateFormModal.bodyLabel')} required error={errors.body?.message}>
            <Textarea {...register('body')} rows={6} placeholder={t('templateFormModal.bodyPlaceholder')} />
          </FormFieldWrapper>
        </div>

        <Controller
          control={control}
          name="active"
          render={({ field }) => (
            <label className="flex items-center gap-2 self-end pb-1.5 text-sm">
              <Switch checked={field.value} onCheckedChange={field.onChange} />
              {t('templateFormModal.activeLabel')}
            </label>
          )}
        />

        <FormModalFooter onCancel={() => onOpenChange(false)} isSubmitting={isSubmitting} className="sm:col-span-2" />
      </form>
    </ModalRegister>
  )
}

export default TemplateFormModal
