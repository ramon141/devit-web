import { SearchIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import SelectField from '@/components/SelectField'
import SearchableSelect from '@/components/SearchableSelect'
import FormFieldWrapper from '@/components/FormFieldWrapper'
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
    <div className="mb-4 grid w-full grid-cols-1 items-end gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <FormFieldWrapper label={t('common:listToolbar.searchLabel')}>
        <div className="relative">
          <SearchIcon className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder={t('leads.filters.searchPlaceholder')}
            value={filters.search}
            onChange={(event) => update({ search: event.target.value })}
          />
        </div>
      </FormFieldWrapper>

      <FormFieldWrapper label={t('leads.filters.sourcePlaceholder')}>
        <SelectField
          value={filters.source}
          onValueChange={(value) => update({ source: value })}
          options={getLeadSourceOptions(t)}
          placeholder={t('leads.filters.sourcePlaceholder')}
        />
      </FormFieldWrapper>

      <FormFieldWrapper label={t('leads.filters.requestTypePlaceholder')}>
        <SelectField
          value={filters.requestType}
          onValueChange={(value) => update({ requestType: value })}
          options={getLeadRequestTypeOptions(t)}
          placeholder={t('leads.filters.requestTypePlaceholder')}
        />
      </FormFieldWrapper>

      <FormFieldWrapper label={t('leads.filters.assignedToPlaceholder')}>
        <SearchableSelect
          value={filters.assignedToId}
          onValueChange={(value) => update({ assignedToId: value, onlyMine: false })}
          options={userOptions}
          placeholder={t('leads.filters.assignedToPlaceholder')}
          disabled={filters.onlyMine}
        />
      </FormFieldWrapper>

      <label className="flex h-9 items-center gap-2 text-sm">
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
