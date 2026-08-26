const CURRENCY_FORMATTER = new Intl.NumberFormat('it-IT', {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 0,
})

export function formatCurrency(value: number | null | undefined): string | null {
  if (value === null || value === undefined) return null

  return CURRENCY_FORMATTER.format(value)
}

export function formatBoolean(value: boolean | null | undefined): string {
  return value ? 'Sì' : 'No'
}

export function formatFeatureLabel(featureKey: string): string {
  const spaced = featureKey.replace(/[_-]+/g, ' ').trim()

  return spaced.charAt(0).toUpperCase() + spaced.slice(1)
}

const CONDITION_LABELS: Record<string, string> = {
  new: 'Nuovo',
  excellent: 'Eccellente',
  good: 'Buono',
  to_renovate: 'Da ristrutturare',
}

const FURNISHED_LABELS: Record<string, string> = {
  yes: 'Sì',
  partial: 'Parzialmente',
  no: 'No',
}

const AVAILABILITY_LABELS: Record<string, string> = {
  available: 'Libero',
  occupied: 'Occupato',
  under_renovation: 'In ristrutturazione',
}

const MEDIATION_TYPE_LABELS: Record<string, string> = {
  exclusive: 'Esclusiva',
  open: 'Aperta',
}

function translateWithFallback(dictionary: Record<string, string>, value: string): string {
  return dictionary[value] ?? value
}

export function formatCondition(value: string): string {
  return translateWithFallback(CONDITION_LABELS, value)
}

export function formatFurnished(value: string): string {
  return translateWithFallback(FURNISHED_LABELS, value)
}

export function formatAvailability(value: string): string {
  return translateWithFallback(AVAILABILITY_LABELS, value)
}

export function formatMediationType(value: string): string {
  return translateWithFallback(MEDIATION_TYPE_LABELS, value)
}
