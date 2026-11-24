import type { UseFormReturn } from 'react-hook-form'
import { useNavigate } from 'react-router'
import { useTranslation } from 'react-i18next'
import { Auth, UserInfo } from '@/auth'
import { propertyControllerFind } from '@/api/generated/api'
import type { PropertyWithRelations } from '@/api/generated/models'
import PropertyBrokerHeader from '@/pages/Imoveis/components/PropertyBrokerHeader'
import { cn } from '@/lib/utils'
import { Tabs, TabsContent } from '@/components/ui/tabs'
import { usePropertyRequiredFields, type RequiredField } from '@/pages/Imoveis/hooks/usePropertyRequiredFields'
import PropertySectionsSidebar from '@/pages/Imoveis/components/PropertySectionsSidebar'
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
import { usePropertySaveMode } from '@/pages/Imoveis/contexts/PropertySaveModeContext'
import { createPropertySchema, type PropertyFormValues } from '@/pages/Imoveis/schemas/propertySchema'
import { getNextStepValue, getPropertySteps, stepFields } from '@/pages/Imoveis/schemas/propertySteps'

type PropertyFormFieldsProps = {
  form: UseFormReturn<PropertyFormValues>
  onSubmit: (event?: FormEvent) => void
  isSubmitting: boolean
  propertyId?: string
  property?: PropertyWithRelations
  responsibleBrokerId?: string
  activeTab: string
  onActiveTabChange: (value: string) => void
}

const INDEPENDENT_TABS = ['dettagli', 'commerciale', 'industriale', 'terreno']

function PropertyFormFields({
  form,
  onSubmit,
  isSubmitting,
  propertyId,
  property,
  responsibleBrokerId,
  activeTab,
  onActiveTabChange,
}: PropertyFormFieldsProps) {
  const { t } = useTranslation('imoveis')
  const navigate = useNavigate()
  const saveMode = usePropertySaveMode()
  const canSeeInternalNote =
    !propertyId || Auth.isAdmin() || responsibleBrokerId === UserInfo.getUserId()

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

  const requiredFields = usePropertyRequiredFields(form.control)

  // Leva até a etapa do campo pendente e dá foco nele
  function focusField(item: RequiredField) {
    onActiveTabChange(item.stepValue)

    setTimeout(() => {
      const element = document.getElementById(`property-field-${item.field}`)

      element?.scrollIntoView({ block: 'center' })
      element?.querySelector<HTMLElement>('input, textarea, button')?.focus()
    }, 100)
  }

  // Salvar da lateral: com dados faltando, abre a etapa do primeiro erro
  function handleSidebarSave() {
    const tabForm = document.getElementById(`property-tab-form-${activeTab}`)

    // Etapas com formulário próprio (detalhes, comercial...) gravam pelo próprio formulário
    if (INDEPENDENT_TABS.includes(activeTab) && tabForm instanceof HTMLFormElement) {
      if (saveMode) saveMode.stayRef.current = true

      tabForm.requestSubmit()
      return
    }

    const parsed = createPropertySchema(t).safeParse(form.getValues())

    if (!parsed.success) {
      goToInvalidStep(String(parsed.error.issues[0]?.path[0]))
      return
    }

    if (saveMode) saveMode.stayRef.current = true

    onSubmit()
  }

  const steps = getPropertySteps(t)

  const sections = steps.map((step) => ({
    ...step,
    locked: step.requiresId && !propertyId,
  }))

  const tabContentClassName =
    'flex-1 min-h-0 overflow-y-auto animate-in fade-in slide-in-from-bottom-2 duration-300'

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4 lg:flex-row">
      <div className="flex min-h-0 min-w-0 flex-1 flex-col rounded-xl bg-card px-4 pt-4 ring-1 ring-border">
        <h2 className="mb-4 shrink-0 text-sm font-bold text-foreground">
          {sections.find((section) => section.value === activeTab)?.label}
        </h2>

        <Tabs value={activeTab} onValueChange={(value) => onActiveTabChange(String(value))} className="min-w-0 flex-1 min-h-0">

          <TabsContent value="generale" className={tabContentClassName}>
            <PropertyGeneralTab form={form} onSubmit={handleNext} propertyId={propertyId} />
          </TabsContent>
          <TabsContent value="dettagli" className={tabContentClassName}>
            <PropertyDettagliTab
              propertyId={propertyId ?? ''}
              canSeeInternalNote={canSeeInternalNote}
              onNext={goToNextStep}
            />
          </TabsContent>
          <TabsContent value="foto" className={cn(tabContentClassName, 'p-1 pb-16')}>
            <PropertyFotoTab propertyId={propertyId ?? ''} />
          </TabsContent>
          <TabsContent value="documenti" className={cn(tabContentClassName, 'p-1 pb-16')}>
            <PropertyDocumentiTab propertyId={propertyId ?? ''} />
          </TabsContent>
          <TabsContent value="prezzo" className={tabContentClassName}>
            <PropertyPriceTab form={form} onSubmit={handleNext} propertyId={propertyId} />
          </TabsContent>
          <TabsContent value="localizzazione" className={tabContentClassName}>
            <PropertyLocationTab form={form} onSubmit={handleNext} propertyId={propertyId} />
          </TabsContent>
          <TabsContent value="descrizione" className={tabContentClassName}>
            <PropertyDescriptionTab form={form} onSubmit={handleNext} propertyId={propertyId} />
          </TabsContent>
          <TabsContent value="commerciale" className={tabContentClassName}>
            <PropertyCommercialeTab propertyId={propertyId ?? ''} onNext={goToNextStep} />
          </TabsContent>
          <TabsContent value="industriale" className={tabContentClassName}>
            <PropertyIndustrialeTab propertyId={propertyId ?? ''} onNext={goToNextStep} />
          </TabsContent>
          <TabsContent value="terreno" className={tabContentClassName}>
            <PropertyTerrenoTab propertyId={propertyId ?? ''} onNext={goToNextStep} />
          </TabsContent>
          <TabsContent value="tasse" className={cn(tabContentClassName, 'p-1 pb-16')}>
            <PropertyTasseTab propertyId={propertyId ?? ''} />
          </TabsContent>
          <TabsContent value="trasferimento" className={cn(tabContentClassName, 'p-1 pb-16')}>
            {property && (
              <PropertyBrokerHeader property={property} />
            )}
          </TabsContent>
          <TabsContent value="storico" className={cn(tabContentClassName, 'p-1 pb-16')}>
            {propertyId && <PropertyStoricoTab propertyId={propertyId} />}
          </TabsContent>
        </Tabs>
      </div>

      <PropertySectionsSidebar
        sections={sections}
        activeValue={activeTab}
        requiredFields={requiredFields.fields}
        isSubmitting={isSubmitting}
        onSelect={onActiveTabChange}
        onFocusField={focusField}
        onCancel={() => navigate('/gestionale/proprieta')}
        onSave={handleSidebarSave}
      />
    </div>
  )
}

export default PropertyFormFields
