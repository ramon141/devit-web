import { useState } from 'react'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { useFormState, type UseFormReturn } from 'react-hook-form'
import type { LoginFormValues } from '@/pages/Login/schemas/loginSchema'
import { cn } from '@/lib/utils'

type DesktopLoginFormProps = {
  form: UseFormReturn<LoginFormValues>
  onSubmit: () => void
  loading: boolean
  error?: string
}

const underlineInputClass = cn(
  'w-full border-0 border-b-2 border-border bg-transparent pt-1 pb-2 text-sm',
  'text-foreground placeholder-muted-foreground/60 outline-none transition-colors duration-200',
  'focus:border-primary'
)

function DesktopLoginForm({ form, onSubmit, loading, error }: DesktopLoginFormProps) {
  const [showPassword, setShowPassword] = useState(false)
  const { register, control } = form
  const { errors } = useFormState({ control })

  return (
    <div className="flex-1 px-14 py-14">
      <h2 className="mb-1 text-2xl font-bold text-foreground">Accedi</h2>
      <p className="mb-10 text-sm text-muted-foreground">
        Inserisci le tue credenziali per continuare
      </p>

      <form onSubmit={onSubmit} className="flex flex-col gap-7">
        <div>
          <label
            htmlFor="login-email"
            className="mb-2 block text-xs font-semibold tracking-wide text-muted-foreground uppercase"
          >
            E-mail
          </label>
          <input
            id="login-email"
            type="email"
            placeholder="tu@devit.it"
            aria-invalid={!!errors.email}
            className={underlineInputClass}
            {...register('email')}
          />
          {errors.email && (
            <span className="mt-1.5 block text-xs text-destructive">
              {errors.email.message}
            </span>
          )}
        </div>

        <div>
          <label
            htmlFor="login-password"
            className="mb-2 block text-xs font-semibold tracking-wide text-muted-foreground uppercase"
          >
            Password
          </label>
          <div className="relative">
            <input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              aria-invalid={!!errors.password}
              className={cn(underlineInputClass, 'pr-8')}
              {...register('password')}
            />
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              className="absolute right-0 bottom-2 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              <span className="sr-only">Mostra/nascondi password</span>
            </button>
          </div>
          {errors.password && (
            <span className="mt-1.5 block text-xs text-destructive">
              {errors.password.message}
            </span>
          )}
        </div>

        {error && (
          <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </p>
        )}

        <div className="mt-1 flex items-center justify-center">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-1.5 rounded-full bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground transition-colors duration-200 hover:bg-primary/85 disabled:opacity-50"
          >
            {loading && <Loader2 className="size-4 animate-spin" />}
            Accedi
          </button>
        </div>
      </form>

      <button
        type="button"
        className="mt-8 block w-full text-center text-sm text-primary hover:underline"
      >
        Password dimenticata?
      </button>
    </div>
  )
}

export default DesktopLoginForm
