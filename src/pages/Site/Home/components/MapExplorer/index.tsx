import { useMemo, useState } from 'react'
import { useSiteDict } from '@/lib/site/dict'
import MapPinsLayer from '@/pages/Site/Home/components/MapExplorer/MapPinsLayer'
import { matchesPurpose } from '@/lib/site/property'
import MapFilters, { type ContractFilter } from '@/pages/Site/Home/components/MapExplorer/MapFilters'
import MapPinCard from '@/pages/Site/Home/components/MapExplorer/MapPinCard'
import type { MapPin } from '@/pages/Site/Home/types/mapPin'

/**
 * O mapa da home: todos os imóveis Devit como pontos sobre o golfo (mapa
 * OpenStreetMap navegável, com arrastar e zoom). Filtros por zona e contrato; clicar num ponto abre o cartão.
 */
function MapExplorer({ pins }: { pins: MapPin[] }) {
  const { dict } = useSiteDict()
  const [zone, setZone] = useState('')
  const [contract, setContract] = useState<ContractFilter>('')
  const [activeId, setActiveId] = useState<string | null>(null)

  const visible = useMemo(
    () =>
      pins.filter(
        (pin) =>
          (!zone || pin.zone === zone) &&
          matchesPurpose(pin.purpose, contract)
      ),
    [pins, zone, contract]
  )
  const active = visible.find((pin) => pin.id === activeId) ?? null

  return (
    <div className="mappa-explorer">
      <MapFilters
        zone={zone}
        contract={contract}
        count={visible.length}
        onZoneChange={setZone}
        onContractChange={setContract}
      />

      <div className="mappa-stage">
        <div className="mappa-static">
          <MapPinsLayer pins={visible} activeId={activeId} onSelect={setActiveId} />

          <p className="mappa-attr">{dict.map.attribution}</p>
        </div>

        {active && <MapPinCard pin={active} onClose={() => setActiveId(null)} />}
      </div>
    </div>
  )
}

export default MapExplorer
