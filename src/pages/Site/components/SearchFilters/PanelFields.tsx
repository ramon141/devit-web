import type { UseFormRegister } from 'react-hook-form'
import FormFieldWrapper from '@/components/FormFieldWrapper'
import { Input } from '@/components/ui/input'
import type { SiteDict } from '@/lib/site/dict'
import type { FilterValues } from '@/pages/Site/components/SearchFilters/filterValues'

type NumberFieldProps = {
  id: string
  label: string
  placeholder: string
  min: number
  step?: number
  max?: number
  name: keyof FilterValues
  register: UseFormRegister<FilterValues>
}

function NumberField({ id, label, placeholder, name, register, ...limits }: NumberFieldProps) {
  return (
    <FormFieldWrapper label={label} htmlFor={id}>
      <Input
        id={id}
        type="number"
        inputMode="numeric"
        placeholder={placeholder}
        {...limits}
        {...register(name)}
      />
    </FormFieldWrapper>
  )
}

// Campos extras do painel de filtros (a página de imóveis); o hero usa só os três selects
function PanelFields({ dict, register }: { dict: SiteDict; register: UseFormRegister<FilterValues> }) {
  return (
    <>
      <div className="grid grid-cols-2 gap-3">
        <NumberField
          id="f-pmin"
          name="priceMin"
          label={dict.search.priceMin}
          placeholder="0"
          min={0}
          step={10000}
          register={register}
        />
        <NumberField
          id="f-pmax"
          name="priceMax"
          label={dict.search.priceMax}
          placeholder="—"
          min={0}
          step={10000}
          register={register}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <NumberField
          id="f-smin"
          name="surfaceMin"
          label={dict.search.surfaceMin}
          placeholder="m²"
          min={0}
          step={10}
          register={register}
        />
        <NumberField
          id="f-bedrooms"
          name="bedroomsMin"
          label={dict.search.bedroomsMin}
          placeholder="—"
          min={1}
          max={10}
          register={register}
        />
      </div>

      <FormFieldWrapper label={dict.search.keyword} htmlFor="f-q">
        <Input id="f-q" type="search" {...register('q')} />
      </FormFieldWrapper>
    </>
  )
}

export default PanelFields
