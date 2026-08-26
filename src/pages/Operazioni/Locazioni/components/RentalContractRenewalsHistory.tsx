import dayjs from 'dayjs'
import { useContractRenewalControllerFind } from '@/api/generated/api'

type RentalContractRenewalsHistoryProps = {
  contractId: string
}

function formatAmount(value?: number | null) {
  if (value == null) return '—'
  return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(value)
}

function RentalContractRenewalsHistory({ contractId }: RentalContractRenewalsHistoryProps) {
  const { data: renewals } = useContractRenewalControllerFind({
    filter: { where: { contractId }, order: ['newEndDate DESC'] },
  })

  return (
    <div className="grid gap-2">
      {(renewals ?? []).length === 0 && (
        <p className="text-sm text-muted-foreground">Nessuna proroga registrata.</p>
      )}
      {(renewals ?? []).map((renewal) => (
        <div key={renewal.id} className="rounded-lg px-3 py-2 ring-1 ring-border">
          <p className="text-sm">
            {dayjs(renewal.previousEndDate).format('DD/MM/YYYY')} → {dayjs(renewal.newEndDate).format('DD/MM/YYYY')}
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
