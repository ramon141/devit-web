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

// Quartiere cadastrado, filtrado pela cidade escolhida; guarda também o nome
// em "neighborhood" para o endereço continuar legível sem carregar a relação
function PropertyNeighborhoodField({ form, error }: PropertyNeighborhoodFieldProps) {
  const { t } = useTranslation('imoveis')
  const [creatingName, setCreatingName] = useState('')
  const city = form.watch('city')
  const options = useNeighborhoodOptions(city)

  function selectOption(value: string, label: string) {
    form.setValue('neighborhoodId', value)
    form.setValue('neighborhood', label)
  }

  function handleCreated(created: Neighborhood) {
    selectOption(created.id ?? '', created.name)
  }

  function handleChange(value: string) {
    const selected = options.find((option) => option.value === value)
    selectOption(value, selected?.label ?? '')
  }

  return (
    <>
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
            disabled={!city}
            error={error}
            creatable
            onCreate={setCreatingName}
          />
        )}
      />

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
