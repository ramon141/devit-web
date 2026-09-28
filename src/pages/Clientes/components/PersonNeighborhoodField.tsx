import { useState } from 'react'
import { Controller, type UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import SearchableSelect from '@/components/SearchableSelect'
import { useNeighborhoodOptions } from '@/hooks/useNeighborhoodOptions'
import PropertyNeighborhoodCreateModal from '@/pages/Imoveis/components/PropertyNeighborhoodCreateModal'
import type { Neighborhood } from '@/api/generated/models'
import type { PersonFormValues } from '@/pages/Clientes/schemas/personSchema'

type PersonNeighborhoodFieldProps = {
  form: UseFormReturn<PersonFormValues>
  error?: string
}

// Bairro cadastrado, filtrado pela cidade escolhida
function PersonNeighborhoodField({ form, error }: PersonNeighborhoodFieldProps) {
  const { t } = useTranslation('clientes')
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
      <div id="modal-field-neighborhoodId">
        <Controller
          control={form.control}
          name="neighborhoodId"
          render={({ field }) => (
            <SearchableSelect
              label={t('personFormFields.neighborhood')}
              value={field.value}
              onValueChange={handleChange}
              options={options}
              placeholder={t('personFormFields.neighborhoodPlaceholder')}
              searchPlaceholder={t('personFormFields.neighborhoodSearchPlaceholder')}
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
        city={city ?? ''}
        initialName={creatingName}
        onCreated={handleCreated}
      />
    </>
  )
}

export default PersonNeighborhoodField
