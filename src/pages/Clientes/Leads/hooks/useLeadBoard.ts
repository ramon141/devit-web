import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLeadControllerFind } from '@/api/generated/api'
import { getLeadStatusOptions } from '@/pages/Clientes/Leads/schemas/leadSchema'
import { UserInfo } from '@/auth'
import type { Lead } from '@/api/generated/models'

export type LeadBoardFilters = {
  source: string
  requestType: string
  assignedToId: string
  onlyMine: boolean
  search: string
}

export const emptyLeadBoardFilters: LeadBoardFilters = {
  source: '',
  requestType: '',
  assignedToId: '',
  onlyMine: false,
  search: '',
}

function matchesFilters(lead: Lead, filters: LeadBoardFilters): boolean {
  if (filters.source && lead.source !== filters.source) return false
  if (filters.requestType && lead.requestType !== filters.requestType) return false

  const currentUserId = UserInfo.getUserId()
  if (filters.onlyMine && lead.assignedToId !== currentUserId) return false
  if (!filters.onlyMine && filters.assignedToId && lead.assignedToId !== filters.assignedToId) {
    return false
  }

  if (filters.search) {
    const term = filters.search.toLowerCase()
    const haystack = `${lead.name ?? ''} ${lead.subject ?? ''}`.toLowerCase()
    if (!haystack.includes(term)) return false
  }

  return true
}

export function useLeadBoard() {
  const { t } = useTranslation('clientes')
  const [filters, setFilters] = useState<LeadBoardFilters>(emptyLeadBoardFilters)
  const { data: leads, isLoading } = useLeadControllerFind({
    filter: { order: ['createdAt DESC'] },
  })

  const filteredLeads = (leads ?? []).filter((lead: Lead) => matchesFilters(lead, filters))

  const columns = getLeadStatusOptions(t).map((status) => ({
    status: status.value,
    label: status.label,
    leads: filteredLeads.filter((lead: Lead) => lead.status === status.value),
  }))

  return { columns, leads: filteredLeads, isLoading, filters, setFilters }
}
