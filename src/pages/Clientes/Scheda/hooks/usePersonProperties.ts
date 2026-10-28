import {
  usePropertyOwnerControllerFind,
  useRentalContractTenantControllerFind,
  useSaleBuyerControllerFind,
  useSaleSellerControllerFind,
  usePropertyControllerFind,
  usePurchaseProposalBuyerControllerFind,
  useRentalContractControllerFind,
  useSaleControllerFind,
  usePurchaseProposalControllerFind,
} from '@/api/generated/api'
import { mergeLinks } from '@/pages/Clientes/Scheda/utils/personLinks'
import type { PersonLink } from '@/pages/Clientes/Scheda/utils/personLinks'

// Contratos, vendas e propostas guardam a parte principal na própria linha
// (tenantId, buyerId...) e as partes adicionais nas tabelas de vínculo:
// é preciso ler os dois lados para não esconder nenhum vínculo
function usePrimaryParties(personId: string) {
  const { data: contracts } = useRentalContractControllerFind({
    filter: { where: { or: [{ tenantId: personId }, { ownerId: personId }] } },
  })
  const { data: sales } = useSaleControllerFind({
    filter: { where: { or: [{ buyerId: personId }, { sellerId: personId }] } },
  })
  const { data: proposals } = usePurchaseProposalControllerFind({
    filter: { where: { buyerId: personId } },
  })

  return { contracts: contracts ?? [], sales: sales ?? [], proposals: proposals ?? [] }
}

function useLinkedParties(personId: string) {
  const byPerson = { where: { personId } }

  const { data: ownerships } = usePropertyOwnerControllerFind({
    filter: { ...byPerson, include: [{ relation: 'property' }] },
  })
  const { data: tenancies } = useRentalContractTenantControllerFind({
    filter: { ...byPerson, include: [{ relation: 'rentalContract' }] },
  })
  const { data: purchases } = useSaleBuyerControllerFind({
    filter: { ...byPerson, include: [{ relation: 'sale' }] },
  })
  const { data: sellings } = useSaleSellerControllerFind({
    filter: { ...byPerson, include: [{ relation: 'sale' }] },
  })
  const { data: proposals } = usePurchaseProposalBuyerControllerFind({
    filter: { ...byPerson, include: [{ relation: 'proposal' }] },
  })

  return {
    ownerships: ownerships ?? [],
    tenancies: tenancies ?? [],
    purchases: purchases ?? [],
    sellings: sellings ?? [],
    proposals: proposals ?? [],
  }
}

export function usePersonProperties(personId: string): PersonLink[] {
  const linked = useLinkedParties(personId)
  const primary = usePrimaryParties(personId)
  const { data: ownedProperties } = usePropertyControllerFind({
    filter: { where: { ownerId: personId } },
  })

  return mergeLinks(personId, linked, primary, ownedProperties ?? [])
}
