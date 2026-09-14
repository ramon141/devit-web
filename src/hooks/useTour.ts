import { useCallback, useState } from 'react'
import { ACTIONS, EVENTS, STATUS, type EventData, type Step } from 'react-joyride'

type UseTourProps = {
  steps: Step[]
}

export function useTour({ steps }: UseTourProps) {
  const [run, setRun] = useState(false)
  const [stepIndex, setStepIndex] = useState(0)
  const [tourKey, setTourKey] = useState(0)

  const startTour = useCallback(() => {
    setStepIndex(0)
    setTourKey((key) => key + 1)
    setRun(true)
  }, [])

  const stopTour = useCallback(() => {
    setRun(false)
    setStepIndex(0)
  }, [])

  const handleJoyrideCallback = useCallback((data: EventData) => {
    const { status, index, action, type } = data

    if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
      setRun(false)
      setStepIndex(0)
      return
    }

    if (type === EVENTS.STEP_AFTER || type === EVENTS.TARGET_NOT_FOUND) {
      setStepIndex(index + (action === ACTIONS.PREV ? -1 : 1))
    }
  }, [])

  return { run, stepIndex, tourKey, steps, handleJoyrideCallback, startTour, stopTour }
}
