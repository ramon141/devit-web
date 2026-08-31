import { Controller, useFormState, type UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import FormFieldWrapper from '@/components/FormFieldWrapper'
import SelectField from '@/components/SelectField'
import SearchableSelect from '@/components/SearchableSelect'
import { useLeadControllerFind, usePersonControllerFind } from '@/api/generated/api'
import { PersonRole } from '@/api/generated/models'
import {
  getEventTypeOptions,
  getConfirmationStatusOptions,
  getReminderOptions,
  getRecurrenceOptions,
  getBackgroundColorOptions,
  type CalendarEventFormValues,
} from '@/pages/Agenda/schemas/calendarEventSchema'
import { cn } from '@/lib/utils'

type CalendarEventFormFieldsProps = {
  form: UseFormReturn<CalendarEventFormValues>
}

function CalendarEventFormFields({ form }: CalendarEventFormFieldsProps) {
  const { t } = useTranslation('agenda')
  const { register, control, watch } = form
  const { errors } = useFormState({ control })

  const eventTypeOptions = getEventTypeOptions(t)
  const confirmationStatusOptions = getConfirmationStatusOptions(t)
  const reminderOptions = getReminderOptions(t)
  const recurrenceOptions = getRecurrenceOptions(t)
  const backgroundColorOptions = getBackgroundColorOptions(t)

  const isAllDay = watch('allDay')

  const { data: leads } = useLeadControllerFind({ filter: { order: ['name ASC'], limit: 200 } })
  const { data: owners } = usePersonControllerFind({
    filter: { where: { role: PersonRole.owner }, order: ['name ASC'], limit: 200 },
  })
  const leadOptions = (leads ?? []).map((lead) => ({ value: lead.id ?? '', label: lead.name }))
  const ownerOptions = (owners ?? []).map((owner) => ({ value: owner.id ?? '', label: owner.name }))

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <FormFieldWrapper label={t('agenda:formFields.title')} required error={errors.title?.message}>
          <Input {...register('title')} placeholder={t('agenda:formFields.titlePlaceholder')} />
        </FormFieldWrapper>
      </div>

      <FormFieldWrapper label={t('agenda:formFields.type')} required error={errors.type?.message}>
        <Controller
          control={control}
          name="type"
          render={({ field }) => (
            <SelectField value={field.value} onValueChange={field.onChange} options={eventTypeOptions} />
          )}
        />
      </FormFieldWrapper>

      <FormFieldWrapper label={t('agenda:formFields.place')} error={errors.place?.message}>
        <Input {...register('place')} placeholder={t('agenda:formFields.placePlaceholder')} />
      </FormFieldWrapper>

      <FormFieldWrapper
        label={t('agenda:formFields.keysLocation')}
        error={errors.keysLocation?.message}
      >
        <Input
          {...register('keysLocation')}
          placeholder={t('agenda:formFields.keysLocationPlaceholder')}
        />
      </FormFieldWrapper>

      <FormFieldWrapper label={t('agenda:formFields.date')} required error={errors.startDate?.message}>
        <Input {...register('startDate')} type="date" />
      </FormFieldWrapper>

      <Controller
        control={control}
        name="allDay"
        render={({ field }) => (
          <label className="flex items-center gap-2 self-end pb-1.5 text-sm">
            <Switch checked={field.value} onCheckedChange={field.onChange} />
            {t('agenda:formFields.allDay')}
          </label>
        )}
      />

      {isAllDay ? (
        <div className="hidden sm:block" />
      ) : (
        <div className="grid grid-cols-2 gap-4">
          <FormFieldWrapper
            label={t('agenda:formFields.startTime')}
            required
            error={errors.startTime?.message}
          >
            <Input {...register('startTime')} type="time" />
          </FormFieldWrapper>
          <FormFieldWrapper
            label={t('agenda:formFields.endTime')}
            required
            error={errors.endTime?.message}
          >
            <Input {...register('endTime')} type="time" />
          </FormFieldWrapper>
        </div>
      )}

      <FormFieldWrapper label={t('agenda:formFields.client')} error={errors.leadId?.message}>
        <Controller
          control={control}
          name="leadId"
          render={({ field }) => (
            <SearchableSelect
              value={field.value}
              onValueChange={field.onChange}
              options={leadOptions}
              placeholder={t('agenda:formFields.clientPlaceholder')}
              searchPlaceholder={t('agenda:formFields.clientSearchPlaceholder')}
            />
          )}
        />
      </FormFieldWrapper>

      <FormFieldWrapper label={t('agenda:formFields.owner')} error={errors.ownerId?.message}>
        <Controller
          control={control}
          name="ownerId"
          render={({ field }) => (
            <SearchableSelect
              value={field.value}
              onValueChange={field.onChange}
              options={ownerOptions}
              placeholder={t('agenda:formFields.ownerPlaceholder')}
              searchPlaceholder={t('agenda:formFields.ownerSearchPlaceholder')}
            />
          )}
        />
      </FormFieldWrapper>

      <FormFieldWrapper
        label={t('agenda:formFields.confirmationStatus')}
        required
        error={errors.confirmationStatus?.message}
      >
        <Controller
          control={control}
          name="confirmationStatus"
          render={({ field }) => (
            <SelectField
              value={field.value}
              onValueChange={field.onChange}
              options={confirmationStatusOptions}
            />
          )}
        />
      </FormFieldWrapper>

      <FormFieldWrapper label={t('agenda:formFields.reminder')} required error={errors.reminder?.message}>
        <Controller
          control={control}
          name="reminder"
          render={({ field }) => (
            <SelectField value={field.value} onValueChange={field.onChange} options={reminderOptions} />
          )}
        />
      </FormFieldWrapper>

      <FormFieldWrapper
        label={t('agenda:formFields.recurrence')}
        required
        error={errors.recurrence?.message}
      >
        <Controller
          control={control}
          name="recurrence"
          render={({ field }) => (
            <SelectField value={field.value} onValueChange={field.onChange} options={recurrenceOptions} />
          )}
        />
      </FormFieldWrapper>

      <Controller
        control={control}
        name="backgroundColor"
        render={({ field }) => (
          <div className="grid gap-1.5">
            <span className="text-sm font-medium">{t('agenda:formFields.eventColor')}</span>
            <div className="flex flex-wrap items-center gap-2">
              {backgroundColorOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  aria-label={option.label}
                  onClick={() => field.onChange(option.value)}
                  className={cn(
                    'size-6 rounded-full ring-2 ring-offset-2 ring-offset-background',
                    field.value === option.value ? 'ring-foreground' : 'ring-transparent'
                  )}
                  style={{ backgroundColor: option.value }}
                />
              ))}
            </div>
          </div>
        )}
      />

      <Controller
        control={control}
        name="private"
        render={({ field }) => (
          <label className="flex items-center gap-2 self-end pb-1.5 text-sm">
            <Switch checked={field.value} onCheckedChange={field.onChange} />
            {t('agenda:formFields.privateEvent')}
          </label>
        )}
      />

      <div className="sm:col-span-2">
        <FormFieldWrapper label={t('agenda:formFields.description')} error={errors.description?.message}>
          <Textarea {...register('description')} rows={3} />
        </FormFieldWrapper>
      </div>
    </div>
  )
}

export default CalendarEventFormFields
