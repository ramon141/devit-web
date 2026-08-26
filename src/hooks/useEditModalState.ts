import { useState } from 'react'

export function useEditModalState<TItem>() {
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<TItem | null>(null)

  function openNew() {
    setEditing(null)
    setOpen(true)
  }

  function openEdit(item: TItem) {
    setEditing(item)
    setOpen(true)
  }

  return { open, setOpen, editing, openNew, openEdit }
}
