import { Controller, useFormState, type UseFormReturn } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import FormFieldWrapper from '@/components/FormFieldWrapper'
import SelectField from '@/components/SelectField'
import {
  availabilityOptions,
  conditionOptions,
  furnishedOptions,
} from '@/pages/Imoveis/Scheda/schemas/propertyDetailOptions'
import type { DettagliFormValues } from '@/pages/Imoveis/Scheda/hooks/usePropertyDetailForm'

type DettagliStatoFieldsProps = {
  form: UseFormReturn<DettagliFormValues>
}

function DettagliStatoFields({ form }: DettagliStatoFieldsProps) {
  const { register, control } = form
  const { errors } = useFormState({ control })

  return (
    <>
      <FormFieldWrapper label="Disponibilità" error={errors.availability?.message}>
        <Controller control={control} name="availability" render={({ field }) => (
          <SelectField value={field.value} onValueChange={field.onChange} options={availabilityOptions} placeholder="Nessuna" />
        )} />
      </FormFieldWrapper>

      <FormFieldWrapper label="Stato di conservazione" error={errors.condition?.message}>
        <Controller control={control} name="condition" render={({ field }) => (
          <SelectField value={field.value} onValueChange={field.onChange} options={conditionOptions} placeholder="Nessuno" />
        )} />
      </FormFieldWrapper>

      <FormFieldWrapper label="Arredato" error={errors.furnished?.message}>
        <Controller control={control} name="furnished" render={({ field }) => (
          <SelectField value={field.value} onValueChange={field.onChange} options={furnishedOptions} placeholder="Nessuno" />
        )} />
      </FormFieldWrapper>

      <FormFieldWrapper label="Esposizione" error={errors.exposure?.message}>
        <Input {...register('exposure')} placeholder="Sud" />
      </FormFieldWrapper>

      <div className="flex flex-wrap items-center gap-4 sm:col-span-2">
        <Controller control={control} name="bareOwnership" render={({ field }) => (
          <label className="flex items-center gap-2 text-sm"><Switch checked={field.value} onCheckedChange={field.onChange} />Nuda proprietà</label>
        )} />
        <Controller control={control} name="prestige" render={({ field }) => (
          <label className="flex items-center gap-2 text-sm"><Switch checked={field.value} onCheckedChange={field.onChange} />Immobile di prestigio</label>
        )} />
        <Controller control={control} name="newConstruction" render={({ field }) => (
          <label className="flex items-center gap-2 text-sm"><Switch checked={field.value} onCheckedChange={field.onChange} />Nuova costruzione</label>
        )} />
        <Controller control={control} name="availableImmediately" render={({ field }) => (
          <label className="flex items-center gap-2 text-sm"><Switch checked={field.value} onCheckedChange={field.onChange} />Disponibile subito</label>
        )} />
      </div>

      <div className="sm:col-span-2">
        <FormFieldWrapper label="Nota interna" error={errors.internalNote?.message}>
          <Textarea {...register('internalNote')} rows={2} />
        </FormFieldWrapper>
      </div>

      <div className="sm:col-span-2">
        <FormFieldWrapper label="Nota condivisa con i colleghi" error={errors.sharedNote?.message}>
          <Textarea {...register('sharedNote')} rows={2} />
        </FormFieldWrapper>
      </div>
    </>
  )
}

export default DettagliStatoFields
