export function formatAmount(value?: number | null, options?: Intl.NumberFormatOptions) {
  if (value == null) return '—'

  return new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: 'EUR',
    ...options,
  }).format(value)
}
