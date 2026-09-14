import { useTranslation } from 'react-i18next'
import { Joyride, type EventData, type Step } from 'react-joyride'
import { getJoyrideLocale, joyrideOptions, joyrideStyles } from '@/constants/joyride'

type JoyrideWrapperProps = {
  steps: Step[]
  run: boolean
  stepIndex: number
  tourKey: number
  onEvent: (data: EventData) => void
}

function JoyrideWrapper({ steps, run, stepIndex, tourKey, onEvent }: JoyrideWrapperProps) {
  const { t } = useTranslation('common')

  return (
    <Joyride
      key={tourKey}
      steps={steps}
      run={run}
      stepIndex={stepIndex}
      onEvent={onEvent}
      continuous
      scrollToFirstStep
      options={joyrideOptions}
      styles={joyrideStyles}
      locale={getJoyrideLocale(t)}
    />
  )
}

export default JoyrideWrapper
