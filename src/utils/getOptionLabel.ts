type Option = { value: string; label: string }

export function getOptionLabel(options: Option[], value?: string, fallback: string = value ?? '—') {
  return options.find((option) => option.value === value)?.label ?? fallback
}
