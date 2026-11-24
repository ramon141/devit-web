import { useTranslation } from 'react-i18next'
import { Badge } from '@/components/ui/badge'
import DashboardListItem from '@/pages/Home/components/DashboardListItem'
import DashboardCard from '@/pages/Home/components/DashboardCard'
import { useLeadsReportControllerByAgent } from '@/api/generated/api'

function conversionRate(total?: number, converted?: number) {
  if (!total) return 0

  return Math.round(((converted ?? 0) / total) * 100)
}

function AgentConversionCard() {
  const { t } = useTranslation('home')
  const { data, isLoading } = useLeadsReportControllerByAgent()
  const agents = data ?? []

  return (
    <DashboardCard
      title={t('agentConversionCard.title')}
      count={agents.length}
      isLoading={isLoading}
    >
      {agents.length === 0 && (
        <p className="text-sm text-muted-foreground">{t('agentConversionCard.empty')}</p>
      )}

      {agents.map((agent) => (
        <DashboardListItem key={agent.agentId}>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{agent.agentName}</p>

            <p className="truncate text-xs text-muted-foreground">
              {t('agentConversionCard.detail', {
                converted: agent.converted ?? 0,
                total: agent.total ?? 0,
              })}
            </p>
          </div>

          <Badge className="shrink-0 bg-accent text-accent-foreground">
            {conversionRate(agent.total, agent.converted)}%
          </Badge>
        </DashboardListItem>
      ))}
    </DashboardCard>
  )
}

export default AgentConversionCard
