import { useState } from 'react'
import type { PointerEvent } from 'react'
import {
  MAX_WIDTH_PERCENT,
  MIN_WIDTH_PERCENT,
} from '@/pages/Home/hooks/useDashboardWidgets'

type DragState = {
  startX: number
  startWidth: number
  gridWidth: number
}

// Redimensiona o widget arrastando a alça com o mouse, com largura livre entre mínimo e 100%
export function useWidgetResize(percent: number, onCommit: (percent: number) => void) {
  const [drag, setDrag] = useState<DragState | null>(null)
  const [preview, setPreview] = useState<number | null>(null)

  function handlePointerDown(e: PointerEvent<HTMLElement>) {
    const widget = e.currentTarget.parentElement
    const grid = widget?.parentElement
    if (!widget || !grid) return

    e.currentTarget.setPointerCapture(e.pointerId)

    setDrag({
      startX: e.clientX,
      startWidth: widget.getBoundingClientRect().width,
      gridWidth: grid.getBoundingClientRect().width,
    })
  }

  function handlePointerMove(e: PointerEvent<HTMLElement>) {
    if (!drag) return

    const width = drag.startWidth + (e.clientX - drag.startX)
    const next = (width / drag.gridWidth) * 100

    setPreview(Math.min(MAX_WIDTH_PERCENT, Math.max(MIN_WIDTH_PERCENT, next)))
  }

  function handlePointerUp() {
    if (preview !== null) onCommit(preview)

    setDrag(null)
    setPreview(null)
  }

  return {
    percent: preview ?? percent,
    isResizing: drag !== null,
    handlers: {
      onPointerDown: handlePointerDown,
      onPointerMove: handlePointerMove,
      onPointerUp: handlePointerUp,
    },
  }
}
