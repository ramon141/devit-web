import { Eye, EyeOff, User } from 'lucide-react'
import type { FieldError, UseFormRegister } from 'react-hook-form'
import type { LoginFormValues } from '@/pages/Login/schemas/loginSchema'
import { cn } from '@/lib/utils'

const filledInputClass = cn(
  'h-[52px] w-full rounded-2xl border-0 bg-foreground/[0.06] px-4 pr-11 text-sm',
  'text-foreground outline-none placeholder:text-muted-foreground/70'
)

const mobileLabelClass = 'mb-2 block text-sm font-semibold text-foreground'

type EmailFieldProps = {
  register: UseFormRegister<LoginFormValues>
  error?: FieldError
}

export function MobileEmailField({ register, error }: EmailFieldProps) {
  return (
    <div className="mb-4">
      <label htmlFor="login-email" className={mobileLabelClass}>
        Inserisci la tua e-mail
      </label>
      <div className="relative">
        <input
          id="login-email"
          type="email"
          placeholder="username@devit.it"
          aria-invalid={!!error}
          className={filledInputClass}
          {...register('email')}
        />
        <User className="absolute top-1/2 right-4 size-4 -translate-y-1/2 text-muted-foreground" />
      </div>
      {error && <span className="mt-1.5 block text-xs text-destructive">{error.message}</span>}
    </div>
  )
}

type PasswordFieldProps = {
  register: UseFormRegister<LoginFormValues>
  error?: FieldError
  showPassword: boolean
  onTogglePassword: () => void
}

export function MobilePasswordField({
  register,
  error,
  showPassword,
  onTogglePassword,
}: PasswordFieldProps) {
  return (
    <div className="mb-4">
      <label htmlFor="login-password" className={mobileLabelClass}>
        Inserisci la tua password
      </label>
      <div className="relative">
        <input
          id="login-password"
          type={showPassword ? 'text' : 'password'}
          placeholder="••••••••"
          aria-invalid={!!error}
          className={filledInputClass}
          {...register('password')}
        />
        <button
          type="button"
          onClick={onTogglePassword}
          className="absolute top-1/2 right-4 -translate-y-1/2 text-muted-foreground hover:text-foreground"
        >
          {showPassword ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
          <span className="sr-only">Mostra/nascondi password</span>
        </button>
      </div>
      {error && <span className="mt-1.5 block text-xs text-destructive">{error.message}</span>}

      <div className="mt-2 flex items-center justify-between">
        <label className="flex items-center gap-1.5 text-xs text-primary">
          <input
            type="checkbox"
            checked={showPassword}
            onChange={onTogglePassword}
            className="size-3.5 accent-primary"
          />
          Mostra password
        </label>
        <button type="button" className="text-xs text-primary hover:underline">
          Password dimenticata?
        </button>
      </div>
    </div>
  )
}
