import type { UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Separator } from '@/components/ui/separator'
import PropertyAdditionalSection from '@/pages/Imoveis/Scheda/components/PropertyAdditionalSection'
import PropertyRoomsManager from '@/pages/Imoveis/Scheda/components/PropertyRoomsManager'
import PropertyHeatingSection from '@/pages/Imoveis/Scheda/components/PropertyHeatingSection'
import PropertyCadastralSection from '@/pages/Imoveis/Scheda/components/PropertyCadastralSection'
import PropertyFeaturesSection from '@/pages/Imoveis/Scheda/components/PropertyFeaturesSection'
import { getAmenityOptions, getNeighborhoodOptions } from '@/pages/Imoveis/Scheda/schemas/featureOptions'
import type { AdditionalFormValues } from '@/pages/Imoveis/Scheda/hooks/usePropertyAdditionalForm'
import type { HeatingFormValues } from '@/pages/Imoveis/Scheda/hooks/usePropertyHeatingForm'
import type { CadastralFormValues } from '@/pages/Imoveis/Scheda/hooks/usePropertyCadastralForm'

type PropertyDescrizioneTabProps = {
  propertyId: string
  additionalForm: UseFormReturn<AdditionalFormValues>
  heatingForm: UseFormReturn<HeatingFormValues>
  cadastralForm: UseFormReturn<CadastralFormValues>
  isLoadingDetail: boolean
}

function PropertyDescrizioneTab({
  propertyId,
  additionalForm,
  heatingForm,
  cadastralForm,
  isLoadingDetail,
}: PropertyDescrizioneTabProps) {
  const { t } = useTranslation('imoveis')

  if (isLoadingDetail) return null

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <PropertyAdditionalSection form={additionalForm} />
      <Separator className="sm:col-span-2" />
      <PropertyRoomsManager propertyId={propertyId} />
      <Separator className="sm:col-span-2" />
      <PropertyHeatingSection form={heatingForm} />
      <Separator className="sm:col-span-2" />
      <PropertyCadastralSection form={cadastralForm} />
      <Separator className="sm:col-span-2" />
      <PropertyFeaturesSection
        propertyId={propertyId}
        category="amenity"
        title={t('scheda.descrizioneTab.otherDataTitle')}
        options={getAmenityOptions(t)}
      />
      <PropertyFeaturesSection
        propertyId={propertyId}
        category="neighborhood"
        title={t('scheda.descrizioneTab.neighborhoodTitle')}
        options={getNeighborhoodOptions(t)}
      />
    </div>
  )
}

export default PropertyDescrizioneTab
