import { useTranslation } from 'react-i18next'
import ModalRegister from '@/components/ModalRegister'
import FormModalFooter from '@/components/FormModalFooter'
import type { UserExcludingPasswordHashWithRelations } from '@/api/generated/models'
import { useUserForm } from '@/pages/Amministrazione/Utenti/hooks/useUserForm'
import UserFormFields from '@/pages/Amministrazione/Utenti/components/UserFormFields'

type UserFormModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  user?: UserExcludingPasswordHashWithRelations | null
}

function UserFormModal({ open, onOpenChange, user }: UserFormModalProps) {
  const { t } = useTranslation('amministrazione')
  const { form, avatarFiles, setAvatarFiles, avatarUrl, isSubmitting, isEditing, onSubmit } = useUserForm({
    user,
    onSaved: () => onOpenChange(false),
  })

  return (
    <ModalRegister
      open={open}
      onOpenChange={onOpenChange}
      title={user ? t('userFormModal.editTitle') : t('userFormModal.newTitle')}
    >
      <form onSubmit={onSubmit} className="grid gap-4">
        <UserFormFields
          form={form}
          isEditing={isEditing}
          avatarFiles={avatarFiles}
          setAvatarFiles={setAvatarFiles}
          avatarUrl={avatarUrl}
        />

        <FormModalFooter onCancel={() => onOpenChange(false)} isSubmitting={isSubmitting} />
      </form>
    </ModalRegister>
  )
}

export default UserFormModal
