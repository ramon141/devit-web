import { useTranslation } from 'react-i18next'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import SelectField from '@/components/SelectField'
import SearchableSelect from '@/components/SearchableSelect'
import FormFieldWrapper from '@/components/FormFieldWrapper'
import {
  usePersonControllerFind,
  usePropertyControllerFind,
  useUserControllerFind,
} from '@/api/generated/api'
import { getProposalStatusOptions } from '@/pages/Proposte/schemas/proposalSchema'
import type { ProposalFiltersValues } from '@/pages/Proposte/hooks/useProposalList'

type ProposalFiltersProps = {
  filters: ProposalFiltersValues
  onChange: (filters: ProposalFiltersValues) => void
}

function ProposalFilters({ filters, onChange }: ProposalFiltersProps) {
  const { t } = useTranslation('proposte')
  const { data: properties } = usePropertyControllerFind({ filter: { order: ['code ASC'], limit: 200 } })
  const { data: people } = usePersonControllerFind({ filter: { order: ['name ASC'], limit: 200 } })
  const { data: users } = useUserControllerFind({ filter: { order: ['fullName ASC'] } })

  const propertyOptions = (properties ?? []).map((property) => ({
    value: property.id ?? '',
    label: `${property.code} · ${property.title}`,
  }))
  const buyerOptions = (people ?? []).map((person) => ({ value: person.id ?? '', label: person.name }))
  const userOptions = (users ?? []).map((user) => ({ value: user.id ?? '', label: user.fullName }))
  const financedOptions = [
    { value: 'true', label: t('filters.financedYes') },
    { value: 'false', label: t('filters.financedNo') },
  ]

  function update(patch: Partial<ProposalFiltersValues>) {
    onChange({ ...filters, ...patch })
  }

  return (
    <div className="grid w-full grid-cols-2 items-end gap-2 sm:grid-cols-4">
      <FormFieldWrapper label={t('filters.statusLabel')}>
        <SelectField
          value={filters.status}
          onValueChange={(value) => update({ status: value })}
          options={getProposalStatusOptions(t)}
          placeholder={t('filters.all')}
        />
      </FormFieldWrapper>

      <FormFieldWrapper label={t('filters.financedLabel')}>
        <SelectField
          value={filters.financed}
          onValueChange={(value) => update({ financed: value })}
          options={financedOptions}
          placeholder={t('filters.all')}
        />
      </FormFieldWrapper>

      <FormFieldWrapper label={t('filters.propertyLabel')}>
        <SearchableSelect
          options={propertyOptions}
          value={filters.propertyId}
          onValueChange={(value) => update({ propertyId: value })}
          placeholder={t('filters.all')}
        />
      </FormFieldWrapper>

      <FormFieldWrapper label={t('filters.buyerLabel')}>
        <SearchableSelect
          options={buyerOptions}
          value={filters.buyerId}
          onValueChange={(value) => update({ buyerId: value })}
          placeholder={t('filters.all')}
        />
      </FormFieldWrapper>

      <FormFieldWrapper label={t('filters.sellerAgentLabel')}>
        <SearchableSelect
          options={userOptions}
          value={filters.sellerAgentId}
          onValueChange={(value) => update({ sellerAgentId: value })}
          placeholder={t('filters.all')}
        />
      </FormFieldWrapper>

      <FormFieldWrapper label={t('filters.assignedToLabel')}>
        <SearchableSelect
          options={userOptions}
          value={filters.assignedToId}
          onValueChange={(value) => update({ assignedToId: value })}
          placeholder={t('filters.all')}
        />
      </FormFieldWrapper>

      <FormFieldWrapper label={t('filters.proposalDateFromLabel')}>
        <Input
          type="date"
          value={filters.proposalDateFrom}
          onChange={(event) => update({ proposalDateFrom: event.target.value })}
        />
      </FormFieldWrapper>

      <FormFieldWrapper label={t('filters.proposalDateToLabel')}>
        <Input
          type="date"
          value={filters.proposalDateTo}
          onChange={(event) => update({ proposalDateTo: event.target.value })}
        />
      </FormFieldWrapper>

      <Label className="flex items-center gap-2 pb-2 text-sm font-normal">
        <Checkbox
          checked={filters.onlyMine}
          onCheckedChange={(checked) => update({ onlyMine: checked === true })}
        />
        {t('filters.onlyMine')}
      </Label>
    </div>
  )
}

export default ProposalFilters
