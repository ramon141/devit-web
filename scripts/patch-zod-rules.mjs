// Roda depois do orval: para enum que também tem tamanho máximo, o orval gera
// `zod.max(N).union([...])`, que não existe e derruba o carregamento do arquivo.
// O tamanho do enum já é garantido pelos próprios valores; remove o trecho inválido.
import { readFileSync, writeFileSync } from 'node:fs'

const file = 'src/api/generated/api.zod.ts'
const src = readFileSync(file, 'utf8')
const fixed = src.replace(/zod\.(?:max|min)\(\w+\)\.union\(/g, 'zod.union(')

if (fixed !== src) writeFileSync(file, fixed)
