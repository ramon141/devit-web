import { Controller, type Control, type FieldValues, type Path } from 'react-hook-form'
import { Textarea } from '@/components/ui/textarea'

type ControlledTextareaProps<T extends FieldValues> = {
  control: Control<T>
  name: Path<T>
  rows?: number
}

// Textarea controlada via Controller — mesmo motivo do ControlledInput
function ControlledTextarea<T extends FieldValues>({ control, name, rows }: ControlledTextareaProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => <Textarea {...field} value={field.value ?? ''} rows={rows} />}
    />
  )
}

export default ControlledTextarea
