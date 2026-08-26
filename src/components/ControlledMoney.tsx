import {
  useWatch,
  type Control,
  type FieldPathValue,
  type FieldValues,
  type Path,
  type UseFormSetValue,
} from 'react-hook-form'
import InputMoney from '@/components/InputMoney'

type ControlledMoneyProps<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>
  setValue: UseFormSetValue<TFieldValues>
  name: Path<TFieldValues>
  label?: string
  required?: boolean
  disabled?: boolean
  error?: string
}

function ControlledMoney<TFieldValues extends FieldValues>({
  control,
  setValue,
  name,
  label,
  required,
  disabled,
  error,
}: ControlledMoneyProps<TFieldValues>) {
  const value = useWatch({ control, name })

  function handleChange(next: string | undefined) {
    const nextValue = required ? (next ?? '') : next
    setValue(name, nextValue as FieldPathValue<TFieldValues, Path<TFieldValues>>)
  }

  return (
    <InputMoney
      name={name}
      label={label}
      required={required}
      disabled={disabled}
      error={error}
      value={value as string | undefined}
      setValue={handleChange}
    />
  )
}

export default ControlledMoney
