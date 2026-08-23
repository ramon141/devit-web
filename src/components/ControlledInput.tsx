import { Controller, type Control, type FieldValues, type Path } from 'react-hook-form'
import { Input } from '@/components/ui/input'

type ControlledInputProps<T extends FieldValues> = {
  control: Control<T>
  name: Path<T>
  type?: string
  placeholder?: string
  step?: string
}

// Input controlado via Controller — necessário quando o mesmo useForm() é
// compartilhado por múltiplos <form> irmãos (register() perde o valor nesse caso)
function ControlledInput<T extends FieldValues>({ control, name, ...props }: ControlledInputProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => <Input {...field} value={field.value ?? ''} {...props} />}
    />
  )
}

export default ControlledInput
