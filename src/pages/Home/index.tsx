import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import AppLayout from '@/components/layout/AppLayout'
import JoyrideWrapper from '@/components/JoyrideWrapper'
import TourFab from '@/components/TourFab'
import { useHomeTour } from '@/pages/Home/hooks/useHomeTour'
import { useDashboardWidgets } from '@/pages/Home/hooks/useDashboardWidgets'
import HomeWidgets from '@/pages/Home/components/HomeWidgets'
import WidgetSelectionFab from '@/pages/Home/components/WidgetSelectionFab'
import WidgetSelectionModal from '@/pages/Home/components/WidgetSelectionModal'
import DashboardWindowSelect from '@/pages/Home/components/DashboardWindowSelect'

const DORMANT_DAYS_KEY = 'dashboard.dormantDays'
const DEFAULT_DORMANT_DAYS = 180

function readDormantDays(): number {
  try {
    return Number(localStorage.getItem(DORMANT_DAYS_KEY)) || DEFAULT_DORMANT_DAYS
  } catch {
    return DEFAULT_DORMANT_DAYS
  }
}

function Home() {
  const { t } = useTranslation('home')
  const [dormantDays, setDormantDays] = useState(readDormantDays)
  const { run, stepIndex, tourKey, steps, handleJoyrideCallback, startTour } = useHomeTour()
  const { layout, inactiveWidgets, addWidget, removeWidget, updateWidget, resizeWidget, getWidth } = useDashboardWidgets()
  const [widgetModalOpen, setWidgetModalOpen] = useState(false)

  function handleWindowChange(days: number) {
    setDormantDays(days)
    try {
      localStorage.setItem(DORMANT_DAYS_KEY, String(days))
    } catch {
      // localStorage indisponível — mantém só em memória
    }
  }

  return (
    <AppLayout
      title={t('page.title')}
      description={t('page.description')}
    >
      <JoyrideWrapper
        steps={steps}
        run={run}
        stepIndex={stepIndex}
        tourKey={tourKey}
        onEvent={handleJoyrideCallback}
      />
      <TourFab onClick={startTour} />
      <WidgetSelectionFab onClick={() => setWidgetModalOpen(true)} />

      <WidgetSelectionModal
        open={widgetModalOpen}
        onOpenChange={setWidgetModalOpen}
        inactiveWidgets={inactiveWidgets}
        onAddWidget={addWidget}
      />

      <div id="home-window-select" className="mb-4 flex justify-end">
        <DashboardWindowSelect value={dormantDays} onChange={handleWindowChange} />
      </div>

      <HomeWidgets
        layout={layout}
        dormantDays={dormantDays}
        getWidth={getWidth}
        onResize={resizeWidget}
        onRemove={removeWidget}
        onChange={updateWidget}
      />
    </AppLayout>
  )
}

export default Home
