import { Controller } from 'react-hook-form'
import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { useRichiesteForm } from '@/pages/Site/Richieste/hooks/useRichiesteForm'

function Richieste() {
  const { t } = useTranslation('site')
  const { form, isSubmitting, onSubmit } = useRichiesteForm()
  const { register, control, watch, formState } = form
  const { errors } = formState
  const requestType = watch('requestType')

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-2xl font-semibold">{t('richieste.title')}</h1>

      <p className="mt-2 text-sm text-muted-foreground">
        {t('richieste.intro')}
      </p>

      <form onSubmit={onSubmit} className="mt-8 space-y-5">
        <div className="flex gap-2">
          <Controller
            control={control}
            name="requestType"
            render={({ field }) => (
              <>
                <Button
                  type="button"
                  variant={field.value === 'search' ? 'default' : 'outline'}
                  onClick={() => field.onChange('search')}
                >
                  {t('richieste.searchProperty')}
                </Button>

                <Button
                  type="button"
                  variant={field.value === 'valuation' ? 'default' : 'outline'}
                  onClick={() => field.onChange('valuation')}
                >
                  {t('richieste.valuation')}
                </Button>
              </>
            )}
          />
        </div>

        <div>
          <Label htmlFor="desiredCity">{t('richieste.desiredCityLabel')}</Label>
          <Input id="desiredCity" {...register('desiredCity')} />
          {errors.desiredCity && (
            <p className="mt-1 text-sm text-destructive">{errors.desiredCity.message}</p>
          )}
        </div>

        {requestType === 'search' && (
          <div>
            <Label htmlFor="maxBudget">{t('richieste.maxBudgetLabel')}</Label>
            <Input id="maxBudget" type="number" {...register('maxBudget')} />
          </div>
        )}

        <div>
          <Label htmlFor="name">{t('richieste.nameLabel')}</Label>
          <Input id="name" {...register('name')} />
          {errors.name && <p className="mt-1 text-sm text-destructive">{errors.name.message}</p>}
        </div>

        <div>
          <Label htmlFor="email">{t('richieste.emailLabel')}</Label>
          <Input id="email" type="email" {...register('email')} />
          {errors.email && (
            <p className="mt-1 text-sm text-destructive">{errors.email.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="phone">{t('richieste.phoneLabel')}</Label>
          <Input id="phone" {...register('phone')} />
          {errors.phone && (
            <p className="mt-1 text-sm text-destructive">{errors.phone.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="message">{t('richieste.messageLabel')}</Label>
          <Textarea id="message" rows={4} {...register('message')} />
          {errors.message && (
            <p className="mt-1 text-sm text-destructive">{errors.message.message}</p>
          )}
        </div>

        <Controller
          control={control}
          name="acceptTerms"
          render={({ field }) => (
            <label className="flex items-start gap-2 text-sm">
              <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              <span>
                {t('richieste.acceptTermsPrefix')}{' '}
                <Link to="/privacy-cookies" className="underline">
                  {t('richieste.acceptTermsLink')}
                </Link>
                .
              </span>
            </label>
          )}
        />
        {errors.acceptTerms && (
          <p className="text-sm text-destructive">{errors.acceptTerms.message}</p>
        )}

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {t('richieste.submit')}
        </Button>
      </form>
    </div>
  )
}

export default Richieste
