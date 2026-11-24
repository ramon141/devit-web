import { useCallback, useRef, useState } from 'react'
import type { MouseEvent as ReactMouseEvent } from 'react'

const STORAGE_KEY = 'sidebar_width'
const EXPANDED_KEY = 'sidebar_width_expanded'
const DEFAULT_WIDTH = 288
const MIN_WIDTH = 80
const MAX_WIDTH = 400
const COLLAPSE_THRESHOLD = 150
// Margem externa da sidebar (m-4), descontada ao calcular a largura pelo mouse
const OUTER_MARGIN = 16

function readNumber(key: string): number | null {
  const value = Number(localStorage.getItem(key))

  return value > 0 ? value : null
}

function clamp(value: number): number {
  return Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, value))
}

export function useSidebarWidth() {
  const [width, setWidth] = useState<number>(
    () => readNumber(STORAGE_KEY) ?? DEFAULT_WIDTH
  )
  const [isResizing, setIsResizing] = useState(false)
  const widthRef = useRef(width)

  const isCollapsed = width <= COLLAPSE_THRESHOLD

  const applyWidth = useCallback((next: number) => {
    widthRef.current = next
    setWidth(next)
  }, [])

  const persist = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, String(widthRef.current))

    if (widthRef.current > COLLAPSE_THRESHOLD) {
      localStorage.setItem(EXPANDED_KEY, String(widthRef.current))
    }
  }, [])

  const handleResizeMouseDown = useCallback(
    (event: ReactMouseEvent) => {
      event.preventDefault()
      setIsResizing(true)

      const onMove = (moveEvent: MouseEvent) => {
        applyWidth(clamp(moveEvent.clientX - OUTER_MARGIN))
      }

      const onUp = () => {
        persist()
        setIsResizing(false)
        document.removeEventListener('mousemove', onMove)
        document.removeEventListener('mouseup', onUp)
      }

      document.addEventListener('mousemove', onMove)
      document.addEventListener('mouseup', onUp)
    },
    [applyWidth, persist]
  )

  const toggleCollapsed = useCallback(() => {
    const wasCollapsed = widthRef.current <= COLLAPSE_THRESHOLD

    if (!wasCollapsed) {
      localStorage.setItem(EXPANDED_KEY, String(widthRef.current))
    }

    const savedExpanded = readNumber(EXPANDED_KEY) ?? DEFAULT_WIDTH

    applyWidth(wasCollapsed ? savedExpanded : MIN_WIDTH)
    persist()
  }, [applyWidth, persist])

  return { width, isCollapsed, isResizing, handleResizeMouseDown, toggleCollapsed }
}
