import { Controller, type UseFormReturn } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import FormFieldWrapper from '@/components/FormFieldWrapper'
import SelectField from '@/components/SelectField'
import type { LandFormValues } from '@/pages/Imoveis/Scheda/hooks/usePropertyLandForm'

const terrainTypeOptions = [
  { value: 'flat', label: 'Pianeggiante' },
  { value: 'sloped', label: 'In pendenza' },
]

type LandDetailFieldsProps = {
  form: UseFormReturn<LandFormValues>
}

function LandDetailFields({ form }: LandDetailFieldsProps) {
  const { register, control } = form

  return (
    <>
      <FormFieldWrapper label="Tipo di terreno">
        <Controller control={control} name="terrainType" render={({ field }) => (
          <SelectField value={field.value} onValueChange={field.onChange} options={terrainTypeOptions} placeholder="Nessuno" />
        )} />
      </FormFieldWrapper>
      <FormFieldWrapper label="Indice di edificabilità"><Input {...register('buildabilityIndex')} type="number" step="0.01" /></FormFieldWrapper>
      <FormFieldWrapper label="M² edificabili"><Input {...register('buildableAreaSqm')} type="number" /></FormFieldWrapper>
      <FormFieldWrapper label="M² agricoli"><Input {...register('agriculturalAreaSqm')} type="number" /></FormFieldWrapper>
      <FormFieldWrapper label="Possibilità di realizzazione"><Input {...register('possibleConstruction')} /></FormFieldWrapper>
      <FormFieldWrapper label="Servitù di passaggio"><Input {...register('rightOfWay')} /></FormFieldWrapper>
      <FormFieldWrapper label="Diritto di prelazione"><Input {...register('preemptionRights')} /></FormFieldWrapper>

      <div className="sm:col-span-2">
        <FormFieldWrapper label="Piantumazioni"><Textarea {...register('plantations')} rows={2} /></FormFieldWrapper>
      </div>

      <div className="flex items-center gap-4 sm:col-span-2">
        <Controller control={control} name="hasExistingConstruction" render={({ field }) => (
          <label className="flex items-center gap-2 text-sm"><Switch checked={field.value} onCheckedChange={field.onChange} />Costruzione esistente</label>
        )} />
        <Controller control={control} name="projectApproved" render={({ field }) => (
          <label className="flex items-center gap-2 text-sm"><Switch checked={field.value} onCheckedChange={field.onChange} />Progetto approvato</label>
        )} />
      </div>
    </>
  )
}

export default LandDetailFields
