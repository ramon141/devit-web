// Prepende `// @ts-nocheck` no arquivo de mocks gerado pelo orval.
// Os builders de faker geram tipos incompatíveis para schemas recursivos
// (foreignKey: {}, actionLogs: never[]). O arquivo é gerado e já está no
// exclude do tsconfig; o import em testes é o que o puxa para o tsc.
import { readFileSync, writeFileSync } from 'node:fs'

const file = 'src/api/generated/api.msw.ts'
const src = readFileSync(file, 'utf8')

if (!src.startsWith('// @ts-nocheck')) {
  writeFileSync(file, `// @ts-nocheck\n${src}`)
}
