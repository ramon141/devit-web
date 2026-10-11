import { useCallback, useState } from 'react'
import { ACTIONS, EVENTS, STATUS, type EventData, type Step } from 'react-joyride'

type UseTourProps = {
  steps: Step[]
  onlyExistingTargets?: boolean
}

function keepExistingTargets(steps: Step[]): Step[] {
  return steps.filter(
    (step) => typeof step.target !== 'string' || document.querySelector(step.target) !== null
  )
}

export function useTour({ steps, onlyExistingTargets = false }: UseTourProps) {
  const [activeSteps, setActiveSteps] = useState(steps)
  const [run, setRun] = useState(false)
  const [stepIndex, setStepIndex] = useState(0)
  const [tourKey, setTourKey] = useState(0)

  const startTour = useCallback(() => {
    setActiveSteps(onlyExistingTargets ? keepExistingTargets(steps) : steps)
    setStepIndex(0)
    setTourKey((key) => key + 1)
    setRun(true)
  }, [steps, onlyExistingTargets])

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

  return {
    run,
    stepIndex,
    tourKey,
    steps: onlyExistingTargets ? activeSteps : steps,
    handleJoyrideCallback,
    startTour,
    stopTour,
  }
}
