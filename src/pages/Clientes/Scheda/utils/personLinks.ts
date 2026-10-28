import type {
  PropertyOwnerWithRelations,
  PropertyWithRelations,
  PurchaseProposalBuyerWithRelations,
  PurchaseProposalWithRelations,
  RentalContractTenantWithRelations,
  RentalContractWithRelations,
  SaleBuyerWithRelations,
  SaleSellerWithRelations,
  SaleWithRelations,
} from '@/api/generated/models'

export type PersonLinkRole = 'owner' | 'seller' | 'tenant' | 'landlord' | 'buyer' | 'proposal'

export type PersonLink = {
  role: PersonLinkRole
  id: string
  text: string
}

type LinkedParties = {
  ownerships: PropertyOwnerWithRelations[]
  tenancies: RentalContractTenantWithRelations[]
  purchases: SaleBuyerWithRelations[]
  sellings: SaleSellerWithRelations[]
  proposals: PurchaseProposalBuyerWithRelations[]
}

type PrimaryParties = {
  contracts: RentalContractWithRelations[]
  sales: SaleWithRelations[]
  proposals: PurchaseProposalWithRelations[]
}

function propertyText(property?: PropertyWithRelations) {
  return [property?.code, property?.title].filter(Boolean).join(' · ')
}

function fromLinked(linked: LinkedParties): PersonLink[] {
  return [
    ...linked.ownerships.map((link) => ({
      role: 'owner' as const,
      id: link.propertyId,
      text: propertyText(link.property),
    })),
    ...linked.sellings.map((link) => ({
      role: 'seller' as const,
      id: link.saleId,
      text: link.sale?.number ?? '',
    })),
    ...linked.tenancies.map((link) => ({
      role: 'tenant' as const,
      id: link.rentalContractId,
      text: link.rentalContract?.number ?? '',
    })),
    ...linked.purchases.map((link) => ({
      role: 'buyer' as const,
      id: link.saleId,
      text: link.sale?.number ?? '',
    })),
    ...linked.proposals.map((link) => ({
      role: 'proposal' as const,
      id: link.proposalId,
      text: link.proposal?.number ?? '',
    })),
  ]
}

function fromPrimary(personId: string, primary: PrimaryParties): PersonLink[] {
  const contractLinks = primary.contracts.flatMap((contract) => [
    ...(contract.tenantId === personId ? [{ role: 'tenant' as const }] : []),
    ...(contract.ownerId === personId ? [{ role: 'landlord' as const }] : []),
  ].map(({ role }) => ({ role, id: contract.id ?? '', text: contract.number })))

  const saleLinks = primary.sales.flatMap((sale) => [
    ...(sale.sellerId === personId ? [{ role: 'seller' as const }] : []),
    ...(sale.buyerId === personId ? [{ role: 'buyer' as const }] : []),
  ].map(({ role }) => ({ role, id: sale.id ?? '', text: sale.number })))

  const proposalLinks = primary.proposals.map((proposal) => ({
    role: 'proposal' as const,
    id: proposal.id ?? '',
    text: proposal.number,
  }))

  return [...contractLinks, ...saleLinks, ...proposalLinks]
}

// Une vínculos das tabelas de partes com a parte principal de cada registro, sem repetir
export function mergeLinks(
  personId: string,
  linked: LinkedParties,
  primary: PrimaryParties,
  ownedProperties: PropertyWithRelations[],
): PersonLink[] {
  const owned = ownedProperties.map((property) => ({
    role: 'owner' as const,
    id: property.id ?? '',
    text: propertyText(property),
  }))

  const all = [...fromLinked(linked), ...owned, ...fromPrimary(personId, primary)]
  const seen = new Set<string>()

  return all.filter((link) => {
    const key = `${link.role}:${link.id}`
    if (seen.has(key)) return false

    seen.add(key)
    return true
  })
}
