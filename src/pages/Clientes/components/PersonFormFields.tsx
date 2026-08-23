import { Controller, useFormState, type UseFormReturn } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import FormFieldWrapper from '@/components/FormFieldWrapper'
import SelectField from '@/components/SelectField'
import { personRoleOptions, type PersonFormValues } from '@/pages/Clientes/schemas/personSchema'

type PersonFormFieldsProps = {
  form: UseFormReturn<PersonFormValues>
}

function PersonFormFields({ form }: PersonFormFieldsProps) {
  const { register, control } = form
  const { errors } = useFormState({ control })

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <FormFieldWrapper label="Nome" required error={errors.name?.message}>
        <Input {...register('name')} placeholder="Mario Rossi" />
      </FormFieldWrapper>

      <FormFieldWrapper label="Ruolo" required error={errors.role?.message}>
        <Controller
          control={control}
          name="role"
          render={({ field }) => (
            <SelectField
              value={field.value}
              onValueChange={field.onChange}
              options={personRoleOptions}
            />
          )}
        />
      </FormFieldWrapper>

      <FormFieldWrapper label="E-mail" error={errors.email?.message}>
        <Input {...register('email')} type="email" placeholder="mario@devit.it" />
      </FormFieldWrapper>

      <FormFieldWrapper label="Data di nascita" error={errors.birthDate?.message}>
        <Input {...register('birthDate')} type="date" />
      </FormFieldWrapper>

      <FormFieldWrapper label="Telefono" error={errors.phone?.message}>
        <Input {...register('phone')} placeholder="+39 333 1234567" />
      </FormFieldWrapper>

      <FormFieldWrapper label="Telefono secondario" error={errors.secondaryPhone?.message}>
        <Input {...register('secondaryPhone')} placeholder="+39 333 1234567" />
      </FormFieldWrapper>

      <FormFieldWrapper label="Tipo documento" error={errors.documentType?.message}>
        <Input {...register('documentType')} placeholder="Carta d'identità" />
      </FormFieldWrapper>

      <FormFieldWrapper label="Numero documento" error={errors.documentNumber?.message}>
        <Input {...register('documentNumber')} />
      </FormFieldWrapper>

      <div className="sm:col-span-2">
        <FormFieldWrapper label="Note" error={errors.notes?.message}>
          <Textarea {...register('notes')} rows={3} />
        </FormFieldWrapper>
      </div>
    </div>
  )
}

export default PersonFormFields
