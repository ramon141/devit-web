import dayjs from 'dayjs'
import { useFormState, type UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Input } from '@/components/ui/input'
import FormFieldWrapper from '@/components/FormFieldWrapper'
import type { CalendarEventFormValues } from '@/pages/Agenda/schemas/calendarEventSchema'
import { DEFAULT_DURATION_MINUTES } from '@/constants/agenda'

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

type CalendarEventTimeFieldsProps = {
  form: UseFormReturn<CalendarEventFormValues>
}

// Início e fim; a duração padrão é 30 min e é mantida ao mudar o início
function CalendarEventTimeFields({ form }: CalendarEventTimeFieldsProps) {
  const { t } = useTranslation('agenda')
  const { register, control, getValues, setValue } = form
  const { errors } = useFormState({ control })

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

  return (
    <div className="grid grid-cols-2 gap-4 sm:col-span-2">
      <FormFieldWrapper
        id="modal-field-startTime"
        label={t('agenda:formFields.startTime')}
        required
        error={errors.startTime?.message}
      >
        <Input {...startField} onChange={handleStartChange} type="time" />
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
