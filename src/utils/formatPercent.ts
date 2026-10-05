export function formatPercent(value?: number | string | null, options?: Intl.NumberFormatOptions) {
  if (value == null) return '—'

  const numericValue = Number(value)

  if (Number.isNaN(numericValue)) return '—'

  return `${new Intl.NumberFormat('it-IT', {
    maximumFractionDigits: 2,
    ...options,
  }).format(numericValue)}%`
}
