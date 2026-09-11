import { Controller } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import ModalRegister from '@/components/ModalRegister'
import FormModalFooter from '@/components/FormModalFooter'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import FormFieldWrapper from '@/components/FormFieldWrapper'
import type { Neighborhood } from '@/api/generated/models'
import { useNeighborhoodForm } from '@/pages/Amministrazione/Zone/hooks/useNeighborhoodForm'

type NeighborhoodFormModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  zoneId: string
  neighborhood?: Neighborhood | null
}

function NeighborhoodFormModal({
  open,
  onOpenChange,
  zoneId,
  neighborhood,
}: NeighborhoodFormModalProps) {
  const { t } = useTranslation('amministrazione')
  const { form, isSubmitting, onSubmit } = useNeighborhoodForm({
    neighborhood,
    zoneId,
    onSaved: () => onOpenChange(false),
  })
  const {
    register,
    control,
    formState: { errors },
  } = form

  return (
    <ModalRegister
      open={open}
      onOpenChange={onOpenChange}
      title={
        neighborhood
          ? t('neighborhoodFormModal.editTitle')
          : t('neighborhoodFormModal.newTitle')
      }
    >
      <form onSubmit={onSubmit} className="grid w-full gap-4 sm:grid-cols-2">
        <FormFieldWrapper
          label={t('neighborhoodFormModal.nameLabel')}
          required
          error={errors.name?.message}
        >
          <Input
            {...register('name')}
            placeholder={t('neighborhoodFormModal.namePlaceholder')}
          />
        </FormFieldWrapper>

        <Controller
          control={control}
          name="active"
          render={({ field }) => (
            <label className="flex items-center gap-2 self-end pb-1.5 text-sm">
              <Switch checked={field.value} onCheckedChange={field.onChange} />
              {t('neighborhoodFormModal.activeLabel')}
            </label>
          )}
        />

        <FormModalFooter
          onCancel={() => onOpenChange(false)}
          isSubmitting={isSubmitting}
          className="sm:col-span-2"
        />
      </form>
    </ModalRegister>
  )
}

export default NeighborhoodFormModal
