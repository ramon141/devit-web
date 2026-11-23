import { createTransferBrokerSchema } from './transferBrokerSchema'
import { tImoveis } from './imoveisTestHelpers'

const schema = createTransferBrokerSchema(tImoveis)
const reasonMsg = tImoveis('broker.transfer.reasonRequired')
const check = (reason: string, newBrokerId = 'broker-2') =>
  schema.safeParse({ newBrokerId, reason })

describe('Imóveis: transferência de corretor', () => {
  it('T109 motivo de 2 caracteres é recusado', () => {
    const result = check('ab')

    expect(result.success).toBe(false)
    expect(result.error?.issues[0]?.message).toBe(reasonMsg)
  })

  it('T110 motivos de 3 e 500 aceitos; 501 recusado', () => {
    expect(check('abc').success).toBe(true)
    expect(check('a'.repeat(500)).success).toBe(true)
    expect(check('a'.repeat(501)).error?.issues[0]?.message).toBe(reasonMsg)
  })

  it('T111 motivo com 3 espaços é recusado', () => {
    expect(check('   ').error?.issues[0]?.message).toBe(reasonMsg)
  })

  it('T112 sem novo corretor: aviso de corretor obrigatório', () => {
    const result = check('motivo válido', '')

    expect(result.error?.issues[0]?.message).toBe(tImoveis('broker.transfer.newBrokerRequired'))
  })
})
