import { beforeEach, describe, expect, it } from 'vitest'
import {
  getLeadsReportControllerBySourceMockHandler,
  getLeadsReportControllerTodayAppointmentsMockHandler,
  getPropertiesReportControllerDormantCountMockHandler,
  getPropertiesReportControllerDormantMockHandler,
  getPropertiesReportControllerIncompleteCountMockHandler,
  getPropertiesReportControllerIncompleteMockHandler,
  getPropertiesReportControllerRecentMockHandler,
} from '@/api/generated/api.msw'
import { apiError, renderWithProviders, screen, server, userEvent, waitFor, within } from '@/test'
import Home from '@/pages/Home'

const ACTIVE_WIDGETS_KEY = 'dashboard.activeWidgets'
const DORMANT_DAYS_KEY = 'dashboard.dormantDays'

const DEFAULT_TITLES = [
  'Impegni di oggi',
  'Ultimi immobili modificati',
  'Immobili dormienti',
  'Provenienza richieste',
]

function mockEmptyDashboard() {
  server.use(
    getLeadsReportControllerTodayAppointmentsMockHandler([]),
    getPropertiesReportControllerRecentMockHandler([]),
    getPropertiesReportControllerDormantMockHandler([]),
    getPropertiesReportControllerDormantCountMockHandler({ count: 0 }),
    getLeadsReportControllerBySourceMockHandler([]),
    getPropertiesReportControllerIncompleteMockHandler([]),
    getPropertiesReportControllerIncompleteCountMockHandler({ count: 0 }),
  )
}

function dormantProperty(code: string, title: string) {
  return {
    id: `id-${code}`,
    code,
    title,
    status: 'active',
    purpose: 'sale',
    categoryName: null,
    city: null,
    areaSqm: null,
    createdAt: '2025-01-10T10:00:00Z',
    updatedAt: '2025-01-10T10:00:00Z',
  }
}

