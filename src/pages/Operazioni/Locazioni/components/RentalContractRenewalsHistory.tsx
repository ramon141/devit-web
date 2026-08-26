import { useTranslation } from 'react-i18next'
import { useContractRenewalControllerFind } from '@/api/generated/api'
import { formatAmount } from '@/utils/formatAmount'
import { formatDate } from '@/utils/formatDate'

type RentalContractRenewalsHistoryProps = {
  contractId: string
}

function RentalContractRenewalsHistory({ contractId }: RentalContractRenewalsHistoryProps) {
  const { t } = useTranslation('operazioni')
  const { data: renewals } = useContractRenewalControllerFind({
    filter: { where: { contractId }, order: ['newEndDate DESC'] },
  })

  return (
    <div className="grid gap-2">
      {(renewals ?? []).length === 0 && (
        <p className="text-sm text-muted-foreground">{t('locazioni.renewalsHistory.emptyMessage')}</p>
      )}
      {(renewals ?? []).map((renewal) => (
        <div key={renewal.id} className="rounded-lg px-3 py-2 ring-1 ring-border">
          <p className="text-sm">
            {formatDate(renewal.previousEndDate)} → {formatDate(renewal.newEndDate)}
          </p>
          <p className="text-sm text-muted-foreground">
            {formatAmount(renewal.previousAmount)} → {formatAmount(renewal.newAmount)}
          </p>
          {renewal.note && <p className="text-xs text-muted-foreground">{renewal.note}</p>}
        </div>
      ))}
    </div>
  )
}

export default RentalContractRenewalsHistory
