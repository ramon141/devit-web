import ModalRegister from '@/components/ModalRegister'
import { Button } from '@/components/ui/button'
import type { PersonWithRelations } from '@/api/generated/models'
import { usePersonForm } from '@/pages/Clientes/hooks/usePersonForm'
import PersonFormFields from '@/pages/Clientes/components/PersonFormFields'

type PersonFormModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  person?: PersonWithRelations | null
}

function PersonFormModal({ open, onOpenChange, person }: PersonFormModalProps) {
  const { form, isSubmitting, onSubmit } = usePersonForm({
    person,
    onSaved: () => onOpenChange(false),
  })

  return (
    <ModalRegister
      open={open}
      onOpenChange={onOpenChange}
      title={person ? 'Modifica cliente' : 'Nuovo cliente'}
      description="Dati anagrafici del cliente"
    >
      <form onSubmit={onSubmit} className="grid gap-4">
        <PersonFormFields form={form} />

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Annulla
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            Salva
          </Button>
        </div>
      </form>
    </ModalRegister>
  )
}

export default PersonFormModal
