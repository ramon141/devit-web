import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { useTranslation } from 'react-i18next'
import { useChartColors } from '@/components/charts/useChartColors'

type DonutChartProps = {
  labels: string[]
  values: number[]
  height?: number
}

function DonutChart({ labels, values, height = 260 }: DonutChartProps) {
  const { t } = useTranslation('common')
  const colors = useChartColors()

  if (colors.length === 0) return null

  if (values.every((value) => value === 0)) {
    return <p className="py-8 text-center text-sm text-muted-foreground">{t('chart.noData')}</p>
  }

  const data = labels.map((label, index) => ({
    name: label,
    value: values[index],
  }))

  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          innerRadius="55%"
          outerRadius="80%"
          label
        >
          {data.map((entry, index) => (
            <Cell key={entry.name} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <Legend verticalAlign="bottom" />
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  )
}

export default DonutChart
