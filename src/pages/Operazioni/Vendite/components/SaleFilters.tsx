import { cn } from '@/lib/utils'
import DateRangeTextPicker from '@/components/DateRangePicker/DateRangeTextPicker'
import { toggleBoxEndClass } from '@/lib/toggleBox'
import type { TFunction } from 'i18next'
import { useTranslation } from 'react-i18next'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import SelectField from '@/components/SelectField'
import { PersonSelect } from '@/components/RemoteSelects'
import FormFieldWrapper from '@/components/FormFieldWrapper'
import BrokerCodeFilter from '@/components/BrokerCodeFilter'
import { getSaleStatusOptions } from '@/pages/Operazioni/Vendite/schemas/saleSchema'
import type { SaleFiltersValues } from '@/pages/Operazioni/Vendite/hooks/useSaleList'

type SaleFiltersProps = {
  filters: SaleFiltersValues
  onChange: (filters: SaleFiltersValues) => void
}

function SaleFilters({ filters, onChange }: SaleFiltersProps) {
  const { t } = useTranslation('operazioni')

  function update(patch: Partial<SaleFiltersValues>) {
    onChange({ ...filters, ...patch })
  }

  return (
    <div className="grid w-full grid-cols-2 items-end gap-2 sm:grid-cols-4">
      <FormFieldWrapper id="vendite-status-filter" label={t('vendite.filters.statusLabel')}>
        <SelectField
          value={filters.status}
          onValueChange={(value) => update({ status: value })}
          options={getSaleStatusOptions(t as TFunction)}
          placeholder={t('vendite.filters.all')}
        />
      </FormFieldWrapper>

      <FormFieldWrapper id="vendite-seller-filter" label={t('vendite.filters.sellerLabel')}>
        <PersonSelect
          value={filters.sellerId}
          onValueChange={(value) => update({ sellerId: value })}
          placeholder={t('vendite.filters.all')}
        />
      </FormFieldWrapper>

      <FormFieldWrapper id="vendite-buyer-filter" label={t('vendite.filters.buyerLabel')}>
        <PersonSelect
          value={filters.buyerId}
          onValueChange={(value) => update({ buyerId: value })}
          placeholder={t('vendite.filters.all')}
        />
      </FormFieldWrapper>

      <BrokerCodeFilter
        id="vendite-broker-filter"
        value={filters.brokerCode}
        onChange={(value) => update({ brokerCode: value })}
      />

      <div className="col-span-2">
        <DateRangeTextPicker
          id="vendite-saleDate-filter"
          label={t('vendite.filters.saleDateFromLabel')}
          from={filters.saleDateFrom}
          to={filters.saleDateTo}
          onChange={(from, to) => update({ saleDateFrom: from, saleDateTo: to })}
        />
      </div>

      <Label id="vendite-onlyMine-filter" className={cn(toggleBoxEndClass, 'col-span-2')}>
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
