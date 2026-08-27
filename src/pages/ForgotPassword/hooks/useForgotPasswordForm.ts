import { useMemo, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import type { AxiosError } from 'axios'
import { useAuthControllerForgotPassword } from '@/api/generated/api'
import type {
  AuthControllerForgotPassword422,
  AuthControllerForgotPassword429,
} from '@/api/generated/models'
import { getErrorMessageFromRequest } from '@/utils/getErrorMessageFromRequest'
import {
  createForgotPasswordSchema,
  type ForgotPasswordFormValues,
} from '@/pages/ForgotPassword/schemas/forgotPasswordSchema'

type ForgotPasswordError = AuthControllerForgotPassword422 | AuthControllerForgotPassword429

export function useForgotPasswordForm() {
  const { t } = useTranslation('login')
  const [error, setError] = useState<string | undefined>(undefined)
  const [sent, setSent] = useState(false)

  const { mutateAsync: forgotPassword, isPending: loading } = useAuthControllerForgotPassword()

  const forgotPasswordSchema = useMemo(() => createForgotPasswordSchema(t), [t])

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  })

  async function onSubmit(values: ForgotPasswordFormValues) {
    setError(undefined)

    try {
      await forgotPassword({ data: values })
      setSent(true)
    } catch (err) {
      setError(getErrorMessageFromRequest(err as AxiosError<ForgotPasswordError>))
    }
  }

  return {
    form,
    loading,
    error,
    sent,
    onSubmit: form.handleSubmit(onSubmit),
  }
}
