import { useTranslation } from 'react-i18next'
import FormFieldWrapper from '@/components/FormFieldWrapper'
import SelectField from '@/components/SelectField'

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

  const windowOptions = WINDOW_DAYS.map((days) => ({
    value: String(days),
    label: t('dashboardWindow.option', { days }),
  }))

  const allOption = {
    value: String(ALL_AGENCY_VALUE),
    label: t('dashboardWindow.all'),
  }

  const options = allowAll ? [allOption, ...windowOptions] : windowOptions

  return (
    <div className="w-full sm:w-56">
      <FormFieldWrapper label={t('dashboardWindow.label')}>
        <SelectField
          value={String(value)}
          onValueChange={(next) => onChange(Number(next))}
          options={options}
          clearable={false}
        />
      </FormFieldWrapper>
    </div>
  )
}

export { ALL_AGENCY_VALUE }

export default DashboardWindowSelect
