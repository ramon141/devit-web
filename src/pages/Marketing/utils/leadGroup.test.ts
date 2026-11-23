import { describe, expect, it } from 'vitest'
import {
  matchesStreet,
  partitionCandidates,
  type GroupCandidate,
} from '@/pages/Marketing/utils/leadGroup'

function candidate(id: string, overrides: Partial<GroupCandidate> = {}): GroupCandidate {
  return { id, name: `Pessoa ${id}`, email: `${id}@x.com`, phone: `39${id}`, ...overrides }
}

const keepAll = () => false

describe('Marketing: filtro de rua do grupo', () => {
  it('T222 filtro "via roma" ignora caixa, número e acento', () => {
    const list = [
      candidate('1', { street: 'Via Roma' }),
      candidate('2', { street: 'VIA ROMA 12' }),
      candidate('3', { street: 'Via Nàpoli' }),
    ]

    const kept = list.filter((item) => matchesStreet(item, ['via roma']))

    expect(kept.map((item) => item.id)).toEqual(['1', '2'])
  })

  it('T223 filtro de rua vazio deixa passar todos os 10', () => {
    const list = Array.from({ length: 10 }, (_, index) =>
      candidate(String(index), { street: index % 2 ? 'Via X' : null }),
    )

    expect(list.filter((item) => matchesStreet(item, []))).toHaveLength(10)
  })

  it('T236 duas ruas no filtro: entra quem está em qualquer uma delas', () => {
    const list = [
      candidate('1', { street: 'Via Roma' }),
      candidate('2', { street: 'Corso Umberto' }),
      candidate('3', { street: 'Via Milano' }),
    ]

    const kept = list.filter((item) => matchesStreet(item, ['via roma', 'corso umberto']))

    expect(kept.map((item) => item.id)).toEqual(['1', '2'])
  })
})

describe('Marketing: separação de elegíveis, sem contato e descadastrados', () => {
  it('T224 sem e-mail em campanha de e-mail conta como sem contato', () => {
    const list = [candidate('1'), candidate('2', { email: null }), candidate('3')]

    const result = partitionCandidates(list, true, keepAll)

    expect(result.withoutContact).toBe(1)
    expect(result.eligible.map((item) => item.id)).toEqual(['1', '3'])
  })

  it('T225 sem telefone em campanha de WhatsApp conta como sem contato', () => {
    const list = [candidate('1'), candidate('2', { phone: '' }), candidate('3')]

    const result = partitionCandidates(list, false, keepAll)

    expect(result.withoutContact).toBe(1)
    expect(result.eligible.map((item) => item.id)).toEqual(['1', '3'])
  })

  it('T229 grupo de 1000: elegíveis + sem contato + descadastrados = 1000', () => {
    const list = Array.from({ length: 1000 }, (_, index) =>
      candidate(String(index), { email: index % 5 === 0 ? null : `${index}@x.com` }),
    )

    const result = partitionCandidates(list, true, (item) => Number(item.id) % 7 === 0)

    expect(result.eligible.length + result.withoutContact + result.optedOut).toBe(1000)
    expect(result.withoutContact).toBe(200)
    expect(result.optedOut).toBeGreaterThan(0)
  })
})
