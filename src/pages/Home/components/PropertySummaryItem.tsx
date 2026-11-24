import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import DashboardListItem from '@/pages/Home/components/DashboardListItem'
import { getPurposeOptions } from '@/pages/Imoveis/schemas/propertySchema'
import { getOptionLabel } from '@/utils/getOptionLabel'
import { formatDateTime } from '@/utils/formatDate'
import type {
  PropertiesReportControllerDormant200Item,
  PropertiesReportControllerRecent200Item,
} from '@/api/generated/models'

type PropertySummary =
  | PropertiesReportControllerDormant200Item
  | PropertiesReportControllerRecent200Item

type PropertySummaryItemProps = {
  property: PropertySummary
  date?: string | null
  dateLabel?: string
  action?: ReactNode
}

// Linha de imóvel da Bacheca: código, tipologia + finalità, comune, m² e data
function PropertySummaryItem({ property, date, dateLabel, action }: PropertySummaryItemProps) {
  const { t } = useTranslation('imoveis')
  const purposeLabel = getOptionLabel(getPurposeOptions(t), property.purpose, '')

  const typology = [property.categoryName, purposeLabel].filter(Boolean).join(' · ')

  return (
    <DashboardListItem>
      <div className="min-w-0">
        <p className="truncate text-sm font-medium">{property.code}</p>

        {typology && <p className="truncate text-xs">{typology}</p>}

        <p className="truncate text-xs text-muted-foreground">
          {[property.city, property.areaSqm ? `m² ${property.areaSqm}` : null]
            .filter(Boolean)
            .join(' · ')}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        {date && (
          <span className="text-xs text-muted-foreground">
            {dateLabel && `${dateLabel} `}
            {formatDateTime(date)}
          </span>
        )}

        {action}
      </div>
    </DashboardListItem>
  )
}

export default PropertySummaryItem
