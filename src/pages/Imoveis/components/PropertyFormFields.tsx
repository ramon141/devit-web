import type { UseFormReturn } from 'react-hook-form'
import { useNavigate } from 'react-router'
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
import PropertyStepFrame from '@/pages/Imoveis/components/PropertyStepFrame'
import PropertyDocumentiTab from '@/pages/Imoveis/Scheda/components/PropertyDocumentiTab'
import type { FormEvent } from 'react'
import { createPropertySchema, type PropertyFormValues } from '@/pages/Imoveis/schemas/propertySchema'
import { getNextStepValue, getPreviousStepValue, getPropertySteps, stepFields } from '@/pages/Imoveis/schemas/propertySteps'

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
  const navigate = useNavigate()

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

  const goToNextStep = () => onActiveTabChange(getNextStepValue(t, activeTab))

  const steps = getPropertySteps(t)
  const isFirstStep = steps[0]?.value === activeTab
  const handleBack = isFirstStep
    ? undefined
    : () => onActiveTabChange(getPreviousStepValue(t, activeTab))

  const stepperSteps = steps.map((step) => ({
    ...step,
    locked: step.requiresId && !propertyId,
  }))

  const tabContentClassName = 'h-full min-h-0 overflow-y-auto'

  return (
    <Tabs value={activeTab} onValueChange={(value) => onActiveTabChange(String(value))} className="h-full min-h-0">
      <Stepper steps={stepperSteps} />

      <TabsContent value="generale" className={tabContentClassName}>
        <PropertyGeneralTab form={form} onSubmit={handleNext} isSubmitting={isSubmitting} propertyId={propertyId} onBack={handleBack} />
      </TabsContent>
      <TabsContent value="dettagli" className={tabContentClassName}>
        <PropertyDettagliTab propertyId={propertyId ?? ''} onBack={handleBack} onNext={goToNextStep} />
      </TabsContent>
      <TabsContent value="foto" className={tabContentClassName}>
        <PropertyStepFrame id="property-tab-foto-actions" onBack={handleBack} onNext={goToNextStep}>
          <PropertyFotoTab propertyId={propertyId ?? ''} />
        </PropertyStepFrame>
      </TabsContent>
      <TabsContent value="documenti" className={tabContentClassName}>
        <PropertyStepFrame id="property-tab-documenti-actions" onBack={handleBack} onNext={goToNextStep}>
          <PropertyDocumentiTab propertyId={propertyId ?? ''} />
        </PropertyStepFrame>
      </TabsContent>
      <TabsContent value="prezzo" className={tabContentClassName}>
        <PropertyPriceTab form={form} onSubmit={handleNext} isSubmitting={isSubmitting} propertyId={propertyId} onBack={handleBack} />
      </TabsContent>
      <TabsContent value="localizzazione" className={tabContentClassName}>
        <PropertyLocationTab form={form} onSubmit={handleNext} isSubmitting={isSubmitting} propertyId={propertyId} onBack={handleBack} />
      </TabsContent>
      <TabsContent value="descrizione" className={tabContentClassName}>
        <PropertyDescriptionTab form={form} onSubmit={handleNext} isSubmitting={isSubmitting} propertyId={propertyId} onBack={handleBack} />
      </TabsContent>
      <TabsContent value="commerciale" className={tabContentClassName}>
        <PropertyCommercialeTab propertyId={propertyId ?? ''} onBack={handleBack} onNext={goToNextStep} />
      </TabsContent>
      <TabsContent value="industriale" className={tabContentClassName}>
        <PropertyIndustrialeTab propertyId={propertyId ?? ''} onBack={handleBack} onNext={goToNextStep} />
      </TabsContent>
      <TabsContent value="terreno" className={tabContentClassName}>
        <PropertyTerrenoTab propertyId={propertyId ?? ''} onBack={handleBack} onNext={goToNextStep} />
      </TabsContent>
      <TabsContent value="tasse" className={tabContentClassName}>
        <PropertyStepFrame id="property-tab-tasse-actions" onBack={handleBack} onNext={goToNextStep}>
          <PropertyTasseTab propertyId={propertyId ?? ''} />
        </PropertyStepFrame>
      </TabsContent>
      <TabsContent value="storico" className={tabContentClassName}>
        {propertyId && (
          <PropertyStepFrame id="property-tab-storico-actions"
            onBack={handleBack}
            onNext={() => navigate('/gestionale/proprieta')}
            isLast
          >
            <PropertyStoricoTab propertyId={propertyId} />
          </PropertyStepFrame>
        )}
      </TabsContent>
    </Tabs>
  )
}

export default PropertyFormFields
