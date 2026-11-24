import { type ChangeEvent, type KeyboardEvent, type RefObject, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { type DateRangeValue, formatRange, maskRangeText, parseRangeText } from './rangeUtils'

type UseRangeTextParams = {
  value: DateRangeValue
  onChange: (value: DateRangeValue) => void
  showMask: boolean
  mask: string
}

const MASK_LETTERS = /[A-Za-z]/

const YEAR_LENGTH = 4

const withMask = (text: string, mask: string): string => text + mask.slice(text.length)

// Próxima parte vazia da máscara (DD, MM ou AAAA), que fica selecionada como seção ativa
function nextSectionRange(text: string, mask: string, showMask: boolean): [number, number] {
  const display = showMask ? withMask(text, mask) : text
  let start = text.length

  while (start < display.length && !MASK_LETTERS.test(display.charAt(start))) start += 1
  if (start >= display.length) return [Math.max(display.length - YEAR_LENGTH, 0), display.length]

  let end = start
  while (end < display.length && display.charAt(end) === display.charAt(start)) end += 1

  return [start, end]
}

function useSectionSelection(
  inputRef: RefObject<HTMLInputElement | null>,
  text: string,
  mask: string,
  showMask: boolean,
) {
  useLayoutEffect(() => {
    if (document.activeElement !== inputRef.current) return

    const [selectionStart, selectionEnd] = nextSectionRange(text, mask, showMask)
    inputRef.current?.setSelectionRange(selectionStart, selectionEnd)
  }, [inputRef, text, mask, showMask])
}

// Texto digitado (máscara progressiva); o restante da máscara aparece como "DD/MM/AAAA"
export function useRangeText({ value, onChange, showMask, mask }: UseRangeTextParams) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [text, setText] = useState(() => formatRange(value))
  const typedKeyRef = useRef<string | null>(null)

  useEffect(() => {
    if (formatRange(parseRangeText(text)) !== formatRange(value)) setText(formatRange(value))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  useSectionSelection(inputRef, text, mask, showMask)

  function update(raw: string) {
    const masked = maskRangeText(raw)
    const parsed = parseRangeText(masked)

    typedKeyRef.current = formatRange(parsed)
    setText(masked)
    if (formatRange(parsed) !== formatRange(value)) onChange(parsed)
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    update(event.target.value)
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    const input = inputRef.current
    if (event.key !== 'Backspace' || !input) return

    const selectsAll = input.selectionStart === 0 && input.selectionEnd === input.value.length

    event.preventDefault()
    update(selectsAll ? '' : text.replace(/\D/g, '').slice(0, -1))
  }

  // Intervalo incompleto vindo do calendário (não digitado) é sinalizado como erro
  const isIncompleteFromCalendar =
    Boolean(value[0] && !value[1]) && typedKeyRef.current !== formatRange(value)

  return {
    inputRef,
    display: showMask ? withMask(text, mask) : text,
    handleChange,
    handleKeyDown,
    isIncompleteFromCalendar,
  }
}
