import { PropertyPurpose } from '@/api/generated/models'
import { tImoveis, validate } from './imoveisTestHelpers'

const msg = (key: string) => tImoveis(`options.validation.${key}`)

describe('Imóveis: preço x finalidade', () => {
  it('T086 venda sem preço de venda: erro obrigatório no preço de venda', () => {
    const errors = validate({ purpose: PropertyPurpose.sale, salePrice: undefined })

    expect(errors.salePrice).toBe(msg('salePriceRequired'))
  })

  it('T087 só locação com preço de venda: erro não permitido', () => {
    const errors = validate({
      purpose: PropertyPurpose.rent,
      salePrice: '300000',
      rentPrice: '900',
    })

    expect(errors.salePrice).toBe(msg('salePriceNotAllowed'))
    expect(errors.rentPrice).toBeUndefined()
  })

  it('T088 só venda com preço de locação: erro não permitido', () => {
    const errors = validate({ purpose: PropertyPurpose.sale, rentPrice: '900' })

    expect(errors.rentPrice).toBe(msg('rentPriceNotAllowed'))
    expect(errors.salePrice).toBeUndefined()
  })

  it('T089 locação ou venda com os dois preços: aceito', () => {
    const errors = validate({
      purpose: PropertyPurpose.rent_or_sale,
      salePrice: '300000',
      rentPrice: '900',
    })

    expect(errors).toEqual({})
  })

  it('T090 locação ou venda sem preço de venda: erro obrigatório', () => {
    const errors = validate({
      purpose: PropertyPurpose.rent_or_sale,
      salePrice: undefined,
      rentPrice: '900',
    })

    expect(errors.salePrice).toBe(msg('salePriceRequired'))
  })

  it('T121 só locação com apenas preço de locação: aceito', () => {
    const errors = validate({
      purpose: PropertyPurpose.rent,
      salePrice: undefined,
      rentPrice: '900',
    })

    expect(errors).toEqual({})
  })
})
