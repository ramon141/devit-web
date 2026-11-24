import FieldHint from '@/components/FieldHint'
import { useTranslation } from 'react-i18next'
import { Separator } from '@/components/ui/separator'
import { usePropertyLandForm } from '@/pages/Imoveis/Scheda/hooks/usePropertyLandForm'
import LandDetailFields from '@/pages/Imoveis/Scheda/components/LandDetailFields'
import PropertyFeaturesSection from '@/pages/Imoveis/Scheda/components/PropertyFeaturesSection'
import { getLandFeatureOptions } from '@/pages/Imoveis/Scheda/schemas/featureOptions'

type PropertyTerrenoTabProps = {
  propertyId: string
  onNext: () => void
}

function PropertyTerrenoTab({ propertyId, onNext }: PropertyTerrenoTabProps) {
  const { t } = useTranslation('imoveis')
  const { form, isLoading, onSubmit } = usePropertyLandForm(propertyId, onNext)

  if (isLoading) return null

  return (
    <form id="property-tab-form-terreno" noValidate onSubmit={onSubmit} className="flex h-full min-h-0 flex-col">
      <div className="grid flex-1 min-h-0 content-start gap-4 overflow-y-auto p-1 pb-16 sm:grid-cols-2">
        <FieldHint className="sm:col-span-2">{t('scheda.registryNote')}</FieldHint>
        <LandDetailFields form={form} />

        <Separator className="sm:col-span-2" />
        <PropertyFeaturesSection
          propertyId={propertyId}
          category="land"
          title={t('scheda.terrenoTab.otherDataTitle')}
          options={getLandFeatureOptions(t)}
        />
      </div>
    </form>
  )
}

export default PropertyTerrenoTab
