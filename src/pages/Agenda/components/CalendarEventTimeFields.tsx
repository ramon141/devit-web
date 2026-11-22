import dayjs from 'dayjs'
import { useFormState, type UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import type { TFunction } from 'i18next'
import { Input } from '@/components/ui/input'
import FormFieldWrapper from '@/components/FormFieldWrapper'
import SelectField from '@/components/SelectField'
import type { CalendarEventFormValues } from '@/pages/Agenda/schemas/calendarEventSchema'
import {
  DEFAULT_DURATION_MINUTES,
  DURATION_STEP_MINUTES,
  MAX_DURATION_MINUTES,
} from '@/constants/agenda'

const TIME_FORMAT = 'HH:mm'
const TIME_BASE_DATE = '2000-01-01'

function parseTime(time: string) {
  return dayjs(`${TIME_BASE_DATE}T${time}`)
}

// Duração em minutos entre dois horários; 0 se algum for inválido
function getDurationMinutes(startTime: string, endTime: string) {
  const start = parseTime(startTime)
  const end = parseTime(endTime)

  if (!start.isValid() || !end.isValid()) return 0

  return end.diff(start, 'minute')
}

function addMinutes(time: string, minutes: number) {
  return parseTime(time).add(minutes, 'minute').format(TIME_FORMAT)
}

function formatDuration(t: TFunction, minutes: number) {
  const hours = Math.floor(minutes / 60)
  const rest = minutes % 60

  if (hours === 0) return t('agenda:duration.minutes', { count: rest })
  if (rest === 0) return t('agenda:duration.hours', { hours })

  return t('agenda:duration.hoursMinutes', { hours, minutes: rest })
}

function getDurationOptions(t: TFunction) {
  const total = MAX_DURATION_MINUTES / DURATION_STEP_MINUTES

  return Array.from({ length: total }, (_, index) => {
    const minutes = (index + 1) * DURATION_STEP_MINUTES

    return { value: String(minutes), label: formatDuration(t, minutes) }
  })
}

type CalendarEventTimeFieldsProps = {
  form: UseFormReturn<CalendarEventFormValues>
}

// Início, duração (menu de 15 em 15 min) e fim, que também pode ser digitado
function CalendarEventTimeFields({ form }: CalendarEventTimeFieldsProps) {
  const { t } = useTranslation('agenda')
  const { register, control, watch, getValues, setValue } = form
  const { errors } = useFormState({ control })

  const startTime = watch('startTime')
  const endTime = watch('endTime')
  const duration = getDurationMinutes(startTime, endTime)
  const isListed =
    duration > 0 && duration <= MAX_DURATION_MINUTES && duration % DURATION_STEP_MINUTES === 0
  const startField = register('startTime')

  // Ao mudar o início, mantém a duração atual (30 min se ainda não houver uma válida)
  function handleStartChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { startTime: oldStart, endTime: oldEnd } = getValues()
    const oldDuration = getDurationMinutes(oldStart, oldEnd)
    const keep = oldDuration > 0 ? oldDuration : DEFAULT_DURATION_MINUTES

    startField.onChange(event)

    if (!event.target.value) return

    setValue('endTime', addMinutes(event.target.value, keep), {
      shouldDirty: true,
      shouldValidate: true,
    })
  }

  function handleDurationChange(value: string) {
    if (!value || !startTime) return

    setValue('endTime', addMinutes(startTime, Number(value)), {
      shouldDirty: true,
      shouldValidate: true,
    })
  }

  return (
    <div className="grid grid-cols-3 gap-4 sm:col-span-2">
      <FormFieldWrapper
        id="modal-field-startTime"
        label={t('agenda:formFields.startTime')}
        required
        error={errors.startTime?.message}
      >
        <Input {...startField} onChange={handleStartChange} type="time" />
      </FormFieldWrapper>

      <FormFieldWrapper
        id="modal-field-duration"
        label={t('agenda:formFields.duration')}
        hint={t('agenda:formFields.durationHint')}
      >
        <SelectField
          value={isListed ? String(duration) : ''}
          onValueChange={handleDurationChange}
          options={getDurationOptions(t)}
          placeholder={t('agenda:duration.custom')}
          clearable={false}
        />
      </FormFieldWrapper>

      <FormFieldWrapper
        id="modal-field-endTime"
        label={t('agenda:formFields.endTime')}
        required
        error={errors.endTime?.message}
      >
        <Input {...register('endTime')} type="time" />
      </FormFieldWrapper>
    </div>
  )
}

export default CalendarEventTimeFields
