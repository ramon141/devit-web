import { useState } from 'react'
import { useNavigate } from 'react-router'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

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

const FIELD_CLASS =
  'h-12 rounded-none border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0'

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
    navigate(`/risultati?${buildQueryString(filters)}`)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto w-full max-w-5xl overflow-hidden rounded-xl border border-border bg-background shadow-xl"
    >
      <div className="grid divide-y divide-border sm:grid-cols-[1.2fr_1.6fr_auto] sm:divide-x sm:divide-y-0">
        <Input
          placeholder="Città"
          value={filters.city}
          onChange={(event) => updateField('city', event.target.value)}
          className={cn(FIELD_CLASS, 'px-4')}
        />

        <div className="relative flex items-center">
          <Search className="pointer-events-none absolute left-4 size-4 text-muted-foreground" />
          <Input
            placeholder="Inserisci un indirizzo, città, via, CAP o codice"
            value={filters.keyword}
            onChange={(event) => updateField('keyword', event.target.value)}
            className={cn(FIELD_CLASS, 'pl-10')}
          />
        </div>

        <Button
          type="submit"
          className="h-12 rounded-none bg-[var(--devit-navy-dark)] px-8 text-white hover:bg-[var(--devit-navy-dark)]/90"
        >
          Ricerca
        </Button>
      </div>

      <button
        type="button"
        className="w-full border-t border-border bg-muted/40 px-4 py-2 text-left text-sm font-medium text-primary hover:underline"
        onClick={() => setShowAdvanced((current) => !current)}
      >
        {showAdvanced ? 'Nascondi filtri avanzati' : 'Avanzate'}
      </button>

      {showAdvanced && (
        <div className="grid divide-y divide-border border-t border-border sm:grid-cols-3 sm:divide-x sm:divide-y-0 md:grid-cols-6">
          <Input
            placeholder="Camere"
            type="number"
            value={filters.bedrooms}
            onChange={(event) => updateField('bedrooms', event.target.value)}
            className={cn(FIELD_CLASS, 'px-4')}
          />

          <Input
            placeholder="Bagni"
            type="number"
            value={filters.bathrooms}
            onChange={(event) => updateField('bathrooms', event.target.value)}
            className={cn(FIELD_CLASS, 'px-4')}
          />

          <Input
            placeholder="Superficie min. (m²)"
            type="number"
            value={filters.minArea}
            onChange={(event) => updateField('minArea', event.target.value)}
            className={cn(FIELD_CLASS, 'px-4')}
          />

          <Input
            placeholder="Superficie max. (m²)"
            type="number"
            value={filters.maxArea}
            onChange={(event) => updateField('maxArea', event.target.value)}
            className={cn(FIELD_CLASS, 'px-4')}
          />

          <Input
            placeholder="Prezzo min. (€)"
            type="number"
            value={filters.minPrice}
            onChange={(event) => updateField('minPrice', event.target.value)}
            className={cn(FIELD_CLASS, 'px-4')}
          />

          <Input
            placeholder="Prezzo max. (€)"
            type="number"
            value={filters.maxPrice}
            onChange={(event) => updateField('maxPrice', event.target.value)}
            className={cn(FIELD_CLASS, 'px-4')}
          />
        </div>
      )}

      {showAdvanced && (
        <div className="border-t border-border p-3">
          <Input
            placeholder="Codice proprietà"
            value={filters.code}
            onChange={(event) => updateField('code', event.target.value)}
          />
        </div>
      )}
    </form>
  )
}

export default SearchBar
