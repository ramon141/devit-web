import { Controller } from 'react-hook-form'
import ModalRegister from '@/components/ModalRegister'
import { Button } from '@/components/ui/button'
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
    <ModalRegister open={open} onOpenChange={onOpenChange} title={banner ? 'Modifica banner' : 'Nuovo banner'}>
      <form onSubmit={onSubmit} className="grid gap-4">
        <FileUpload
          label="Immagine"
          value={imageFiles}
          onChange={setImageFiles}
          accept="image/*"
          error={imageError}
          hint={banner ? 'Lascia vuoto per mantenere l’immagine attuale' : undefined}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <FormFieldWrapper label="Titolo" required error={errors.title?.message}>
            <Input {...register('title')} />
          </FormFieldWrapper>

          <FormFieldWrapper label="Sottotitolo" error={errors.subtitle?.message}>
            <Input {...register('subtitle')} />
          </FormFieldWrapper>

          <FormFieldWrapper label="Link" error={errors.targetLink?.message}>
            <Input {...register('targetLink')} placeholder="https://" />
          </FormFieldWrapper>

          <FormFieldWrapper label="Ordine" error={errors.displayOrder?.message}>
            <Input {...register('displayOrder')} type="number" />
          </FormFieldWrapper>

          <FormFieldWrapper label="Data inizio" error={errors.startDate?.message}>
            <Input {...register('startDate')} type="date" />
          </FormFieldWrapper>

          <FormFieldWrapper label="Data fine" error={errors.endDate?.message}>
            <Input {...register('endDate')} type="date" />
          </FormFieldWrapper>

          <Controller
            control={control}
            name="active"
            render={({ field }) => (
              <label className="flex items-center gap-2 self-end pb-1.5 text-sm">
                <Switch checked={field.value} onCheckedChange={field.onChange} />
                Banner attivo
              </label>
            )}
          />
        </div>

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

export default BannerFormModal
