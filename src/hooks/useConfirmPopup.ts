import { useCallback, useState } from 'react'

export function useConfirmPopup() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const openConfirm = useCallback(() => setOpen(true), [])
  const closeConfirm = useCallback(() => setOpen(false), [])

  const withLoading = useCallback(async (action: () => Promise<void>) => {
    setLoading(true)

    try {
      await action()
      setOpen(false)
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    open,
    setOpen,
    loading,
    openConfirm,
    closeConfirm,
    withLoading,
  }
}
