import { useTranslation } from 'react-i18next'
import { useLeadControllerFind } from '@/api/generated/api'
import { getLeadStatusOptions } from '@/pages/Clientes/Leads/schemas/leadSchema'
import type { Lead } from '@/api/generated/models'

export function useLeadBoard() {
  const { t } = useTranslation('clientes')
  const { data: leads, isLoading } = useLeadControllerFind({
    filter: { order: ['createdAt DESC'] },
  })

  const columns = getLeadStatusOptions(t).map((status) => ({
    status: status.value,
    label: status.label,
    leads: (leads ?? []).filter((lead: Lead) => lead.status === status.value),
  }))

  return { columns, leads: leads ?? [], isLoading }
}
