import { useMemo, useState } from 'react'
import { useSiteDict } from '@/lib/site/dict'
import { MAP, inMap, project } from '@/lib/site/geo'
import { matchesPurpose } from '@/lib/site/property'
import MapFilters, { type ContractFilter } from '@/pages/Site/Home/components/MapExplorer/MapFilters'
import MapPinCard from '@/pages/Site/Home/components/MapExplorer/MapPinCard'
import type { MapPin } from '@/pages/Site/Home/types/mapPin'

/**
 * O mapa da home: todos os imóveis Devit como pontos sobre o golfo (imagem
 * OpenStreetMap costurada, sem scripts externos nem chave), posicionados por
 * projeção Mercator. Filtros por zona e contrato; clicar num ponto abre o cartão.
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
          inMap(pin.lat, pin.lng) &&
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
          <img
            src={MAP.src}
            alt=""
            width={MAP.width}
            height={MAP.height}
            loading="lazy"
            decoding="async"
            className="block h-auto w-full"
          />

          {visible.map((pin) => {
            const { x, y } = project(pin.lat, pin.lng)
            const classes = [
              'mappa-punto',
              activeId === pin.id ? 'is-active' : '',
              pin.purpose === 'rent' ? 'mappa-punto--affitto' : '',
            ].join(' ')

            return (
              <button
                key={pin.id}
                type="button"
                className={classes}
                style={{ left: `${x}%`, top: `${y}%` }}
                onClick={() => setActiveId(activeId === pin.id ? null : pin.id)}
                aria-label={pin.title}
              />
            )
          })}

          <p className="mappa-attr">{dict.map.attribution}</p>
        </div>

        {active && <MapPinCard pin={active} onClose={() => setActiveId(null)} />}
      </div>
    </div>
  )
}

export default MapExplorer
