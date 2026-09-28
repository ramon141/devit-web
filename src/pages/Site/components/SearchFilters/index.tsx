import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router'
import ControlledSelectField from '@/components/ControlledSelectField'
import { Button, buttonVariants } from '@/components/ui/button'
import { useSiteDict } from '@/lib/site/dict'
import { SITE_PATHS } from '@/lib/site/paths'
import PanelFields from '@/pages/Site/components/SearchFilters/PanelFields'
import { toSearchString, type FilterValues } from '@/pages/Site/components/SearchFilters/filterValues'
import { useCategoryFacets, useZones } from '@/pages/Site/hooks/useSiteData'

type SearchFiltersProps = {
  current: FilterValues
  variant?: 'panel' | 'hero'
}

const HERO_FORM =
  'grid gap-4 rounded-2xl bg-white/95 p-6 text-site-ink shadow-[0_20px_60px_-20px_rgb(11_11_11/0.35)] ' +
  'backdrop-blur sm:grid-cols-2 lg:grid-cols-4'

/**
 * Formulário de busca: cada combinação de filtro vira query string em
 * /immobili, então a URL é compartilhável. O pai remonta o componente (via
 * `key`) quando a URL muda, para os campos refletirem os filtros atuais.
 */
function SearchFilters({ current, variant = 'panel' }: SearchFiltersProps) {
  const { dict } = useSiteDict()
  const navigate = useNavigate()
  const compact = variant === 'hero'
  const { register, control, handleSubmit } = useForm<FilterValues>({ defaultValues: current })
  const { data: zones } = useZones()
  const { data: facets } = useCategoryFacets()

  const contractOptions = [
    { value: 'sale', label: dict.search.sale },
    { value: 'rent', label: dict.search.rent },
  ]
  const zoneOptions = (zones ?? []).map((zone) => ({
    value: zone.slug ?? '',
    label: `${zone.name} (${zone.propertiesCount ?? 0})`,
  }))
  const categoryOptions = (facets?.byCategory ?? [])
    .filter((category) => (category.count ?? 0) > 0)
    .map((category) => ({ value: category.slug ?? '', label: category.name ?? '' }))

  function onSubmit(values: FilterValues) {
    const search = toSearchString(values)
    navigate(`${SITE_PATHS.properties}${search ? `?${search}` : ''}`)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={compact ? HERO_FORM : 'grid gap-5'}>
      <ControlledSelectField
        id="f-contract"
        control={control}
        name="contract"
        label={dict.search.contract}
        options={contractOptions}
        placeholder={dict.search.any}
      />
      <ControlledSelectField
        id="f-zone"
        control={control}
        name="zone"
        label={dict.search.zone}
        options={zoneOptions}
        placeholder={dict.search.allZones}
      />
      <ControlledSelectField
        id="f-category"
        control={control}
        name="category"
        label={dict.search.category}
        options={categoryOptions}
        placeholder={dict.search.allTypologies}
      />

      {!compact && <PanelFields dict={dict} register={register} />}

      <div className={compact ? 'flex items-end' : 'flex flex-wrap gap-3 pt-1'}>
        <Button type="submit" className="w-full">
          {dict.search.submit}
        </Button>
        {!compact && (
          <Link
            to={SITE_PATHS.properties}
            className={buttonVariants({ variant: 'outline', className: 'w-full' })}
          >
            {dict.search.reset}
          </Link>
        )}
      </div>
    </form>
  )
}

export default SearchFilters
