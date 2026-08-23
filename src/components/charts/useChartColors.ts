import { useEffect, useState } from 'react'

const CHART_VARS = ['--chart-1', '--chart-2', '--chart-3', '--chart-4', '--chart-5']

function readChartColors() {
  const styles = getComputedStyle(document.documentElement)
  return CHART_VARS.map((name) => styles.getPropertyValue(name).trim())
}

export function useChartColors() {
  const [colors, setColors] = useState<string[]>([])

  useEffect(() => {
    setColors(readChartColors())
  }, [])

  return colors
}
