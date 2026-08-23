import Chart from 'react-apexcharts'
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

function BarChart({ categories, series, height = 280, stacked = false }: BarChartProps) {
  const colors = useChartColors()

  if (colors.length === 0) return null

  const hasData = series.some((item) => item.data.some((value) => value > 0))
  if (!hasData) {
    return <p className="py-8 text-center text-sm text-muted-foreground">Nessun dato disponibile.</p>
  }

  return (
    <Chart
      type="bar"
      height={height}
      series={series}
      options={{
        chart: { stacked, toolbar: { show: false } },
        colors,
        plotOptions: { bar: { borderRadius: 4, columnWidth: '45%' } },
        dataLabels: { enabled: false },
        xaxis: { categories },
        legend: { position: 'bottom' },
      }}
    />
  )
}

export default BarChart
