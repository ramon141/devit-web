import dayjs from 'dayjs'
import i18n from 'i18next'
import { describe, expect, it } from 'vitest'
import { emptyLeadFormValues } from '@/pages/Clientes/Leads/schemas/leadFormValues'
import {
  createLeadSchema,
  getLeadPurposeOptions,
  getLeadRequestTypeOptions,
  getLeadSourceOptions,
  getLeadStatusOptions,
  type LeadFormValues,
} from '@/pages/Clientes/Leads/schemas/leadSchema'

const t = i18n.getFixedT('it', 'clientes')
const schema = createLeadSchema(t)
const DAY_FORMAT = 'YYYY-MM-DD'

const validLead: LeadFormValues = { ...emptyLeadFormValues, name: 'Maria Rossi' }

// Devolve as mensagens de erro agrupadas por campo
function errorsOf(overrides: Partial<LeadFormValues>) {
  const result = schema.safeParse({ ...validLead, ...overrides })
  const byField: Record<string, string[]> = {}

  if (result.success) return byField

  for (const issue of result.error.issues) {
    const field = String(issue.path[0])

    byField[field] = [...(byField[field] ?? []), issue.message]
  }

  return byField
}

const MIN_GREATER = 'Il valore minimo non può essere maggiore del massimo'
const NEGATIVE = 'Il valore non può essere negativo'
const INTEGER = 'Inserisci un numero intero'

describe('Leads: campos básicos', () => {
  it('T051 bloqueia nome de 1 letra com aviso de mínimo de 2 caracteres', () => {
    expect(errorsOf({ name: 'A' }).name).toEqual(['Inserisci almeno 2 caratteri'])
    expect(errorsOf({ name: 'Al' }).name).toBeUndefined()
  })

  it('T052 exige a situação quando ela é limpa', () => {
    const errors = errorsOf({ status: '' as LeadFormValues['status'] })

    expect(errors.status).toEqual(['Seleziona uno stato'])
  })

  it('T053 recusa primeiro contato amanhã e aceita hoje e ontem', () => {
    const tomorrow = dayjs().add(1, 'day').format(DAY_FORMAT)
    const today = dayjs().format(DAY_FORMAT)
    const yesterday = dayjs().subtract(1, 'day').format(DAY_FORMAT)

    expect(errorsOf({ firstContactAt: tomorrow }).firstContactAt).toHaveLength(1)
    expect(errorsOf({ firstContactAt: today }).firstContactAt).toBeUndefined()
    expect(errorsOf({ firstContactAt: yesterday }).firstContactAt).toBeUndefined()
  })

  it('T084 mostra os avisos de e-mail e de telefone ao mesmo tempo', () => {
    const errors = errorsOf({ email: 'x@', phone: 'abc' })

    expect(errors.email).toEqual(['E-mail non valida'])
    expect(errors.phone).toEqual(['Numero di telefono non valido'])
  })
})

