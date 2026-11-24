import { useTranslation } from 'react-i18next'
import DashboardListItem from '@/pages/Home/components/DashboardListItem'
import DashboardCard from '@/pages/Home/components/DashboardCard'
import { useSalesRentalsReportControllerByAgent } from '@/api/generated/api'
import { formatAmount } from '@/utils/formatAmount'

function AgentRankingCard() {
  const { t } = useTranslation('home')
  const { data, isLoading } = useSalesRentalsReportControllerByAgent()
  const agents = data ?? []

  return (
    <DashboardCard
      title={t('agentRankingCard.title')}
      count={agents.length}
      isLoading={isLoading}
    >
      {agents.length === 0 && (
        <p className="text-sm text-muted-foreground">{t('agentRankingCard.empty')}</p>
      )}

      {agents.map((agent, index) => (
        <DashboardListItem key={agent.agentId}>
          <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-semibold">
            {index + 1}
          </span>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{agent.agentName}</p>

            <p className="truncate text-xs text-muted-foreground">
              {t('agentRankingCard.detail', {
                sales: agent.salesCount ?? 0,
                converted: agent.leadsConverted ?? 0,
              })}
            </p>
          </div>

          <span className="shrink-0 text-sm font-medium">
            {formatAmount(agent.salesAmount)}
          </span>
        </DashboardListItem>
      ))}
    </DashboardCard>
  )
}

export default AgentRankingCard
