import AppLayout from '@/components/layout/AppLayout'
import { Button } from '@/components/ui/button'
import { UserInfo } from '@/auth'
import { useUserControllerFindById } from '@/api/generated/api'
import { useUserForm } from '@/pages/Amministrazione/Utenti/hooks/useUserForm'
import UserFormFields from '@/pages/Amministrazione/Utenti/components/UserFormFields'

function Profilo() {
  const userId = UserInfo.getUserId() ?? ''
  const { data: user } = useUserControllerFindById(userId, undefined, {
    query: { enabled: !!userId },
  })
  const { form, avatarFiles, setAvatarFiles, isSubmitting, isEditing, onSubmit } = useUserForm({
    user,
    onSaved: () => {},
  })

  return (
    <AppLayout
      title="Il mio profilo"
      description="Gestisci i tuoi dati personali"
      breadcrumbItems={[{ label: 'Il mio profilo' }]}
    >
      <form onSubmit={onSubmit} className="grid max-w-3xl gap-4">
        <UserFormFields
          form={form}
          isEditing={isEditing}
          avatarFiles={avatarFiles}
          setAvatarFiles={setAvatarFiles}
        />

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            Salva
          </Button>
        </div>
      </form>
    </AppLayout>
  )
}

export default Profilo
