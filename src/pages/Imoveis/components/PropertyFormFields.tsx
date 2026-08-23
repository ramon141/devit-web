import type { UseFormReturn } from 'react-hook-form'
import { Tabs, TabsContent } from '@/components/ui/tabs'
import PropertyStepper from '@/pages/Imoveis/components/PropertyStepper'
import PropertyGeneralTab from '@/pages/Imoveis/components/PropertyGeneralTab'
import PropertyPriceTab from '@/pages/Imoveis/components/PropertyPriceTab'
import PropertyLocationTab from '@/pages/Imoveis/components/PropertyLocationTab'
import PropertyDescriptionTab from '@/pages/Imoveis/components/PropertyDescriptionTab'
import PropertyDettagliTab from '@/pages/Imoveis/Scheda/components/PropertyDettagliTab'
import PropertyCommercialeTab from '@/pages/Imoveis/Scheda/components/PropertyCommercialeTab'
import PropertyIndustrialeTab from '@/pages/Imoveis/Scheda/components/PropertyIndustrialeTab'
import PropertyTerrenoTab from '@/pages/Imoveis/Scheda/components/PropertyTerrenoTab'
import PropertyStoricoTab from '@/pages/Imoveis/Scheda/components/PropertyStoricoTab'
import type { PropertyFormValues } from '@/pages/Imoveis/schemas/propertySchema'

type PropertyFormFieldsProps = {
  form: UseFormReturn<PropertyFormValues>
  onSubmit: () => void
  isSubmitting: boolean
  propertyId?: string
}

const steps = [
  { value: 'generale', label: 'Generale', step: 1, requiresId: false },
  { value: 'prezzo', label: 'Prezzo', step: 2, requiresId: false },
  { value: 'localizzazione', label: 'Localizzazione', step: 3, requiresId: false },
  { value: 'descrizione', label: 'Descrizione', step: 4, requiresId: false },
  { value: 'dettagli', label: 'Dettagli', step: 5, requiresId: true },
  { value: 'commerciale', label: 'Commerciale', step: 6, requiresId: true },
  { value: 'industriale', label: 'Industriale', step: 7, requiresId: true },
  { value: 'terreno', label: 'Terreno', step: 8, requiresId: true },
  { value: 'storico', label: 'Storico', step: 9, requiresId: true },
]

function PropertyFormFields({ form, onSubmit, isSubmitting, propertyId }: PropertyFormFieldsProps) {
  const stepperSteps = steps.map((step) => ({
    ...step,
    locked: step.requiresId && !propertyId,
  }))

  return (
    <Tabs defaultValue="generale">
      <PropertyStepper steps={stepperSteps} />

      <TabsContent value="generale">
        <PropertyGeneralTab form={form} onSubmit={onSubmit} isSubmitting={isSubmitting} propertyId={propertyId} />
      </TabsContent>
      <TabsContent value="dettagli">
        {propertyId && <PropertyDettagliTab propertyId={propertyId} />}
      </TabsContent>
      <TabsContent value="prezzo">
        <PropertyPriceTab form={form} onSubmit={onSubmit} isSubmitting={isSubmitting} propertyId={propertyId} />
      </TabsContent>
      <TabsContent value="localizzazione">
        <PropertyLocationTab form={form} onSubmit={onSubmit} isSubmitting={isSubmitting} propertyId={propertyId} />
      </TabsContent>
      <TabsContent value="descrizione">
        <PropertyDescriptionTab form={form} onSubmit={onSubmit} isSubmitting={isSubmitting} propertyId={propertyId} />
      </TabsContent>
      <TabsContent value="commerciale">
        {propertyId && <PropertyCommercialeTab propertyId={propertyId} />}
      </TabsContent>
      <TabsContent value="industriale">
        {propertyId && <PropertyIndustrialeTab propertyId={propertyId} />}
      </TabsContent>
      <TabsContent value="terreno">
        {propertyId && <PropertyTerrenoTab propertyId={propertyId} />}
      </TabsContent>
      <TabsContent value="storico">
        {propertyId && <PropertyStoricoTab propertyId={propertyId} />}
      </TabsContent>
    </Tabs>
  )
}

export default PropertyFormFields
