import Chart from 'react-apexcharts'
import { useChartColors } from '@/components/charts/useChartColors'

type DonutChartProps = {
  labels: string[]
  values: number[]
  height?: number
}

function DonutChart({ labels, values, height = 260 }: DonutChartProps) {
  const colors = useChartColors()

  if (colors.length === 0) return null

  if (values.every((value) => value === 0)) {
    return <p className="py-8 text-center text-sm text-muted-foreground">Nessun dato disponibile.</p>
  }

  return (
    <Chart
      type="donut"
      height={height}
      series={values}
      options={{
        labels,
        colors,
        legend: { position: 'bottom' },
        dataLabels: { enabled: true },
        stroke: { width: 0 },
      }}
    />
  )
}

export default DonutChart
