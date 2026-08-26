import { Controller } from 'react-hook-form'
import { Link } from 'react-router'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { useContattiForm } from '@/pages/Site/Contatti/hooks/useContattiForm'
import BranchList from '@/pages/Site/Contatti/components/BranchList'

function Contatti() {
  const { form, isSubmitting, onSubmit } = useContattiForm()
  const { register, control, formState } = form
  const { errors } = formState

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-2xl font-semibold">Contatti</h1>

      <p className="mt-2 text-sm text-muted-foreground">
        Hai una domanda generica? Scrivici. Se invece cerchi un immobile o
        vuoi una valutazione, usa la pagina{' '}
        <Link to="/site/richieste" className="underline">
          Richieste
        </Link>
        .
      </p>

      <form onSubmit={onSubmit} className="mt-8 space-y-5">
        <div>
          <Label htmlFor="name">Nome Completo</Label>
          <Input id="name" {...register('name')} />
          {errors.name && <p className="mt-1 text-sm text-destructive">{errors.name.message}</p>}
        </div>

        <div>
          <Label htmlFor="email">La tua email</Label>
          <Input id="email" type="email" {...register('email')} />
          {errors.email && (
            <p className="mt-1 text-sm text-destructive">{errors.email.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="phone">Telefono</Label>
          <Input id="phone" {...register('phone')} />
          {errors.phone && (
            <p className="mt-1 text-sm text-destructive">{errors.phone.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="subject">Oggetto</Label>
          <Input id="subject" {...register('subject')} />
        </div>

        <div>
          <Label htmlFor="message">Il tuo messaggio</Label>
          <Textarea id="message" rows={4} {...register('message')} />
          {errors.message && (
            <p className="mt-1 text-sm text-destructive">{errors.message.message}</p>
          )}
        </div>

        <Controller
          control={control}
          name="acceptPrivacy"
          render={({ field }) => (
            <label className="flex items-start gap-2 text-sm">
              <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              <span>
                Ho letto e accetto la{' '}
                <Link to="/site/privacy-cookies" className="underline">
                  Privacy e Cookie Policy
                </Link>
                .
              </span>
            </label>
          )}
        />
        {errors.acceptPrivacy && (
          <p className="text-sm text-destructive">{errors.acceptPrivacy.message}</p>
        )}

        <Button type="submit" disabled={isSubmitting} className="w-full">
          Invia
        </Button>
      </form>

      <BranchList />
    </div>
  )
}

export default Contatti
