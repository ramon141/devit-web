import type { http } from 'msw'

// Tipos do argumento dos resolvers (a API gerada tipa o override de delete como unknown)
export type DeleteInfo = Parameters<Parameters<typeof http.delete>[1]>[0]
export type PostInfo = Parameters<Parameters<typeof http.post>[1]>[0]
export type PutInfo = Parameters<Parameters<typeof http.put>[1]>[0]
export type PatchInfo = Parameters<Parameters<typeof http.patch>[1]>[0]
