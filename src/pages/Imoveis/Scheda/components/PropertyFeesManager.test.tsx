import { describe, expect, it } from 'vitest'
import type { PropertyFeeWithRelations } from '@/api/generated/models'
import {
  getPropertyFeeControllerCreateMockHandler,
  getPropertyFeeControllerCreateResponseMock,
  getPropertyFeeControllerFindMockHandler,
} from '@/api/generated/api.msw'
import { screen, server, userEvent, waitFor } from '@/test'
import { renderFicha } from '@/pages/Imoveis/Scheda/test/fichaTestUtils'
import PropertyFeesManager from '@/pages/Imoveis/Scheda/components/PropertyFeesManager'

type FeeBody = { name: string; amount: number; frequency: string }

const FREQUENCIES = [
  { value: 'once', label: 'Una tantum' },
  { value: 'monthly', label: 'Mensile' },
  { value: 'yearly', label: 'Annuale' },
]

function setup() {
  let stored: PropertyFeeWithRelations[] = []
  const bodies: FeeBody[] = []

  server.use(
    getPropertyFeeControllerFindMockHandler(() => stored),
    getPropertyFeeControllerCreateMockHandler(async ({ request }) => {
      const body = (await request.json()) as FeeBody
      bodies.push(body)
      const id = `fee${stored.length}`
      stored = [...stored, { id, propertyId: 'p1', ...body } as PropertyFeeWithRelations]

      return getPropertyFeeControllerCreateResponseMock({ id })
    }),
  )

  renderFicha(<PropertyFeesManager propertyId="p1" />)

  return bodies
}

describe('PropertyFeesManager', () => {
  it('T141 condomínio com cada periodicidade mostra o rótulo próprio e envia o valor certo', async () => {
    const bodies = setup()
    const user = userEvent.setup()

    for (const frequency of FREQUENCIES) {
      await user.type(screen.getByPlaceholderText('Nome tassa'), `Condominio ${frequency.value}`)
      await user.type(screen.getByPlaceholderText('0,00'), '15000')
      await user.click(screen.getByRole('combobox'))
      await user.click(await screen.findByRole('option', { name: frequency.label }))
      await user.click(screen.getByRole('button', { name: /aggiungi/i }))

      await screen.findByText(
        new RegExp(`Condominio ${frequency.value} · .*150,00.* · ${frequency.label}`),
      )
    }

    expect(bodies.map((body) => body.frequency)).toEqual(['once', 'monthly', 'yearly'])
    expect(bodies.every((body) => body.amount === 150)).toBe(true)
  }, 60000)

  it('T141 valor negativo nunca é enviado (o campo ignora o sinal) e campos faltando são recusados', async () => {
    const bodies = setup()
    const user = userEvent.setup()

    await user.click(screen.getByRole('button', { name: /aggiungi/i }))
    expect(await screen.findByText('Compila nome, importo e frequenza.')).toBeInTheDocument()

    await user.type(screen.getByPlaceholderText('Nome tassa'), 'Condominio')
    await user.type(screen.getByPlaceholderText('0,00'), '-500')
    await user.click(screen.getByRole('combobox'))
    await user.click(await screen.findByRole('option', { name: 'Mensile' }))
    await user.click(screen.getByRole('button', { name: /aggiungi/i }))

    await waitFor(() => expect(bodies).toHaveLength(1))
    expect(bodies[0]?.amount).toBeGreaterThanOrEqual(0)
  })
})
