// Barrel dos utilitários de teste. Importe daqui em vez de caçar caminhos:
//   import { renderWithProviders, server, apiError } from '@/test'
export * from '@testing-library/react'
export { default as userEvent } from '@testing-library/user-event'
export { renderWithProviders } from './renderWithProviders'
export { renderHookWithProviders } from './renderHookWithProviders'
export { createTestQueryClient } from './queryClient'
export { server } from './server'
export { apiError, apiNetworkError, apiPending } from './apiMocks'
