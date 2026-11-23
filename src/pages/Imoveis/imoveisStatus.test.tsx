import i18n from '@/i18n'
import { PropertyStatus } from '@/api/generated/models'
import { renderWithProviders, screen, within } from '@/test'
import { makeProperty } from '@/pages/Imoveis/imoveisTestData'
import { getShortStatusOptions, getStatusOptions } from '@/pages/Imoveis/schemas/propertySchema'
import PropertyTable from '@/pages/Imoveis/components/PropertyTable'

const FULL_IT = {
  available: 'Disponibile',
  reserved: 'In trattativa',
  rented: 'Affittato',
  sold: 'Venduto',
  unavailable: 'Sospeso',
  expired: 'Scaduto',
}
const SHORT_IT = {
  available: 'Disp.',
  reserved: 'Tratt.',
  rented: 'Aff.',
  sold: 'Vend.',
  unavailable: 'Sosp.',
  expired: 'Scad.',
}
const STATUSES = [
  PropertyStatus.available,
  PropertyStatus.reserved,
  PropertyStatus.rented,
  PropertyStatus.sold,
  PropertyStatus.unavailable,
  PropertyStatus.expired,
] as const

describe('Imóveis: rótulos dos 6 status', () => {
  it('T104 lista mostra o rótulo completo de cada status', () => {
    const rows = STATUSES.map((status, index) =>
      makeProperty({ id: `s${index}`, code: `ST-${index}`, title: `Imm ${status}`, status }),
    )

    renderWithProviders(<PropertyTable properties={rows} isLoading={false} />)

    for (const status of STATUSES) {
      const row = screen.getByText(`Imm ${status}`).closest('tr')

      expect(row).not.toBeNull()
      expect(within(row as HTMLElement).getByText(FULL_IT[status])).toBeInTheDocument()
    }
  })

  it('T104 rótulos abreviados corretos em italiano e distintos dos completos', () => {
    const t = i18n.getFixedT('it', 'imoveis')
    const short = Object.fromEntries(getShortStatusOptions(t).map((o) => [o.value, o.label]))
    const full = Object.fromEntries(getStatusOptions(t).map((o) => [o.value, o.label]))

    expect(short).toEqual(SHORT_IT)
    expect(full).toEqual(FULL_IT)
  })

  it('T104 em português cada status tem rótulo próprio, sem repetir', () => {
    const t = i18n.getFixedT('pt', 'imoveis')
    const labels = getStatusOptions(t).map((option) => option.label)
    const shorts = getShortStatusOptions(t).map((option) => option.label)

    expect(new Set(labels).size).toBe(6)
    expect(new Set(shorts).size).toBe(6)
    expect(labels).not.toEqual(Object.values(FULL_IT))
  })
})
