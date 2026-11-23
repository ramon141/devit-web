import { describe, expect, it } from 'vitest'
import { screen, userEvent, waitFor, within } from '@/test'
import {
  addFromSelect,
  addOutcome,
  getSection,
  removeRow,
  renderForm,
  save,
  trackCreatedEvents,
  typeTitle,
  useSearchData,
  waitForBodies,
} from '@/pages/Agenda/agendaFormTestUtils'

const PEOPLE = [
  { id: 'p1', name: 'Rossi Mario' },
  { id: 'p2', name: 'Bianchi Luca' },
  { id: 'p3', name: 'Verdi Anna' },
]

const PROPERTIES = [
  { id: 'i12', code: 'AP-12', title: 'Attico centro' },
  { id: 'i15', code: 'AP-15', title: 'Bilocale mare' },
]

describe('Evento novo: vínculos antes de salvar', () => {
  it('T207 – 3 participantes, remove o segundo: lista tem 2 e só esses 2 são enviados', async () => {
    useSearchData(PEOPLE)
    const bodies = trackCreatedEvents()
    renderForm()

    await addFromSelect('Clienti/proprietari collegati', 'Rossi Mario')
    await addFromSelect('Clienti/proprietari collegati', 'Bianchi Luca')
    await addFromSelect('Clienti/proprietari collegati', 'Verdi Anna')
    await removeRow('Bianchi Luca')

    const section = getSection('Clienti/proprietari collegati')

    expect(within(section).queryByText('Bianchi Luca')).not.toBeInTheDocument()
    expect(within(section).getByText('Rossi Mario')).toBeInTheDocument()
    expect(within(section).getByText('Verdi Anna')).toBeInTheDocument()

    await typeTitle('Visita')
    await save()
    await waitForBodies(bodies)

    expect(bodies[0]?.participants).toEqual([{ personId: 'p1' }, { personId: 'p3' }])
  })

  it('T208 – adiciona AP-12 e AP-15, remove AP-12: só AP-15 fica e é enviado', async () => {
    useSearchData([], PROPERTIES)
    const bodies = trackCreatedEvents()
    renderForm()

    await addFromSelect('Immobili collegati', 'AP-12 · Attico centro')
    await addFromSelect('Immobili collegati', 'AP-15 · Bilocale mare')

    expect(screen.getByText('AP-12 · Attico centro')).toBeInTheDocument()
    expect(screen.getByText('AP-15 · Bilocale mare')).toBeInTheDocument()

    await removeRow('AP-12 · Attico centro')

    expect(screen.queryByText('AP-12 · Attico centro')).not.toBeInTheDocument()
    expect(screen.getByText('AP-15 · Bilocale mare')).toBeInTheDocument()

    await typeTitle('Visita')
    await save()
    await waitForBodies(bodies)

    expect(bodies[0]?.linkedProperties).toEqual([{ propertyId: 'i15' }])
  })

  it('T209 – 3 resultados, remove o segundo: ficam o primeiro e o terceiro, na ordem', async () => {
    const bodies = trackCreatedEvents()
    renderForm()

    await addOutcome('gostou')
    await addOutcome('quer revisitar')
    await addOutcome('proposta futura')
    await removeRow('quer revisitar')

    await typeTitle('Visita')
    await save()
    await waitForBodies(bodies)

    expect(bodies[0]?.outcomes).toEqual([{ outcome: 'gostou' }, { outcome: 'proposta futura' }])
  })

  it('T209 – resultados repetidos: remover pela posição apaga só o escolhido', async () => {
    const bodies = trackCreatedEvents()
    renderForm()

    await addOutcome('ok')
    await addOutcome('ok')
    await addOutcome('depois')

    const user = userEvent.setup()
    const rows = screen.getAllByText('ok').map((text) => text.closest('div'))

    await user.click(within(rows[0] as HTMLElement).getByRole('button'))
    await typeTitle('Visita')
    await save()
    await waitForBodies(bodies)

    expect(bodies[0]?.outcomes).toEqual([{ outcome: 'ok' }, { outcome: 'depois' }])
  })

  it('T210 – (a) anexo escolhido é enviado junto ao salvar o evento', async () => {
    const bodies = trackCreatedEvents()
    renderForm()
    const file = new File(['%PDF-1.4 conteudo'], 'scheda.pdf', { type: 'application/pdf' })

    await userEvent.setup().upload(getFileInput(), file)
    expect(await screen.findByText('scheda.pdf')).toBeInTheDocument()

    await typeTitle('Visita')
    await save()
    await waitForBodies(bodies)

    expect(bodies[0]?.attachments).toHaveLength(1)
    expect(bodies[0]?.attachments?.[0]).toMatchObject({
      originalName: 'scheda.pdf',
      mimeType: 'application/pdf',
    })
  })

  it('T210 – (b) cancelar não envia nada ao servidor', async () => {
    const bodies = trackCreatedEvents()
    const { onOpenChange } = renderForm()
    const file = new File(['%PDF-1.4 conteudo'], 'scheda.pdf', { type: 'application/pdf' })

    await userEvent.setup().upload(getFileInput(), file)
    await userEvent.setup().click(screen.getByRole('button', { name: 'Annulla' }))

    expect(onOpenChange).toHaveBeenCalledWith(false)
    await waitFor(() => expect(bodies).toHaveLength(0))
  })
})

function getFileInput() {
  const input = getSection('Scheda di visualizzazione').parentElement?.querySelector('input[type=file]')

  if (!(input instanceof HTMLInputElement)) throw new Error('campo de arquivo não encontrado')

  return input
}
