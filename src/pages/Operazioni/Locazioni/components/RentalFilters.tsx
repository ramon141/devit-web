import { cn } from '@/lib/utils'
import DateRangeTextPicker from '@/components/DateRangePicker/DateRangeTextPicker'
import { toggleBoxEndClass } from '@/lib/toggleBox'
import { useTranslation } from 'react-i18next'
import type { TFunction } from 'i18next'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import SelectField from '@/components/SelectField'
import { PersonSelect } from '@/components/RemoteSelects'
import FormFieldWrapper from '@/components/FormFieldWrapper'
import BrokerCodeFilter from '@/components/BrokerCodeFilter'
import { getRentalSituationOptions } from '@/pages/Operazioni/Locazioni/schemas/rentalContractSchema'
import type { RentalContractFiltersValues } from '@/pages/Operazioni/Locazioni/hooks/useRentalContractList'

type RentalFiltersProps = {
  filters: RentalContractFiltersValues
  onChange: (filters: RentalContractFiltersValues) => void
}

function RentalFilters({ filters, onChange }: RentalFiltersProps) {
  const { t } = useTranslation('operazioni')
  function update(patch: Partial<RentalContractFiltersValues>) {
    onChange({ ...filters, ...patch })
  }

  return (
    <div className="grid w-full grid-cols-2 items-end gap-2 sm:grid-cols-4">
      <FormFieldWrapper id="locazioni-situation-filter" label={t('locazioni.filters.situationLabel')}>
        <SelectField
          value={filters.situation}
          onValueChange={(value) => update({ situation: value })}
          options={getRentalSituationOptions(t as TFunction)}
          placeholder={t('locazioni.filters.all')}
        />
      </FormFieldWrapper>

      <FormFieldWrapper id="locazioni-owner-filter" label={t('locazioni.filters.ownerLabel')}>
        <PersonSelect
          value={filters.ownerId}
          onValueChange={(value) => update({ ownerId: value })}
          placeholder={t('locazioni.filters.all')}
        />
      </FormFieldWrapper>

      <FormFieldWrapper id="locazioni-tenant-filter" label={t('locazioni.filters.tenantLabel')}>
        <PersonSelect
          value={filters.tenantId}
          onValueChange={(value) => update({ tenantId: value })}
          placeholder={t('locazioni.filters.all')}
        />
      </FormFieldWrapper>

      <BrokerCodeFilter
        id="locazioni-broker-filter"
        value={filters.brokerCode}
        onChange={(value) => update({ brokerCode: value })}
      />

      <DateRangeTextPicker
        id="locazioni-stipulaDate-filter"
        label={t('locazioni.filters.stipulaDateFromLabel')}
        from={filters.stipulaDateFrom}
        to={filters.stipulaDateTo}
        onChange={(from, to) => update({ stipulaDateFrom: from, stipulaDateTo: to })}
      />

      <DateRangeTextPicker
        id="locazioni-startDate-filter"
        label={t('locazioni.filters.startDateFromLabel')}
        from={filters.startDateFrom}
        to={filters.startDateTo}
        onChange={(from, to) => update({ startDateFrom: from, startDateTo: to })}
      />

      <Label id="locazioni-onlyMine-filter" className={cn(toggleBoxEndClass, 'col-span-2')}>
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
