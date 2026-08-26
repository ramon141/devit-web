import { useEffect, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useQueryClient } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import {
  getUserControllerCountQueryKey,
  getUserControllerFindQueryKey,
  useAttachmentControllerFindById,
  useUserControllerCreate,
  useUserControllerUpdateById,
} from '@/api/generated/api'
import type { UserExcludingPasswordHashWithRelations } from '@/api/generated/models'
import { useToast } from '@/contexts/ToastContext'
import { useAttachmentUpload } from '@/hooks/useAttachmentUpload'
import { getErrorMessageFromRequest, type ApiErrorResponse } from '@/utils/getErrorMessageFromRequest'
import { emptyStringsToNull } from '@/utils/emptyStringsToNull'
import { userSchema, type UserFormValues } from '@/pages/Amministrazione/Utenti/schemas/userSchema'

const emptyValues: UserFormValues = {
  fullName: '',
  email: '',
  accessLevel: 'broker',
  branchId: '',
  active: true,
  password: '',
}

type UseUserFormProps = {
  user?: UserExcludingPasswordHashWithRelations | null
  onSaved: () => void
}

export function useUserForm({ user, onSaved }: UseUserFormProps) {
  const queryClient = useQueryClient()
  const { toastPromise } = useToast()
  const { mutateAsync: create, isPending: creating } = useUserControllerCreate()
  const { mutateAsync: update, isPending: updating } = useUserControllerUpdateById()
  const { uploadFile } = useAttachmentUpload()
  const [avatarFiles, setAvatarFiles] = useState<File[]>([])
  const { data: avatar } = useAttachmentControllerFindById(user?.avatarId ?? '', undefined, {
    query: { enabled: !!user?.avatarId },
  })

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: emptyValues,
  })

  useEffect(() => {
    setAvatarFiles([])
    form.reset(
      user
        ? {
            fullName: user.fullName,
            email: user.email,
            accessLevel: user.accessLevel,
            branchId: user.branchId ?? '',
            active: user.active ?? true,
            password: '',
          }
        : emptyValues
    )
  }, [user, form])

  function invalidateList() {
    queryClient.invalidateQueries({ queryKey: getUserControllerFindQueryKey() })
    queryClient.invalidateQueries({ queryKey: getUserControllerCountQueryKey() })
  }

  async function saveUser(values: UserFormValues) {
    const { password, branchId, ...rest } = emptyStringsToNull(values)
    const avatarId = avatarFiles[0] ? (await uploadFile(avatarFiles[0], 'avatars')).id : undefined

    if (user?.id) {
      return update({ id: user.id, data: { ...rest, branchId, ...(avatarId && { avatarId }) } })
    }

    return create({ data: { ...rest, password: password ?? '', ...(avatarId && { avatarId }) } })
  }

  function onSubmit(values: UserFormValues) {
    if (!user && !values.password) {
      form.setError('password', { message: 'La password è obbligatoria per un nuovo utente' })
      return
    }

    toastPromise(saveUser(values), {
      pending: user ? 'Salvataggio utente...' : 'Creazione utente...',
      success: () => {
        invalidateList()
        onSaved()
        return user ? 'Utente aggiornato con successo!' : 'Utente creato con successo!'
      },
      error: (error: AxiosError<ApiErrorResponse>) =>
        getErrorMessageFromRequest(error, 'Errore durante il salvataggio dell’utente'),
    })
  }

  return {
    form,
    avatarFiles,
    setAvatarFiles,
    avatarUrl: avatar?.url ?? undefined,
    isSubmitting: creating || updating,
    isEditing: !!user,
    onSubmit: form.handleSubmit(onSubmit),
  }
}
