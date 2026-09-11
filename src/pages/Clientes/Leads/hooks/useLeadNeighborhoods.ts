import {
  useLeadNeighborhoodControllerCreate,
  useLeadNeighborhoodControllerDeleteById,
  useLeadNeighborhoodControllerFind,
} from '@/api/generated/api'

// Sincroniza as zonas de interesse da richiesta: remove as que saíram e cria as novas
export function useLeadNeighborhoods(leadId?: string) {
  const { mutateAsync: create } = useLeadNeighborhoodControllerCreate()
  const { mutateAsync: remove } = useLeadNeighborhoodControllerDeleteById()

  const { data: links } = useLeadNeighborhoodControllerFind(
    { filter: { where: { leadId } } },
    { query: { enabled: !!leadId } }
  )

  const neighborhoodIds = (links ?? []).map((link) => link.neighborhoodId)

  async function sync(targetLeadId: string, selectedIds: string[]) {
    const current = links ?? []

    const toRemove = current.filter((link) => !selectedIds.includes(link.neighborhoodId))
    const toAdd = selectedIds.filter(
      (id) => !current.some((link) => link.neighborhoodId === id)
    )

    await Promise.all(toRemove.map((link) => remove({ id: link.id ?? '' })))

    await Promise.all(
      toAdd.map((neighborhoodId) =>
        create({ data: { leadId: targetLeadId, neighborhoodId } })
      )
    )
  }

  return { neighborhoodIds, sync }
}
