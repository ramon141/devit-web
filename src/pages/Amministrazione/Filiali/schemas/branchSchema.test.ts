import { describe, expect, it } from 'vitest'
import i18n from '@/i18n'
import { createBranchSchema } from '@/pages/Amministrazione/Filiali/schemas/branchSchema'

const t = i18n.getFixedT('it', 'amministrazione')

function nameError(name: string) {
  const result = createBranchSchema(t).safeParse({ name, active: true })

  return result.success ? undefined : result.error.issues[0]?.message
}

describe('Schema da filial', () => {
  it('T247 nome vazio e de 1 letra são recusados; 2 letras é aceito', () => {
    expect(nameError('')).toBe(t('branchSchema.nameMin'))
    expect(nameError('A')).toBe(t('branchSchema.nameMin'))
    expect(nameError('Ab')).toBeUndefined()
  })

  it('T247 espaços ao redor não contam como letras do nome', () => {
    expect(nameError('  A  ')).toBe(t('branchSchema.nameMin'))
    expect(nameError('   ')).toBe(t('branchSchema.nameMin'))
  })
})
