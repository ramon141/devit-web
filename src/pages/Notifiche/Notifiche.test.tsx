import { describe, expect, it } from 'vitest'
import type { PathParams } from 'msw'
import {
  getNotificationControllerCountMockHandler,
  getNotificationControllerFindMockHandler,
  getNotificationControllerUpdateByIdMockHandler,
} from '@/api/generated/api.msw'
import type { NotificationWithRelations } from '@/api/generated/models'
import NotificationsPopover from '@/components/layout/NotificationsPopover'
import Notifiche from '@/pages/Notifiche'
import { renderWithProviders, screen, server, userEvent, waitFor } from '@/test'

function buildNotification(
  overrides: Partial<NotificationWithRelations>,
): NotificationWithRelations {
  return {
    id: 'n-1',
    type: 'new_lead',
    title: 'Titolo',
    message: null,
    entityType: null,
    entityId: null,
    readAt: null,
    createdAt: '2026-01-10T10:00:00Z',
    updatedAt: '2026-01-10T10:00:00Z',
    userId: 'u1',
    ...overrides,
  }
}

function mockNotifications(list: NotificationWithRelations[]) {
  server.use(getNotificationControllerFindMockHandler(list))
}

describe('Notifiche', () => {
  it('T269 contador do sino acompanha as não lidas ao marcar uma como lida', async () => {
    const list = [
      buildNotification({ id: 'n-1', title: 'Primeira' }),
      buildNotification({ id: 'n-2', title: 'Segunda' }),
      buildNotification({ id: 'n-3', title: 'Terceira' }),
    ]
    const readIds = new Set<string>()

    server.use(
      getNotificationControllerFindMockHandler(() =>
        list.map((item) => ({
          ...item,
          readAt: readIds.has(item.id ?? '') ? '2026-01-11T10:00:00Z' : null,
        })),
      ),
      getNotificationControllerCountMockHandler(() => ({ count: list.length - readIds.size })),
      getNotificationControllerUpdateByIdMockHandler(({ params }: { params: PathParams }) => {
        readIds.add(String(params.id))

        return undefined
      }),
    )

    const user = userEvent.setup()

    renderWithProviders(
      <>
        <NotificationsPopover />
        <Notifiche />
      </>,
    )

    const bell = await screen.findByRole('button', { name: 'Notifiche' })

    await waitFor(() => expect(bell).toHaveTextContent('3'))

    const markButtons = await screen.findAllByRole('button', { name: 'Segna come letta' })

    expect(markButtons).toHaveLength(3)

    await user.click(markButtons[0] as HTMLElement)

    await waitFor(() => expect(bell).toHaveTextContent('2'))
    expect(screen.getAllByRole('button', { name: 'Segna come letta' })).toHaveLength(2)
  })

  it('T269 sem nenhuma não lida o sino não mostra contador; acima de 9 mostra 9+', async () => {
    server.use(getNotificationControllerCountMockHandler({ count: 25 }))

    renderWithProviders(<NotificationsPopover />)

    const bell = await screen.findByRole('button', { name: 'Notifiche' })

    await waitFor(() => expect(bell).toHaveTextContent('9+'))
  })

  it('T270 nova solicitação e imóvel disponível abrem a ficha correta', async () => {
    mockNotifications([
      buildNotification({
        id: 'n-lead',
        type: 'new_lead',
        title: 'Nuova richiesta da Mario',
        entityType: 'Lead',
        entityId: 'lead-42',
      }),
      buildNotification({
        id: 'n-prop',
        type: 'property_available_again',
        title: 'Villa di nuovo disponibile',
        entityType: 'Property',
        entityId: 'prop-77',
      }),
    ])

    renderWithProviders(<Notifiche />)

    expect(await screen.findByText('Nuova richiesta da Mario')).toBeInTheDocument()
    expect(screen.getByText('Villa di nuovo disponibile')).toBeInTheDocument()

    const links = screen.getAllByRole('link', { name: 'Apri richiesta' })

    expect(links[0]).toHaveAttribute('href', '/gestionale/clienti/richieste?leadId=lead-42')
    expect(links[1]).toHaveAttribute('href', '/gestionale/proprieta/prop-77')
  })

  it('T271 notificação sem vínculo aparece sem link e sem erro', async () => {
    mockNotifications([
      buildNotification({
        id: 'n-free',
        type: 'event_reminder',
        title: 'Aviso geral',
        entityType: null,
        entityId: null,
      }),
      buildNotification({
        id: 'n-other',
        type: 'sale_completed',
        title: 'Venda feita',
        entityType: 'Sale',
        entityId: 'sale-1',
      }),
    ])

    renderWithProviders(<Notifiche />)

    expect(await screen.findByText('Aviso geral')).toBeInTheDocument()
    expect(screen.getByText('Venda feita')).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Apri richiesta' })).not.toBeInTheDocument()
  })

  it('T271 lista vazia mostra a mensagem de vazio', async () => {
    mockNotifications([])

    renderWithProviders(<Notifiche />)

    expect(await screen.findByText('Nessuna notifica.')).toBeInTheDocument()
  })
})
