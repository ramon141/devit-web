import { useState } from 'react'
import { useNavigate } from 'react-router'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

type SearchFilters = {
  city: string
  keyword: string
  bedrooms: string
  bathrooms: string
  minArea: string
  maxArea: string
  minPrice: string
  maxPrice: string
  code: string
}

const EMPTY_FILTERS: SearchFilters = {
  city: '',
  keyword: '',
  bedrooms: '',
  bathrooms: '',
  minArea: '',
  maxArea: '',
  minPrice: '',
  maxPrice: '',
  code: '',
}

function buildQueryString(filters: SearchFilters) {
  const params = new URLSearchParams()

  Object.entries(filters).forEach(([key, value]) => {
    if (value.trim()) params.set(key, value.trim())
  })

  return params.toString()
}

function SearchBar() {
  const navigate = useNavigate()
  const [filters, setFilters] = useState<SearchFilters>(EMPTY_FILTERS)
  const [showAdvanced, setShowAdvanced] = useState(false)

  function updateField(field: keyof SearchFilters, value: string) {
    setFilters((current) => ({ ...current, [field]: value }))
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    navigate(`/site/risultati?${buildQueryString(filters)}`)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto flex max-w-4xl flex-col gap-3 rounded-xl border border-border bg-background p-4 shadow-sm"
    >
      <div className="grid gap-3 sm:grid-cols-3">
        <Input
          placeholder="Città"
          value={filters.city}
          onChange={(event) => updateField('city', event.target.value)}
        />

        <Input
          placeholder="Indirizzo, via, CAP o codice"
          value={filters.keyword}
          onChange={(event) => updateField('keyword', event.target.value)}
        />

        <Button type="submit">Ricerca</Button>
      </div>

      <button
        type="button"
        className="w-fit text-sm text-primary underline-offset-4 hover:underline"
        onClick={() => setShowAdvanced((current) => !current)}
      >
        {showAdvanced ? 'Nascondi filtri avanzati' : 'Avanzate'}
      </button>

      {showAdvanced && (
        <div className="grid gap-3 sm:grid-cols-3">
          <Input
            placeholder="Camere"
            type="number"
            value={filters.bedrooms}
            onChange={(event) => updateField('bedrooms', event.target.value)}
          />

          <Input
            placeholder="Bagni"
            type="number"
            value={filters.bathrooms}
            onChange={(event) => updateField('bathrooms', event.target.value)}
          />

          <Input
            placeholder="Codice proprietà"
            value={filters.code}
            onChange={(event) => updateField('code', event.target.value)}
          />

          <Input
            placeholder="Superficie min. (m²)"
            type="number"
            value={filters.minArea}
            onChange={(event) => updateField('minArea', event.target.value)}
          />

          <Input
            placeholder="Superficie max. (m²)"
            type="number"
            value={filters.maxArea}
            onChange={(event) => updateField('maxArea', event.target.value)}
          />

          <Input
            placeholder="Prezzo min. (€)"
            type="number"
            value={filters.minPrice}
            onChange={(event) => updateField('minPrice', event.target.value)}
          />

          <Input
            placeholder="Prezzo max. (€)"
            type="number"
            value={filters.maxPrice}
            onChange={(event) => updateField('maxPrice', event.target.value)}
          />
        </div>
      )}
    </form>
  )
}

export default SearchBar
