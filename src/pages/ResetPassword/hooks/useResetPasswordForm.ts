import { useMemo, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useNavigate, useSearchParams } from 'react-router'
import { useTranslation } from 'react-i18next'
import type { AxiosError } from 'axios'
import { useAuthControllerResetPassword } from '@/api/generated/api'
import type { AuthControllerResetPassword422 } from '@/api/generated/models'
import { getErrorMessageFromRequest } from '@/utils/getErrorMessageFromRequest'
import { CRM_BASE_PATH } from '@/lib/crmBasePath'
import {
  createResetPasswordSchema,
  type ResetPasswordFormValues,
} from '@/pages/ResetPassword/schemas/resetPasswordSchema'

export function useResetPasswordForm() {
  const { t } = useTranslation('login')
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') ?? ''
  const [error, setError] = useState<string | undefined>(undefined)

  const { mutateAsync: resetPassword, isPending: loading } = useAuthControllerResetPassword()

  const resetPasswordSchema = useMemo(() => createResetPasswordSchema(t), [t])

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: '', confirmPassword: '' },
  })

  async function onSubmit(values: ResetPasswordFormValues) {
    setError(undefined)

    try {
      await resetPassword({ data: { token, password: values.password } })
      navigate(`${CRM_BASE_PATH}/login`)
    } catch (err) {
      setError(getErrorMessageFromRequest(err as AxiosError<AuthControllerResetPassword422>))
    }
  }

  return {
    form,
    loading,
    error,
    tokenMissing: !token,
    onSubmit: form.handleSubmit(onSubmit),
  }
}
