import { useTranslation } from 'react-i18next'
import { SlidersHorizontalIcon } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import FormFieldWrapper from '@/components/FormFieldWrapper'
import type { PropertyFiltersValues } from '@/pages/Imoveis/hooks/usePropertyList'

type PropertyFiltersPriceRangeToggleProps = {
  filters: PropertyFiltersValues
  update: (patch: Partial<PropertyFiltersValues>) => void
  onToggleAdvanced: () => void
}

function PropertyFiltersPriceRangeToggle({
  filters,
  update,
  onToggleAdvanced,
}: PropertyFiltersPriceRangeToggleProps) {
  const { t } = useTranslation('imoveis')

  return (
    <>
      <FormFieldWrapper label={t('filters.priceFromLabel')}>
        <Input
          value={filters.priceMin}
          onChange={(event) => update({ priceMin: event.target.value })}
          type="number"
          placeholder={t('filters.priceFromPlaceholder')}
        />
      </FormFieldWrapper>

      <FormFieldWrapper label={t('filters.priceToLabel')}>
        <Input
          value={filters.priceMax}
          onChange={(event) => update({ priceMax: event.target.value })}
          type="number"
          placeholder={t('filters.priceToPlaceholder')}
        />
      </FormFieldWrapper>

      <Button type="button" variant="outline" className="gap-1.5" onClick={onToggleAdvanced}>
        <SlidersHorizontalIcon className="size-4" />
        {t('filters.advancedFilters')}
      </Button>
    </>
  )
}

export default PropertyFiltersPriceRangeToggle
