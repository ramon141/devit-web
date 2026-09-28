import SelectField from '@/components/SelectField'
import { useSiteDict } from '@/lib/site/dict'
import type { Purpose } from '@/lib/site/types'
import { useZones } from '@/pages/Site/hooks/useSiteData'

export type ContractFilter = Purpose | ''

type MapFiltersProps = {
  zone: string
  contract: ContractFilter
  count: number
  onZoneChange: (zone: string) => void
  onContractChange: (contract: ContractFilter) => void
}

const CHIP_BASE = 'rounded-full border px-4 py-2 text-sm transition-colors '
const CHIP_ON = 'border-site-ink bg-site-ink text-site-cream'
const CHIP_OFF = 'border-site-line bg-white text-site-ink hover:border-site-accent-deep'

function MapFilters({ zone, contract, count, onZoneChange, onContractChange }: MapFiltersProps) {
  const { dict } = useSiteDict()
  const { data: zones } = useZones()

  const contracts: Array<{ value: ContractFilter; label: string }> = [
    { value: '', label: dict.map.all },
    { value: 'sale', label: dict.search.sale },
    { value: 'rent', label: dict.search.rent },
  ]

  return (
    <div className="mb-5 flex flex-wrap items-center gap-2">
      <div className="w-56">
        <SelectField
          value={zone}
          onValueChange={onZoneChange}
          options={(zones ?? []).map((item) => ({ value: item.slug ?? '', label: item.name ?? '' }))}
          placeholder={dict.search.allZones}
        />
      </div>

      <div className="flex gap-2" role="group" aria-label={dict.search.contract}>
        {contracts.map((item) => (
          <button
            key={item.value}
            type="button"
            className={CHIP_BASE + (contract === item.value ? CHIP_ON : CHIP_OFF)}
            onClick={() => onContractChange(item.value)}
          >
            {item.label}
          </button>
        ))}
      </div>

      <p className="ml-auto font-site-mono text-[0.7rem] uppercase tracking-[0.14em] text-site-muted">
        <span>{count}</span> {dict.map.onMap}
      </p>
    </div>
  )
}

export default MapFilters
