import { keepPreviousData } from '@tanstack/react-query'

// Listas paginadas: mantém a página anterior na tela enquanto a nova carrega
export const KEEP_PREVIOUS_DATA = { query: { placeholderData: keepPreviousData } }

// Dados que quase não mudam (categorias, filiais, zonas): validade longa
export const STABLE_DATA = { query: { staleTime: 30 * 60 * 1000 } }
