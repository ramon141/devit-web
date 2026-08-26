import { useEffect, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router'
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
import { loginSchema, type LoginFormValues } from '@/pages/Login/schemas/loginSchema'
import { CRM_BASE_PATH } from '@/lib/crmBasePath'

type LoginError = AuthControllerLogin401 | AuthControllerLogin422 | AuthControllerLogin429

export function useLoginForm() {
  const navigate = useNavigate()
  const [error, setError] = useState<string | undefined>(undefined)

  const { mutateAsync: login, isPending: loading } = useAuthControllerLogin()

  const { data: me } = useAuthControllerMe({
    query: { enabled: Auth.isAuthenticated(), retry: false },
  })

  useEffect(() => {
    if (me) navigate(CRM_BASE_PATH)
  }, [me, navigate])

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
