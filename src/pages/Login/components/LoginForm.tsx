import { useState } from 'react'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import type { UseFormReturn } from 'react-hook-form'
import type { LoginFormValues } from '@/pages/Login/schemas/loginSchema'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

type LoginFormProps = {
  form: UseFormReturn<LoginFormValues>
  onSubmit: () => void
  loading: boolean
  error?: string
}

function LoginForm({ form, onSubmit, loading, error }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false)
  const {
    register,
    formState: { errors },
  } = form

  return (
    <div className="-mt-6 flex-1 rounded-t-3xl bg-card px-8 pt-10 pb-10 md:mt-0 md:rounded-none md:px-14 md:py-14">
      <h2 className="mb-1 text-2xl font-bold text-foreground">Accedi</h2>
      <p className="mb-8 text-sm text-muted-foreground">
        Inserisci le tue credenziali per continuare
      </p>

      <form onSubmit={onSubmit} className="grid gap-5">
        <div className="grid gap-2">
          <Label htmlFor="login-email">E-mail</Label>
          <Input
            id="login-email"
            type="email"
            placeholder="tu@devit.it"
            aria-invalid={!!errors.email}
            {...register('email')}
          />
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="login-password">Password</Label>
          <div className="relative">
            <Input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              aria-invalid={!!errors.password}
              className="pr-9"
              {...register('password')}
            />
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              className="absolute inset-y-0 right-2.5 flex items-center text-muted-foreground hover:text-foreground"
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              <span className="sr-only">Mostra/nascondi password</span>
            </button>
          </div>
          {errors.password && (
            <p className="text-sm text-destructive">{errors.password.message}</p>
          )}
        </div>

        {error && (
          <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </p>
        )}

        <Button type="submit" disabled={loading} className="mt-1 w-full">
          {loading && <Loader2 className="animate-spin" />}
          Accedi
        </Button>
      </form>
    </div>
  )
}

export default LoginForm
