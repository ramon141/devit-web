import { PolarAngleAxis, RadialBar, RadialBarChart, ResponsiveContainer } from 'recharts'
import { useChartColors } from '@/components/charts/useChartColors'

type GaugeChartProps = {
  value: number
  label: string
  size?: number
  colorIndex?: number
}

const MAX_PERCENT = 100

// Medidor circular usado nos indicadores da Bacheca
function GaugeChart({ value, label, size = 140, colorIndex = 0 }: GaugeChartProps) {
  const colors = useChartColors()

  if (colors.length === 0) return null

  const color = colors[colorIndex % colors.length]

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative" style={{ width: size, height: size }}>
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            innerRadius="78%"
            outerRadius="100%"
            barSize={10}
            startAngle={90}
            endAngle={-270}
            data={[{ value }]}
          >
            <PolarAngleAxis
              type="number"
              domain={[0, MAX_PERCENT]}
              angleAxisId={0}
              tick={false}
            />
            <RadialBar background dataKey="value" cornerRadius={8} fill={color} />
          </RadialBarChart>
        </ResponsiveContainer>

        <span className="absolute inset-0 flex items-center justify-center text-xl font-semibold">
          {value}%
        </span>
      </div>

      <span className="text-sm text-muted-foreground">{label}</span>
    </div>
  )
}

export default GaugeChart
