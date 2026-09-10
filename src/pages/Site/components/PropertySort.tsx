import { useTranslation } from 'react-i18next'
import type { TFunction } from 'i18next'
import SelectField from '@/components/SelectField'

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

  return (
    <div className="w-full sm:w-64">
      <SelectField
        value={value}
        onValueChange={(next) => onChange(next || 'featured')}
        options={getSortOptions(t)}
        placeholder={t('propertySort.featured')}
        clearable={false}
      />
    </div>
  )
}

export default PropertySort
