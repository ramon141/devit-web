import { useTranslation } from 'react-i18next'
import DashboardCard from '@/pages/Home/components/DashboardCard'
import RenewalItem from '@/pages/Home/components/RenewalItem'
import { useSalesRentalsReportControllerUpcomingRenewals } from '@/api/generated/api'

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
        <RenewalItem
          key={contract.id}
          title={contract.propertyTitle ?? contract.number}
          tenantNames={contract.tenantNames}
          dueDate={contract.renewalDueDate}
          amount={contract.rentAmount}
        />
      ))}
    </DashboardCard>
  )
}

export default UpcomingRenewalsCard
