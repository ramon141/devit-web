import { Controller } from 'react-hook-form'
import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { SITE_PATHS } from '@/lib/site/paths'
import ContactFields from '@/pages/Site/Contatti/components/ContactFields'
import { useContattiForm } from '@/pages/Site/Contatti/hooks/useContattiForm'

// Envia o contato como lead para a API (mesmo fluxo de antes, novo visual)
function ContactForm() {
  const { t } = useTranslation('site')
  const { form, formKey, isSubmitting, onSubmit } = useContattiForm()
  const { register, control, formState } = form
  const { errors } = formState

  return (
    <form key={formKey} onSubmit={onSubmit} className="grid max-w-[560px] gap-5">
      <ContactFields register={register} errors={errors} />

      <Controller
        control={control}
        name="acceptPrivacy"
        render={({ field }) => (
          <label className="flex items-start gap-2 text-sm text-site-ink-soft">
            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
            <span>
              {t('contatti.acceptPrivacyPrefix')}{' '}
              <Link to={SITE_PATHS.privacy} className="underline">
                {t('contatti.acceptPrivacyLink')}
              </Link>
              .
            </span>
          </label>
        )}
      />
      {errors.acceptPrivacy && <p className="text-sm text-destructive">{errors.acceptPrivacy.message}</p>}

      <Button type="submit" disabled={isSubmitting} className="justify-self-start px-7">
        {t('contatti.submit')}
      </Button>
    </form>
  )
}

export default ContactForm
