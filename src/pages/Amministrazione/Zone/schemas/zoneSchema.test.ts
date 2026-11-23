import { describe, expect, it } from 'vitest'
import i18n from '@/i18n'
import {
  createNeighborhoodSchema,
  createZoneSchema,
} from '@/pages/Amministrazione/Zone/schemas/zoneSchema'

const t = i18n.getFixedT('it', 'amministrazione')

function zoneErrors(name: string, city = 'Napoli') {
  const result = createZoneSchema(t).safeParse({ name, city, region: '', active: true })

  if (result.success) return {}

  return Object.fromEntries(result.error.issues.map((issue) => [issue.path.join('.'), issue.message]))
}

function neighborhoodErrors(name: string, zoneId = 'z1') {
  const result = createNeighborhoodSchema(t).safeParse({ name, zoneId, active: true })

  if (result.success) return {}

  return Object.fromEntries(result.error.issues.map((issue) => [issue.path.join('.'), issue.message]))
}

describe('Schema da zona', () => {
  it('T252 nome de 120 caracteres é aceito e de 121 é recusado', () => {
    expect(zoneErrors('a'.repeat(120))).toEqual({})
    expect(zoneErrors('a'.repeat(121)).name).toBe(t('zoneSchema.nameMax'))
  })

  it('T253 cidade vazia ou de 1 letra é recusada', () => {
    expect(zoneErrors('Centro', '').city).toBe(t('zoneSchema.cityMin'))
    expect(zoneErrors('Centro', 'A').city).toBe(t('zoneSchema.cityMin'))
    expect(zoneErrors('Centro', 'Na')).toEqual({})
  })

  it('T262 espaços são removidos e nome de 1 letra com espaços é recusado', () => {
    const parsed = createZoneSchema(t).parse({
      name: '  Posillipo  ',
      city: 'Napoli',
      region: '',
      active: true,
    })

    expect(parsed.name).toBe('Posillipo')
    expect(zoneErrors('  a  ').name).toBe(t('zoneSchema.nameMin'))
  })

  it('T262 espaços não ajudam a passar do limite de 120', () => {
    expect(zoneErrors(`  ${'a'.repeat(120)}  `)).toEqual({})
  })
})

describe('Schema do bairro', () => {
  it('T254 bairro sem zona recebe aviso de zona obrigatória', () => {
    expect(neighborhoodErrors('Chiaia', '').zoneId).toBe(t('neighborhoodSchema.zoneRequired'))
  })

  it('T263 nome de 120 caracteres é aceito e de 121 é recusado', () => {
    expect(neighborhoodErrors('b'.repeat(120))).toEqual({})
    expect(neighborhoodErrors('b'.repeat(121)).name).toBe(t('neighborhoodSchema.nameMax'))
  })
})
