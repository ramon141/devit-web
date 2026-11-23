import { describe, expect, it } from 'vitest'
import { seedSession } from '@/test/accessHelpers'
import { getNavItems } from '@/components/layout/nav-items'

const ADMIN_MENU = 'sidebar.nav.amministrazione'

describe('menu lateral por nível de acesso', () => {
  it('T012 administrador vê o menu de administração com todas as áreas', () => {
    seedSession('ADMIN')

    const labels = getNavItems().map((item) => item.label)
    const admin = getNavItems().find((item) => item.label === ADMIN_MENU)

    expect(labels).toContain(ADMIN_MENU)
    expect(admin?.children).toHaveLength(7)
  })

  it('T012 corretor não vê o menu de administração, mas vê as demais áreas', () => {
    seedSession('BROKER')

    const labels = getNavItems().map((item) => item.label)

    expect(labels).not.toContain(ADMIN_MENU)
    expect(labels).toContain('sidebar.nav.proprieta')
    expect(labels).toHaveLength(8)
  })
})
