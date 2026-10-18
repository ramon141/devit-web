import { saleControllerCount } from '@/api/generated/api'

export type SaleConflict = 'duplicateNumber' | 'propertyAlreadySold' | null

type FindSaleConflictProps = {
  number: string
  propertyId: string
  saleId?: string
}

async function countSales(where: Record<string, unknown>) {
  const { count } = await saleControllerCount({ where })

  return count ?? 0
}

// Espelha as regras do backend: número único e um imóvel só pode ter uma venda concluída
export async function findSaleConflict({
  number,
  propertyId,
  saleId,
}: FindSaleConflictProps): Promise<SaleConflict> {
  const notSelf = saleId ? { id: { neq: saleId } } : {}

  if ((await countSales({ number, ...notSelf })) > 0) return 'duplicateNumber'

  // Só bloqueia criação: a edição de uma venda existente segue a regra de status do backend
  if (!saleId && (await countSales({ propertyId, status: 'sold' })) > 0) return 'propertyAlreadySold'

  return null
}
