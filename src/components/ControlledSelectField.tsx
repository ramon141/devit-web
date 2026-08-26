import { Controller, type Control, type FieldValues, type Path } from 'react-hook-form'
import FormFieldWrapper from '@/components/FormFieldWrapper'
import SelectField, { type SelectFieldOption } from '@/components/SelectField'

type ControlledSelectFieldProps<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>
  name: Path<TFieldValues>
  label: string
  options: SelectFieldOption[]
  required?: boolean
  placeholder?: string
  disabled?: boolean
  error?: string
}

function ControlledSelectField<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  options,
  required,
  placeholder,
  disabled,
  error,
}: ControlledSelectFieldProps<TFieldValues>) {
  return (
    <FormFieldWrapper label={label} required={required} error={error}>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <SelectField
            value={field.value as string}
            onValueChange={field.onChange}
            options={options}
            placeholder={placeholder}
            disabled={disabled}
          />
        )}
      />
    </FormFieldWrapper>
  )
}

export default ControlledSelectField
