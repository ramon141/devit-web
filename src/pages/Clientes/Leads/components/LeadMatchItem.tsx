import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'
import { Badge } from '@/components/ui/badge'
import SelectField from '@/components/SelectField'
import type { LeadPropertyContactStatus, LeadPropertyWithRelations } from '@/api/generated/models'
import {
  getLeadContactStatusOptions,
  isLeadContactStatus,
} from '@/pages/Clientes/Leads/schemas/leadMatchOptions'
import { CRM_BASE_PATH } from '@/lib/crmBasePath'
import { formatDateTime } from '@/utils/formatDate'

type LeadMatchItemProps = {
  match: LeadPropertyWithRelations
  onStatusChange: (id: string, status: LeadPropertyContactStatus) => void
}

// Um imóvel compatível: nota, critérios atendidos/não atendidos e andamento do contato
function LeadMatchItem({ match, onStatusChange }: LeadMatchItemProps) {
  const { t } = useTranslation('clientes')
  const { property } = match

  function handleStatusChange(value: string) {
    if (match.id && isLeadContactStatus(value)) onStatusChange(match.id, value)
  }

  return (
    <div className="grid gap-2 rounded-lg border p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Link
          to={`${CRM_BASE_PATH}/proprieta/${match.propertyId}`}
          className="text-sm font-medium text-primary hover:underline"
        >
          {property ? `${property.code} — ${property.title}` : match.propertyId}
        </Link>

        {match.matchTotal != null && (
          <Badge variant="secondary">
            {t('leadMatches.score', { score: match.matchScore, total: match.matchTotal })}
          </Badge>
        )}
      </div>

      <div className="flex flex-wrap gap-1">
        {(match.matchedCriteria ?? []).map((criterion) => (
          <Badge key={criterion} className="bg-emerald-100 text-emerald-800">
            ✓ {t(`leadMatchCriteria.${criterion}`)}
          </Badge>
        ))}

        {(match.unmatchedCriteria ?? []).map((criterion) => (
          <Badge key={criterion} variant="outline" className="text-muted-foreground">
            ✗ {t(`leadMatchCriteria.${criterion}`)}
          </Badge>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="w-56">
          <SelectField
            value={match.contactStatus ?? undefined}
            onValueChange={handleStatusChange}
            options={getLeadContactStatusOptions(t)}
            placeholder={t('leadMatches.statusPlaceholder')}
          />
        </div>

        {match.contactStatusUpdatedAt && (
          <span className="text-xs text-muted-foreground">
            {t('leadMatches.updatedBy', {
              name: match.contactStatusUpdatedBy?.fullName ?? '—',
              date: formatDateTime(match.contactStatusUpdatedAt),
            })}
          </span>
        )}
      </div>
    </div>
  )
}

export default LeadMatchItem