describe('Painel inicial (Home)', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  // T264
  it('T264 sem nenhum dado mostra mensagens de vazio e nenhum NaN', async () => {
    mockEmptyDashboard()

    const { container } = renderWithProviders(<Home />)

    expect(await screen.findByText('Nessun immobile dormiente.')).toBeInTheDocument()
    expect(await screen.findByText('Nessun immobile modificato di recente.')).toBeInTheDocument()
    expect(await screen.findByText('Nessun risultato.')).toBeInTheDocument()
    expect(screen.getByText('Totale: 0')).toBeInTheDocument()
    expect(container.textContent).not.toMatch(/NaN|undefined|null/)
  })

  // T265
  it('T265 imóveis parados e cadastros incompletos mostram só o que o servidor devolve', async () => {
    mockEmptyDashboard()
    server.use(
      getPropertiesReportControllerDormantMockHandler([
        dormantProperty('IM-001', 'Casa velha'),
        dormantProperty('IM-002', 'Terreno'),
      ]),
      getPropertiesReportControllerDormantCountMockHandler({ count: 7 }),
      getPropertiesReportControllerIncompleteMockHandler([
        {
          id: 'inc-1',
          code: 'IM-900',
          title: 'Sem fotos',
          missingDescription: false,
          missingPhotos: true,
          responsibleBrokerName: null,
          responsibleBrokerCode: null,
        },
      ]),
      getPropertiesReportControllerIncompleteCountMockHandler({ count: 12 }),
    )
    localStorage.setItem(
      ACTIVE_WIDGETS_KEY,
      JSON.stringify(['dormantProperties', 'incompleteProperties']),
    )

    renderWithProviders(<Home />)

    expect(await screen.findByText('IM-001')).toBeInTheDocument()
    expect(screen.getByText('IM-002')).toBeInTheDocument()
    expect(await screen.findByText('IM-900')).toBeInTheDocument()
    expect(screen.getByText('Senza foto')).toBeInTheDocument()
    expect(screen.queryByText('Senza descrizione')).not.toBeInTheDocument()

    // o contador usa o total do servidor, não o tamanho da lista exibida
    await waitFor(() => expect(screen.getByText('7')).toBeInTheDocument())
    expect(screen.getByText('12')).toBeInTheDocument()
  })

  // T266
  it('T266 trocar o período do painel pede ao servidor os imóveis parados da nova janela', async () => {
    mockEmptyDashboard()

    const requestedDays: string[] = []

    server.use(
      getPropertiesReportControllerDormantMockHandler(({ request }) => {
        requestedDays.push(new URL(request.url).searchParams.get('days') ?? '')

        return []
      }),
    )

    const user = userEvent.setup()

    renderWithProviders(<Home />)

    await waitFor(() => expect(requestedDays).toContain('180'))

    await user.click(screen.getAllByRole('combobox')[0] as HTMLElement)
    await user.click(await screen.findByRole('option', { name: 'Ultimi 90 giorni' }))

    await waitFor(() => expect(requestedDays).toContain('90'))
    expect(localStorage.getItem(DORMANT_DAYS_KEY)).toBe('90')
  })

  // T267
  describe('T267 cartões escolhidos e prazo guardados', () => {
    it('T267 sem escolha salva mostra os 4 cartões padrão', async () => {
      mockEmptyDashboard()

      renderWithProviders(<Home />)

      for (const title of DEFAULT_TITLES) {
        expect(await screen.findByText(title)).toBeInTheDocument()
      }

      expect(screen.queryByText('Imbuto di conversione')).not.toBeInTheDocument()
    })

    it('T267 com 2 cartões escolhidos mostra só esses', async () => {
      mockEmptyDashboard()
      localStorage.setItem(
        ACTIVE_WIDGETS_KEY,
        JSON.stringify(['todayAppointments', 'dormantProperties']),
      )

      renderWithProviders(<Home />)

      expect(await screen.findByText('Impegni di oggi')).toBeInTheDocument()
      expect(screen.getByText('Immobili dormienti')).toBeInTheDocument()
      expect(screen.queryByText('Provenienza richieste')).not.toBeInTheDocument()
      expect(screen.queryByText('Ultimi immobili modificati')).not.toBeInTheDocument()
    })

    it('T267 valor guardado inválido volta aos 4 padrão', async () => {
      mockEmptyDashboard()
      localStorage.setItem(ACTIVE_WIDGETS_KEY, '{nao-e-json')

      renderWithProviders(<Home />)

      for (const title of DEFAULT_TITLES) {
        expect(await screen.findByText(title)).toBeInTheDocument()
      }
    })

    it('T267 cartão inexistente guardado é ignorado', async () => {
      mockEmptyDashboard()
      localStorage.setItem(
        ACTIVE_WIDGETS_KEY,
        JSON.stringify(['cartaoFantasma', 'dormantProperties', 42]),
      )

      renderWithProviders(<Home />)

      expect(await screen.findByText('Immobili dormienti')).toBeInTheDocument()
      expect(screen.queryByText('Impegni di oggi')).not.toBeInTheDocument()
    })

    it('T267 prazo de parados guardado em 90 dias é usado na consulta', async () => {
      mockEmptyDashboard()
      localStorage.setItem(DORMANT_DAYS_KEY, '90')

      const requestedDays: string[] = []

      server.use(
        getPropertiesReportControllerDormantMockHandler(({ request }) => {
          requestedDays.push(new URL(request.url).searchParams.get('days') ?? '')

          return []
        }),
      )

      renderWithProviders(<Home />)

      await waitFor(() => expect(requestedDays).toContain('90'))
      expect(requestedDays).not.toContain('180')
    })

    it('T267 remover um cartão guarda a escolha para o próximo acesso', async () => {
      mockEmptyDashboard()

      const user = userEvent.setup()

      renderWithProviders(<Home />)
      await screen.findByText('Immobili dormienti')

      const card = document.getElementById('home-card-dormantProperties') as HTMLElement

      await user.click(within(card).getByRole('button', { name: 'Rimuovi widget' }))

      expect(screen.queryByText('Immobili dormienti')).not.toBeInTheDocument()
      expect(JSON.parse(localStorage.getItem(ACTIVE_WIDGETS_KEY) ?? '[]')).not.toContain(
        'dormantProperties',
      )
    })
  })

  // T268
  it('T268 falha de um relatório não derruba os outros cartões', async () => {
    mockEmptyDashboard()
    server.use(
      apiError('*/reports/properties/dormant', 500, { error: { message: 'boom' } }, 'get'),
      getPropertiesReportControllerRecentMockHandler([dormantProperty('IM-777', 'Recente')]),
    )

    renderWithProviders(<Home />)

    expect(await screen.findByText('IM-777')).toBeInTheDocument()
    expect(screen.getByText('Impegni di oggi')).toBeInTheDocument()
    expect(screen.getByText('Provenienza richieste')).toBeInTheDocument()
  })
})
