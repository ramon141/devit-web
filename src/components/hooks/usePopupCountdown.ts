import { useEffect, useState } from 'react'

const COUNTDOWN_SECONDS = 3

// Contagem regressiva do botão Ok do PromisePopup; fecha sozinho ao chegar em 0
export function usePopupCountdown(active: boolean, onFinish: () => void) {
  const [secondsLeft, setSecondsLeft] = useState(COUNTDOWN_SECONDS)

  useEffect(() => {
    if (!active) {
      setSecondsLeft(COUNTDOWN_SECONDS)
      return
    }

    if (secondsLeft <= 0) {
      onFinish()
      return
    }

    const timer = setTimeout(() => setSecondsLeft((current) => current - 1), 1000)
    return () => clearTimeout(timer)
  }, [active, secondsLeft, onFinish])

  return secondsLeft
}
