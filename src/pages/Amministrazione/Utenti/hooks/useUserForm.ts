import { useEffect, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useQueryClient } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import {
  getUserControllerCountQueryKey,
  getUserControllerFindByIdQueryKey,
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
  const { t } = useTranslation('amministrazione')
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

    if (user?.id) {
      queryClient.invalidateQueries({ queryKey: getUserControllerFindByIdQueryKey(user.id) })
    }
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
      form.setError('password', { message: t('userForm.passwordRequired') })
      return
    }

    toastPromise(saveUser(values), {
      pending: user ? t('userForm.pendingUpdate') : t('userForm.pendingCreate'),
      success: () => {
        invalidateList()
        onSaved()
        return user ? t('userForm.successUpdate') : t('userForm.successCreate')
      },
      error: (error: AxiosError<ApiErrorResponse>) =>
        getErrorMessageFromRequest(error, t('userForm.error')),
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
