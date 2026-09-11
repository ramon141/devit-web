import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import DonutChart from '@/components/charts/DonutChart'
import { useChannelStatusReport } from '@/pages/Marketing/hooks/useChannelStatusReport'
import { getCommunicationStatusLabels } from '@/constants/communications'

type ChannelStatusDashboardProps = {
  channel: 'email' | 'whatsapp'
}

type StatCardProps = {
  title: string
  value: number
  isLoading: boolean
}

// Card de indicador: só o valor vira skeleton, o título continua visível
function StatCard({ title, value, isLoading }: StatCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>

      <CardContent className="text-2xl font-semibold">
        {isLoading ? <Skeleton className="h-8 w-16" /> : value}
      </CardContent>
    </Card>
  )
}

// Quantos status existem só é conhecido depois da resposta: 3 cards de espera
const PENDING_STAT_CARDS = 3

function PendingStatCards() {
  return (
    <>
      {Array.from({ length: PENDING_STAT_CARDS }).map((_, index) => (
        <Card key={index}>
          <CardHeader>
            <CardTitle>
              <Skeleton className="h-4 w-24" />
            </CardTitle>
          </CardHeader>

          <CardContent className="text-2xl font-semibold">
            <Skeleton className="h-8 w-16" />
          </CardContent>
        </Card>
      ))}
    </>
  )
}

function ChannelStatusDashboard({ channel }: ChannelStatusDashboardProps) {
  const { t } = useTranslation('marketing')
  const { t: tCommon } = useTranslation('common')
  const statusLabels = getCommunicationStatusLabels(tCommon)
  const { rows, total, isLoading } = useChannelStatusReport(channel)

  return (
    <div className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title={t('channelStatusDashboard.total')}
          value={total}
          isLoading={isLoading}
        />

        {rows.map((row) => (
          <StatCard
            key={row.status}
            title={statusLabels[row.status ?? ''] ?? row.status ?? ''}
            value={row.total ?? 0}
            isLoading={false}
          />
        ))}

        {isLoading && <PendingStatCards />}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('channelStatusDashboard.distributionByStatus')}</CardTitle>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <div className="flex justify-center">
              <Skeleton className="size-56 rounded-full" />
            </div>
          ) : (
            <DonutChart
              labels={rows.map((row) => statusLabels[row.status ?? ''] ?? row.status ?? '')}
              values={rows.map((row) => row.total ?? 0)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default ChannelStatusDashboard
