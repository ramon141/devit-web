import { useTranslation } from 'react-i18next'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import SelectField from '@/components/SelectField'
import SearchableSelect from '@/components/SearchableSelect'
import { useUserControllerFind } from '@/api/generated/api'
import {
  getLeadRequestTypeOptions,
  getLeadSourceOptions,
} from '@/pages/Clientes/Leads/schemas/leadSchema'
import type { LeadBoardFilters } from '@/pages/Clientes/Leads/hooks/useLeadBoard'

type LeadFiltersProps = {
  filters: LeadBoardFilters
  onChange: (filters: LeadBoardFilters) => void
}

function LeadFilters({ filters, onChange }: LeadFiltersProps) {
  const { t } = useTranslation('clientes')
  const { data: users } = useUserControllerFind({ filter: {order: ['fullName ASC']} })
  const userOptions = (users ?? []).map((user) => ({ value: user.id ?? '', label: user.fullName }))

  function update(patch: Partial<LeadBoardFilters>) {
    onChange({ ...filters, ...patch })
  }

  return (
    <div className="mb-4 flex flex-wrap items-end gap-3">
      <Input
        className="w-56"
        placeholder={t('leads.filters.searchPlaceholder')}
        value={filters.search}
        onChange={(event) => update({ search: event.target.value })}
      />

      <SelectField
        value={filters.source}
        onValueChange={(value) => update({ source: value })}
        options={getLeadSourceOptions(t)}
        placeholder={t('leads.filters.sourcePlaceholder')}
      />

      <SelectField
        value={filters.requestType}
        onValueChange={(value) => update({ requestType: value })}
        options={getLeadRequestTypeOptions(t)}
        placeholder={t('leads.filters.requestTypePlaceholder')}
      />

      <SearchableSelect
        value={filters.assignedToId}
        onValueChange={(value) => update({ assignedToId: value, onlyMine: false })}
        options={userOptions}
        placeholder={t('leads.filters.assignedToPlaceholder')}
        disabled={filters.onlyMine}
      />

      <label className="flex items-center gap-2 text-sm">
        <Checkbox
          checked={filters.onlyMine}
          onCheckedChange={(checked) => update({ onlyMine: checked === true, assignedToId: '' })}
        />
        {t('leads.filters.onlyMine')}
      </label>
    </div>
  )
}

export default LeadFilters
