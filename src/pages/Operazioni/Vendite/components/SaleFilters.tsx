import type { TFunction } from 'i18next'
import { useTranslation } from 'react-i18next'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import SelectField from '@/components/SelectField'
import SearchableSelect from '@/components/SearchableSelect'
import FormFieldWrapper from '@/components/FormFieldWrapper'
import { usePersonControllerFind, useUserControllerFind } from '@/api/generated/api'
import { getSaleStatusOptions } from '@/pages/Operazioni/Vendite/schemas/saleSchema'
import type { SaleFiltersValues } from '@/pages/Operazioni/Vendite/hooks/useSaleList'

type SaleFiltersProps = {
  filters: SaleFiltersValues
  onChange: (filters: SaleFiltersValues) => void
}

function personToOption(person: { id?: string; name: string }) {
  return { value: person.id ?? '', label: person.name }
}

function userToOption(user: { id?: string; fullName: string }) {
  return { value: user.id ?? '', label: user.fullName }
}

function SaleFilters({ filters, onChange }: SaleFiltersProps) {
  const { t } = useTranslation('operazioni')
  const { data: people } = usePersonControllerFind({ filter: { order: ['name ASC'], limit: 200 } })
  const { data: users } = useUserControllerFind({ filter: { order: ['fullName ASC'] } })

  const personOptions = (people ?? []).map(personToOption)
  const userOptions = (users ?? []).map(userToOption)

  function update(patch: Partial<SaleFiltersValues>) {
    onChange({ ...filters, ...patch })
  }

  return (
    <div className="grid w-full grid-cols-2 items-end gap-2 sm:grid-cols-4">
      <FormFieldWrapper label={t('vendite.filters.statusLabel')}>
        <SelectField
          value={filters.status}
          onValueChange={(value) => update({ status: value })}
          options={getSaleStatusOptions(t as TFunction)}
          placeholder={t('vendite.filters.all')}
        />
      </FormFieldWrapper>

      <FormFieldWrapper label={t('vendite.filters.sellerLabel')}>
        <SearchableSelect
          options={personOptions}
          value={filters.sellerId}
          onValueChange={(value) => update({ sellerId: value })}
          placeholder={t('vendite.filters.all')}
        />
      </FormFieldWrapper>

      <FormFieldWrapper label={t('vendite.filters.buyerLabel')}>
        <SearchableSelect
          options={personOptions}
          value={filters.buyerId}
          onValueChange={(value) => update({ buyerId: value })}
          placeholder={t('vendite.filters.all')}
        />
      </FormFieldWrapper>

      <FormFieldWrapper label={t('vendite.filters.sellerAgentLabel')}>
        <SearchableSelect
          options={userOptions}
          value={filters.sellerAgentId}
          onValueChange={(value) => update({ sellerAgentId: value })}
          placeholder={t('vendite.filters.all')}
        />
      </FormFieldWrapper>

      <FormFieldWrapper label={t('vendite.filters.buyerAgentLabel')}>
        <SearchableSelect
          options={userOptions}
          value={filters.buyerAgentId}
          onValueChange={(value) => update({ buyerAgentId: value })}
          placeholder={t('vendite.filters.all')}
        />
      </FormFieldWrapper>

      <FormFieldWrapper label={t('vendite.filters.saleDateFromLabel')}>
        <Input
          type="date"
          value={filters.saleDateFrom}
          onChange={(event) => update({ saleDateFrom: event.target.value })}
        />
      </FormFieldWrapper>

      <FormFieldWrapper label={t('vendite.filters.saleDateToLabel')}>
        <Input
          type="date"
          value={filters.saleDateTo}
          onChange={(event) => update({ saleDateTo: event.target.value })}
        />
      </FormFieldWrapper>

      <Label className="flex items-center gap-2 pb-2 text-sm font-normal">
        <Checkbox
          checked={filters.onlyMine}
          onCheckedChange={(checked) => update({ onlyMine: checked === true })}
        />
        {t('vendite.filters.onlyMine')}
      </Label>
    </div>
  )
}

export default SaleFilters
