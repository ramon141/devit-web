import { useTranslation } from 'react-i18next'
import ModalRegister from '@/components/ModalRegister'
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
    <ModalRegister
      open={open}
      onOpenChange={onOpenChange}
      title={t('kindPicker.title')}
    >
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {getCategoryKindOptions(t).map((option) => {
            const hasCategory = !!categoryIdsByKind[option.value]?.length

            return (
              <Button
                key={option.value}
                type="button"
                variant="outline"
                className="h-auto min-h-16 flex-col gap-1 px-2 py-2 text-center whitespace-normal"
                onClick={() => handleSelect(option.value)}
              >
                {option.label}
                {!hasCategory && (
                  <span className="text-xs leading-tight font-normal text-muted-foreground">
                    {t('kindPicker.noCategory')}
                  </span>
                )}
              </Button>
            )
          })}
        </div>
    </ModalRegister>
  )
}

export default PropertyKindPickerModal
