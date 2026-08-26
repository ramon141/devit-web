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
  recurrenceOptions,
  backgroundColorOptions,
  type CalendarEventFormValues,
} from '@/pages/Agenda/schemas/calendarEventSchema'
import { cn } from '@/lib/utils'

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

      <FormFieldWrapper label="Luogo delle chiavi" error={errors.keysLocation?.message}>
        <Input {...register('keysLocation')} placeholder="Portineria, agenzia..." />
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

      <FormFieldWrapper label="Ricorrenza" required error={errors.recurrence?.message}>
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
            <span className="text-sm font-medium">Colore evento</span>
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
