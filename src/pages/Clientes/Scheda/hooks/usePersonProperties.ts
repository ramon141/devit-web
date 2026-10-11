import {
  usePropertyOwnerControllerFind,
  useRentalContractTenantControllerFind,
  useSaleBuyerControllerFind,
  useSaleSellerControllerFind,
  usePropertyControllerFind,
  usePurchaseProposalBuyerControllerFind,
} from '@/api/generated/api'

export function usePersonProperties(personId: string) {
  const { data: ownerships } = usePropertyOwnerControllerFind({
    filter: { where: { personId }, include: [{ relation: 'property' }] },
  })
  const { data: tenancies } = useRentalContractTenantControllerFind({
    filter: { where: { personId }, include: [{ relation: 'rentalContract' }] },
  })
  const { data: purchases } = useSaleBuyerControllerFind({
    filter: { where: { personId }, include: [{ relation: 'sale' }] },
  })
  const { data: sales } = useSaleSellerControllerFind({
    filter: { where: { personId }, include: [{ relation: 'sale' }] },
  })
  const { data: ownedProperties } = usePropertyControllerFind({
    filter: { where: { ownerId: personId } },
  })
  const { data: proposals } = usePurchaseProposalBuyerControllerFind({
    filter: { where: { personId }, include: [{ relation: 'proposal' }] },
  })

  const coOwnedIds = new Set((ownerships ?? []).map((link) => link.propertyId))
  const primaryOwned = (ownedProperties ?? []).filter((property) => !coOwnedIds.has(property.id ?? ''))

  return {
    ownerships: ownerships ?? [],
    primaryOwned,
    sales: sales ?? [],
    tenancies: tenancies ?? [],
    purchases: purchases ?? [],
    proposals: proposals ?? [],
  }
}
