import { describe, expect, it } from 'vitest'
import { getCalendarEventControllerFindMockHandler } from '@/api/generated/api.msw'
import { renderWithProviders, screen, server } from '@/test'
import Agenda from '@/pages/Agenda'
import { buildEvent } from '@/pages/Agenda/agendaTestUtils'

async function findEventElement(title: string) {
  const text = await screen.findByText(title)

  return text.closest<HTMLElement>('.fc-event')
}

describe('Agenda: aparência dos eventos no calendário', () => {
  it('T199 – cor segue a confirmação (cinza/verde/vermelho) ou a cor própria escolhida', async () => {
    server.use(
      getCalendarEventControllerFindMockHandler([
        buildEvent({ id: 'a', title: 'Pendente', confirmationStatus: 'pending' }),
        buildEvent({ id: 'b', title: 'Confermato', confirmationStatus: 'confirmed' }),
        buildEvent({ id: 'c', title: 'Annullato', confirmationStatus: 'cancelled' }),
        buildEvent({
          id: 'd',
          title: 'ComCor',
          confirmationStatus: 'confirmed',
          backgroundColor: '#7c3aed',
        }),
      ]),
    )

    renderWithProviders(<Agenda />)

    expect((await findEventElement('Pendente'))?.style.backgroundColor).toBe('rgb(156, 163, 175)')
    expect((await findEventElement('Confermato'))?.style.backgroundColor).toBe('rgb(34, 197, 94)')
    expect((await findEventElement('Annullato'))?.style.backgroundColor).toBe('rgb(239, 68, 68)')
    expect((await findEventElement('ComCor'))?.style.backgroundColor).toBe('rgb(124, 58, 237)')
  })

  it('T202 – cada origem mostra a sigla IM, S, C, V e P no cartão', async () => {
    const origins = [
      ['immobiliare_it', 'IM'],
      ['social', 'S'],
      ['sign', 'C'],
      ['showcase', 'V'],
      ['agency_proposed', 'P'],
    ] as const

    server.use(
      getCalendarEventControllerFindMockHandler(
        origins.map(([origin], index) =>
          buildEvent({ id: `o${index}`, title: `Evento ${origin}`, origin }),
        ),
      ),
    )

    renderWithProviders(<Agenda />)

    for (const [origin, acronym] of origins) {
      const element = await findEventElement(`Evento ${origin}`)

      expect(element?.textContent).toContain(acronym)
      expect(element?.querySelector('span.rounded')?.textContent).toBe(acronym)
    }
  })
})
