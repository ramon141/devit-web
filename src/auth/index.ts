import type { AuthControllerLogin200 } from '@/api/generated/models'

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

export const Auth = {
  isAdmin: (): boolean => {
    return UserInfo.getAccessLevel()?.toUpperCase() === 'ADMIN'
  },

  isAuthenticated: (): boolean => {
    return !!Auth.getToken()
  },

  getToken: (): string | null => {
    return localStorage.getItem('token')
  },

  setToken: (token: string): void => {
    localStorage.setItem('token', token)
  },

  removeToken: (): void => {
    localStorage.removeItem('token')
  },

  logout: (redirect = true): void => {
    Auth.removeToken()
    UserInfo.removeFullName()
    UserInfo.removeEmail()
    UserInfo.removeAccessLevel()
    UserInfo.removeUserId()

    // Percorso hardcoded (non importato da routes.tsx) per evitare import circolare con Auth
    if (redirect) window.location.href = '/gestionale/login'
  },

  login: (response: AuthControllerLogin200): void => {
    if (!response.token) {
      throw new Error('Token inesistente. Prova a effettuare nuovamente il login.')
    }

    Auth.setToken(response.token)

    if (response.user) {
      if (response.user.fullName) UserInfo.setFullName(response.user.fullName)
      if (response.user.email) UserInfo.setEmail(response.user.email)
      if (response.user.accessLevel) UserInfo.setAccessLevel(response.user.accessLevel)
      if (response.user.id) UserInfo.setUserId(response.user.id)
    }
  },
}
