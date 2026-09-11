// Formata um par mínimo/máximo como "1.000 — 2.000"; retorna null quando os dois faltam
export function formatRange(min?: number | null, max?: number | null): string | null {
  if (min == null && max == null) return null

  const format = (value: number) => new Intl.NumberFormat('it-IT').format(value)

  if (min != null && max != null) return `${format(min)} — ${format(max)}`

  return min != null ? `≥ ${format(min)}` : `≤ ${format(max ?? 0)}`
}
