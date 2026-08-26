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
  return (
    <>
      <ConfirmPopup
        open={!!deleteTarget}
        onOpenChange={(open) => !open && onDeleteTargetChange(null)}
        title="Eliminare il contratto?"
        description={`Questa azione eliminerà definitivamente il contratto "${deleteTarget?.number}".`}
        variant="destructive"
        confirmLabel="Elimina"
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
