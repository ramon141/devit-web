import { Controller } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import ModalRegister from '@/components/ModalRegister'
import FormModalFooter from '@/components/FormModalFooter'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import FormFieldWrapper from '@/components/FormFieldWrapper'
import type { Branch } from '@/api/generated/models'
import { useBranchForm } from '@/pages/Amministrazione/Filiali/hooks/useBranchForm'

type BranchFormModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  branch?: Branch | null
}

function BranchFormModal({ open, onOpenChange, branch }: BranchFormModalProps) {
  const { t } = useTranslation('amministrazione')
  const { form, isSubmitting, onSubmit } = useBranchForm({
    branch,
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
      title={branch ? t('branchFormModal.editTitle') : t('branchFormModal.newTitle')}
    >
      <form onSubmit={onSubmit} className="grid gap-4">
        <FormFieldWrapper label={t('branchFormModal.nameLabel')} required error={errors.name?.message}>
          <Input {...register('name')} placeholder={t('branchFormModal.namePlaceholder')} />
        </FormFieldWrapper>

        <Controller
          control={control}
          name="active"
          render={({ field }) => (
            <div className="flex items-center gap-2">
              <Switch checked={field.value} onCheckedChange={field.onChange} />
              <span className="text-sm">{t('branchFormModal.activeLabel')}</span>
            </div>
          )}
        />

        <FormModalFooter onCancel={() => onOpenChange(false)} isSubmitting={isSubmitting} />
      </form>
    </ModalRegister>
  )
}

export default BranchFormModal
