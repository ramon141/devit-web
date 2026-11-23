import dayjs from 'dayjs'
import { describe, expect, it } from 'vitest'
import type { LeadsReportControllerTodayAppointments200Item } from '@/api/generated/models'
import { renderWithProviders, screen } from '@/test'
import TodayAppointmentsCard from '@/pages/Home/components/TodayAppointmentsCard'

const today = dayjs().format('YYYY-MM-DD')

function appointment(
  id: string,
  time: string,
  title: string,
): LeadsReportControllerTodayAppointments200Item {
  return {
    id,
    title,
    type: 'property_viewing',
    startAt: dayjs(`${today}T${time}`).toISOString(),
    endAt: dayjs(`${today}T${time}`).add(1, 'hour').toISOString(),
    confirmationStatus: 'confirmed',
    place: null,
  }
}

// Quem escolhe "só hoje" e a ordem por horário é o servidor; o painel precisa
// mostrar exatamente o que ele devolve, sem reordenar nem esconder nada.
describe('Painel: compromissos de hoje', () => {
  it('T213 – mostra os compromissos recebidos, na ordem de horário, com contagem correta', () => {
    renderWithProviders(
      <TodayAppointmentsCard
        appointments={[
          appointment('a', '08:30', 'Primeiro'),
          appointment('b', '11:00', 'Segundo'),
          appointment('c', '16:45', 'Terceiro'),
        ]}
      />,
    )

    const titles = screen.getAllByText(/Primeiro|Segundo|Terceiro/).map((node) => node.textContent)
    const times = screen.getAllByText(/^\d{2}:\d{2}$/).map((node) => node.textContent)

    expect(titles).toEqual(['Primeiro', 'Segundo', 'Terceiro'])
    expect(times).toEqual(['08:30', '11:00', '16:45'])
    expect(screen.getByText('3')).toBeInTheDocument()
  })

  it('T213 – sem compromissos mostra a mensagem de vazio e contagem 0', () => {
    renderWithProviders(<TodayAppointmentsCard appointments={[]} />)

    expect(screen.getByText('0')).toBeInTheDocument()
    expect(screen.queryByText(/^\d{2}:\d{2}$/)).not.toBeInTheDocument()
  })
})
