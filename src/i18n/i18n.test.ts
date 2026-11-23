import { afterEach, describe, expect, it, vi } from 'vitest'
import i18n from '@/i18n'

afterEach(async () => {
  await i18n.changeLanguage('it')
  localStorage.clear()
})

describe('T293 idioma salvo', () => {
  it('guarda a escolha e a restaura ao recarregar', async () => {
    await i18n.changeLanguage('pt')
    expect(localStorage.getItem('lang')).toBe('pt')

    vi.resetModules()
    const { default: reloaded } = await import('@/i18n')

    expect(reloaded.language).toBe('pt')
    expect(reloaded.t('confirmPopup.cancel', { ns: 'common' })).toBe('Cancelar')
  })

  it('sem escolha salva usa italiano', async () => {
    localStorage.clear()
    vi.resetModules()
    const { default: fresh } = await import('@/i18n')

    expect(fresh.language).toBe('it')
  })
})

describe('T294 texto sem tradução', () => {
  it('cai no italiano em vez de mostrar a chave técnica', async () => {
    i18n.addResource('it', 'common', 'testOnlyItalian', 'Solo italiano')
    await i18n.changeLanguage('pt')

    expect(i18n.t('testOnlyItalian', { ns: 'common' })).toBe('Solo italiano')
  })
})
