import { useTranslation } from 'react-i18next'
import { Checkbox } from '@/components/ui/checkbox'
import type { PropertyFiltersValues } from '@/pages/Imoveis/hooks/usePropertyList'

type PropertyFiltersCheckboxesProps = {
  filters: PropertyFiltersValues
  update: (patch: Partial<PropertyFiltersValues>) => void
}

function PropertyFiltersCheckboxes({ filters, update }: PropertyFiltersCheckboxesProps) {
  const { t } = useTranslation('imoveis')

  return (
    <>
      <label className="flex items-center gap-2 self-end pb-2 text-sm">
        <Checkbox
          checked={filters.onlyMine}
          onCheckedChange={(checked) => update({ onlyMine: checked === true })}
        />
        {t('filters.onlyMine')}
      </label>

      <label className="flex items-center gap-2 self-end pb-2 text-sm">
        <Checkbox
          checked={filters.onlyPrestige}
          onCheckedChange={(checked) => update({ onlyPrestige: checked === true })}
        />
        {t('filters.onlyPrestige')}
      </label>

      <label className="flex items-center gap-2 self-end pb-2 text-sm">
        <Checkbox
          checked={filters.onlyAuction}
          onCheckedChange={(checked) => update({ onlyAuction: checked === true })}
        />
        {t('filters.onlyAuction')}
      </label>
    </>
  )
}

export default PropertyFiltersCheckboxes
