import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import ListToolbar from '@/components/ListToolbar'
import DataTable from '@/components/DataTable'
import { useOwnerAccessList } from '@/pages/Amministrazione/Proprietari/hooks/useOwnerAccessList'
import { useOwnerAccessActions } from '@/pages/Amministrazione/Proprietari/hooks/useOwnerAccessActions'
import OwnerAccessFormModal from '@/pages/Amministrazione/Proprietari/components/OwnerAccessFormModal'
import PinRevealDialog from '@/pages/Amministrazione/Proprietari/components/PinRevealDialog'
import { buildOwnerAccessTableColumns } from '@/pages/Amministrazione/Proprietari/components/OwnerAccessTableColumns'
import type { OwnerPortalAccess } from '@/pages/Amministrazione/Proprietari/types'

function Proprietari() {
  const { t } = useTranslation('amministrazione')
  const { accesses, isLoading, refetch } = useOwnerAccessList()
  const { resetPin, toggleActive, revealedPin, clearRevealedPin } = useOwnerAccessActions(refetch)
  const [formOpen, setFormOpen] = useState(false)

  const columns = buildOwnerAccessTableColumns({
    onResetPin: (access: OwnerPortalAccess) => resetPin(access.id),
    onToggleActive: (access: OwnerPortalAccess, active: boolean) => toggleActive(access.id, active),
  })

  return (
    <div>
      <ListToolbar
        search=""
        onSearchChange={() => {}}
        onNewClick={() => setFormOpen(true)}
        newLabel={t('proprietari.newLabel')}
      />

      <DataTable
        columns={columns}
        data={accesses}
        keyExtractor={(access) => access.id}
        isLoading={isLoading}
        emptyMessage={t('proprietari.empty')}
      />

      <OwnerAccessFormModal open={formOpen} onOpenChange={setFormOpen} onCreated={refetch} />
      <PinRevealDialog pin={revealedPin} onClose={clearRevealedPin} />
    </div>
  )
}

export default Proprietari
