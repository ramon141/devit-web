import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const SORT_OPTIONS = [
  { value: 'featured', label: 'Ordine predefinito' },
  { value: 'price-asc', label: 'Prezzo - Dal minore al maggiore' },
  { value: 'price-desc', label: 'Prezzo - Dal maggiore al minore' },
  { value: 'date-asc', label: 'Data - dalla meno recente' },
  { value: 'date-desc', label: 'Data - dalla più recente' },
  { value: 'title-asc', label: 'Title - ASC' },
  { value: 'title-desc', label: 'Title - DESC' },
]

type PropertySortProps = {
  value: string
  onChange: (value: string) => void
}

function PropertySort({ value, onChange }: PropertySortProps) {
  return (
    <Select
      value={value}
      onValueChange={(next) => onChange(next ?? 'featured')}
    >
      <SelectTrigger className="w-full sm:w-64">
        <SelectValue placeholder="Ordine predefinito" />
      </SelectTrigger>

      <SelectContent>
        {SORT_OPTIONS.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export default PropertySort
