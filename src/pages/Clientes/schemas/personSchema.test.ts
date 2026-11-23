import { describe, expect, it } from 'vitest'
import i18n from '@/i18n'
import { createPersonSchema } from '@/pages/Clientes/schemas/personSchema'

const t = i18n.getFixedT('it', 'clientes')

describe('T300 espaços extras em nomes', () => {
  const schema = createPersonSchema(t)
  const base = { role: 'contact', active: true } as const

  it('remove espaços das pontas', () => {
    const result = schema.safeParse({ ...base, name: '  Maria   Rossi  ' })

    expect(result.success).toBe(true)
    expect(result.data?.name).toBe('Maria   Rossi')
  })

  it('nome só com espaços é rejeitado', () => {
    const result = schema.safeParse({ ...base, name: '     ' })

    expect(result.success).toBe(false)
  })
})
