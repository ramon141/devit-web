import { Controller } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import FormFieldWrapper from '@/components/FormFieldWrapper'
import { usePropertyLocationDetailForm } from '@/pages/Imoveis/Scheda/hooks/usePropertyLocationDetailForm'

type PropertyLocationDetailSectionProps = {
  propertyId: string
}

function PropertyLocationDetailSection({ propertyId }: PropertyLocationDetailSectionProps) {
  const { form, isLoading, isSubmitting, onSubmit } = usePropertyLocationDetailForm(propertyId)
  const { register, control } = form

  if (isLoading) return null

  return (
    <form onSubmit={onSubmit} className="grid gap-4 sm:col-span-2 sm:grid-cols-2">
      <Separator className="sm:col-span-2" />
      <p className="text-sm font-medium sm:col-span-2">Dettagli aggiuntivi</p>

      <FormFieldWrapper label="Latitudine"><Input {...register('latitude')} type="number" step="0.000001" /></FormFieldWrapper>
      <FormFieldWrapper label="Longitudine"><Input {...register('longitude')} type="number" step="0.000001" /></FormFieldWrapper>
      <FormFieldWrapper label="Posizione"><Input {...register('position')} placeholder="Centrale" /></FormFieldWrapper>
      <FormFieldWrapper label="Distanza dal mare/lago (m)"><Input {...register('distanceToWaterM')} type="number" /></FormFieldWrapper>
      <FormFieldWrapper label="Piano"><Input {...register('floorNumber')} type="number" /></FormFieldWrapper>
      <FormFieldWrapper label="Totale piani"><Input {...register('totalFloors')} type="number" /></FormFieldWrapper>
      <FormFieldWrapper label="Anno di costruzione"><Input {...register('builtYear')} type="number" /></FormFieldWrapper>
      <FormFieldWrapper label="Totale unità nell'edificio"><Input {...register('totalUnitsInBuilding')} type="number" /></FormFieldWrapper>
      <FormFieldWrapper label="M² utili"><Input {...register('usableAreaSqm')} type="number" /></FormFieldWrapper>

      <div className="flex items-center gap-4 sm:col-span-2">
        <Controller control={control} name="hasElevator" render={({ field }) => (
          <label className="flex items-center gap-2 text-sm"><Switch checked={field.value} onCheckedChange={field.onChange} />Ascensore</label>
        )} />
        <Controller control={control} name="hasArchitecturalBarriers" render={({ field }) => (
          <label className="flex items-center gap-2 text-sm"><Switch checked={field.value} onCheckedChange={field.onChange} />Barriere architettoniche</label>
        )} />
      </div>

      <div className="flex justify-end sm:col-span-2">
        <Button type="submit" disabled={isSubmitting}>Salva posizione</Button>
      </div>
    </form>
  )
}

export default PropertyLocationDetailSection
