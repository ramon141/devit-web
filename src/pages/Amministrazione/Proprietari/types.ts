// Tipos locais: model novo, orval ainda não regenerado contra estes endpoints.
export type OwnerPortalAccess = {
  id: string
  email: string
  active?: boolean
  personId: string
  lastAccessAt?: string | null
  accessCount?: number
  createdAt: string
  updatedAt: string
  person?: { id: string; name: string }
}

export type OwnerPortalAccessCreated = OwnerPortalAccess & { pin: string }
