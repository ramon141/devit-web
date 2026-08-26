import { Controller, useFormState, type UseFormReturn } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import FormFieldWrapper from '@/components/FormFieldWrapper'
import SelectField from '@/components/SelectField'
import {
  eventTypeOptions,
  confirmationStatusOptions,
  reminderOptions,
  type CalendarEventFormValues,
} from '@/pages/Agenda/schemas/calendarEventSchema'

type CalendarEventFormFieldsProps = {
  form: UseFormReturn<CalendarEventFormValues>
}

function CalendarEventFormFields({ form }: CalendarEventFormFieldsProps) {
  const { register, control } = form
  const { errors } = useFormState({ control })

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <FormFieldWrapper label="Titolo" required error={errors.title?.message}>
          <Input {...register('title')} placeholder="Visita immobile con cliente" />
        </FormFieldWrapper>
      </div>

      <FormFieldWrapper label="Tipo di impegno" required error={errors.type?.message}>
        <Controller
          control={control}
          name="type"
          render={({ field }) => (
            <SelectField value={field.value} onValueChange={field.onChange} options={eventTypeOptions} />
          )}
        />
      </FormFieldWrapper>

      <FormFieldWrapper label="Luogo" error={errors.place?.message}>
        <Input {...register('place')} placeholder="Via Roma 12, Milano" />
      </FormFieldWrapper>

      <FormFieldWrapper label="Data" required error={errors.startDate?.message}>
        <Input {...register('startDate')} type="date" />
      </FormFieldWrapper>

      <div className="grid grid-cols-2 gap-4">
        <FormFieldWrapper label="Ora inizio" required error={errors.startTime?.message}>
          <Input {...register('startTime')} type="time" />
        </FormFieldWrapper>
        <FormFieldWrapper label="Ora fine" required error={errors.endTime?.message}>
          <Input {...register('endTime')} type="time" />
        </FormFieldWrapper>
      </div>

      <FormFieldWrapper label="Stato di conferma" required error={errors.confirmationStatus?.message}>
        <Controller
          control={control}
          name="confirmationStatus"
          render={({ field }) => (
            <SelectField value={field.value} onValueChange={field.onChange} options={confirmationStatusOptions} />
          )}
        />
      </FormFieldWrapper>

      <FormFieldWrapper label="Promemoria" required error={errors.reminder?.message}>
        <Controller
          control={control}
          name="reminder"
          render={({ field }) => (
            <SelectField value={field.value} onValueChange={field.onChange} options={reminderOptions} />
          )}
        />
      </FormFieldWrapper>

      <Controller
        control={control}
        name="private"
        render={({ field }) => (
          <label className="flex items-center gap-2 self-end pb-1.5 text-sm">
            <Switch checked={field.value} onCheckedChange={field.onChange} />
            Impegno privato
          </label>
        )}
      />

      <div className="sm:col-span-2">
        <FormFieldWrapper label="Descrizione" error={errors.description?.message}>
          <Textarea {...register('description')} rows={3} />
        </FormFieldWrapper>
      </div>
    </div>
  )
}

export default CalendarEventFormFields
