import { http, HttpResponse } from 'msw'
import {
  getRentalContractControllerCountMockHandler,
  getRentalContractControllerFindMockHandler,
  getRentalContractControllerFindResponseMock,
  getSaleControllerCountMockHandler,
  getSaleControllerFindMockHandler,
  getSaleControllerFindResponseMock,
} from '@/api/generated/api.msw'
import type { RentalContractWithRelations, SaleWithRelations } from '@/api/generated/models'

type ListFilter = { skip?: number; limit?: number }

// Venda de teste: parte do mock gerado e fixa só o que o teste precisa
export function makeSale(overrides: Partial<SaleWithRelations> = {}): SaleWithRelations {
  const base: SaleWithRelations = {
    ...(getSaleControllerFindResponseMock()[0] as SaleWithRelations),
    id: 's1',
    number: 'V-1',
    status: 'negotiating',
    finalAmount: 1000,
    saleDate: '2026-03-05T00:00:00.000Z',
    deedDate: undefined,
    notes: undefined,
    buyer: undefined,
    seller: undefined,
    property: undefined,
    saleBuyers: undefined,
    saleSellers: undefined,
  }

  return Object.assign({}, base, overrides)
}

export function makeContract(
  overrides: Partial<RentalContractWithRelations> = {},
): RentalContractWithRelations {
  const base: RentalContractWithRelations = {
    ...(getRentalContractControllerFindResponseMock()[0] as RentalContractWithRelations),
    id: 'c1',
    number: 'L-1',
    situation: 'active',
    rentAmount: 800,
    property: undefined,
    owner: undefined,
    tenant: undefined,
    rentalContractOwners: undefined,
    rentalContractTenants: undefined,
  }

  return Object.assign({}, base, overrides)
}

function readFilter(url: string): ListFilter {
  const raw = new URL(url).searchParams.get('filter')

  return raw ? JSON.parse(raw) : {}
}

function slice<TItem>(items: TItem[], url: string) {
  const { skip = 0, limit = items.length } = readFilter(url)

  return items.slice(skip, skip + limit)
}

// Lista de vendas em memória: respeita skip/limit e devolve o total no count
export function mockSaleList(getSales: () => SaleWithRelations[]) {
  return [
    getSaleControllerFindMockHandler(({ request }) => slice(getSales(), request.url)),
    getSaleControllerCountMockHandler(() => ({ count: getSales().length })),
  ]
}

export function mockRentalList(getContracts: () => RentalContractWithRelations[]) {
  return [
    getRentalContractControllerFindMockHandler(({ request }) => slice(getContracts(), request.url)),
    getRentalContractControllerCountMockHandler(() => ({ count: getContracts().length })),
  ]
}

// Marca a chamada de exclusão e responde 204
export function mockDelete(path: string, onDelete: (id: string) => void) {
  return http.delete(path, ({ params }) => {
    onDelete(String(params.id))

    return new HttpResponse(null, { status: 204 })
  })
}
