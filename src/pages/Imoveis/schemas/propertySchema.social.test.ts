import { tImoveis, validate } from './imoveisTestHelpers'

const instagramMsg = tImoveis('options.validation.instagramUrl')

describe('Imóveis: links de redes sociais', () => {
  it('T098 Instagram: válido aceito; outro site, sem https e 501 caracteres recusados', () => {
    const long = `https://instagram.com/${'a'.repeat(501 - 22)}`

    expect(long).toHaveLength(501)
    expect(validate({ instagramUrl: 'https://www.instagram.com/devit' })).toEqual({})
    expect(validate({ instagramUrl: 'https://facebook.com/x' }).instagramUrl).toBe(instagramMsg)
    expect(validate({ instagramUrl: 'instagram.com/x' }).instagramUrl).toBe(instagramMsg)
    expect(validate({ instagramUrl: long }).instagramUrl).toBe(instagramMsg)
  })

  it('T098 Instagram com exatamente 500 caracteres é aceito (limite)', () => {
    const exact = `https://instagram.com/${'a'.repeat(500 - 22)}`

    expect(exact).toHaveLength(500)
    expect(validate({ instagramUrl: exact }).instagramUrl).toBeUndefined()
  })

  it.each(['https://evil-instagram.com', 'https://instagram.com.evil.com'])(
    'T099 domínio imitado %s é recusado',
    (instagramUrl) => {
      expect(validate({ instagramUrl }).instagramUrl).toBe(instagramMsg)
    },
  )

  it('T100 TikTok com dois espaços é tratado como vazio', () => {
    expect(validate({ tiktokUrl: '  ' })).toEqual({})
  })
})
