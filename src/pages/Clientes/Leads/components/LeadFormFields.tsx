import { Controller, useFormState, type UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import FormFieldWrapper from '@/components/FormFieldWrapper'
import SelectField from '@/components/SelectField'
import { useUserControllerFind } from '@/api/generated/api'
import {
  getLeadRequestTypeOptions,
  getLeadSourceOptions,
  getLeadStatusOptions,
  type LeadFormValues,
} from '@/pages/Clientes/Leads/schemas/leadSchema'

type LeadFormFieldsProps = {
  form: UseFormReturn<LeadFormValues>
}

function LeadFormFields({ form }: LeadFormFieldsProps) {
  const { t } = useTranslation('clientes')
  const { register, control } = form
  const { errors } = useFormState({ control })
  const { data: users } = useUserControllerFind({ filter: { order: ['fullName ASC'] } })
  const userOptions = (users ?? []).map((user) => ({ value: user.id ?? '', label: user.fullName }))
  const leadStatusOptions = getLeadStatusOptions(t)
  const leadSourceOptions = getLeadSourceOptions(t)
  const leadRequestTypeOptions = getLeadRequestTypeOptions(t)

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <FormFieldWrapper label={t('leadFormFields.name')} required error={errors.name?.message}>
        <Input
          {...register('name')}
          placeholder={t('leadFormFields.namePlaceholder')}
        />
      </FormFieldWrapper>

      <FormFieldWrapper label={t('leadFormFields.phone')} error={errors.phone?.message}>
        <Input
          {...register('phone')}
          placeholder={t('leadFormFields.phonePlaceholder')}
        />
      </FormFieldWrapper>

      <FormFieldWrapper label={t('leadFormFields.email')} error={errors.email?.message}>
        <Input {...register('email')} type="email" />
      </FormFieldWrapper>

      <FormFieldWrapper
        label={t('leadFormFields.firstContactAt')}
        error={errors.firstContactAt?.message}
      >
        <Input {...register('firstContactAt')} type="date" />
      </FormFieldWrapper>

      <FormFieldWrapper label={t('leadFormFields.status')} required error={errors.status?.message}>
        <Controller
          control={control}
          name="status"
          render={({ field }) => (
            <SelectField value={field.value} onValueChange={field.onChange} options={leadStatusOptions} />
          )}
        />
      </FormFieldWrapper>

      <FormFieldWrapper label={t('leadFormFields.source')} error={errors.source?.message}>
        <Controller
          control={control}
          name="source"
          render={({ field }) => (
            <SelectField
              value={field.value ?? undefined}
              onValueChange={field.onChange}
              options={leadSourceOptions}
              placeholder={t('leadFormFields.sourcePlaceholder')}
            />
          )}
        />
      </FormFieldWrapper>

      <FormFieldWrapper
        label={t('leadFormFields.requestType')}
        error={errors.requestType?.message}
      >
        <Controller
          control={control}
          name="requestType"
          render={({ field }) => (
            <SelectField
              value={field.value ?? undefined}
              onValueChange={field.onChange}
              options={leadRequestTypeOptions}
              placeholder={t('leadFormFields.requestTypePlaceholder')}
            />
          )}
        />
      </FormFieldWrapper>

      <FormFieldWrapper label={t('leadFormFields.desiredCity')} error={errors.desiredCity?.message}>
        <Input {...register('desiredCity')} />
      </FormFieldWrapper>

      <FormFieldWrapper label={t('leadFormFields.maxBudget')} error={errors.maxBudget?.message}>
        <Input {...register('maxBudget')} type="number" min={0} />
      </FormFieldWrapper>

      <FormFieldWrapper label={t('leadFormFields.subject')} error={errors.subject?.message}>
        <Input {...register('subject')} />
      </FormFieldWrapper>

      <FormFieldWrapper
        label={t('leadFormFields.assignedTo')}
        error={errors.assignedToId?.message}
      >
        <Controller
          control={control}
          name="assignedToId"
          render={({ field }) => (
            <SelectField
              value={field.value}
              onValueChange={field.onChange}
              options={userOptions}
              placeholder={t('leadFormFields.assignedToPlaceholder')}
            />
          )}
        />
      </FormFieldWrapper>

      <div className="sm:col-span-2">
        <FormFieldWrapper label={t('leadFormFields.lossReason')} error={errors.lossReason?.message}>
          <Input {...register('lossReason')} />
        </FormFieldWrapper>
      </div>

      <div className="sm:col-span-2">
        <FormFieldWrapper label={t('leadFormFields.notes')} error={errors.notes?.message}>
          <Textarea {...register('notes')} rows={3} />
        </FormFieldWrapper>
      </div>
    </div>
  )
}

export default LeadFormFields
