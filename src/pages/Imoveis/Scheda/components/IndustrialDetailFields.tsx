import { Controller, type UseFormReturn } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import FormFieldWrapper from '@/components/FormFieldWrapper'
import type { IndustrialFormValues } from '@/pages/Imoveis/Scheda/hooks/usePropertyIndustrialForm'

type IndustrialDetailFieldsProps = {
  form: UseFormReturn<IndustrialFormValues>
}

function IndustrialDetailFields({ form }: IndustrialDetailFieldsProps) {
  const { register, control } = form

  return (
    <>
      <FormFieldWrapper label="Altezza (m)"><Input {...register('heightM')} type="number" /></FormFieldWrapper>
      <FormFieldWrapper label="Altezza sotto trave (m)"><Input {...register('heightUnderBeamM')} type="number" /></FormFieldWrapper>
      <FormFieldWrapper label="Numero di piani"><Input {...register('floorsCount')} type="number" /></FormFieldWrapper>
      <FormFieldWrapper label="Numero di entrate"><Input {...register('entrancesCount')} type="number" /></FormFieldWrapper>
      <FormFieldWrapper label="Numero di baie di carico"><Input {...register('loadingBaysCount')} type="number" /></FormFieldWrapper>
      <FormFieldWrapper label="Attività consentite"><Input {...register('allowedActivities')} /></FormFieldWrapper>

      <div className="flex items-center gap-4 sm:col-span-2">
        <Controller control={control} name="hasOverheadCrane" render={({ field }) => (
          <label className="flex items-center gap-2 text-sm"><Switch checked={field.value} onCheckedChange={field.onChange} />Ponte rolante</label>
        )} />
        <Controller control={control} name="hasAlarm" render={({ field }) => (
          <label className="flex items-center gap-2 text-sm"><Switch checked={field.value} onCheckedChange={field.onChange} />Allarme</label>
        )} />
      </div>
    </>
  )
}

export default IndustrialDetailFields
