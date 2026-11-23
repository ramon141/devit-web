import { describe, expect, it } from 'vitest'
import { useLocation } from 'react-router'
import { getLeadControllerFindMockHandler } from '@/api/generated/api.msw'
import { renderWithProviders, screen, server, waitFor } from '@/test'
import Leads from '@/pages/Clientes/Leads'
import { makeLead } from '@/pages/Clientes/Leads/leadsTestData'

// Mostra o endereço atual para conferir que o código sai dele
function LocationProbe() {
  const location = useLocation()

  return <span data-testid="search">{location.search}</span>
}

function renderBoard(search: string) {
  server.use(getLeadControllerFindMockHandler([makeLead('l1', 'new', { name: 'Maria Rossi' })]))

  return renderWithProviders(
    <>
      <Leads />
      <LocationProbe />
    </>,
    { initialEntries: [`/clienti/richieste${search}`] },
  )
}

describe('Abrir solicitação por link direto', () => {
  it('T078 abre a solicitação existente e remove o código do endereço', async () => {
    renderBoard('?leadId=l1')

    expect(await screen.findByText('Modifica richiesta')).toBeInTheDocument()
    await waitFor(() => expect(screen.getByTestId('search')).toBeEmptyDOMElement())
    expect(screen.getByDisplayValue('Maria Rossi')).toBeInTheDocument()
  })

  it('T078 com código inexistente nada abre e a tela funciona', async () => {
    renderBoard('?leadId=nao-existe')

    expect(await screen.findByText('Maria Rossi')).toBeInTheDocument()
    expect(screen.queryByText('Modifica richiesta')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: /nuova richiesta/i })).toBeInTheDocument()
  })
})
