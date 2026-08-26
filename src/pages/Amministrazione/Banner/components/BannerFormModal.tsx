import { Controller } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import ModalRegister from '@/components/ModalRegister'
import FormModalFooter from '@/components/FormModalFooter'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import FormFieldWrapper from '@/components/FormFieldWrapper'
import FileUpload from '@/components/FileUpload'
import type { HomeBanner } from '@/api/generated/models'
import { useBannerForm } from '@/pages/Amministrazione/Banner/hooks/useBannerForm'

type BannerFormModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  banner?: HomeBanner | null
}

function BannerFormModal({ open, onOpenChange, banner }: BannerFormModalProps) {
  const { t } = useTranslation('amministrazione')
  const { form, imageFiles, setImageFiles, imageError, isSubmitting, onSubmit } = useBannerForm({
    banner,
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
      title={banner ? t('bannerFormModal.editTitle') : t('bannerFormModal.newTitle')}
    >
      <form onSubmit={onSubmit} className="grid gap-4">
        <FileUpload
          label={t('bannerFormModal.imageLabel')}
          value={imageFiles}
          onChange={setImageFiles}
          accept="image/*"
          error={imageError}
          hint={banner ? t('bannerFormModal.imageHint') : undefined}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <FormFieldWrapper
            label={t('bannerFormModal.titleLabel')}
            required
            error={errors.title?.message}
          >
            <Input {...register('title')} />
          </FormFieldWrapper>

          <FormFieldWrapper label={t('bannerFormModal.subtitleLabel')} error={errors.subtitle?.message}>
            <Input {...register('subtitle')} />
          </FormFieldWrapper>

          <FormFieldWrapper label={t('bannerFormModal.linkLabel')} error={errors.targetLink?.message}>
            <Input {...register('targetLink')} placeholder="https://" />
          </FormFieldWrapper>

          <FormFieldWrapper label={t('bannerFormModal.orderLabel')} error={errors.displayOrder?.message}>
            <Input {...register('displayOrder')} type="number" />
          </FormFieldWrapper>

          <FormFieldWrapper label={t('bannerFormModal.startDateLabel')} error={errors.startDate?.message}>
            <Input {...register('startDate')} type="date" />
          </FormFieldWrapper>

          <FormFieldWrapper label={t('bannerFormModal.endDateLabel')} error={errors.endDate?.message}>
            <Input {...register('endDate')} type="date" />
          </FormFieldWrapper>

          <Controller
            control={control}
            name="active"
            render={({ field }) => (
              <label className="flex items-center gap-2 self-end pb-1.5 text-sm">
                <Switch checked={field.value} onCheckedChange={field.onChange} />
                {t('bannerFormModal.activeLabel')}
              </label>
            )}
          />
        </div>

        <FormModalFooter onCancel={() => onOpenChange(false)} isSubmitting={isSubmitting} />
      </form>
    </ModalRegister>
  )
}

export default BannerFormModal
