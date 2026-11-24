import { filterPanelClass } from '@/lib/filterPanel'
import { toggleBoxClass } from '@/lib/toggleBox'
import { cn } from '@/lib/utils'
import { useTranslation } from 'react-i18next'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import SelectField from '@/components/SelectField'
import FormFieldWrapper from '@/components/FormFieldWrapper'
import MultiSelectField from '@/components/MultiSelectField'
import { useUserControllerFind } from '@/api/generated/api'
import { getEventTypeOptions } from '@/pages/Agenda/schemas/calendarEventSchema'
import type { CalendarEventFilters } from '@/pages/Agenda/hooks/useCalendarEventList'

type AgendaFiltersProps = {
  filters: CalendarEventFilters
  onChange: (filters: CalendarEventFilters) => void
  onGoToDate: (date: string) => void
}

function AgendaFilters({ filters, onChange, onGoToDate }: AgendaFiltersProps) {
  const { t } = useTranslation('agenda')
  const { data: users } = useUserControllerFind()
  const userOptions = (users ?? []).map((user) => ({ value: user.id ?? '', label: user.fullName }))

  function update(patch: Partial<CalendarEventFilters>) {
    onChange({ ...filters, ...patch })
  }

  return (
    <div
      className={cn('mb-3 grid grid-cols-1 items-end gap-3 sm:grid-cols-2 lg:grid-cols-4', filterPanelClass)}
    >
      <FormFieldWrapper label={t('agenda:filters.search')} htmlFor="agenda-search-filter">
        <Input
          id="agenda-search-filter"
          placeholder={t('agenda:filters.searchPlaceholder')}
          value={filters.search}
          onChange={(event) => update({ search: event.target.value })}
        />
      </FormFieldWrapper>

      <FormFieldWrapper label={t('agenda:filters.goToDate')} htmlFor="agenda-goto-date">
        <Input
          id="agenda-goto-date"
          type="date"
          onChange={(event) => event.target.value && onGoToDate(event.target.value)}
        />
      </FormFieldWrapper>

      <FormFieldWrapper
        id="agenda-type-filter"
        label={t('agenda:filters.type')}
        disabledReason={filters.onlyCalls ? t('agenda:filters.typeDisabledReason') : undefined}
      >
        <SelectField
          value={filters.type}
          onValueChange={(value) => update({ type: value })}
          options={getEventTypeOptions(t)}
          placeholder={t('agenda:filters.typePlaceholder')}
          disabled={filters.onlyCalls}
        />
      </FormFieldWrapper>

      <FormFieldWrapper id="agenda-onlyCalls-filter" label={t('agenda:filters.calls')}>
        <label className={cn(toggleBoxClass, 'h-10')}>
          <Checkbox
            checked={filters.onlyCalls}
            onCheckedChange={(checked) => update({ onlyCalls: checked === true, type: '' })}
          />
          {t('agenda:filters.onlyCalls')}
        </label>
      </FormFieldWrapper>

      <div id="agenda-visibleUsers-filter" className="sm:col-span-2 lg:col-span-4">
        <MultiSelectField
          label={t('agenda:filters.visibleUsers')}
          placeholder={t('agenda:filters.visibleUsersPlaceholder')}
          options={userOptions}
          values={filters.visibleUserIds}
          onChange={(visibleUserIds) => update({ visibleUserIds })}
        />
      </div>
    </div>
  )
}

export default AgendaFilters
