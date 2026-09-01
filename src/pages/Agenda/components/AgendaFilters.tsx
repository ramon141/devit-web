import { useTranslation } from 'react-i18next'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import SelectField from '@/components/SelectField'
import MultiSelectField from '@/components/MultiSelectField'
import { useUserControllerFind } from '@/api/generated/api'
import { getEventTypeOptions } from '@/pages/Agenda/schemas/calendarEventSchema'
import type { CalendarEventFilters } from '@/pages/Agenda/hooks/useCalendarEventList'

type AgendaFiltersProps = {
  filters: CalendarEventFilters
  onChange: (filters: CalendarEventFilters) => void
}

function AgendaFilters({ filters, onChange }: AgendaFiltersProps) {
  const { t } = useTranslation('agenda')
  const { data: users } = useUserControllerFind()
  const userOptions = (users ?? []).map((user) => ({ value: user.id ?? '', label: user.fullName }))

  function update(patch: Partial<CalendarEventFilters>) {
    onChange({ ...filters, ...patch })
  }

  return (
    <div className="mb-3 flex flex-wrap items-end gap-3">
      <Input
        className="w-56"
        placeholder={t('agenda:filters.searchPlaceholder')}
        value={filters.search}
        onChange={(event) => update({ search: event.target.value })}
      />

      <SelectField
        value={filters.type}
        onValueChange={(value) => update({ type: value })}
        options={getEventTypeOptions(t)}
        placeholder={t('agenda:filters.typePlaceholder')}
        disabled={filters.onlyCalls}
      />

      <label className="flex items-center gap-2 text-sm">
        <Checkbox
          checked={filters.onlyCalls}
          onCheckedChange={(checked) => update({ onlyCalls: checked === true, type: '' })}
        />
        {t('agenda:filters.onlyCalls')}
      </label>

      <div className="w-64">
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
