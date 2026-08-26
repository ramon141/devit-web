import ModalRegister from '@/components/ModalRegister'
import { Button } from '@/components/ui/button'
import type { UserExcludingPasswordHashWithRelations } from '@/api/generated/models'
import { useUserForm } from '@/pages/Amministrazione/Utenti/hooks/useUserForm'
import UserFormFields from '@/pages/Amministrazione/Utenti/components/UserFormFields'

type UserFormModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  user?: UserExcludingPasswordHashWithRelations | null
}

function UserFormModal({ open, onOpenChange, user }: UserFormModalProps) {
  const { form, avatarFiles, setAvatarFiles, avatarUrl, isSubmitting, isEditing, onSubmit } = useUserForm({
    user,
    onSaved: () => onOpenChange(false),
  })

  return (
    <ModalRegister
      open={open}
      onOpenChange={onOpenChange}
      title={user ? 'Modifica utente' : 'Nuovo utente'}
    >
      <form onSubmit={onSubmit} className="grid gap-4">
        <UserFormFields
          form={form}
          isEditing={isEditing}
          avatarFiles={avatarFiles}
          setAvatarFiles={setAvatarFiles}
          avatarUrl={avatarUrl}
        />

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

export default UserFormModal
