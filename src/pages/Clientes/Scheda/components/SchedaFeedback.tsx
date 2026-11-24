import Feedback from '@/pages/Clientes/Feedback'

type SchedaFeedbackProps = {
  personId: string
}

function SchedaFeedback({ personId }: SchedaFeedbackProps) {
  return (
    <div id="cliente-scheda-feedback">
      <Feedback personId={personId} />
    </div>
  )
}

export default SchedaFeedback
