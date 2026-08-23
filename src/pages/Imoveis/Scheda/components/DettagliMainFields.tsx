import { Controller, type UseFormReturn } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import FormFieldWrapper from '@/components/FormFieldWrapper'
import SelectField from '@/components/SelectField'
import { useUserControllerFind } from '@/api/generated/api'
import { ratingOptions, mediationOptions } from '@/pages/Imoveis/Scheda/schemas/propertyDetailOptions'
import type { DettagliFormValues } from '@/pages/Imoveis/Scheda/hooks/usePropertyDetailForm'

type DettagliMainFieldsProps = {
  form: UseFormReturn<DettagliFormValues>
}

function DettagliMainFields({ form }: DettagliMainFieldsProps) {
  const { register, control, formState: { errors } } = form
  const { data: agents } = useUserControllerFind({ filter: { order: ['fullName ASC'] } })
  const agentOptions = (agents ?? []).map((agent) => ({ value: agent.id ?? '', label: agent.fullName }))

  return (
    <>
      <FormFieldWrapper label="Data di acquisizione" error={errors.acquisitionDate?.message}>
        <Input {...register('acquisitionDate')} type="date" />
      </FormFieldWrapper>

      <FormFieldWrapper label="Stato dell'annuncio" error={errors.listingStage?.message}>
        <Input {...register('listingStage')} placeholder="Proponibile" />
      </FormFieldWrapper>

      <FormFieldWrapper label="Rating" error={errors.rating?.message}>
        <Controller control={control} name="rating" render={({ field }) => (
          <SelectField value={field.value} onValueChange={field.onChange} options={ratingOptions} />
        )} />
      </FormFieldWrapper>

      <FormFieldWrapper label="Agente responsabile" error={errors.agentId?.message}>
        <Controller control={control} name="agentId" render={({ field }) => (
          <SelectField value={field.value} onValueChange={field.onChange} options={agentOptions} placeholder="Nessuno" />
        )} />
      </FormFieldWrapper>

      <FormFieldWrapper label="Tipo di mediazione" error={errors.mediationType?.message}>
        <Controller control={control} name="mediationType" render={({ field }) => (
          <SelectField value={field.value} onValueChange={field.onChange} options={mediationOptions} placeholder="Nessuno" />
        )} />
      </FormFieldWrapper>

      <FormFieldWrapper label="Tipologia" error={errors.subtype?.message}>
        <Input {...register('subtype')} placeholder="Bilocale" />
      </FormFieldWrapper>

      <FormFieldWrapper label="% mediazione cliente" error={errors.mediationFeeClientPct?.message}>
        <Input {...register('mediationFeeClientPct')} type="number" step="0.01" />
      </FormFieldWrapper>

      <FormFieldWrapper label="% mediazione proprietario" error={errors.mediationFeeOwnerPct?.message}>
        <Input {...register('mediationFeeOwnerPct')} type="number" step="0.01" />
      </FormFieldWrapper>
    </>
  )
}

export default DettagliMainFields
