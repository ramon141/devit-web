import { Controller } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import ModalRegister from '@/components/ModalRegister'
import FormModalFooter from '@/components/FormModalFooter'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import FormFieldWrapper from '@/components/FormFieldWrapper'
import type { PropertyCategory } from '@/api/generated/models'
import { useCategoryForm } from '@/pages/Amministrazione/Categorie/hooks/useCategoryForm'

type CategoryFormModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  category?: PropertyCategory | null
}

function CategoryFormModal({ open, onOpenChange, category }: CategoryFormModalProps) {
  const { t } = useTranslation('amministrazione')
  const { form, isSubmitting, onSubmit } = useCategoryForm({
    category,
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
      title={category ? t('categoryFormModal.editTitle') : t('categoryFormModal.newTitle')}
    >
      <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
        <FormFieldWrapper label={t('categoryFormModal.nameLabel')} required error={errors.name?.message}>
          <Input {...register('name')} placeholder={t('categoryFormModal.namePlaceholder')} />
        </FormFieldWrapper>

        <FormFieldWrapper label={t('categoryFormModal.slugLabel')} required error={errors.slug?.message}>
          <Input {...register('slug')} placeholder={t('categoryFormModal.slugPlaceholder')} />
        </FormFieldWrapper>

        <FormFieldWrapper label={t('categoryFormModal.iconLabel')} error={errors.icon?.message}>
          <Input {...register('icon')} placeholder={t('categoryFormModal.iconPlaceholder')} />
        </FormFieldWrapper>

        <FormFieldWrapper
          label={t('categoryFormModal.orderLabel')}
          error={errors.displayOrder?.message}
        >
          <Input {...register('displayOrder')} type="number" placeholder="1" />
        </FormFieldWrapper>

        <Controller
          control={control}
          name="active"
          render={({ field }) => (
            <label className="flex items-center gap-2 self-end pb-1.5 text-sm">
              <Switch checked={field.value} onCheckedChange={field.onChange} />
              {t('categoryFormModal.activeLabel')}
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

export default CategoryFormModal
