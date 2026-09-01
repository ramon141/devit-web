import { useTranslation } from 'react-i18next'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const WINDOW_DAYS = [30, 90, 180, 365] as const

// ponytail: 0 = "tutta l'agenzia" (sem filtro de data), reaproveita o mesmo select
const ALL_AGENCY_VALUE = 0

type DashboardWindowSelectProps = {
  value: number
  onChange: (days: number) => void
  allowAll?: boolean
}

function DashboardWindowSelect({ value, onChange, allowAll }: DashboardWindowSelectProps) {
  const { t } = useTranslation('home')

  return (
    <Select
      value={String(value)}
      onValueChange={(next) => onChange(Number(next))}
    >
      <SelectTrigger className="w-full sm:w-56">
        <SelectValue />
      </SelectTrigger>

      <SelectContent>
        {allowAll && (
          <SelectItem value={String(ALL_AGENCY_VALUE)}>
            {t('dashboardWindow.all')}
          </SelectItem>
        )}
        {WINDOW_DAYS.map((days) => (
          <SelectItem key={days} value={String(days)}>
            {t('dashboardWindow.option', { days })}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export { ALL_AGENCY_VALUE }

export default DashboardWindowSelect
