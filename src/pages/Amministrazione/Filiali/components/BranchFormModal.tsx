import { Controller } from 'react-hook-form'
import ModalRegister from '@/components/ModalRegister'
import { Button } from '@/components/ui/button'
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
      title={branch ? 'Modifica filiale' : 'Nuova filiale'}
    >
      <form onSubmit={onSubmit} className="grid gap-4">
        <FormFieldWrapper label="Nome" required error={errors.name?.message}>
          <Input {...register('name')} placeholder="Filiale Milano Centro" />
        </FormFieldWrapper>

        <Controller
          control={control}
          name="active"
          render={({ field }) => (
            <div className="flex items-center gap-2">
              <Switch checked={field.value} onCheckedChange={field.onChange} />
              <span className="text-sm">Filiale attiva</span>
            </div>
          )}
        />

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Annulla
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            Salva
          </Button>
        </div>
      </form>
    </ModalRegister>
  )
}

export default BranchFormModal
