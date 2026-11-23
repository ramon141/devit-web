import { describe, expect, it } from 'vitest'
import { screen, userEvent, within } from '@/test'
import { buildEvent } from '@/pages/Agenda/agendaTestUtils'
import {
  chooseOption,
  getField,
  renderForm,
  save,
  trackCreatedEvents,
  typeTitle,
  waitForBodies,
} from '@/pages/Agenda/agendaFormTestUtils'

const REMINDERS = [
  ['none', 'Nessuno'],
  ['at_time', 'Al momento'],
  ['5_minutes_before', '5 minuti prima'],
  ['15_minutes_before', '15 minuti prima'],
  ['30_minutes_before', '30 minuti prima'],
  ['1_hour_before', '1 ora prima'],
  ['1_day_before', '1 giorno prima'],
] as const

const RECURRENCES = [
  ['none', 'Nessuna'],
  ['daily', 'Giornaliera'],
  ['weekly', 'Settimanale'],
  ['monthly', 'Mensile'],
] as const

function selectedLabel(fieldId: string) {
  return within(getField(fieldId)).getByRole('combobox').textContent
}

describe('Evento: lembrete e repetição', () => {
  it.each(REMINDERS)('T200 – lembrete %s é enviado ao salvar e reaparece ao reabrir', async (value, label) => {
    const bodies = trackCreatedEvents()
    const { unmount } = renderForm()

    await typeAndSaveWith('modal-field-reminder', label)
    await waitForBodies(bodies)
    expect(bodies[0]?.reminder).toBe(value)

    unmount()
    renderForm({ event: buildEvent({ reminder: value }) })
    expect(selectedLabel('modal-field-reminder')).toBe(label)
  })

  it.each(RECURRENCES)('T201 – repetição %s é enviada ao salvar e reaparece ao reabrir', async (value, label) => {
    const bodies = trackCreatedEvents()
    const { unmount } = renderForm()

    await typeAndSaveWith('modal-field-recurrence', label)
    await waitForBodies(bodies)
    expect(bodies[0]?.recurrence).toBe(value)

    unmount()
    renderForm({ event: buildEvent({ recurrence: value }) })
    expect(selectedLabel('modal-field-recurrence')).toBe(label)
  })

  it('T201 – as quatro opções de repetição existem em italiano e em português', async () => {
    const { default: i18n } = await import('@/i18n')
    const labels = {
      it: ['Nessuna', 'Giornaliera', 'Settimanale', 'Mensile'],
      pt: ['Nenhuma', 'Diária', 'Semanal', 'Mensal'],
    }

    for (const language of ['it', 'pt'] as const) {
      await i18n.changeLanguage(language)
      const { unmount } = renderForm()

      await userEvent.setup().click(within(getField('modal-field-recurrence')).getByRole('combobox'))
      const options = await screen.findAllByRole('option')

      expect(options.map((option) => option.textContent)).toEqual(labels[language])
      unmount()
    }

    await i18n.changeLanguage('it')
  })
})

async function typeAndSaveWith(fieldId: string, label: string) {
  await typeTitle('Evento teste')
  await chooseOption(fieldId, label)
  await save()
}
