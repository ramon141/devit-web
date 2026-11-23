import { describe, expect, it } from 'vitest'
import i18n from '@/i18n'
import { createUserSchema } from '@/pages/Amministrazione/Utenti/schemas/userSchema'

const t = i18n.getFixedT('it', 'amministrazione')

const validUser = {
  fullName: 'Mario Rossi',
  email: 'mario@devit.it',
  accessLevel: 'broker',
  branchId: '',
  active: true,
  password: 'Abc12345!',
}

function messagesByField(
  values: Record<string, string | boolean | undefined>,
  isNewUser: boolean,
) {
  const result = createUserSchema(t, isNewUser).safeParse(values)

  if (result.success) return {}

  return Object.fromEntries(result.error.issues.map((issue) => [issue.path.join('.'), issue.message]))
}

describe('Schema do usuário', () => {
  it('T237 recusa senha sem maiúscula e símbolo e aceita a forte', () => {
    const weak = messagesByField({ ...validUser, password: 'abc12345' }, true)
    const strong = messagesByField({ ...validUser, password: 'Abc12345!' }, true)

    expect(weak.password).toBe(t('userSchema.passwordMin'))
    expect(strong).toEqual({})
  })

  it('T238 senha forte: 7 caracteres recusada, 8 aceita', () => {
    const seven = messagesByField({ ...validUser, password: 'Ab1!xyz' }, true)
    const eight = messagesByField({ ...validUser, password: 'Ab1!xyzw' }, true)

    expect(seven.password).toBe(t('userSchema.passwordMin'))
    expect(eight).toEqual({})
  })

  it('T239 usuário novo sem senha recebe aviso de senha obrigatória', () => {
    const empty = messagesByField({ ...validUser, password: '' }, true)
    const missing = messagesByField({ ...validUser, password: undefined }, true)

    expect(empty.password).toBe(t('userForm.passwordRequired'))
    expect(missing.password).toBe(t('userForm.passwordRequired'))
  })

  it('T240 edição aceita senha em branco (mantém a atual)', () => {
    const blank = messagesByField({ ...validUser, fullName: 'Mario Bianchi', password: '' }, false)
    const absent = messagesByField({ ...validUser, password: undefined }, false)

    expect(blank).toEqual({})
    expect(absent).toEqual({})
  })

  it('T241 edição com senha fraca digitada é recusada mesmo sendo opcional', () => {
    const errors = messagesByField({ ...validUser, password: 'abc' }, false)

    expect(errors.password).toBe(t('userSchema.passwordMin'))
  })

  it('T242 nome de 1 letra e e-mail inválido geram dois avisos, um por campo', () => {
    const errors = messagesByField({ ...validUser, fullName: 'A', email: 'x' }, true)

    expect(errors.fullName).toBe(t('userSchema.fullNameMin'))
    expect(errors.email).toBe(t('userSchema.emailInvalid'))
    expect(Object.keys(errors).sort()).toEqual(['email', 'fullName'])
  })

  it('T243 usuário sem nível de acesso recebe aviso de nível obrigatório', () => {
    const errors = messagesByField({ ...validUser, accessLevel: undefined }, true)

    expect(errors.accessLevel).toBe(t('userSchema.accessLevelRequired'))
  })
})
