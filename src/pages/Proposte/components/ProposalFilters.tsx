import { cn } from '@/lib/utils'
import DateRangeTextPicker from '@/components/DateRangePicker/DateRangeTextPicker'
import { toggleBoxEndClass } from '@/lib/toggleBox'
import { useTranslation } from 'react-i18next'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import SelectField from '@/components/SelectField'
import { PersonSelect, PropertySelect } from '@/components/RemoteSelects'
import FormFieldWrapper from '@/components/FormFieldWrapper'
import BrokerCodeFilter from '@/components/BrokerCodeFilter'
import { getProposalStatusOptions } from '@/pages/Proposte/schemas/proposalSchema'
import type { ProposalFiltersValues } from '@/pages/Proposte/hooks/useProposalList'

type ProposalFiltersProps = {
  filters: ProposalFiltersValues
  onChange: (filters: ProposalFiltersValues) => void
}

function ProposalFilters({ filters, onChange }: ProposalFiltersProps) {
  const { t } = useTranslation('proposte')
  const financedOptions = [
    { value: 'true', label: t('filters.financedYes') },
    { value: 'false', label: t('filters.financedNo') },
  ]

  function update(patch: Partial<ProposalFiltersValues>) {
    onChange({ ...filters, ...patch })
  }

  return (
    <div className="grid w-full grid-cols-2 items-end gap-2 sm:grid-cols-4">
      <FormFieldWrapper id="proposte-status-filter" label={t('filters.statusLabel')}>
        <SelectField
          value={filters.status}
          onValueChange={(value) => update({ status: value })}
          options={getProposalStatusOptions(t)}
          placeholder={t('filters.all')}
        />
      </FormFieldWrapper>

      <FormFieldWrapper id="proposte-financed-filter" label={t('filters.financedLabel')}>
        <SelectField
          value={filters.financed}
          onValueChange={(value) => update({ financed: value })}
          options={financedOptions}
          placeholder={t('filters.all')}
        />
      </FormFieldWrapper>

      <FormFieldWrapper id="proposte-property-filter" label={t('filters.propertyLabel')}>
        <PropertySelect
          value={filters.propertyId}
          onValueChange={(value) => update({ propertyId: value })}
          placeholder={t('filters.all')}
        />
      </FormFieldWrapper>

      <FormFieldWrapper id="proposte-buyer-filter" label={t('filters.buyerLabel')}>
        <PersonSelect
          value={filters.buyerId}
          onValueChange={(value) => update({ buyerId: value })}
          placeholder={t('filters.all')}
        />
      </FormFieldWrapper>

      <BrokerCodeFilter
        id="proposte-broker-filter"
        value={filters.brokerCode}
        onChange={(value) => update({ brokerCode: value })}
      />

      <DateRangeTextPicker
        id="proposte-date-filter"
        label={t('filters.proposalDateFromLabel')}
        from={filters.proposalDateFrom}
        to={filters.proposalDateTo}
        onChange={(from, to) => update({ proposalDateFrom: from, proposalDateTo: to })}
      />

      <Label id="proposte-onlyMine-filter" className={cn(toggleBoxEndClass, 'col-span-2')}>
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
