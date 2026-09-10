import { Controller, useFormState } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import FormFieldWrapper from '@/components/FormFieldWrapper'
import FileUpload from '@/components/FileUpload'
import FormModalFooter from '@/components/FormModalFooter'
import type { HomeBannerWithRelations } from '@/api/generated/models'
import type { useBannerForm } from '@/pages/Amministrazione/Banner/hooks/useBannerForm'

type BannerFormFieldsProps = {
  banner?: HomeBannerWithRelations | null
  bannerForm: ReturnType<typeof useBannerForm>
  onCancel: () => void
}

function BannerFormFields({ banner, bannerForm, onCancel }: BannerFormFieldsProps) {
  const { t } = useTranslation('amministrazione')
  const {
    form,
    imageFiles,
    setImageFiles,
    mobileImageFiles,
    setMobileImageFiles,
    imageError,
    isSubmitting,
    onSubmit,
  } = bannerForm
  const { register, control } = form

  // useFormState assina o estado aqui: o useForm vive na página, então
  // desestruturar form.formState neste componente não dispara re-render
  const { errors } = useFormState({ control })

  return (
    <form onSubmit={onSubmit} className="grid gap-6">
      <div className="grid items-start gap-4">
        <FileUpload
          label={t('bannerFormModal.imageLabel')}
          value={imageFiles}
          onChange={setImageFiles}
          accept="image/*"
          error={imageError}
          hint={banner ? t('bannerFormModal.imageHint') : undefined}
        />

        <FileUpload
          label={t('bannerFormModal.mobileImageLabel')}
          value={mobileImageFiles}
          onChange={setMobileImageFiles}
          accept="image/*"
          hint={banner ? t('bannerFormModal.imageHint') : undefined}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormFieldWrapper
          label={t('bannerFormModal.titleLabel')}
          required
          error={errors.title?.message}
        >
          <Input {...register('title')} />
        </FormFieldWrapper>

        <FormFieldWrapper
          label={t('bannerFormModal.subtitleLabel')}
          error={errors.subtitle?.message}
        >
          <Input {...register('subtitle')} />
        </FormFieldWrapper>

        <FormFieldWrapper label={t('bannerFormModal.linkLabel')} error={errors.targetLink?.message}>
          <Input {...register('targetLink')} placeholder="https://" />
        </FormFieldWrapper>

        <FormFieldWrapper
          label={t('bannerFormModal.orderLabel')}
          error={errors.displayOrder?.message}
        >
          <Input {...register('displayOrder')} type="number" />
        </FormFieldWrapper>

        <FormFieldWrapper
          label={t('bannerFormModal.startDateLabel')}
          error={errors.startDate?.message}
        >
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

      <FormModalFooter onCancel={onCancel} isSubmitting={isSubmitting} />
    </form>
  )
}

export default BannerFormFields
