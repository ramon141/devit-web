import { useTranslation } from 'react-i18next'
import { useLeadMatches } from '@/pages/Clientes/Leads/hooks/useLeadMatches'
import LeadMatchItem from '@/pages/Clientes/Leads/components/LeadMatchItem'

type LeadMatchesListProps = {
  leadId: string
}

// Imóveis da carteira compatíveis com a richiesta
function LeadMatchesList({ leadId }: LeadMatchesListProps) {
  const { t } = useTranslation('clientes')
  const { matches, isLoading, changeStatus } = useLeadMatches(leadId)

  return (
    <div id="modal-leads-matches" className="grid gap-3 border-t pt-4">
      <div>
        <h3 className="text-sm font-semibold">{t('leadMatches.title')}</h3>
        <p className="text-xs text-muted-foreground">{t('leadMatches.description')}</p>
      </div>

      {!isLoading && matches.length === 0 && (
        <p className="text-sm text-muted-foreground">{t('leadMatches.empty')}</p>
      )}

      {matches.map((match) => (
        <LeadMatchItem key={match.id} match={match} onStatusChange={changeStatus} />
      ))}
    </div>
  )
}

export default LeadMatchesList
