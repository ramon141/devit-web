import { describe, expect, it } from 'vitest'
import { getPublicPropertyControllerFindByIdResponseMock } from '@/api/generated/api.msw'
import itDict from '@/i18n/locales/it/publicSite.json'
import type { SiteBranch } from './types'
import { formatPrice } from './dict'
import { googleMapsUrl, inMap, MAP, project } from './geo'
import {
  branchCity,
  branchStreet,
  matchesPurpose,
  telHref,
  toNumber,
  toPhotos,
} from './property'

const PURPOSES = ['sale', 'rent', 'rent_or_sale']

// O Intl separa o € com espaço inseparável; troca por espaço comum para comparar
const plain = (text: string) => text.replace(/\u00a0/g, ' ')

function buildBranch(overrides: Partial<SiteBranch>): SiteBranch {
  return { id: 'b1', name: 'Sede', ...overrides }
}

describe('site público: regras de contrato (venda/locação)', () => {
  it('T272 filtro "venda" aceita venda e "locação ou venda", não só locação', () => {
    const visible = PURPOSES.filter((purpose) => matchesPurpose(purpose, 'sale'))

    expect(visible).toEqual(['sale', 'rent_or_sale'])
  })

  it('T273 filtro "locação" aceita locação e "locação ou venda", não só venda', () => {
    const visible = PURPOSES.filter((purpose) => matchesPurpose(purpose, 'rent'))

    expect(visible).toEqual(['rent', 'rent_or_sale'])
  })

  it('T272 sem filtro mostra todos', () => {
    expect(PURPOSES.every((purpose) => matchesPurpose(purpose, ''))).toBe(true)
  })
})

describe('site público: preço', () => {
  it('T274 preço em texto "835000.00" vira número formatado em euro', () => {
    expect(toNumber('835000.00')).toBe(835000)
    expect(plain(formatPrice('835000.00', 'it', itDict))).toBe('835.000 €')
  })

  it('T274 vazio, nulo e "abc" mostram "preço sob consulta" e nunca NaN', () => {
    for (const value of ['', null, undefined, 'abc']) {
      const text = formatPrice(value, 'it', itDict)

      expect(text).toBe(itDict.property.priceOnRequest)
      expect(text).not.toContain('NaN')
    }
  })

  it('T274 preço zero é formatado como valor, não como "sob consulta"', () => {
    expect(plain(formatPrice('0', 'it', itDict))).toBe('0 €')
  })
})

describe('site público: fotos da ficha', () => {
  it('T275 capa primeiro e depois pela ordem de exibição', () => {
    const detail = getPublicPropertyControllerFindByIdResponseMock({
      coverPhotoUrl: null,
      photos: [
        { url: 'c.jpg', cover: false, displayOrder: 3, caption: null },
        { url: 'a.jpg', cover: false, displayOrder: 1, caption: null },
        { url: 'capa.jpg', cover: true, displayOrder: 9, caption: null },
        { url: 'b.jpg', cover: false, displayOrder: 2, caption: null },
      ],
    })

    expect(toPhotos(detail).map((photo) => photo.url)).toEqual([
      'capa.jpg',
      'a.jpg',
      'b.jpg',
      'c.jpg',
    ])
  })

  it('T275 só com a capa mostra a capa; sem nada devolve lista vazia (imagem padrão)', () => {
    const onlyCover = getPublicPropertyControllerFindByIdResponseMock({
      photos: [],
      coverPhotoUrl: 'capa.jpg',
    })
    const nothing = getPublicPropertyControllerFindByIdResponseMock({
      photos: [],
      coverPhotoUrl: null,
    })

    expect(toPhotos(onlyCover)).toEqual([{ url: 'capa.jpg' }])
    expect(toPhotos(nothing)).toEqual([])
  })

  it('T275 foto sem endereço de imagem é descartada', () => {
    const detail = getPublicPropertyControllerFindByIdResponseMock({
      coverPhotoUrl: null,
      photos: [
        { url: '', cover: false, displayOrder: 1, caption: null },
        { url: 'ok.jpg', cover: false, displayOrder: 2, caption: null },
      ],
    })

    expect(toPhotos(detail).map((photo) => photo.url)).toEqual(['ok.jpg'])
  })
})

describe('site público: mapa', () => {
  it('T278 coordenada dentro da região coberta fica dentro do quadro (0 a 100%)', () => {
    // Napoli centro
    expect(inMap(40.8518, 14.2681)).toBe(true)

    const { x, y } = project(40.8518, 14.2681)

    expect(x).toBeGreaterThan(0)
    expect(x).toBeLessThan(100)
    expect(y).toBeGreaterThan(0)
    expect(y).toBeLessThan(100)
  })

  it('T278 coordenada fora da região não tem marcador', () => {
    // Roma e Milão
    expect(inMap(41.9028, 12.4964)).toBe(false)
    expect(inMap(45.4642, 9.19)).toBe(false)
  })

  it('T278 limites exatos do mapa contam como dentro; um pouco além, fora', () => {
    expect(inMap(MAP.north, MAP.west)).toBe(true)
    expect(inMap(MAP.south, MAP.east)).toBe(true)
    expect(inMap(MAP.north + 0.001, MAP.west)).toBe(false)
    expect(inMap(MAP.south, MAP.east + 0.001)).toBe(false)
  })

  it('T278 o canto noroeste fica em 0%,0% e o sudeste em 100%,100%', () => {
    const northWest = project(MAP.north, MAP.west)
    const southEast = project(MAP.south, MAP.east)

    expect(northWest.x).toBeCloseTo(0)
    expect(northWest.y).toBeCloseTo(0)
    expect(southEast.x).toBeCloseTo(100)
    expect(southEast.y).toBeCloseTo(100)
  })

  it('T278 link para o mapa externo usa 5 casas decimais', () => {
    expect(googleMapsUrl(40.8518123, 14.2681987)).toBe(
      'https://www.google.com/maps/search/?api=1&query=40.85181,14.26820',
    )
  })
})

describe('site público: filial', () => {
  it('T279 link de ligar remove todos os espaços do telefone', () => {
    expect(telHref('+39 081 123 4567')).toBe('tel:+390811234567')
    expect(telHref('081\t123 456')).toBe('tel:081123456')
  })

  it('T279 endereço sem número mostra só a rua, sem vírgula sobrando', () => {
    const branch = buildBranch({
      address: { street: 'Via Roma', number: null, city: 'Napoli', postalCode: '80100' },
    })

    expect(branchStreet(branch)).toBe('Via Roma')
    expect(branchCity(branch)).toBe('80100 Napoli')
  })

  it('T279 endereço completo e filial sem endereço', () => {
    const full = buildBranch({
      address: { street: 'Via Roma', number: '10', city: 'Napoli', postalCode: null },
    })

    expect(branchStreet(full)).toBe('Via Roma, 10')
    expect(branchCity(full)).toBe('Napoli')
    expect(branchStreet(buildBranch({}))).toBe('')
    expect(branchCity(buildBranch({}))).toBe('')
  })
})
