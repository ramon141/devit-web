import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import RemovableRow from '@/components/RemovableRow'

type CalendarEventOutcomeDraftSectionProps = {
  outcomes: string[]
  onAdd: (outcome: string) => void
  onRemove: (index: number) => void
}

function CalendarEventOutcomeDraftSection({
  outcomes,
  onAdd,
  onRemove,
}: CalendarEventOutcomeDraftSectionProps) {
  const { t } = useTranslation('agenda')
  const [outcome, setOutcome] = useState('')

  function handleAdd() {
    if (!outcome.trim()) return

    onAdd(outcome)
    setOutcome('')
  }

  return (
    <div className="grid gap-3">
      <p className="text-sm font-medium">{t('agenda:outcomeSection.title')}</p>

      <Textarea
        value={outcome}
        onChange={(event) => setOutcome(event.target.value)}
        placeholder={t('agenda:outcomeSection.placeholder')}
        rows={3}
      />
      <div>
        <Button type="button" onClick={handleAdd}>
          {t('agenda:outcomeSection.save')}
        </Button>
      </div>

      <div className="grid gap-2">
        {outcomes.map((entry, index) => (
          <RemovableRow key={`${index}-${entry}`} onRemove={() => onRemove(index)}>
            <span className="text-sm">{entry}</span>
          </RemovableRow>
        ))}
      </div>
    </div>
  )
}

export default CalendarEventOutcomeDraftSection
