import {
  Funnel,
  FunnelChart as RechartsFunnelChart,
  LabelList,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'
import { useTranslation } from 'react-i18next'
import { useChartColors } from '@/components/charts/useChartColors'

type FunnelChartProps = {
  labels: string[]
  values: number[]
  height?: number
}

function FunnelChart({ labels, values, height = 260 }: FunnelChartProps) {
  const { t } = useTranslation('common')
  const colors = useChartColors()

  if (colors.length === 0) return null

  if (values.every((value) => value === 0)) {
    return <p className="py-8 text-center text-sm text-muted-foreground">{t('chart.noData')}</p>
  }

  const data = labels.map((label, index) => ({
    name: label,
    value: values[index],
    fill: colors[index % colors.length],
  }))

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsFunnelChart>
        <Tooltip />
        <Funnel dataKey="value" nameKey="name" data={data} isAnimationActive>
          <LabelList position="right" dataKey="name" fill="currentColor" stroke="none" />
          <LabelList position="left" dataKey="value" fill="currentColor" stroke="none" />
        </Funnel>
      </RechartsFunnelChart>
    </ResponsiveContainer>
  )
}

export default FunnelChart
