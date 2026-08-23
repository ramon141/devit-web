import { Button } from '@/components/ui/button'
import type { Person } from '@/api/generated/models'
import { usePersonForm } from '@/pages/Clientes/hooks/usePersonForm'
import PersonFormFields from '@/pages/Clientes/components/PersonFormFields'

type SchedaDatiProps = {
  person: Person
}

function SchedaDati({ person }: SchedaDatiProps) {
  const { form, isSubmitting, onSubmit } = usePersonForm({ person, onSaved: () => {} })

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      <PersonFormFields form={form} />

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          Salva modifiche
        </Button>
      </div>
    </form>
  )
}

export default SchedaDati
