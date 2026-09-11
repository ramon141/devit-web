// Comuni atendidos pela imobiliária — usados nos selects de cidade
export const PROPERTY_CITIES = [
  'Napoli',
  'Portici',
  'San Giorgio a Cremano',
  'Ercolano',
  'Torre del Greco',
  'Pozzuoli',
  'Arzano',
  'Massa Lubrense',
] as const

export const PROPERTY_CITY_OPTIONS = PROPERTY_CITIES.map((city) => ({
  value: city,
  label: city,
}))

// Único país atendido por enquanto — já vem pré-selecionado no formulário
export const DEFAULT_COUNTRY = 'Italia'

export const COUNTRY_OPTIONS = [{ value: DEFAULT_COUNTRY, label: DEFAULT_COUNTRY }]
