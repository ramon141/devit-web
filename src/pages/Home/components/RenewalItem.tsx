import { useTranslation } from 'react-i18next'
import DashboardListItem from '@/pages/Home/components/DashboardListItem'
import { getRenewalUrgency } from '@/pages/Home/components/renewalUrgency'
import { formatAmount } from '@/utils/formatAmount'
import { formatDate } from '@/utils/formatDate'

type RenewalItemProps = {
  title?: string
  tenantNames?: string | null
  dueDate?: string | null
  amount?: number | null
}

// Linha de contrato a vencer, com cor e texto de urgência
function RenewalItem({ title, tenantNames, dueDate, amount }: RenewalItemProps) {
  const { t } = useTranslation('home')
  const urgency = getRenewalUrgency(dueDate)

  function getLabel() {
    if (urgency.daysLeft < 0) return t('upcomingRenewalsCard.urgency.overdue')
    if (urgency.daysLeft === 0) return t('upcomingRenewalsCard.urgency.today')
    if (urgency.daysLeft === 1) return t('upcomingRenewalsCard.urgency.tomorrow')

    return t('upcomingRenewalsCard.urgency.inDays', { count: urgency.daysLeft })
  }

  return (
    <DashboardListItem accentClassName={urgency.accentClassName}>
      <div className="min-w-0">
        <p className="truncate text-sm font-medium">{title}</p>

        <p className="truncate text-xs text-muted-foreground">{tenantNames}</p>
      </div>

      <div className="flex shrink-0 flex-col items-end gap-1">
        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${urgency.badgeClassName}`}>
          {getLabel()}
        </span>

        <span className="text-xs text-muted-foreground">{formatDate(dueDate)}</span>

        <span className="text-sm font-medium">{formatAmount(amount)}</span>
      </div>
    </DashboardListItem>
  )
}

export default RenewalItem
