import { Controller, type UseFormReturn } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import FormFieldWrapper from '@/components/FormFieldWrapper'
import SelectField from '@/components/SelectField'
import { useUserControllerFind } from '@/api/generated/api'
import { leadStatusOptions, type LeadFormValues } from '@/pages/Clientes/Leads/schemas/leadSchema'

type LeadFormFieldsProps = {
  form: UseFormReturn<LeadFormValues>
}

function LeadFormFields({ form }: LeadFormFieldsProps) {
  const {
    register,
    control,
    formState: { errors },
  } = form
  const { data: users } = useUserControllerFind({ filter: { order: ['fullName ASC'] } })
  const userOptions = (users ?? []).map((user) => ({ value: user.id ?? '', label: user.fullName }))

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <FormFieldWrapper label="Nome" required error={errors.name?.message}>
        <Input {...register('name')} placeholder="Mario Rossi" />
      </FormFieldWrapper>

      <FormFieldWrapper label="Telefono" error={errors.phone?.message}>
        <Input {...register('phone')} placeholder="+39 333 1234567" />
      </FormFieldWrapper>

      <FormFieldWrapper label="E-mail" error={errors.email?.message}>
        <Input {...register('email')} type="email" />
      </FormFieldWrapper>

      <FormFieldWrapper label="Primo contatto" error={errors.firstContactAt?.message}>
        <Input {...register('firstContactAt')} type="date" />
      </FormFieldWrapper>

      <FormFieldWrapper label="Stato" required error={errors.status?.message}>
        <Controller
          control={control}
          name="status"
          render={({ field }) => (
            <SelectField value={field.value} onValueChange={field.onChange} options={leadStatusOptions} />
          )}
        />
      </FormFieldWrapper>

      <FormFieldWrapper label="Responsabile" error={errors.assignedToId?.message}>
        <Controller
          control={control}
          name="assignedToId"
          render={({ field }) => (
            <SelectField value={field.value} onValueChange={field.onChange} options={userOptions} placeholder="Nessuno" />
          )}
        />
      </FormFieldWrapper>

      <div className="sm:col-span-2">
        <FormFieldWrapper label="Motivo di perdita" error={errors.lossReason?.message}>
          <Input {...register('lossReason')} />
        </FormFieldWrapper>
      </div>

      <div className="sm:col-span-2">
        <FormFieldWrapper label="Note" error={errors.notes?.message}>
          <Textarea {...register('notes')} rows={3} />
        </FormFieldWrapper>
      </div>
    </div>
  )
}

export default LeadFormFields
