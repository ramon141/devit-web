import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import ModalRegister from '@/components/ModalRegister'
import { formatDateTime } from '@/utils/formatDate'
import type { PropertyDuplicateInfo, PropertyDuplicateViolation } from '@/pages/Imoveis/types/duplicate'

type PropertyDuplicateModalProps = {
  info: PropertyDuplicateInfo | null
  onClose: () => void
}

function Violation({ violation }: { violation: PropertyDuplicateViolation }) {
  const { t } = useTranslation('imoveis')
  const existing = violation.existingProperty
  const broker = violation.responsibleBroker
  const brokerName = broker?.code ? `${broker.code} - ${broker.name}` : broker?.name

  return (
    <div className="grid gap-1 rounded-md p-3 text-sm ring-1 ring-border">
      <p className="font-semibold text-destructive">{violation.ruleDescription}</p>
      <p>{t('broker.duplicate.matched')}: <strong>{violation.matchedValue}</strong></p>

      <p>
        {t('broker.duplicate.existing')}: <strong>{existing?.code}</strong> · {existing?.address}{' '}
        {existing?.situation && <Badge variant="secondary">{t(`broker.duplicate.status.${existing.situation}`)}</Badge>}
      </p>

      <p>
        {t('broker.duplicate.responsible')}: <strong>{brokerName ?? '—'}</strong>
        {broker?.phone && <> · {t('broker.duplicate.phone', { phone: broker.phone })}</>}
      </p>

      <p className="text-xs text-muted-foreground">
        {existing?.registeredAt && t('broker.duplicate.registeredAt', { date: formatDateTime(existing.registeredAt) })}
        {broker?.since && <> · {t('broker.duplicate.since', { date: formatDateTime(broker.since) })}</>}
      </p>
    </div>
  )
}

// Bloqueio de duplicidade: mostra o motivo exato, o imóvel existente e quem é o responsável
function PropertyDuplicateModal({ info, onClose }: PropertyDuplicateModalProps) {
  const { t } = useTranslation('imoveis')
  const violations = info?.violations ?? []
  const canTransfer = violations.some((violation) => violation.canTransfer)

  return (
    <ModalRegister open={info !== null} onOpenChange={(open) => !open && onClose()} title={t('broker.duplicate.title')}>
      <div className="grid w-full gap-3">
        {violations.map((violation) => (
          <Violation key={`${violation.rule}-${violation.existingProperty?.id}`} violation={violation} />
        ))}

        {!canTransfer && <p className="text-sm text-muted-foreground">{t('broker.duplicate.transferHint')}</p>}

        <div className="flex justify-end">
          <Button type="button" onClick={onClose}>{t('broker.duplicate.close')}</Button>
        </div>
      </div>
    </ModalRegister>
  )
}

export default PropertyDuplicateModal
