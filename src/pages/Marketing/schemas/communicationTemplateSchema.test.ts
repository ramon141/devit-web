import { describe, expect, it } from 'vitest'
import i18n from '@/i18n'
import {
  communicationTemplateSchema,
  type TemplateFormValues,
} from '@/pages/Marketing/schemas/communicationTemplateSchema'

const t = i18n.getFixedT('it', 'marketing')
const schema = communicationTemplateSchema(t)

const valid: TemplateFormValues = {
  name: 'Promozione',
  channel: 'email',
  category: 'generico',
  subject: 'Oggetto',
  body: '<p>Ciao</p>',
  design: null,
  active: true,
}

function messagesFor(values: Partial<TemplateFormValues>, field: string) {
  const result = schema.safeParse({ ...valid, ...values })

  if (result.success) return []

  return result.error.issues
    .filter((issue) => issue.path[0] === field)
    .map((issue) => issue.message)
}

describe('Marketing: regras do modelo de mensagem', () => {
  it('T215 modelo sem nome, canal e categoria dá um aviso por campo', () => {
    const result = schema.safeParse({ ...valid, name: '', channel: '', category: '' })

    expect(result.success).toBe(false)

    const byField = Object.fromEntries(
      (result.error?.issues ?? []).map((issue) => [String(issue.path[0]), issue.message]),
    )

    expect(byField.name).toBe(t('templateSchema.nameRequired'))
    expect(byField.channel).toBe(t('templateSchema.channelRequired'))
    expect(byField.category).toBe(t('templateSchema.categoryRequired'))
  })

  it('T216 e-mail sem assunto ou com assunto só de espaços é recusado', () => {
    const expected = [t('templateSchema.subjectRequiredForEmail')]

    expect(messagesFor({ subject: '' }, 'subject')).toEqual(expected)
    expect(messagesFor({ subject: undefined }, 'subject')).toEqual(expected)
    expect(messagesFor({ subject: '   ' }, 'subject')).toEqual(expected)
  })

  it('T217 WhatsApp sem assunto é aceito', () => {
    const result = schema.safeParse({ ...valid, channel: 'whatsapp', subject: '', body: 'Ciao' })

    expect(result.success).toBe(true)
  })

  it.each([
    ['vazio', ''],
    ['só espaços', '     '],
    ['só marcas de formatação', '<p></p>'],
    ['marcas com espaços', '<p> </p><br/>'],
  ])('T218 corpo %s é recusado', (_label, body) => {
    expect(messagesFor({ body }, 'body')).toContain(t('templateSchema.bodyRequired'))
  })

  it('T219 corpo com texto dentro de formatação é aceito', () => {
    const result = schema.safeParse({ ...valid, body: '<p>Olá <b>Maria</b></p>' })

    expect(result.success).toBe(true)
  })
})
