import { describe, expect, it } from 'vitest'
import i18n from '@/i18n'
import { createCategorySchema } from '@/pages/Amministrazione/Categorie/schemas/categorySchema'

const t = i18n.getFixedT('it', 'amministrazione')

const validCategory = { name: 'Casa', slug: 'casa-nova', kind: '', icon: '', displayOrder: '', active: true }

function fieldError(field: 'slug' | 'displayOrder', value: string) {
  const result = createCategorySchema(t).safeParse({ ...validCategory, [field]: value })

  if (result.success) return undefined

  return result.error.issues.find((issue) => issue.path[0] === field)?.message
}

describe('Schema da categoria', () => {
  it.each(['Casa Nova', 'casa_nova!', 'a', '-casa', 'casa-', 'casa--nova'])(
    'T249 identificador "%s" é recusado',
    (slug) => {
      expect(fieldError('slug', slug)).toBeDefined()
    },
  )

  it.each(['casa-nova', 'ab', 'casa2-nova-3'])('T249 identificador "%s" é aceito', (slug) => {
    expect(fieldError('slug', slug)).toBeUndefined()
  })

  it.each(['-1', '1.5', 'abc', '32768', '1e9'])(
    'T250 ordem "%s" é recusada com aviso do máximo 32767',
    (order) => {
      const message = fieldError('displayOrder', order)

      expect(message).toBe(t('categorySchema.orderInvalid', { max: 32767 }))
      expect(message).toContain('32767')
    },
  )

  it.each(['0', '32767', ''])('T250 ordem "%s" é aceita', (order) => {
    expect(fieldError('displayOrder', order)).toBeUndefined()
  })
})
