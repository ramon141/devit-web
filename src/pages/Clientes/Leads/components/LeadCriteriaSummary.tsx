import { useTranslation } from 'react-i18next'
import { Badge } from '@/components/ui/badge'
import type { LeadWithRelations } from '@/api/generated/models'
import { getLeadPurposeOptions } from '@/pages/Clientes/Leads/schemas/leadSchema'
import { useNeighborhoodOptions } from '@/hooks/useNeighborhoodOptions'
import { formatRange } from '@/pages/Clientes/Leads/utils/formatRange'

type LeadCriteriaSummaryProps = {
  lead: LeadWithRelations
}

// Resumo dos critérios da richiesta exibido no card do kanban
function LeadCriteriaSummary({ lead }: LeadCriteriaSummaryProps) {
  const { t } = useTranslation('clientes')
  const neighborhoodOptions = useNeighborhoodOptions()

  const purposeLabel = getLeadPurposeOptions(t).find(
    (option) => option.value === lead.purpose
  )?.label

  const zoneLabels = (lead.leadNeighborhoods ?? [])
    .map((link) => neighborhoodOptions.find((option) => option.value === link.neighborhoodId))
    .filter((option): option is { value: string; label: string } => !!option)

  const priceRange = formatRange(lead.minBudget, lead.maxBudget)
  const areaRange = formatRange(lead.minAreaSqm, lead.maxAreaSqm)

  const hasCriteria = purposeLabel || lead.category || priceRange || areaRange || zoneLabels.length

  if (!hasCriteria) return null

  return (
    <div className="grid gap-1.5 border-t pt-2">
      <div className="flex flex-wrap gap-1">
        {purposeLabel && <Badge variant="secondary">{purposeLabel}</Badge>}
        {lead.category && <Badge variant="outline">{lead.category.name}</Badge>}
      </div>

      {priceRange && (
        <p className="text-xs text-muted-foreground">
          {t('leadFormFields.priceRange')}: {priceRange}
        </p>
      )}

      {areaRange && (
        <p className="text-xs text-muted-foreground">
          {t('leadFormFields.areaRange')}: {areaRange}
        </p>
      )}

      {zoneLabels.length > 0 && (
        <p className="line-clamp-2 text-xs text-muted-foreground">
          {zoneLabels.map((option) => option.label).join(' · ')}
        </p>
      )}
    </div>
  )
}

export default LeadCriteriaSummary
