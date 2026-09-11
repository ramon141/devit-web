import type { UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Tabs, TabsContent } from '@/components/ui/tabs'
import Stepper from '@/components/Stepper'
import PropertyGeneralTab from '@/pages/Imoveis/components/PropertyGeneralTab'
import PropertyPriceTab from '@/pages/Imoveis/components/PropertyPriceTab'
import PropertyLocationTab from '@/pages/Imoveis/components/PropertyLocationTab'
import PropertyDescriptionTab from '@/pages/Imoveis/components/PropertyDescriptionTab'
import PropertyDettagliTab from '@/pages/Imoveis/Scheda/components/PropertyDettagliTab'
import PropertyCommercialeTab from '@/pages/Imoveis/Scheda/components/PropertyCommercialeTab'
import PropertyIndustrialeTab from '@/pages/Imoveis/Scheda/components/PropertyIndustrialeTab'
import PropertyTerrenoTab from '@/pages/Imoveis/Scheda/components/PropertyTerrenoTab'
import PropertyStoricoTab from '@/pages/Imoveis/Scheda/components/PropertyStoricoTab'
import PropertyTasseTab from '@/pages/Imoveis/Scheda/components/PropertyTasseTab'
import PropertyFotoTab from '@/pages/Imoveis/Scheda/components/PropertyFotoTab'
import PropertyDocumentiTab from '@/pages/Imoveis/Scheda/components/PropertyDocumentiTab'
import type { FormEvent } from 'react'
import { createPropertySchema, type PropertyFormValues } from '@/pages/Imoveis/schemas/propertySchema'
import { getNextStepValue, getPropertySteps, stepFields } from '@/pages/Imoveis/schemas/propertySteps'

type PropertyFormFieldsProps = {
  form: UseFormReturn<PropertyFormValues>
  onSubmit: (event: FormEvent) => void
  isSubmitting: boolean
  propertyId?: string
  activeTab: string
  onActiveTabChange: (value: string) => void
}

function PropertyFormFields({
  form,
  onSubmit,
  isSubmitting,
  propertyId,
  activeTab,
  onActiveTabChange,
}: PropertyFormFieldsProps) {
  const { t } = useTranslation('imoveis')

  // Só valida os campos da etapa atual; o save completo só acontece quando o
  // formulário inteiro está válido (campos obrigatórios vivem em etapas diferentes)
  async function handleNext(event: FormEvent) {
    event.preventDefault()

    const isStepValid = await form.trigger(stepFields[activeTab])
    if (!isStepValid) return

    const isFormComplete = createPropertySchema(t).safeParse(form.getValues()).success

    if (isFormComplete) {
      onSubmit(event)
      return
    }

    onActiveTabChange(getNextStepValue(t, activeTab))
  }

  const stepperSteps = getPropertySteps(t).map((step) => ({
    ...step,
    locked: step.requiresId && !propertyId,
  }))

  return (
    <Tabs value={activeTab} onValueChange={(value) => onActiveTabChange(String(value))}>
      <Stepper steps={stepperSteps} />

      <TabsContent value="generale">
        <PropertyGeneralTab form={form} onSubmit={handleNext} isSubmitting={isSubmitting} propertyId={propertyId} />
      </TabsContent>
      <TabsContent value="dettagli">
        <PropertyDettagliTab propertyId={propertyId ?? ''} />
      </TabsContent>
      <TabsContent value="foto">
        <PropertyFotoTab propertyId={propertyId ?? ''} />
      </TabsContent>
      <TabsContent value="documenti">
        <PropertyDocumentiTab propertyId={propertyId ?? ''} />
      </TabsContent>
      <TabsContent value="prezzo">
        <PropertyPriceTab form={form} onSubmit={handleNext} isSubmitting={isSubmitting} propertyId={propertyId} />
      </TabsContent>
      <TabsContent value="localizzazione">
        <PropertyLocationTab form={form} onSubmit={handleNext} isSubmitting={isSubmitting} propertyId={propertyId} />
      </TabsContent>
      <TabsContent value="descrizione">
        <PropertyDescriptionTab form={form} onSubmit={handleNext} isSubmitting={isSubmitting} propertyId={propertyId} />
      </TabsContent>
      <TabsContent value="commerciale">
        <PropertyCommercialeTab propertyId={propertyId ?? ''} />
      </TabsContent>
      <TabsContent value="industriale">
        <PropertyIndustrialeTab propertyId={propertyId ?? ''} />
      </TabsContent>
      <TabsContent value="terreno">
        <PropertyTerrenoTab propertyId={propertyId ?? ''} />
      </TabsContent>
      <TabsContent value="tasse">
        <PropertyTasseTab propertyId={propertyId ?? ''} />
      </TabsContent>
      <TabsContent value="storico">
        {propertyId && <PropertyStoricoTab propertyId={propertyId} />}
      </TabsContent>
    </Tabs>
  )
}

export default PropertyFormFields
