import { useNeighborhoodControllerFind } from '@/api/generated/api'

// Opções de quartiere; com "city" mostra apenas os da cidade e encurta o label
export function useNeighborhoodOptions(city?: string) {
  const { data: neighborhoods } = useNeighborhoodControllerFind({
    filter: {
      where: { active: true },
      order: ['name ASC'],
      include: [{ relation: 'zone' }],
    },
  })

  return (neighborhoods ?? [])
    .filter((neighborhood) => !city || neighborhood.zone?.city === city)
    .map((neighborhood) => {
      const zone = neighborhood.zone

      const label = !zone
        ? neighborhood.name
        : city
          ? `${zone.name} - ${neighborhood.name}`
          : `${zone.city} - ${zone.name} - ${neighborhood.name}`

      return { value: neighborhood.id ?? '', label }
    })
}
