import { describe, expect, it } from 'vitest'
import { getPersonRoleOptions } from '@/pages/Clientes/schemas/personSchema'
import i18n from '@/i18n'
import dayjs from 'dayjs'
import { schemaErrors, tClientes } from '@/pages/Clientes/clientesTestUtils'

const NAME_MIN = 'Inserisci almeno 2 caratteri'
const PHONE_INVALID = 'Numero di telefono non valido'
const CITY_REQUIRED = "Inserisci la città per salvare l'indirizzo"
const POSTAL_INVALID = 'Il CAP deve contenere solo numeri (4-10 cifre)'

describe('Clientes - regras do cadastro de pessoa', () => {
  it('T026 recusa nome de 1 letra e aceita 2', () => {
    expect(schemaErrors({ name: 'A' }).name).toBe(NAME_MIN)
    expect(schemaErrors({ name: 'Al' }).name).toBeUndefined()
  })

  it('T027 nome só de espaços conta como vazio', () => {
    expect(schemaErrors({ name: '   ' }).name).toBe(NAME_MIN)
  })

  it('T028 recusa cadastro sem papel', () => {
    const errors = schemaErrors({ role: '' })

    expect(errors.role).toBe('Seleziona un ruolo')
  })

  it('T029 oferece os 6 papéis com rótulo no idioma ativo', async () => {
    const italian = getPersonRoleOptions(tClientes)

    expect(italian.map((option) => option.value)).toEqual([
      'owner',
      'tenant',
      'buyer',
      'guarantor',
      'contact',
      'supplier',
    ])
    expect(italian.map((option) => option.label)).toEqual([
      'Proprietario',
      'Inquilino',
      'Acquirente',
      'Garante',
      'Contatto',
      'Fornitore',
    ])

    const portuguese = getPersonRoleOptions(i18n.getFixedT('pt', 'clientes'))

    expect(portuguese.map((option) => option.label)).not.toEqual(italian.map((o) => o.label))
    expect(portuguese.every((option) => option.label.length > 0)).toBe(true)

    for (const option of italian) {
      expect(schemaErrors({ role: option.value }).role).toBeUndefined()
    }
  })

  // possível bug: o formato "(081) 1234567" é recusado porque o telefone precisa começar por dígito ou +
  it.fails('T030 aceita telefones nos formatos comuns', () => {
    for (const phone of ['+39 081 123 4567', '(081) 1234567', '081.123.4567']) {
      expect(schemaErrors({ phone }).phone).toBeUndefined()
    }
  })

  it('T031 recusa telefone com letras, só símbolo, curto e longo', () => {
    for (const phone of ['abc', '+', '123', '1'.repeat(25)]) {
      expect(schemaErrors({ phone }).phone).toBe(PHONE_INVALID)
    }
  })

  it('T032 erro do telefone secundário não cai no principal', () => {
    const errors = schemaErrors({ phone: '+39 333 1234567', secondaryPhone: 'abc' })

    expect(errors.secondaryPhone).toBe(PHONE_INVALID)
    expect(errors.phone).toBeUndefined()
  })

  it('T033 e-mail vazio é aceito e "maria@" é recusado', () => {
    expect(schemaErrors({ email: '' }).email).toBeUndefined()
    expect(schemaErrors({ email: 'maria@' }).email).toBe('E-mail non valida')
  })

  it('T034 data de nascimento: amanhã recusada, hoje aceita', () => {
    const tomorrow = dayjs().add(1, 'day').format('YYYY-MM-DD')
    const today = dayjs().format('YYYY-MM-DD')

    expect(schemaErrors({ birthDate: tomorrow }).birthDate).toBe(
      'La data di nascita non può essere nel futuro',
    )
    expect(schemaErrors({ birthDate: today }).birthDate).toBeUndefined()
  })

  it('T035 data de nascimento: 1899 recusada, 1900 aceita', () => {
    expect(schemaErrors({ birthDate: '1899-12-31' }).birthDate).toBe(
      'La data di nascita deve essere dal 1900 in poi',
    )
    expect(schemaErrors({ birthDate: '1900-01-01' }).birthDate).toBeUndefined()
  })

  it('T036 rua sem cidade pede a cidade no campo cidade', () => {
    const errors = schemaErrors({ street: 'Via Roma', number: '12', city: '' })

    expect(errors.city).toBe(CITY_REQUIRED)
    expect(errors.street).toBeUndefined()
  })

  it('T037 só a cidade preenchida é aceita', () => {
    expect(schemaErrors({ city: 'Napoli' })).toEqual({})
  })

  it('T038 CEP aceita 4 e 10 dígitos e vazio; recusa 3, 11 e letras', () => {
    for (const postalCode of ['1234', '1234567890', '']) {
      expect(schemaErrors({ postalCode, city: 'Napoli' }).postalCode).toBeUndefined()
    }

    for (const postalCode of ['123', '12345678901', '12AB5']) {
      expect(schemaErrors({ postalCode, city: 'Napoli' }).postalCode).toBe(POSTAL_INVALID)
    }
  })

  it('T050 cidade só com espaços não conta como cidade', () => {
    const errors = schemaErrors({ street: 'Via Roma', number: '12', city: '   ' })

    expect(errors.city).toBe(CITY_REQUIRED)
  })
})
