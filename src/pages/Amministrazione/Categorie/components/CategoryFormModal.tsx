import { Controller } from 'react-hook-form'
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
      title={category ? 'Modifica categoria' : 'Nuova categoria'}
    >
      <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
        <FormFieldWrapper label="Nome" required error={errors.name?.message}>
          <Input {...register('name')} placeholder="Appartamento" />
        </FormFieldWrapper>

        <FormFieldWrapper label="Slug" required error={errors.slug?.message}>
          <Input {...register('slug')} placeholder="appartamento" />
        </FormFieldWrapper>

        <FormFieldWrapper label="Icona" error={errors.icon?.message}>
          <Input {...register('icon')} placeholder="home" />
        </FormFieldWrapper>

        <FormFieldWrapper label="Ordine di visualizzazione" error={errors.displayOrder?.message}>
          <Input {...register('displayOrder')} type="number" placeholder="1" />
        </FormFieldWrapper>

        <Controller
          control={control}
          name="active"
          render={({ field }) => (
            <label className="flex items-center gap-2 self-end pb-1.5 text-sm">
              <Switch checked={field.value} onCheckedChange={field.onChange} />
              Categoria attiva
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
