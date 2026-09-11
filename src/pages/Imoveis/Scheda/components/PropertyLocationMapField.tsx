import { useTranslation } from 'react-i18next'
import MapPicker from '@/components/MapPicker'
import { toNumberOrNull } from '@/utils/toNumberOrNull'

type PropertyLocationMapFieldProps = {
  latitude: string
  longitude: string
  onSelect: (coords: { latitude: number; longitude: number }) => void
}

function PropertyLocationMapField({ latitude, longitude, onSelect }: PropertyLocationMapFieldProps) {
  const { t } = useTranslation('imoveis')

  return (
    <div className="grid gap-2 sm:col-span-2">
      <p className="text-xs text-muted-foreground">{t('scheda.locationDetailSection.mapHint')}</p>

      <MapPicker
        latitude={toNumberOrNull(latitude)}
        longitude={toNumberOrNull(longitude)}
        onChange={onSelect}
      />
    </div>
  )
}

export default PropertyLocationMapField
