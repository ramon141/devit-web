import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useCalendarEventOutcome } from '@/pages/Agenda/hooks/useCalendarEventOutcome'
import { formatDateTime } from '@/utils/formatDate'

type CalendarEventOutcomeSectionProps = {
  calendarEventId: string
}

function CalendarEventOutcomeSection({ calendarEventId }: CalendarEventOutcomeSectionProps) {
  const { outcomes, outcome, setOutcome, saveOutcome, isSaving } = useCalendarEventOutcome(calendarEventId)

  return (
    <div className="grid gap-3">
      <p className="text-sm font-medium">Esito dell’impegno</p>

      <Textarea
        value={outcome}
        onChange={(event) => setOutcome(event.target.value)}
        placeholder="Descrivi come è andata la visita/chiamata..."
        rows={3}
      />
      <div>
        <Button type="button" onClick={saveOutcome} disabled={isSaving}>
          Registra esito
        </Button>
      </div>

      <div className="grid gap-2">
        {outcomes.map((entry) => (
          <div key={entry.id} className="rounded-lg px-3 py-2 ring-1 ring-border">
            <p className="text-sm">{entry.outcome}</p>
            <p className="text-xs text-muted-foreground">{formatDateTime(entry.createdAt)}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CalendarEventOutcomeSection
