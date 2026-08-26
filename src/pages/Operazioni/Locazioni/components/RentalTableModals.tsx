import { useTranslation } from 'react-i18next'
import ConfirmPopup from '@/components/ConfirmPopup'
import type { RentalContractWithRelations } from '@/api/generated/models'
import RentalRenewModal from '@/pages/Operazioni/Locazioni/components/RentalRenewModal'
import RentalContractTerminationModal from '@/pages/Operazioni/Locazioni/components/RentalContractTerminationModal'

type RentalTableModalsProps = {
  deleteTarget: RentalContractWithRelations | null
  onDeleteTargetChange: (target: RentalContractWithRelations | null) => void
  onConfirmDelete: () => void
  renewTarget: RentalContractWithRelations | null
  onRenewTargetChange: (target: RentalContractWithRelations | null) => void
  terminateTarget: RentalContractWithRelations | null
  onTerminateTargetChange: (target: RentalContractWithRelations | null) => void
}

function RentalTableModals({
  deleteTarget,
  onDeleteTargetChange,
  onConfirmDelete,
  renewTarget,
  onRenewTargetChange,
  terminateTarget,
  onTerminateTargetChange,
}: RentalTableModalsProps) {
  const { t } = useTranslation('operazioni')

  return (
    <>
      <ConfirmPopup
        open={!!deleteTarget}
        onOpenChange={(open) => !open && onDeleteTargetChange(null)}
        title={t('locazioni.tableModals.deleteTitle')}
        description={t('locazioni.tableModals.deleteDescription', { number: deleteTarget?.number })}
        variant="destructive"
        confirmLabel={t('locazioni.tableModals.deleteConfirm')}
        onConfirm={onConfirmDelete}
      />

      <RentalRenewModal
        open={!!renewTarget}
        onOpenChange={(open) => !open && onRenewTargetChange(null)}
        contractId={renewTarget?.id}
        contractNumber={renewTarget?.number}
      />

      <RentalContractTerminationModal
        open={!!terminateTarget}
        onOpenChange={(open) => !open && onTerminateTargetChange(null)}
        contractId={terminateTarget?.id}
        contractNumber={terminateTarget?.number}
      />
    </>
  )
}

export default RentalTableModals
