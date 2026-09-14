import { useTranslation } from 'react-i18next'
import AppLayout from '@/components/layout/AppLayout'
import FormFieldWrapper from '@/components/FormFieldWrapper'
import LanguageSwitcher from '@/components/layout/LanguageSwitcher'
import { Button } from '@/components/ui/button'
import JoyrideWrapper from '@/components/JoyrideWrapper'
import TourFab from '@/components/TourFab'
import { UserInfo } from '@/auth'
import { useUserControllerFindById } from '@/api/generated/api'
import { useUserForm } from '@/pages/Amministrazione/Utenti/hooks/useUserForm'
import UserFormFields from '@/pages/Amministrazione/Utenti/components/UserFormFields'
import { useProfiloTour } from '@/pages/Profilo/hooks/useProfiloTour'

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
  const { run, stepIndex, tourKey, steps, handleJoyrideCallback, startTour } = useProfiloTour()

  return (
    <AppLayout
      title={t('index.title')}
      description={t('index.description')}
      breadcrumbItems={[{ label: t('index.breadcrumb') }]}
    >
      <JoyrideWrapper
        steps={steps}
        run={run}
        stepIndex={stepIndex}
        tourKey={tourKey}
        onEvent={handleJoyrideCallback}
      />
      <TourFab onClick={startTour} />

      {user && (
        <form onSubmit={onSubmit} className="grid gap-4">
          <div id="profilo-form-fields">
            <UserFormFields
              key={user.id}
              form={form}
              isEditing={isEditing}
              avatarFiles={avatarFiles}
              setAvatarFiles={setAvatarFiles}
              avatarUrl={avatarUrl}
            />
          </div>

          <FormFieldWrapper id="profilo-language-field" label={t('index.languageLabel')}>
            <LanguageSwitcher />
          </FormFieldWrapper>

          <div id="profilo-save-btn" className="flex justify-end">
            <Button type="submit" disabled={isSubmitting}>
              {t('index.save')}
            </Button>
          </div>
        </form>
      )}
    </AppLayout>
  )
}

export default Profilo
