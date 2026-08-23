import { useState } from 'react'
import { PointerSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core'
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core'
import type { Lead, LeadStatus } from '@/api/generated/models'
import { useMoveLead } from '@/pages/Clientes/Leads/hooks/useMoveLead'

type UseKanbanDragDropProps = {
  leads: Lead[]
}

export function useKanbanDragDrop({ leads }: UseKanbanDragDropProps) {
  const { moveLead } = useMoveLead()
  const [activeId, setActiveId] = useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } })
  )

  const activeLead = activeId ? (leads.find((lead) => lead.id === activeId) ?? null) : null

  function handleDragStart(event: DragStartEvent) {
    setActiveId(String(event.active.id))
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    setActiveId(null)

    if (!over) return

    const leadId = String(active.id)
    const newStatus = String(over.id) as LeadStatus
    const lead = leads.find((item) => item.id === leadId)

    if (!lead || lead.status === newStatus) return

    moveLead(leadId, newStatus)
  }

  return { sensors, activeLead, handleDragStart, handleDragEnd }
}
