import { Controller } from 'react-hook-form'
import { Link } from 'react-router'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import DropCapHeading from '@/pages/Site/components/DropCapHeading'
import { useContattiForm } from '@/pages/Site/Contatti/hooks/useContattiForm'
import BranchList from '@/pages/Site/Contatti/components/BranchList'

function Contatti() {
  const { form, isSubmitting, onSubmit } = useContattiForm()
  const { register, control, formState } = form
  const { errors } = formState

  return (
    <div className="bg-muted/40 py-12">
      <div className="mx-auto max-w-5xl px-4">
        <div className="text-center">
          <DropCapHeading as="h1" text="Contatti" className="text-3xl font-bold" />
          <p className="mx-auto mt-2 max-w-xl text-muted-foreground">
            Hai una domanda generica? Scrivici. Se invece cerchi un immobile o
            vuoi una valutazione, usa la pagina{' '}
            <Link to="/richieste" className="font-medium text-primary underline underline-offset-2">
              Richieste
            </Link>
            .
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.3fr_1fr]">
          <form onSubmit={onSubmit} className="flex flex-col gap-5 rounded-xl bg-card p-6 shadow-sm sm:p-8">
            <div>
              <Label htmlFor="name">Nome Completo</Label>
              <Input id="name" className="mt-1.5" {...register('name')} />
              {errors.name && <p className="mt-1 text-sm text-destructive">{errors.name.message}</p>}
            </div>

            <div>
              <Label htmlFor="email">La tua email</Label>
              <Input id="email" type="email" className="mt-1.5" {...register('email')} />
              {errors.email && (
                <p className="mt-1 text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="phone">Telefono</Label>
              <Input id="phone" className="mt-1.5" {...register('phone')} />
              {errors.phone && (
                <p className="mt-1 text-sm text-destructive">{errors.phone.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="subject">Oggetto</Label>
              <Input id="subject" className="mt-1.5" {...register('subject')} />
            </div>

            <div>
              <Label htmlFor="message">Il tuo messaggio</Label>
              <Textarea id="message" rows={4} className="mt-1.5" {...register('message')} />
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
                    <Link to="/privacy-cookies" className="underline">
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
      </div>
    </div>
  )
}

export default Contatti
