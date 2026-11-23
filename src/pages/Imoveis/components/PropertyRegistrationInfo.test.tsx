import { renderWithProviders, screen } from '@/test'
import { makeProperty } from '@/pages/Imoveis/imoveisTestData'
import PropertyRegistrationInfo from './PropertyRegistrationInfo'

const user = {
  id: 'u1',
  fullName: 'Mario Rossi',
  email: 'm@x.it',
  passwordHash: 'x',
  accessLevel: 'broker' as const,
  createdAt: '2025-01-01T00:00:00Z',
  updatedAt: '2025-01-01T00:00:00Z',
}

describe('Imóveis: dados de cadastro', () => {
  it('T118 imóvel importado sem corretor de cadastro mostra origem não indicada', () => {
    renderWithProviders(<PropertyRegistrationInfo property={makeProperty({ createdBy: undefined })} />)

    expect(screen.getByText(/da Origine non indicata/)).toBeInTheDocument()
    expect(screen.queryByText(/Mario/)).not.toBeInTheDocument()
  })

  it('T119 data e hora no horário de Roma, com quem criou e quem alterou', () => {
    // 22:30 UTC de 30/06 = 00:30 de 01/07 em Roma (horário de verão, UTC+2)
    const property = makeProperty({
      createdAt: '2025-06-30T22:30:00.000Z',
      createdBy: user,
      lastChangedAt: '2025-06-30T22:45:10.000Z',
      lastChangedBy: { ...user, id: 'u2', fullName: 'Luca Bianchi' },
    })

    renderWithProviders(<PropertyRegistrationInfo property={property} />)

    expect(screen.getByText('Registrato il 01/07/2025 00:30:00 da Mario Rossi')).toBeInTheDocument()
    expect(screen.getByText('Ultima modifica di Luca Bianchi il 01/07/2025 00:45:10')).toBeInTheDocument()
  })
})
