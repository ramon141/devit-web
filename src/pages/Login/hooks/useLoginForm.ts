import { useEffect, useMemo, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router'
import { useTranslation } from 'react-i18next'
import type { AxiosError } from 'axios'
import {
  useAuthControllerLogin,
  useAuthControllerMe,
} from '@/api/generated/api'
import type {
  AuthControllerLogin401,
  AuthControllerLogin422,
  AuthControllerLogin429,
} from '@/api/generated/models'
import { Auth } from '@/auth'
import { getErrorMessageFromRequest } from '@/utils/getErrorMessageFromRequest'
import { createLoginSchema, type LoginFormValues } from '@/pages/Login/schemas/loginSchema'
import { CRM_BASE_PATH } from '@/lib/crmBasePath'

type LoginError = AuthControllerLogin401 | AuthControllerLogin422 | AuthControllerLogin429

export function useLoginForm() {
  const { t } = useTranslation('login')
  const navigate = useNavigate()
  const [error, setError] = useState<string | undefined>(undefined)

  const { mutateAsync: login, isPending: loading } = useAuthControllerLogin()

  const { data: me } = useAuthControllerMe({
    query: { enabled: Auth.isAuthenticated(), retry: false },
  })

  useEffect(() => {
    if (me) navigate(CRM_BASE_PATH)
  }, [me, navigate])

  const loginSchema = useMemo(() => createLoginSchema(t), [t])

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  async function onSubmit(values: LoginFormValues) {
    setError(undefined)

    try {
      const response = await login({ data: values })
      Auth.login(response)
      navigate(CRM_BASE_PATH)
    } catch (err) {
      setError(getErrorMessageFromRequest(err as AxiosError<LoginError>))
    }
  }

  return {
    form,
    loading,
    error,
    onSubmit: form.handleSubmit(onSubmit),
  }
}
