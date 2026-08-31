import { useTranslation } from 'react-i18next'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const WINDOW_DAYS = [30, 90, 180, 365] as const

type DashboardWindowSelectProps = {
  value: number
  onChange: (days: number) => void
}

function DashboardWindowSelect({ value, onChange }: DashboardWindowSelectProps) {
  const { t } = useTranslation('home')

  return (
    <Select
      value={String(value)}
      onValueChange={(next) => onChange(Number(next) || 180)}
    >
      <SelectTrigger className="w-full sm:w-56">
        <SelectValue />
      </SelectTrigger>

      <SelectContent>
        {WINDOW_DAYS.map((days) => (
          <SelectItem key={days} value={String(days)}>
            {t('dashboardWindow.option', { days })}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export default DashboardWindowSelect
