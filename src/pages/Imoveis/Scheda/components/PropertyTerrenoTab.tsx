import type { FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { Separator } from '@/components/ui/separator'
import PropertyFormFooter from '@/pages/Imoveis/components/PropertyFormFooter'
import { usePropertyLandForm } from '@/pages/Imoveis/Scheda/hooks/usePropertyLandForm'
import LandDetailFields from '@/pages/Imoveis/Scheda/components/LandDetailFields'
import PropertyFeaturesSection from '@/pages/Imoveis/Scheda/components/PropertyFeaturesSection'
import { getLandFeatureOptions } from '@/pages/Imoveis/Scheda/schemas/featureOptions'

type PropertyTerrenoTabProps = {
  propertyId: string
  onBack?: () => void
  onNext: () => void
}

function PropertyTerrenoTab({ propertyId, onBack, onNext }: PropertyTerrenoTabProps) {
  const { t } = useTranslation('imoveis')
  const { form, isLoading, isSubmitting, onSubmit } = usePropertyLandForm(propertyId)

  // Salva e avança para a próxima etapa
  function handleSubmit(event: FormEvent) {
    onSubmit(event)
    onNext()
  }

  if (isLoading) return null

  return (
    <form onSubmit={handleSubmit} className="flex h-full min-h-0 flex-col">
      <div className="grid flex-1 min-h-0 gap-4 overflow-y-auto p-1 sm:grid-cols-2">
        <LandDetailFields form={form} />

        <Separator className="sm:col-span-2" />
        <PropertyFeaturesSection
          propertyId={propertyId}
          category="land"
          title={t('scheda.terrenoTab.otherDataTitle')}
          options={getLandFeatureOptions(t)}
        />
      </div>

      <PropertyFormFooter
        id="property-tab-terreno-actions"
        isSubmitting={isSubmitting}
        onBack={onBack}
      />
    </form>
  )
}

export default PropertyTerrenoTab
