import FormFieldWrapper from '@/components/FormFieldWrapper'
import { PlusIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import SelectField from '@/components/SelectField'
import RemovableRow from '@/components/RemovableRow'
import type { PropertyIndustrialAreaAreaType } from '@/api/generated/models'
import { getIndustrialAreaTypeOptions } from '@/pages/Imoveis/Scheda/schemas/industrialAreaOptions'
import { usePropertyIndustrialAreas } from '@/pages/Imoveis/Scheda/hooks/usePropertyIndustrialAreas'
import { getOptionLabel } from '@/utils/getOptionLabel'

type PropertyIndustrialAreasManagerProps = {
  propertyId: string
}

function PropertyIndustrialAreasManager({ propertyId }: PropertyIndustrialAreasManagerProps) {
  const { t } = useTranslation('imoveis')
  const { areas, areaType, setAreaType, areaSqm, setAreaSqm, heightM, setHeightM, addArea, removeArea } =
    usePropertyIndustrialAreas(propertyId)
  const industrialAreaTypeOptions = getIndustrialAreaTypeOptions(t)

  return (
    <div className="sm:col-span-2">
      <p className="mb-2 text-sm font-medium">{t('scheda.industrialAreasManager.title')}</p>

      <div className="grid gap-2">
        {areas.map((area) => (
          <RemovableRow
            key={area.id}
            confirmName={getOptionLabel(industrialAreaTypeOptions, area.areaType)}
            onRemove={() => area.id && removeArea(area.id)}
          >
            <span className="text-sm">
              {getOptionLabel(industrialAreaTypeOptions, area.areaType)}
              {area.areaSqm != null && ` · ${area.areaSqm} m²`}
              {area.heightM != null && ` · h ${area.heightM}m`}
            </span>
          </RemovableRow>
        ))}
      </div>

      <div className="mt-2 flex flex-wrap items-end gap-2">
        <div className="min-w-40 flex-1">
          <FormFieldWrapper label={t('scheda.industrialAreasManager.areaTypeLabel')}>
            <SelectField
              value={areaType}
              onValueChange={(value) => setAreaType(value as PropertyIndustrialAreaAreaType)}
              options={industrialAreaTypeOptions}
              placeholder={t('scheda.industrialAreasManager.areaTypePlaceholder')}
            />
          </FormFieldWrapper>
        </div>
        <FormFieldWrapper className="min-w-28 flex-1" label={t('scheda.industrialAreasManager.areaLabel')}>
          <Input
            value={areaSqm}
            onChange={(e) => setAreaSqm(e.target.value)}
            type="number"
            placeholder={t('scheda.industrialAreasManager.areaPlaceholder')}
          />
        </FormFieldWrapper>
        <FormFieldWrapper className="min-w-28 flex-1" label={t('scheda.industrialAreasManager.heightLabel')}>
          <Input
            value={heightM}
            onChange={(e) => setHeightM(e.target.value)}
            type="number"
            placeholder={t('scheda.industrialAreasManager.heightPlaceholder')}
          />
        </FormFieldWrapper>
        <Button type="button" className="h-10" onClick={addArea}>
          <PlusIcon data-icon="inline-start" />
          {t('scheda.industrialAreasManager.add')}
        </Button>
      </div>
    </div>
  )
}

export default PropertyIndustrialAreasManager
