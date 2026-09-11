import { useNeighborhoodControllerFind } from '@/api/generated/api'

// Opções "Città - Zona - Quartiere" para o multi-select de zonas da richiesta
export function useNeighborhoodOptions() {
  const { data: neighborhoods } = useNeighborhoodControllerFind({
    filter: {
      where: { active: true },
      order: ['name ASC'],
      include: [{ relation: 'zone' }],
    },
  })

  return (neighborhoods ?? []).map((neighborhood) => {
    const zone = neighborhood.zone

    const label = zone
      ? `${zone.city} - ${zone.name} - ${neighborhood.name}`
      : neighborhood.name

    return { value: neighborhood.id ?? '', label }
  })
}
