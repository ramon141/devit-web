import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import ConfirmPopup from '@/components/ConfirmPopup'
import { useConfirmPopup } from '@/hooks/useConfirmPopup'
import ComponentSection from '@/pages/Componentes/components/ComponentSection'

function ConfirmPopupSection() {
  const { open, setOpen, loading, openConfirm, withLoading } =
    useConfirmPopup()
  const [deleted, setDeleted] = useState(false)

  function handleConfirm() {
    withLoading(async () => {
      await new Promise((resolve) => setTimeout(resolve, 900))
      setDeleted(true)
    })
  }

  return (
    <ComponentSection
      id="confirm-popup"
      title="Confirm Popup"
      description="Modale di conferma per azioni distruttive o sensibili."
    >
      <div className="flex items-center gap-3">
        <Button variant="destructive" onClick={openConfirm}>
          <Trash2 />
          Elimina immobile
        </Button>
        {deleted && (
          <span className="text-sm text-muted-foreground">
            Immobile eliminato.
          </span>
        )}
      </div>

      <ConfirmPopup
        open={open}
        onOpenChange={setOpen}
        variant="destructive"
        title="Elimina immobile"
        description="Questa azione non può essere annullata. L'annuncio verrà rimosso definitivamente."
        confirmLabel="Elimina"
        loading={loading}
        onConfirm={handleConfirm}
      />
    </ComponentSection>
  )
}

export default ConfirmPopupSection
