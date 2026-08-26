import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import SearchableSelect from '@/components/SearchableSelect'
import RemovableRow from '@/components/RemovableRow'
import { usePersonControllerFind } from '@/api/generated/api'
import { usePropertyOwners } from '@/pages/Imoveis/Scheda/hooks/usePropertyOwners'

type PropertyOwnersManagerProps = {
  propertyId: string
}

function PropertyOwnersManager({ propertyId }: PropertyOwnersManagerProps) {
  const { t } = useTranslation('imoveis')
  const { owners, personId, setPersonId, percent, setPercent, addOwner, removeOwner } =
    usePropertyOwners(propertyId)
  const { data: people } = usePersonControllerFind({ filter: { order: ['name ASC'], limit: 200 } })
  const personOptions = (people ?? []).map((person) => ({ value: person.id ?? '', label: person.name }))

  return (
    <div className="grid gap-3 sm:col-span-2">
      <p className="text-sm font-medium">{t('scheda.ownersManager.title')}</p>

      {owners.map((owner) => (
        <RemovableRow key={owner.id} onRemove={() => owner.id && removeOwner(owner.id)}>
          <span className="text-sm">
            {owner.person?.name} {owner.ownershipPercent != null && `· ${owner.ownershipPercent}%`}
          </span>
        </RemovableRow>
      ))}

      <div className="flex flex-wrap items-end gap-2">
        <div className="min-w-52 flex-1">
          <SearchableSelect
            value={personId}
            onValueChange={setPersonId}
            options={personOptions}
            placeholder={t('scheda.ownersManager.ownerPlaceholder')}
            searchPlaceholder={t('scheda.ownersManager.searchClientPlaceholder')}
          />
        </div>
        <Input
          value={percent}
          onChange={(event) => setPercent(event.target.value)}
          type="number"
          placeholder={t('scheda.ownersManager.percentPlaceholder')}
          className="w-28"
        />
        <Button type="button" onClick={addOwner}>
          {t('scheda.ownersManager.add')}
        </Button>
      </div>
    </div>
  )
}

export default PropertyOwnersManager
