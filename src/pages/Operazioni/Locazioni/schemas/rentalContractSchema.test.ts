import { describe, expect, it } from 'vitest'
import i18n from '@/i18n'
import { createRentalContractSchema, getRentalSituationOptions } from './rentalContractSchema'
import type { RentalContractFormValues } from './rentalContractSchema'

const baseValues: RentalContractFormValues = {
  number: 'L-1',
  propertyId: 'p1',
  tenantId: 't1',
  ownerId: 'o1',
  startDate: '2026-01-01',
  endDate: '',
  dueDay: '5',
  rentAmount: '800',
  noticeDays: '',
  situation: 'active',
}

// Devolve as mensagens de erro por campo
function errorsOf(overrides: Partial<RentalContractFormValues>) {
  const result = createRentalContractSchema(i18n.t).safeParse({ ...baseValues, ...overrides })

  if (result.success) return {}

  const byField: Record<string, string[]> = {}

  for (const issue of result.error.issues) {
    const field = String(issue.path[0])

    byField[field] = [...(byField[field] ?? []), issue.message]
  }

  return byField
}

describe('Locazioni: regras do formulário de locação', () => {
  it.each([
    ['0', true],
    ['32', true],
    ['1.5', true],
    ['1', false],
    ['31', false],
  ])('T188 dia de vencimento "%s" recusado=%s', (value, refused) => {
    expect(Boolean(errorsOf({ dueDay: value }).dueDay)).toBe(refused)
  })

  it.each([
    ['-1', true],
    ['1.5', true],
    ['0', false],
    ['', false],
  ])('T189 aviso prévio "%s" recusado=%s', (value, refused) => {
    expect(Boolean(errorsOf({ noticeDays: value }).noticeDays)).toBe(refused)
  })

  it('T190 término depois do início ou em branco é aceito', () => {
    expect(errorsOf({ startDate: '2026-01-01', endDate: '2026-12-31' }).endDate).toBeUndefined()
    expect(errorsOf({ startDate: '2026-01-01', endDate: '' }).endDate).toBeUndefined()
  })

  it.each([
    ['igual ao início', '2026-01-01'],
    ['anterior ao início', '2025-12-31'],
  ])('T190 término %s é recusado', (_label, endDate) => {
    const errors = errorsOf({ startDate: '2026-01-01', endDate })

    expect(errors.endDate).toEqual(['La data di fine deve essere successiva alla data di inizio'])
  })

  it('T191 contrato vazio avisa os sete campos obrigatórios', () => {
    const errors = errorsOf({
      number: '',
      propertyId: '',
      tenantId: '',
      ownerId: '',
      startDate: '',
      dueDay: '',
      rentAmount: '',
    })

    expect(Object.keys(errors).sort()).toEqual(
      ['dueDay', 'number', 'ownerId', 'propertyId', 'rentAmount', 'startDate', 'tenantId'].sort(),
    )
  })

  it('T192 as três situações aparecem com o rótulo certo em italiano e português', () => {
    const values = (lang: string) =>
      getRentalSituationOptions(i18n.getFixedT(lang)).map((option) => [option.value, option.label])

    expect(values('it')).toEqual([
      ['active', 'Attivo'],
      ['terminated', 'Rescisso'],
      ['closed', 'Chiuso'],
    ])
    expect(values('pt')).toEqual([
      ['active', 'Ativo'],
      ['terminated', 'Rescindido'],
      ['closed', 'Encerrado'],
    ])
  })
})
