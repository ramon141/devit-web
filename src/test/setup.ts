import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { faker } from '@faker-js/faker'
import { afterAll, afterEach, beforeAll } from 'vitest'
import '@/i18n'
import { server } from './server'
import { installBrowserPolyfills } from './polyfills'

// As respostas padrão do orval geram listas com `faker.number.int({ min: 1, max: 10 })`
// itens, aninhadas em vários níveis (relações), e isso deixa cada tela lenta.
// 1 item basta para o handler padrão (quem precisa de dados sobrescreve com server.use).
const LIMITED = Symbol.for('devit.faker.int.limited')
type LimitedInt = typeof faker.number.int & { [LIMITED]?: true }
const currentInt: LimitedInt = faker.number.int

if (!currentInt[LIMITED]) {
  const int = currentInt.bind(faker.number)
  const limitedInt: LimitedInt = (options) =>
    typeof options === 'object' && options.min === 1 && options.max === 10 ? 1 : int(options)

  limitedInt[LIMITED] = true
  faker.number.int = limitedInt
}

installBrowserPolyfills()

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))

afterEach(() => {
  cleanup()
  server.resetHandlers()
  localStorage.clear()
})

afterAll(() => server.close())
