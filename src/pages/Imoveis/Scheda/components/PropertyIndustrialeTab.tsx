import FieldHint from '@/components/FieldHint'
import { useTranslation } from 'react-i18next'
import { Separator } from '@/components/ui/separator'
import { usePropertyIndustrialForm } from '@/pages/Imoveis/Scheda/hooks/usePropertyIndustrialForm'
import IndustrialDetailFields from '@/pages/Imoveis/Scheda/components/IndustrialDetailFields'
import PropertyIndustrialAreasManager from '@/pages/Imoveis/Scheda/components/PropertyIndustrialAreasManager'
import PropertyFeaturesSection from '@/pages/Imoveis/Scheda/components/PropertyFeaturesSection'
import { getIndustrialFeatureOptions } from '@/pages/Imoveis/Scheda/schemas/featureOptions'

type PropertyIndustrialeTabProps = {
  propertyId: string
  onNext: () => void
}

function PropertyIndustrialeTab({ propertyId, onNext }: PropertyIndustrialeTabProps) {
  const { t } = useTranslation('imoveis')
  const { form, isLoading, onSubmit } = usePropertyIndustrialForm(propertyId, onNext)

  if (isLoading) return null

  return (
    <form id="property-tab-form-industriale" noValidate onSubmit={onSubmit} className="flex h-full min-h-0 flex-col">
      <div className="grid flex-1 min-h-0 content-start gap-4 overflow-y-auto p-1 pb-16 sm:grid-cols-2">
        <FieldHint className="sm:col-span-2">{t('scheda.registryNote')}</FieldHint>
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
    </form>
  )
}

export default PropertyIndustrialeTab
