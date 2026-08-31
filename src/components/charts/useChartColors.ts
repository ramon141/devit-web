import { useEffect, useState } from 'react'

const CHART_VARS = ['--chart-1', '--chart-2', '--chart-3', '--chart-4', '--chart-5']

function readChartColors() {
  const styles = getComputedStyle(document.documentElement)

  return CHART_VARS.map((name) => styles.getPropertyValue(name).trim()).filter(
    (value) => value.length > 0,
  )
}

export function useChartColors() {
  const [colors, setColors] = useState<string[]>(readChartColors)

  useEffect(() => {
    const update = () => setColors(readChartColors())

    // Tema é trocado via classe `.dark` no <html> — recolore os charts quando ela muda.
    const observer = new MutationObserver(update)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    })

    const media = window.matchMedia('(prefers-color-scheme: dark)')
    media.addEventListener('change', update)

    return () => {
      observer.disconnect()
      media.removeEventListener('change', update)
    }
  }, [])

  return colors
}
