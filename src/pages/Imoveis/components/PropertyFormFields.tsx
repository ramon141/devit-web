import type { UseFormReturn } from 'react-hook-form'
import { useNavigate } from 'react-router'
import { useTranslation } from 'react-i18next'
import { propertyControllerFind } from '@/api/generated/api'
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
import { usePropertySaveMode } from '@/pages/Imoveis/contexts/PropertySaveModeContext'
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
  const saveMode = usePropertySaveMode()

  // Só valida os campos da etapa atual; o save completo só acontece quando o
  // formulário inteiro está válido (campos obrigatórios vivem em etapas diferentes)
  async function isCodeTaken() {
    if (activeTab !== 'generale' || propertyId) return false

    const code = form.getValues('code')
    const found = await propertyControllerFind({ filter: { where: { code }, fields: { id: true }, limit: 1 } })
    if (found.length === 0) return false

    form.setError('code', { message: t('generalTab.codeExists') })
    return true
  }

  async function handleNext(event: FormEvent) {
    event.preventDefault()

    const isStepValid = await form.trigger(stepFields[activeTab])
    if (!isStepValid || (await isCodeTaken())) return

    const parsed = createPropertySchema(t).safeParse(form.getValues())

    if (parsed.success) {
      onSubmit(event)
      return
    }

    if (saveMode?.stayRef.current) {
      saveMode.stayRef.current = false
      goToInvalidStep(String(parsed.error.issues[0]?.path[0]))
      return
    }

    goToNextStep()
  }

  // Salvar com dados faltando em outra etapa: leva o usuário até o campo com erro
  function goToInvalidStep(field: string) {
    const stepValue = Object.entries(stepFields).find(([, fields]) => fields.some((f) => f === field))?.[0]

    if (stepValue) onActiveTabChange(stepValue)

    form.trigger()
  }

  // "Salvar" mantém a etapa atual aberta; "Próximo" avança
  function goToNextStep() {
    if (saveMode?.stayRef.current) {
      saveMode.stayRef.current = false
      return
    }

    onActiveTabChange(getNextStepValue(t, activeTab))
  }

  const steps = getPropertySteps(t)
  const isFirstStep = steps[0]?.value === activeTab
  const handleBack = isFirstStep
    ? undefined
    : () => onActiveTabChange(getPreviousStepValue(t, activeTab))

  const stepperSteps = steps.map((step) => ({
    ...step,
    locked: step.requiresId && !propertyId,
  }))

  const tabContentClassName = 'flex-1 min-h-0 overflow-y-auto'

  return (
    <Tabs value={activeTab} onValueChange={(value) => onActiveTabChange(String(value))} className="flex-1 min-h-0">
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
            finishLabelKey="formFields.close"
            skipSavedToast
          >
            <PropertyStoricoTab propertyId={propertyId} />
          </PropertyStepFrame>
        )}
      </TabsContent>
    </Tabs>
  )
}

export default PropertyFormFields
