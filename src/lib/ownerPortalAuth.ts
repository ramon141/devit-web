import axios from 'axios'

// Auth separada do CRM: o proprietário nunca usa o token/instância `api` do gestionale.
const TOKEN_KEY = 'ownerPortalToken'

export const ownerPortalApi = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API_URL,
})

ownerPortalApi.interceptors.request.use((config) => {
  const token = OwnerPortalAuth.getToken()

  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

export const OwnerPortalAuth = {
  getToken: (): string | null => localStorage.getItem(TOKEN_KEY),
  setToken: (token: string): void => localStorage.setItem(TOKEN_KEY, token),
  removeToken: (): void => localStorage.removeItem(TOKEN_KEY),
  isAuthenticated: (): boolean => !!OwnerPortalAuth.getToken(),
}
