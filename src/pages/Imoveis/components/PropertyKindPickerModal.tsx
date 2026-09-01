import { useTranslation } from 'react-i18next'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useCategoryKinds, type PropertyCategoryKind } from '@/pages/Imoveis/hooks/useCategoryKinds'
import { getCategoryKindOptions } from '@/pages/Imoveis/schemas/propertySchema'

type PropertyKindPickerModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelect: (categoryId?: string) => void
}

function PropertyKindPickerModal({ open, onOpenChange, onSelect }: PropertyKindPickerModalProps) {
  const { t } = useTranslation('imoveis')
  const { categoryIdsByKind } = useCategoryKinds()

  function handleSelect(kind: PropertyCategoryKind) {
    onSelect(categoryIdsByKind[kind]?.[0])
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('kindPicker.title')}</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {getCategoryKindOptions(t).map((option) => {
            const hasCategory = !!categoryIdsByKind[option.value]?.length

            return (
              <Button
                key={option.value}
                type="button"
                variant="outline"
                className="h-16 flex-col gap-1"
                onClick={() => handleSelect(option.value)}
              >
                {option.label}
                {!hasCategory && (
                  <span className="text-xs font-normal text-muted-foreground">
                    {t('kindPicker.noCategory')}
                  </span>
                )}
              </Button>
            )
          })}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default PropertyKindPickerModal
