import { useTranslation } from 'react-i18next'
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
        <div
          key={agent.agentId}
          className="flex items-center justify-between gap-3 rounded-lg px-2 py-2 hover:bg-accent hover:text-accent-foreground"
        >
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">
              {index + 1}. {agent.agentName}
            </p>

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
        </div>
      ))}
    </DashboardCard>
  )
}

export default AgentRankingCard
