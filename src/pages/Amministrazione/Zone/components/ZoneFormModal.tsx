import { Controller } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import ModalRegister from '@/components/ModalRegister'
import FormModalFooter from '@/components/FormModalFooter'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import FormFieldWrapper from '@/components/FormFieldWrapper'
import type { Zone } from '@/api/generated/models'
import { useZoneForm } from '@/pages/Amministrazione/Zone/hooks/useZoneForm'

type ZoneFormModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  zone?: Zone | null
}

function ZoneFormModal({ open, onOpenChange, zone }: ZoneFormModalProps) {
  const { t } = useTranslation('amministrazione')
  const { form, isSubmitting, onSubmit } = useZoneForm({
    zone,
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
      title={zone ? t('zoneFormModal.editTitle') : t('zoneFormModal.newTitle')}
    >
      <form onSubmit={onSubmit} className="grid w-full gap-4 sm:grid-cols-2">
        <FormFieldWrapper
          label={t('zoneFormModal.nameLabel')}
          required
          error={errors.name?.message}
        >
          <Input {...register('name')} placeholder={t('zoneFormModal.namePlaceholder')} />
        </FormFieldWrapper>

        <FormFieldWrapper
          label={t('zoneFormModal.cityLabel')}
          required
          error={errors.city?.message}
        >
          <Input {...register('city')} placeholder={t('zoneFormModal.cityPlaceholder')} />
        </FormFieldWrapper>

        <FormFieldWrapper label={t('zoneFormModal.regionLabel')} error={errors.region?.message}>
          <Input {...register('region')} placeholder={t('zoneFormModal.regionPlaceholder')} />
        </FormFieldWrapper>

        <Controller
          control={control}
          name="active"
          render={({ field }) => (
            <label className="flex items-center gap-2 self-end pb-1.5 text-sm">
              <Switch checked={field.value} onCheckedChange={field.onChange} />
              {t('zoneFormModal.activeLabel')}
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

export default ZoneFormModal
