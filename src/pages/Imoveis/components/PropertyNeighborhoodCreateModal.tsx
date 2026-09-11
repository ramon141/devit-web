import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
import { useQueryClient } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import ModalRegister from '@/components/ModalRegister'
import FormModalFooter from '@/components/FormModalFooter'
import FormFieldWrapper from '@/components/FormFieldWrapper'
import SelectField from '@/components/SelectField'
import { Input } from '@/components/ui/input'
import {
  getNeighborhoodControllerFindQueryKey,
  useNeighborhoodControllerCreate,
  useZoneControllerFind,
} from '@/api/generated/api'
import type { Neighborhood } from '@/api/generated/models'
import { usePromisePopup } from '@/contexts/PromisePopupContext'
import { getErrorMessageFromRequest, type ApiErrorResponse } from '@/utils/getErrorMessageFromRequest'
import {
  neighborhoodSchema,
  type NeighborhoodFormValues,
} from '@/pages/Amministrazione/Zone/schemas/zoneSchema'

type PropertyNeighborhoodCreateModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  city: string
  initialName: string
  onCreated: (neighborhood: Neighborhood) => void
}

// Cria um quartiere sem sair do cadastro do imóvel; a zona é escolhida entre
// as zonas da cidade selecionada, já que Neighborhood pertence a uma Zone
function PropertyNeighborhoodCreateModal({
  open,
  onOpenChange,
  city,
  initialName,
  onCreated,
}: PropertyNeighborhoodCreateModalProps) {
  const { t } = useTranslation('imoveis')
  const queryClient = useQueryClient()
  const { promisePopup } = usePromisePopup()
  const { mutateAsync: create, isPending } = useNeighborhoodControllerCreate()

  const { data: zones } = useZoneControllerFind({
    filter: { where: { city, active: true }, order: ['name ASC'] },
  })

  const form = useForm<NeighborhoodFormValues>({
    resolver: zodResolver(neighborhoodSchema),
    defaultValues: { name: '', zoneId: '', active: true },
  })

  const {
    register,
    control,
    formState: { errors },
  } = form

  useEffect(() => {
    if (open) form.reset({ name: initialName, zoneId: '', active: true })
  }, [open, initialName, form])

  function onSubmit(values: NeighborhoodFormValues) {
    promisePopup(create({ data: values }), {
      pending: t('neighborhoodCreateModal.pending'),
      success: (created) => {
        queryClient.invalidateQueries({ queryKey: getNeighborhoodControllerFindQueryKey() })
        onCreated(created)
        onOpenChange(false)
        return t('neighborhoodCreateModal.success')
      },
      error: (error: AxiosError<ApiErrorResponse>) => getErrorMessageFromRequest(error),
    })
  }

  const zoneOptions = (zones ?? []).map((zone) => ({
    value: zone.id ?? '',
    label: zone.name,
  }))

  return (
    <ModalRegister
      open={open}
      onOpenChange={onOpenChange}
      title={t('neighborhoodCreateModal.title')}
    >
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid w-full gap-4 sm:grid-cols-2"
      >
        <FormFieldWrapper
          label={t('neighborhoodCreateModal.nameLabel')}
          required
          error={errors.name?.message}
        >
          <Input
            {...register('name')}
            placeholder={t('neighborhoodCreateModal.namePlaceholder')}
          />
        </FormFieldWrapper>

        <FormFieldWrapper
          label={t('neighborhoodCreateModal.zoneLabel')}
          required
          error={errors.zoneId?.message}
        >
          <Controller
            control={control}
            name="zoneId"
            render={({ field }) => (
              <SelectField
                value={field.value}
                onValueChange={field.onChange}
                options={zoneOptions}
                placeholder={t('neighborhoodCreateModal.zonePlaceholder')}
              />
            )}
          />
        </FormFieldWrapper>

        <FormModalFooter
          onCancel={() => onOpenChange(false)}
          isSubmitting={isPending}
          className="sm:col-span-2"
        />
      </form>
    </ModalRegister>
  )
}

export default PropertyNeighborhoodCreateModal
