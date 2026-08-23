import {
  usePropertyOwnerControllerFind,
  useRentalContractTenantControllerFind,
  useSaleBuyerControllerFind,
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
  const { data: proposals } = usePurchaseProposalBuyerControllerFind({
    filter: { where: { personId }, include: [{ relation: 'proposal' }] },
  })

  return {
    ownerships: ownerships ?? [],
    tenancies: tenancies ?? [],
    purchases: purchases ?? [],
    proposals: proposals ?? [],
  }
}
