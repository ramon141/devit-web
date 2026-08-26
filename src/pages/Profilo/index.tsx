import { useTranslation } from 'react-i18next'
import AppLayout from '@/components/layout/AppLayout'
import FormFieldWrapper from '@/components/FormFieldWrapper'
import LanguageSwitcher from '@/components/layout/LanguageSwitcher'
import { Button } from '@/components/ui/button'
import { UserInfo } from '@/auth'
import { useUserControllerFindById } from '@/api/generated/api'
import { useUserForm } from '@/pages/Amministrazione/Utenti/hooks/useUserForm'
import UserFormFields from '@/pages/Amministrazione/Utenti/components/UserFormFields'

function Profilo() {
  const { t } = useTranslation('profilo')
  const userId = UserInfo.getUserId() ?? ''
  const { data: user } = useUserControllerFindById(userId, undefined, {
    query: { enabled: !!userId },
  })
  const { form, avatarFiles, setAvatarFiles, avatarUrl, isSubmitting, isEditing, onSubmit } = useUserForm({
    user,
    onSaved: () => {},
  })

  return (
    <AppLayout
      title={t('index.title')}
      description={t('index.description')}
      breadcrumbItems={[{ label: t('index.breadcrumb') }]}
    >
      <form onSubmit={onSubmit} className="grid gap-4">
        <UserFormFields
          form={form}
          isEditing={isEditing}
          avatarFiles={avatarFiles}
          setAvatarFiles={setAvatarFiles}
          avatarUrl={avatarUrl}
        />

        <FormFieldWrapper label={t('index.languageLabel')}>
          <LanguageSwitcher />
        </FormFieldWrapper>

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {t('index.save')}
          </Button>
        </div>
      </form>
    </AppLayout>
  )
}

export default Profilo
