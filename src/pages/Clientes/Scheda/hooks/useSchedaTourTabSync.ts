import { useEffect } from 'react'

type UseSchedaTourTabSyncProps = {
  run: boolean
  stepIndex: number
  activeTab: string
  setActiveTab: (tab: string) => void
  tabByStep: string[]
}

// Troca a aba ativa conforme o step atual do tour (react-joyride não sabe
// que o alvo está escondido numa aba fechada)
export function useSchedaTourTabSync({
  run,
  stepIndex,
  activeTab,
  setActiveTab,
  tabByStep,
}: UseSchedaTourTabSyncProps) {
  useEffect(() => {
    if (!run) return

    const tab = tabByStep[stepIndex]
    if (tab && tab !== activeTab) setActiveTab(tab)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [run, stepIndex])
}
