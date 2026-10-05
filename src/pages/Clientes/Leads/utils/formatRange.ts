// Formata um par mínimo/máximo como "1.000 — 2.000"; retorna null quando os dois
// faltam. 0 é tratado como "não informado" (não como teto/piso real) — senão um
// lead sem orçamento preenchido aparecia como "≤ 0" no card.
export function formatRange(min?: number | null, max?: number | null): string | null {
  const minValue = min ? min : null
  const maxValue = max ? max : null

  if (minValue == null && maxValue == null) return null

  const format = (value: number) => new Intl.NumberFormat('it-IT').format(value)

  if (minValue != null && maxValue != null) return `${format(minValue)} — ${format(maxValue)}`

  return minValue != null ? `≥ ${format(minValue)}` : `≤ ${format(maxValue as number)}`
}
