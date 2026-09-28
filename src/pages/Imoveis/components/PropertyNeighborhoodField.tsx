import { useState } from 'react'
import { Controller, type UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import SearchableSelect from '@/components/SearchableSelect'
import { useNeighborhoodOptions } from '@/hooks/useNeighborhoodOptions'
import PropertyNeighborhoodCreateModal from '@/pages/Imoveis/components/PropertyNeighborhoodCreateModal'
import type { Neighborhood } from '@/api/generated/models'
import type { PropertyFormValues } from '@/pages/Imoveis/schemas/propertySchema'

type PropertyNeighborhoodFieldProps = {
  form: UseFormReturn<PropertyFormValues>
  error?: string
}

// Quartiere cadastrado, filtrado pela cidade escolhida
function PropertyNeighborhoodField({ form, error }: PropertyNeighborhoodFieldProps) {
  const { t } = useTranslation('imoveis')
  const [creatingName, setCreatingName] = useState('')
  const city = form.watch('city')
  const options = useNeighborhoodOptions(city)

  function handleCreated(created: Neighborhood) {
    form.setValue('neighborhoodId', created.id ?? '')
  }

  function handleChange(value: string) {
    form.setValue('neighborhoodId', value)
  }

  return (
    <>
      <div id="property-field-neighborhoodId">
        <Controller
          control={form.control}
          name="neighborhoodId"
          render={({ field }) => (
            <SearchableSelect
              label={t('locationTab.neighborhoodLabel')}
              value={field.value}
              onValueChange={handleChange}
              options={options}
              placeholder={t('locationTab.neighborhoodPlaceholder')}
              searchPlaceholder={t('locationTab.neighborhoodSearchPlaceholder')}
              error={error}
              creatable
              onCreate={setCreatingName}
            />
          )}
        />
      </div>

      <PropertyNeighborhoodCreateModal
        open={!!creatingName}
        onOpenChange={(open) => !open && setCreatingName('')}
        city={city}
        initialName={creatingName}
        onCreated={handleCreated}
      />
    </>
  )
}

export default PropertyNeighborhoodField
