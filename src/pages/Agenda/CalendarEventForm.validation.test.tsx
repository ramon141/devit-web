import { describe, expect, it } from 'vitest'
import { fireEvent, screen, waitFor, within } from '@/test'
import {
  getField,
  renderForm,
  save,
  trackCreatedEvents,
  typeTitle,
} from '@/pages/Agenda/agendaFormTestUtils'

function setTimes(start: string, end: string) {
  const startInput = within(getField('modal-field-startTime')).getByDisplayValue('09:00')

  fireEvent.change(startInput, { target: { value: start } })
  fireEvent.change(within(getField('modal-field-endTime')).getByDisplayValue(/\d\d:\d\d/), {
    target: { value: end },
  })
}

describe('Evento: erros mostrados no formulário', () => {
  it('T193 – título vazio mostra aviso e nada é salvo', async () => {
    const bodies = trackCreatedEvents()
    renderForm()

    await typeTitle('')
    await save()

    expect(await screen.findByText('Inserisci almeno 2 caratteri')).toBeInTheDocument()
    expect(bodies).toHaveLength(0)
  })

  it('T195 – hora de fim antes da de início: erro no campo hora de fim e nada é salvo', async () => {
    const bodies = trackCreatedEvents()
    renderForm()

    await typeTitle('Visita')
    setTimes('15:00', '14:00')
    await save()

    const error = await screen.findByText('L’ora di fine deve essere successiva all’ora di inizio')

    expect(getField('modal-field-endTime')).toContainElement(error)
    expect(bodies).toHaveLength(0)
  })

  it('T196 – hora de fim igual à de início é recusada', async () => {
    const bodies = trackCreatedEvents()
    renderForm()

    await typeTitle('Visita')
    setTimes('15:00', '15:00')
    await save()

    expect(
      await screen.findByText('L’ora di fine deve essere successiva all’ora di inizio'),
    ).toBeInTheDocument()
    expect(bodies).toHaveLength(0)
  })

  it('T197 – dia inteiro marcado: horas ignoradas e evento salvo', async () => {
    const bodies = trackCreatedEvents()
    renderForm()

    await typeTitle('Feriado')
    setTimes('15:00', '14:00')
    fireEvent.click(within(getField('modal-field-allDay')).getByRole('switch'))
    await save()

    await waitFor(() => expect(bodies).toHaveLength(1))
  })
})
