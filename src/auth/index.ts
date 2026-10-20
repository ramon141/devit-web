import type { AuthControllerLogin200 } from '@/api/generated/models'
import i18n from '@/i18n'
import { api } from '@/api/mutator'

export const UserInfo = {
  getFullName: (): string | null => localStorage.getItem('fullName'),
  getEmail: (): string | null => localStorage.getItem('email'),
  getAccessLevel: (): string | null => localStorage.getItem('accessLevel'),
  getUserId: (): string | null => localStorage.getItem('userId'),

  setFullName: (fullName: string): void => localStorage.setItem('fullName', fullName),
  setEmail: (email: string): void => localStorage.setItem('email', email),
  setAccessLevel: (accessLevel: string): void => localStorage.setItem('accessLevel', accessLevel),
  setUserId: (userId: string): void => localStorage.setItem('userId', userId),

  removeFullName: (): void => localStorage.removeItem('fullName'),
  removeEmail: (): void => localStorage.removeItem('email'),
  removeAccessLevel: (): void => localStorage.removeItem('accessLevel'),
  removeUserId: (): void => localStorage.removeItem('userId'),
}

// A sessão vive num cookie HttpOnly gerenciado pela API; aqui só fica um indicador não sensível de que há login.
export const Auth = {
  isAdmin: (): boolean => {
    return UserInfo.getAccessLevel()?.toUpperCase() === 'ADMIN'
  },

  isAuthenticated: (): boolean => {
    return !!UserInfo.getUserId()
  },

  // notifyServer = false quando a API já recusou a sessão (401): não há o que encerrar lá.
  logout: (redirect = true, notifyServer = true): void => {
    if (notifyServer) void api.post('/auth/logout').catch(() => undefined)

    UserInfo.removeFullName()
    UserInfo.removeEmail()
    UserInfo.removeAccessLevel()
    UserInfo.removeUserId()

    // Percorso hardcoded (non importato da routes.tsx) per evitare import circolare con Auth
    if (redirect) window.location.href = '/gestionale/login'
  },

  login: (response: AuthControllerLogin200): void => {
    if (!response.user?.id) {
      throw new Error(i18n.t('auth.tokenMissing', { ns: 'common' }))
    }

    if (response.user.fullName) UserInfo.setFullName(response.user.fullName)
    if (response.user.email) UserInfo.setEmail(response.user.email)
    if (response.user.accessLevel) UserInfo.setAccessLevel(response.user.accessLevel)
    UserInfo.setUserId(response.user.id)
  },
}
