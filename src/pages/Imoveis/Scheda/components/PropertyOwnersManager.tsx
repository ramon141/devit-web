import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import SearchableSelect from '@/components/SearchableSelect'
import RemovableRow from '@/components/RemovableRow'
import { usePropertyOwners } from '@/pages/Imoveis/Scheda/hooks/usePropertyOwners'
import { usePersonSearchOptions } from '@/hooks/usePersonSearchOptions'
import { getOptionLabel } from '@/utils/getOptionLabel'

type PropertyOwnersManagerProps = {
  propertyId: string
}

function PropertyOwnersManager({ propertyId }: PropertyOwnersManagerProps) {
  const { t } = useTranslation('imoveis')
  const { owners, personId, setPersonId, percent, setPercent, addOwner, removeOwner } =
    usePropertyOwners(propertyId)
  const {
    options: personOptions,
    isLoading: isLoadingPeople,
    setSearch: setPersonSearch,
  } = usePersonSearchOptions(personId)

  return (
    <div className="grid gap-3 sm:col-span-2">
      <p className="text-sm font-medium">{t('scheda.ownersManager.title')}</p>

      {owners.map((owner) => (
        <RemovableRow key={owner.id} onRemove={() => owner.id && removeOwner(owner.id)}>
          <span className="text-sm">
            {owner.person?.name ?? getOptionLabel(personOptions, owner.personId)}
            {owner.ownershipPercent != null && ` · ${owner.ownershipPercent}%`}
          </span>
        </RemovableRow>
      ))}

      <div className="flex flex-wrap items-end gap-2">
        <div className="min-w-52 flex-1">
          <SearchableSelect
            value={personId}
            onValueChange={setPersonId}
            options={personOptions}
            onSearchChange={setPersonSearch}
            isLoading={isLoadingPeople}
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