describe('Leads: faixas de busca', () => {
  it('T054 mostra "mínimo maior que máximo" no campo do máximo do orçamento', () => {
    const errors = errorsOf({ minBudget: '500000', maxBudget: '400000' })

    expect(errors.maxBudget).toEqual([MIN_GREATER])
    expect(errors.minBudget).toBeUndefined()
  })

  it('T055 aceita orçamento mínimo igual ao máximo', () => {
    expect(errorsOf({ minBudget: '300000', maxBudget: '300000' })).toEqual({})
  })

  it('T056 compara área como número e não como texto', () => {
    expect(errorsOf({ minAreaSqm: '100', maxAreaSqm: '99.9' }).maxAreaSqm).toEqual([MIN_GREATER])
    expect(errorsOf({ minAreaSqm: '100', maxAreaSqm: '100' })).toEqual({})
  })

  it('T057 avisa valor negativo em orçamento, área, quartos e banheiros', () => {
    const fields = ['minBudget', 'minAreaSqm', 'minRooms', 'minBathrooms'] as const

    for (const field of fields) {
      expect(errorsOf({ [field]: '-1' })[field]).toEqual([NEGATIVE])
    }
  })

  it('T058 aceita andar mínimo -1 e máximo 3 sem aviso de negativo', () => {
    expect(errorsOf({ minFloor: '-1', maxFloor: '3' })).toEqual({})
  })

  it('T059 recusa andar mínimo 5 com máximo -2 tratando negativos como número', () => {
    const errors = errorsOf({ minFloor: '5', maxFloor: '-2' })

    expect(errors.maxFloor).toEqual([MIN_GREATER])
  })

  it('T060 recusa quartos 2,5 e banheiros 1,2 com aviso de número inteiro', () => {
    const errors = errorsOf({ minRooms: '2.5', minBathrooms: '1.2' })

    expect(errors.minRooms).toEqual([INTEGER])
    expect(errors.minBathrooms).toEqual([INTEGER])
  })

  it('T061 recusa andar 1,5 mesmo permitindo negativos', () => {
    expect(errorsOf({ minFloor: '1.5' }).minFloor).toEqual([INTEGER])
    expect(errorsOf({ minFloor: '-1.5' }).minFloor).toEqual([INTEGER])
  })

  it('T062 mostra seis avisos, um em cada campo de máximo', () => {
    const errors = errorsOf({
      minBudget: '9', maxBudget: '1',
      minAreaSqm: '9', maxAreaSqm: '1',
      minRooms: '9', maxRooms: '1',
      minBedrooms: '9', maxBedrooms: '1',
      minBathrooms: '9', maxBathrooms: '1',
      minFloor: '9', maxFloor: '1',
    })

    const maxFields = [
      'maxBudget', 'maxAreaSqm', 'maxRooms', 'maxBedrooms', 'maxBathrooms', 'maxFloor',
    ]

    expect(Object.keys(errors).sort()).toEqual([...maxFields].sort())

    for (const field of maxFields) expect(errors[field]).toEqual([MIN_GREATER])
  })

  it('T063 aceita todos os critérios em branco', () => {
    expect(schema.safeParse(validLead).success).toBe(true)
  })

  it('T064 aceita mínimo de quartos igual a "0" sem erro', () => {
    expect(errorsOf({ minRooms: '0' })).toEqual({})
    expect(errorsOf({ minRooms: '0', maxRooms: '2' })).toEqual({})
  })
})

describe('Leads: opções das listas', () => {
  it('T081 oferece as 10 origens com rótulo', () => {
    const options = getLeadSourceOptions(t)

    const expected = [
      'internet', 'other', 'phone', 'portal', 'referral',
      'showcase', 'site', 'social_media', 'walk_in', 'whatsapp_chatbot',
    ]

    expect(options.map((option) => option.value).sort()).toEqual(expected)
    expect(options).toHaveLength(10)
    expect(options.every((option) => option.label && !option.label.includes('.'))).toBe(true)
  })

  it('T082 oferece as 5 situações na ordem do funil', () => {
    const options = getLeadStatusOptions(t)

    expect(options.map((option) => option.value)).toEqual([
      'new', 'contacted', 'negotiating', 'converted', 'lost',
    ])
    expect(options.map((option) => option.label)).toEqual([
      'Nuovo', 'Contattato', 'In trattativa', 'Convertito', 'Perso',
    ])
  })

  it('T085 oferece tipos de pedido e finalidades nos dois idiomas', () => {
    for (const lang of ['it', 'pt']) {
      const translate = i18n.getFixedT(lang, 'clientes')
      const types = getLeadRequestTypeOptions(translate)
      const purposes = getLeadPurposeOptions(translate)

      expect(types.map((option) => option.value)).toEqual(['search', 'valuation', 'contact'])
      expect(purposes.map((option) => option.value)).toEqual(['rent', 'sale', 'rent_or_sale'])

      const labels = [...types, ...purposes].map((option) => option.label)

      expect(new Set(labels).size).toBe(6)
      expect(labels.every((label) => !label.includes('leadRequestTypeOptions'))).toBe(true)
      expect(labels.every((label) => !label.includes('leadPurposeOptions'))).toBe(true)
    }
  })
})
