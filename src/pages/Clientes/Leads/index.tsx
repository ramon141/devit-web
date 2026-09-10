import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PlusIcon } from 'lucide-react'
import { DndContext, DragOverlay } from '@dnd-kit/core'
import { Button } from '@/components/ui/button'
import ConfirmPopup from '@/components/ConfirmPopup'
import type { Lead } from '@/api/generated/models'
import { useLeadBoard } from '@/pages/Clientes/Leads/hooks/useLeadBoard'
import { useDeleteLead } from '@/pages/Clientes/Leads/hooks/useDeleteLead'
import { useKanbanDragDrop } from '@/pages/Clientes/Leads/hooks/useKanbanDragDrop'
import LeadColumn from '@/pages/Clientes/Leads/components/LeadColumn'
import LeadCard from '@/pages/Clientes/Leads/components/LeadCard'
import LeadFormModal from '@/pages/Clientes/Leads/components/LeadFormModal'
import LeadFilters from '@/pages/Clientes/Leads/components/LeadFilters'

function Leads() {
  const { t } = useTranslation('clientes')
  const { columns, leads, filters, setFilters } = useLeadBoard()
  const { handleDelete } = useDeleteLead()
  const { sensors, activeLead, handleDragStart, handleDragEnd } = useKanbanDragDrop({ leads })
  const [formOpen, setFormOpen] = useState(false)
  const [editingLead, setEditingLead] = useState<Lead | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Lead | null>(null)

  function handleNew() {
    setEditingLead(null)
    setFormOpen(true)
  }

  function handleEdit(lead: Lead) {
    setEditingLead(lead)
    setFormOpen(true)
  }

  function confirmDelete() {
    if (deleteTarget?.id) handleDelete(deleteTarget.id)
    setDeleteTarget(null)
  }

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <Button onClick={handleNew} className="gap-1.5">
          <PlusIcon className="size-4" />
          {t('leads.newButton')}
        </Button>
      </div>

      <LeadFilters filters={filters} onChange={setFilters} />

      <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        {/* ponytail: altura fixa para o header sticky funcionar; ajustar 16rem se o topo da página mudar */}
        <div className="h-[calc(100dvh-16rem)] overflow-auto pb-2">
          {/* wrapper com altura do conteúdo: colunas esticam até a mais alta */}
          <div className="flex min-h-full w-max gap-3">
            {columns.map((column) => (
              <LeadColumn
                key={column.status}
                status={column.status}
                label={column.label}
                leads={column.leads}
                onEdit={handleEdit}
                onDelete={setDeleteTarget}
              />
            ))}
          </div>
        </div>

        <DragOverlay>
          {activeLead && (
            <LeadCard lead={activeLead} onEdit={() => {}} onDelete={() => {}} isOverlay />
          )}
        </DragOverlay>
      </DndContext>

      <LeadFormModal open={formOpen} onOpenChange={setFormOpen} lead={editingLead} />

      <ConfirmPopup
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title={t('leads.deleteTitle')}
        description={t('leads.deleteDescription', { name: deleteTarget?.name })}
        variant="destructive"
        confirmLabel={t('leads.deleteConfirm')}
        onConfirm={confirmDelete}
      />
    </div>
  )
}

export default Leads
