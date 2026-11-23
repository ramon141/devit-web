import { describe, expect, it } from 'vitest'
import { getMarketingCampaignControllerListMockHandler } from '@/api/generated/api.msw'
import { renderWithProviders, screen, server, within } from '@/test'
import StoricoTab from '@/pages/Marketing/components/StoricoTab'
import { at, makeCampaign } from '@/pages/Marketing/marketingTestData'

const TOTAL = 30
const PAGE_SIZE = 10

// Campanha 0 é a mais antiga e a 29 a mais recente; o servidor devolve fora de ordem
function shuffledCampaigns() {
  const campaigns = Array.from({ length: TOTAL }, (_, index) =>
    makeCampaign({
      campaignId: `c${index}`,
      subject: `Campanha ${String(index).padStart(2, '0')}`,
      sentAt: new Date(2026, 0, index + 1, 10).toISOString(),
    }),
  )

  return [...campaigns].sort((a, b) => Number(a.campaignId?.slice(1)) % 7 - Number(b.campaignId?.slice(1)) % 7)
}

describe('Marketing: histórico de campanhas', () => {
  // possível bug: a tela lista tudo sem paginar e sem ordenar por data
  it.fails('T235 histórico de 30 itens: 10 por página e a mais recente em primeiro', async () => {
    server.use(getMarketingCampaignControllerListMockHandler(shuffledCampaigns()))

    renderWithProviders(<StoricoTab />)

    await screen.findAllByText(/Campanha \d\d/)

    const rows = screen.getAllByRole('row').slice(1)

    expect(rows).toHaveLength(PAGE_SIZE)
    expect(within(at(rows, 0)).getByText('Campanha 29')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /3/ })).toBeInTheDocument()
  })
})
