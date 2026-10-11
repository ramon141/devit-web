// Valor positivo ou null. A API pode devolver numéricos como texto ("0.00"),
// então converte antes de decidir se o valor foi informado.
function toPositiveNumber(value?: number | string | null): number | null {
  const parsed = Number(value)

  return Number.isFinite(parsed) && parsed > 0 ? parsed : null
}

const formatValue = (value: number) => new Intl.NumberFormat('it-IT').format(value)

// Formata um par mínimo/máximo como "1.000 — 2.000"; retorna null quando os dois
// faltam. 0 é tratado como "não informado" (não como teto/piso real).
export function formatRange(
  min?: number | string | null,
  max?: number | string | null
): string | null {
  const minValue = toPositiveNumber(min)
  const maxValue = toPositiveNumber(max)

  if (minValue != null && maxValue != null) {
    return `${formatValue(minValue)} — ${formatValue(maxValue)}`
  }

  if (minValue != null) return `≥ ${formatValue(minValue)}`

  return maxValue != null ? `≤ ${formatValue(maxValue)}` : null
}
