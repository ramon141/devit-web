import { useTranslation } from 'react-i18next'
import type { TFunction } from 'i18next'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

function getSortOptions(t: TFunction<'site'>) {
  return [
    { value: 'featured', label: t('propertySort.featured') },
    { value: 'price-asc', label: t('propertySort.priceAsc') },
    { value: 'price-desc', label: t('propertySort.priceDesc') },
    { value: 'date-asc', label: t('propertySort.dateAsc') },
    { value: 'date-desc', label: t('propertySort.dateDesc') },
    { value: 'title-asc', label: t('propertySort.titleAsc') },
    { value: 'title-desc', label: t('propertySort.titleDesc') },
  ]
}

type PropertySortProps = {
  value: string
  onChange: (value: string) => void
}

function PropertySort({ value, onChange }: PropertySortProps) {
  const { t } = useTranslation('site')
  const sortOptions = getSortOptions(t)

  return (
    <Select
      value={value}
      onValueChange={(next) => onChange(next ?? 'featured')}
    >
      <SelectTrigger className="w-full sm:w-64">
        <SelectValue placeholder={t('propertySort.featured')}>
          {(current: string) => sortOptions.find((option) => option.value === current)?.label ?? current}
        </SelectValue>
      </SelectTrigger>

      <SelectContent>
        {sortOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export default PropertySort
