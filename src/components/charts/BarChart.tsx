import {
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { useTranslation } from 'react-i18next'
import { useChartColors } from '@/components/charts/useChartColors'

type BarChartSeries = {
  name: string
  data: number[]
}

type BarChartProps = {
  categories: string[]
  series: BarChartSeries[]
  height?: number
  stacked?: boolean
}

function buildData(categories: string[], series: BarChartSeries[]) {
  return categories.map((category, index) => {
    const row: Record<string, string | number> = { category }

    series.forEach((item) => {
      row[item.name] = item.data[index] ?? 0
    })

    return row
  })
}

function BarChart({ categories, series, height = 280, stacked = false }: BarChartProps) {
  const { t } = useTranslation('common')
  const colors = useChartColors()

  if (colors.length === 0) return null

  const hasData = series.some((item) => item.data.some((value) => value > 0))
  if (!hasData) {
    return <p className="py-8 text-center text-sm text-muted-foreground">{t('chart.noData')}</p>
  }

  const data = buildData(categories, series)

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsBarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="category" />
        <YAxis />
        <Tooltip />
        <Legend verticalAlign="bottom" />
        {series.map((item, index) =>
          stacked ? (
            <Bar
              key={item.name}
              dataKey={item.name}
              fill={colors[index % colors.length]}
              stackId="stack"
              maxBarSize={40}
            />
          ) : (
            <Bar
              key={item.name}
              dataKey={item.name}
              fill={colors[index % colors.length]}
              radius={[4, 4, 0, 0]}
              maxBarSize={40}
            />
          ),
        )}
      </RechartsBarChart>
    </ResponsiveContainer>
  )
}

export default BarChart
