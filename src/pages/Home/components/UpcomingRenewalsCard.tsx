import { useTranslation } from 'react-i18next'
import DashboardCard from '@/pages/Home/components/DashboardCard'
import { useSalesRentalsReportControllerUpcomingRenewals } from '@/api/generated/api'
import { formatAmount } from '@/utils/formatAmount'
import { formatDate } from '@/utils/formatDate'

const RENEWAL_WINDOW_DAYS = 30

function UpcomingRenewalsCard() {
  const { t } = useTranslation('home')
  const { data, isLoading } = useSalesRentalsReportControllerUpcomingRenewals({
    days: RENEWAL_WINDOW_DAYS,
  })
  const contracts = data ?? []

  return (
    <DashboardCard
      title={t('upcomingRenewalsCard.title')}
      count={contracts.length}
      isLoading={isLoading}
    >
      {contracts.length === 0 && (
        <p className="text-sm text-muted-foreground">{t('upcomingRenewalsCard.empty')}</p>
      )}

      {contracts.map((contract) => (
        <div
          key={contract.id}
          className="flex items-center justify-between gap-3 rounded-lg px-2 py-2 hover:bg-accent hover:text-accent-foreground"
        >
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">
              {contract.propertyTitle ?? contract.number}
            </p>

            <p className="truncate text-xs text-muted-foreground">{contract.tenantNames}</p>
          </div>

          <div className="flex shrink-0 flex-col items-end">
            <span className="text-xs text-muted-foreground">
              {formatDate(contract.renewalDueDate)}
            </span>
            <span className="text-sm font-medium">{formatAmount(contract.rentAmount)}</span>
          </div>
        </div>
      ))}
    </DashboardCard>
  )
}

export default UpcomingRenewalsCard
