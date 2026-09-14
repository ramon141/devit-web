import { useEffect } from 'react'
import type { Step } from 'react-joyride'

type UseTourModalSyncProps = {
  run: boolean
  stepIndex: number
  modalStartStep: number
  modalEndStep?: number
  isOpen: boolean
  openModal: () => void
  closeModal: () => void
  steps?: Step[]
}

// Sincroniza abertura/fechamento de modal de cadastro com o avanço do tour
// (react-joyride não abre modais sozinho) e centraliza o alvo do step atual
export function useTourModalSync({
  run,
  stepIndex,
  modalStartStep,
  modalEndStep = Infinity,
  isOpen,
  openModal,
  closeModal,
  steps,
}: UseTourModalSyncProps) {
  const inModalRange = run && stepIndex >= modalStartStep && stepIndex < modalEndStep

  useEffect(() => {
    if (inModalRange && !isOpen) openModal()
    if (!inModalRange && isOpen) closeModal()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [run, stepIndex])

  useEffect(() => {
    if (!inModalRange || !steps) return

    const step = steps[stepIndex]
    if (!step?.target || typeof step.target !== 'string') return

    const target = step.target
    const timer = setTimeout(() => {
      document.querySelector(target)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 200)

    return () => clearTimeout(timer)
  }, [inModalRange, stepIndex, steps])
}
