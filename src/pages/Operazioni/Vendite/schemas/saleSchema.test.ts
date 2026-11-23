import { describe, expect, it } from 'vitest'
import i18n from '@/i18n'
import { createSaleSchema, getSaleStatusOptions } from './saleSchema'
import type { SaleFormValues } from './saleSchema'

const baseValues: SaleFormValues = {
  number: 'V-1',
  propertyId: 'p1',
  buyerId: 'b1',
  sellerId: 's1',
  finalAmount: '100000',
  saleDate: '2026-05-10',
  deedDate: '',
  installmentsCount: '',
  commissionAmount: '',
  status: 'negotiating',
  cancellationReason: '',
  notes: '',
}

// Devolve as mensagens de erro por campo
function errorsOf(overrides: Partial<SaleFormValues>) {
  const result = createSaleSchema(i18n.t).safeParse({ ...baseValues, ...overrides })

  if (result.success) return {}

  const byField: Record<string, string[]> = {}

  for (const issue of result.error.issues) {
    const field = String(issue.path[0])

    byField[field] = [...(byField[field] ?? []), issue.message]
  }

  return byField
}

describe('Vendite: regras do formulário de venda', () => {
  it('T178 escritura antes da venda é recusada; no mesmo dia é aceita', () => {
    const before = errorsOf({ saleDate: '2026-05-10', deedDate: '2026-05-09' })
    const sameDay = errorsOf({ saleDate: '2026-05-10', deedDate: '2026-05-10' })

    expect(before.deedDate).toEqual(['La data del rogito non può precedere la data della vendita'])
    expect(sameDay.deedDate).toBeUndefined()
  })

  it('T179 comissão acima do valor é recusada; igual ao valor é aceita', () => {
    const above = errorsOf({ finalAmount: '100000', commissionAmount: '100001' })
    const equal = errorsOf({ finalAmount: '100000', commissionAmount: '100000' })

    expect(above.commissionAmount).toEqual([
      'La provvigione non può superare il valore della vendita',
    ])
    expect(equal.commissionAmount).toBeUndefined()
  })

  it('T180 comprador e vendedor iguais dão erro no campo vendedor', () => {
    const errors = errorsOf({ buyerId: 'x1', sellerId: 'x1' })

    expect(errors.sellerId).toEqual(['Acquirente e venditore devono essere persone diverse'])
    expect(errorsOf({ buyerId: 'x1', sellerId: 'x2' }).sellerId).toBeUndefined()
  })

  it.each([
    ['sem motivo', ''],
    ['motivo só de espaços', '   '],
  ])('T181 venda cancelada %s exige o motivo', (_label, reason) => {
    const errors = errorsOf({ status: 'canceled', cancellationReason: reason })

    expect(errors.cancellationReason).toEqual(["Indica il motivo dell'annullamento"])
  })

  it('T181 venda cancelada com motivo escrito é aceita', () => {
    const errors = errorsOf({ status: 'canceled', cancellationReason: 'Comprador desistiu' })

    expect(errors.cancellationReason).toBeUndefined()
  })

  it.each([
    ['0', true],
    ['2.5', true],
    ['3', false],
    ['', false],
  ])('T182 parcelas "%s" recusada=%s', (value, refused) => {
    const errors = errorsOf({ installmentsCount: value })

    expect(Boolean(errors.installmentsCount)).toBe(refused)
  })

  it('T183 valor final vazio pede o valor; 0 e -1 pedem valor positivo', () => {
    expect(errorsOf({ finalAmount: '' }).finalAmount).toContain('Inserisci il valore finale')

    for (const value of ['0', '-1']) {
      expect(errorsOf({ finalAmount: value }).finalAmount).toEqual([
        'Il valore finale deve essere maggiore di zero',
      ])
    }
  })

  it('T184 comissão -1 é recusada; 0 é aceita', () => {
    expect(errorsOf({ commissionAmount: '-1' }).commissionAmount).toEqual([
      'La provvigione non può essere negativa',
    ])
    expect(errorsOf({ commissionAmount: '0' }).commissionAmount).toBeUndefined()
  })

  it('T187 as três situações aparecem com o rótulo certo em italiano e português', async () => {
    const values = (lang: string) =>
      getSaleStatusOptions(i18n.getFixedT(lang)).map((option) => [option.value, option.label])

    expect(values('it')).toEqual([
      ['negotiating', 'In trattativa'],
      ['sold', 'Venduta'],
      ['canceled', 'Annullata'],
    ])
    expect(values('pt')).toEqual([
      ['negotiating', 'Em negociação'],
      ['sold', 'Vendida'],
      ['canceled', 'Cancelada'],
    ])
  })
})
