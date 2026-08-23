import { useLeadControllerFind } from '@/api/generated/api'
import { leadStatusOptions } from '@/pages/Clientes/Leads/schemas/leadSchema'
import type { Lead } from '@/api/generated/models'

export function useLeadBoard() {
  const { data: leads, isLoading } = useLeadControllerFind({
    filter: { order: ['createdAt DESC'] },
  })

  const columns = leadStatusOptions.map((status) => ({
    status: status.value,
    label: status.label,
    leads: (leads ?? []).filter((lead: Lead) => lead.status === status.value),
  }))

  return { columns, leads: leads ?? [], isLoading }
}
