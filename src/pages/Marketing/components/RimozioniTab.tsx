import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PlusIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useOptOutList } from '@/pages/Marketing/hooks/useOptOutList'
import OptOutTable from '@/pages/Marketing/components/OptOutTable'
import OptOutFormModal from '@/pages/Marketing/components/OptOutFormModal'

// Sub-aba RIMOZIONI: opt-out de comunicações. Sem link de auto-descadastro
// ainda — criação manual pelo admin, conforme diretiva do W3-F4.
function RimozioniTab() {
  const { t } = useTranslation('marketing')
  const { optOuts, isLoading } = useOptOutList()
  const [open, setOpen] = useState(false)

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <Button onClick={() => setOpen(true)} className="gap-1.5">
          <PlusIcon className="size-4" />
          {t('rimozioniTab.newLabel')}
        </Button>
      </div>

      <OptOutTable optOuts={optOuts} isLoading={isLoading} />

      <OptOutFormModal open={open} onOpenChange={setOpen} />
    </div>
  )
}

export default RimozioniTab
