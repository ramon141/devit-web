import type { FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { Separator } from '@/components/ui/separator'
import PropertyFormFooter from '@/pages/Imoveis/components/PropertyFormFooter'
import { usePropertyIndustrialForm } from '@/pages/Imoveis/Scheda/hooks/usePropertyIndustrialForm'
import IndustrialDetailFields from '@/pages/Imoveis/Scheda/components/IndustrialDetailFields'
import PropertyIndustrialAreasManager from '@/pages/Imoveis/Scheda/components/PropertyIndustrialAreasManager'
import PropertyFeaturesSection from '@/pages/Imoveis/Scheda/components/PropertyFeaturesSection'
import { getIndustrialFeatureOptions } from '@/pages/Imoveis/Scheda/schemas/featureOptions'

type PropertyIndustrialeTabProps = {
  propertyId: string
  onBack?: () => void
  onNext: () => void
}

function PropertyIndustrialeTab({ propertyId, onBack, onNext }: PropertyIndustrialeTabProps) {
  const { t } = useTranslation('imoveis')
  const { form, isLoading, isSubmitting, onSubmit } = usePropertyIndustrialForm(propertyId)

  // Salva e avança para a próxima etapa
  function handleSubmit(event: FormEvent) {
    onSubmit(event)
    onNext()
  }

  if (isLoading) return null

  return (
    <form onSubmit={handleSubmit} className="flex h-full min-h-0 flex-col">
      <div className="grid flex-1 min-h-0 gap-4 overflow-y-auto p-1 sm:grid-cols-2">
        <IndustrialDetailFields form={form} />

        <Separator className="sm:col-span-2" />
        <PropertyIndustrialAreasManager propertyId={propertyId} />

        <Separator className="sm:col-span-2" />
        <PropertyFeaturesSection
          propertyId={propertyId}
          category="industrial"
          title={t('scheda.industrialeTab.otherDataTitle')}
          options={getIndustrialFeatureOptions(t)}
        />
      </div>

      <PropertyFormFooter
        id="property-tab-industriale-actions"
        isSubmitting={isSubmitting}
        onBack={onBack}
      />
    </form>
  )
}

export default PropertyIndustrialeTab
