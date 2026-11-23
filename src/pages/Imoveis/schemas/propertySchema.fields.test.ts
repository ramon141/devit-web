import { z } from 'zod'
import { percentRange } from './propertySchema'
import { tImoveis, validate } from './imoveisTestHelpers'

const msg = (key: string, options?: { max: number }) =>
  tImoveis(`options.validation.${key}`, options)

describe('Imóveis: campos do cadastro', () => {
  it.each([['empty', ''], ['three spaces', '   ']])(
    'T092 cidade em branco (%s): aviso de cidade obrigatória',
    (_label, city) => {
      expect(validate({ city }).city).toBe(msg('city'))
    },
  )

  it.each(['1234', '1234567890'])('T093 CEP com %s é aceito', (postalCode) => {
    expect(validate({ postalCode }).postalCode).toBeUndefined()
  })

  it.each(['123', '12345678901', '12AB5'])('T093 CEP %s é recusado', (postalCode) => {
    expect(validate({ postalCode }).postalCode).toBe(msg('postalCode'))
  })

  it('T094 quartos e banheiros 50 aceitos; 51 recusado com máximo de cômodos', () => {
    expect(validate({ bedrooms: '50', bathrooms: '50' })).toEqual({})
    expect(validate({ bedrooms: '51' }).bedrooms).toBe(msg('maxCount', { max: 50 }))
  })

  it('T095 vagas -1 e área -10: número não negativo', () => {
    expect(validate({ parkingSpots: '-1' }).parkingSpots).toBe(msg('nonNegativeNumber'))
    expect(validate({ areaSqm: '-10' }).areaSqm).toBe(msg('nonNegativeNumber'))
  })

  it.each(['abc', '1e3', '∞'])('T096 quartos "%s" é recusado', (bedrooms) => {
    expect(validate({ bedrooms }).bedrooms).toBeDefined()
  })

  it('T096 "1e3" nunca vira 1000 quartos (limite de 50 barra)', () => {
    expect(validate({ bedrooms: '1e3' }).bedrooms).toBe(msg('maxCount', { max: 50 }))
  })

  it('T097 percentual: 0 e 100 aceitos; -1 e 100,01 recusados', () => {
    const schema = z.object({ pct: percentRange(tImoveis) })
    const check = (pct: string) => schema.safeParse({ pct })

    expect(check('0').success).toBe(true)
    expect(check('100').success).toBe(true)
    expect(check('-1').success).toBe(false)
    expect(check('100.01').success).toBe(false)
    expect(check('-1').error?.issues[0]?.message).toBe(msg('percentRange'))
  })
})
