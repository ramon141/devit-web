import { useTranslation } from 'react-i18next'
import type { TFunction } from 'i18next'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import SelectField from '@/components/SelectField'
import SearchableSelect from '@/components/SearchableSelect'
import FormFieldWrapper from '@/components/FormFieldWrapper'
import { usePersonControllerFind, useUserControllerFind } from '@/api/generated/api'
import { getRentalSituationOptions } from '@/pages/Operazioni/Locazioni/schemas/rentalContractSchema'
import type { RentalContractFiltersValues } from '@/pages/Operazioni/Locazioni/hooks/useRentalContractList'

type RentalFiltersProps = {
  filters: RentalContractFiltersValues
  onChange: (filters: RentalContractFiltersValues) => void
}

function personToOption(person: { id?: string; name: string }) {
  return { value: person.id ?? '', label: person.name }
}

function userToOption(user: { id?: string; fullName: string }) {
  return { value: user.id ?? '', label: user.fullName }
}

function RentalFilters({ filters, onChange }: RentalFiltersProps) {
  const { t } = useTranslation('operazioni')
  const { data: people } = usePersonControllerFind({ filter: { order: ['name ASC'], limit: 200 } })
  const { data: users } = useUserControllerFind({ filter: { order: ['fullName ASC'] } })

  const personOptions = (people ?? []).map(personToOption)
  const userOptions = (users ?? []).map(userToOption)

  function update(patch: Partial<RentalContractFiltersValues>) {
    onChange({ ...filters, ...patch })
  }

  return (
    <div className="grid w-full grid-cols-2 items-end gap-2 sm:grid-cols-4">
      <FormFieldWrapper label={t('locazioni.filters.situationLabel')}>
        <SelectField
          value={filters.situation}
          onValueChange={(value) => update({ situation: value })}
          options={getRentalSituationOptions(t as TFunction)}
          placeholder={t('locazioni.filters.all')}
        />
      </FormFieldWrapper>

      <FormFieldWrapper label={t('locazioni.filters.ownerLabel')}>
        <SearchableSelect
          options={personOptions}
          value={filters.ownerId}
          onValueChange={(value) => update({ ownerId: value })}
          placeholder={t('locazioni.filters.all')}
        />
      </FormFieldWrapper>

      <FormFieldWrapper label={t('locazioni.filters.tenantLabel')}>
        <SearchableSelect
          options={personOptions}
          value={filters.tenantId}
          onValueChange={(value) => update({ tenantId: value })}
          placeholder={t('locazioni.filters.all')}
        />
      </FormFieldWrapper>

      <FormFieldWrapper label={t('locazioni.filters.ownerAgentLabel')}>
        <SearchableSelect
          options={userOptions}
          value={filters.ownerAgentId}
          onValueChange={(value) => update({ ownerAgentId: value })}
          placeholder={t('locazioni.filters.all')}
        />
      </FormFieldWrapper>

      <FormFieldWrapper label={t('locazioni.filters.tenantAgentLabel')}>
        <SearchableSelect
          options={userOptions}
          value={filters.tenantAgentId}
          onValueChange={(value) => update({ tenantAgentId: value })}
          placeholder={t('locazioni.filters.all')}
        />
      </FormFieldWrapper>

      <FormFieldWrapper label={t('locazioni.filters.stipulaDateFromLabel')}>
        <Input
          type="date"
          value={filters.stipulaDateFrom}
          onChange={(event) => update({ stipulaDateFrom: event.target.value })}
        />
      </FormFieldWrapper>

      <FormFieldWrapper label={t('locazioni.filters.stipulaDateToLabel')}>
        <Input
          type="date"
          value={filters.stipulaDateTo}
          onChange={(event) => update({ stipulaDateTo: event.target.value })}
        />
      </FormFieldWrapper>

      <FormFieldWrapper label={t('locazioni.filters.startDateFromLabel')}>
        <Input
          type="date"
          value={filters.startDateFrom}
          onChange={(event) => update({ startDateFrom: event.target.value })}
        />
      </FormFieldWrapper>

      <FormFieldWrapper label={t('locazioni.filters.startDateToLabel')}>
        <Input
          type="date"
          value={filters.startDateTo}
          onChange={(event) => update({ startDateTo: event.target.value })}
        />
      </FormFieldWrapper>

      <Label className="flex items-center gap-2 pb-2 text-sm font-normal">
        <Checkbox
          checked={filters.onlyMine}
          onCheckedChange={(checked) => update({ onlyMine: checked === true })}
        />
        {t('locazioni.filters.onlyMine')}
      </Label>
    </div>
  )
}

export default RentalFilters
