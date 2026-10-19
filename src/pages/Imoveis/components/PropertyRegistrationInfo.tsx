import { useTranslation } from 'react-i18next'
import type { PropertyWithRelations } from '@/api/generated/models'
import { lastChangeText, registrationText } from '@/utils/propertyRegistration'

type PropertyRegistrationInfoProps = {
  property: PropertyWithRelations
}

function PropertyRegistrationInfo({ property }: PropertyRegistrationInfoProps) {
  const { t } = useTranslation('imoveis')
  const lastChange = lastChangeText(t, property)

  return (
    <div className="text-xs text-muted-foreground">
      <p>{registrationText(t, property)}</p>
      {lastChange && <p>{lastChange}</p>}
    </div>
  )
}

export default PropertyRegistrationInfo
