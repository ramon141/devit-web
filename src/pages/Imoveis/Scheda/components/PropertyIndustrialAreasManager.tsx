import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import SelectField from '@/components/SelectField'
import RemovableRow from '@/components/RemovableRow'
import type { PropertyIndustrialAreaAreaType } from '@/api/generated/models'
import { industrialAreaTypeOptions } from '@/pages/Imoveis/Scheda/schemas/industrialAreaOptions'
import { usePropertyIndustrialAreas } from '@/pages/Imoveis/Scheda/hooks/usePropertyIndustrialAreas'
import { getOptionLabel } from '@/utils/getOptionLabel'

type PropertyIndustrialAreasManagerProps = {
  propertyId: string
}

function PropertyIndustrialAreasManager({ propertyId }: PropertyIndustrialAreasManagerProps) {
  const { areas, areaType, setAreaType, areaSqm, setAreaSqm, heightM, setHeightM, addArea, removeArea } =
    usePropertyIndustrialAreas(propertyId)

  return (
    <div className="sm:col-span-2">
      <p className="mb-2 text-sm font-medium">Superfici e altezze per ambiente</p>

      <div className="grid gap-2">
        {areas.map((area) => (
          <RemovableRow key={area.id} onRemove={() => area.id && removeArea(area.id)}>
            <span className="text-sm">
              {getOptionLabel(industrialAreaTypeOptions, area.areaType)}
              {area.areaSqm != null && ` · ${area.areaSqm} m²`}
              {area.heightM != null && ` · h ${area.heightM}m`}
            </span>
          </RemovableRow>
        ))}
      </div>

      <div className="mt-2 flex flex-wrap items-end gap-2">
        <div className="min-w-40">
          <SelectField
            value={areaType}
            onValueChange={(value) => setAreaType(value as PropertyIndustrialAreaAreaType)}
            options={industrialAreaTypeOptions}
            placeholder="Tipo area"
          />
        </div>
        <Input value={areaSqm} onChange={(e) => setAreaSqm(e.target.value)} type="number" placeholder="M²" className="w-28" />
        <Input value={heightM} onChange={(e) => setHeightM(e.target.value)} type="number" placeholder="Altezza (m)" className="w-32" />
        <Button type="button" onClick={addArea}>Aggiungi</Button>
      </div>
    </div>
  )
}

export default PropertyIndustrialAreasManager
