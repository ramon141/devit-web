export function toNumberOrNull(value?: string): number | null {
  if (!value) return null

  const parsed = Number(value)
  return Number.isNaN(parsed) ? null : parsed
}
