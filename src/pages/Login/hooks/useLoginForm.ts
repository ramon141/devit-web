import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router'
import { loginSchema, type LoginFormValues } from '@/pages/Login/schemas/loginSchema'

const DEMO_EMAIL = 'admin@devit.com'
const DEMO_PASSWORD = 'admin123'

export function useLoginForm() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | undefined>(undefined)

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  async function onSubmit(values: LoginFormValues) {
    setError(undefined)
    setLoading(true)

    await new Promise((resolve) => setTimeout(resolve, 700))

    const isValid = values.email === DEMO_EMAIL && values.password === DEMO_PASSWORD

    if (!isValid) {
      setError('E-mail o password non corretti.')
      setLoading(false)
      return
    }

    setLoading(false)
    navigate('/')
  }

  return {
    form,
    loading,
    error,
    onSubmit: form.handleSubmit(onSubmit),
  }
}
