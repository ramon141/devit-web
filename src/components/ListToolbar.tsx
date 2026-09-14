import type { ReactNode } from 'react'
import { PlusIcon, SearchIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import FormFieldWrapper from '@/components/FormFieldWrapper'

type ListToolbarProps = {
  search: string
  onSearchChange: (value: string) => void
  searchPlaceholder?: string
  onNewClick?: () => void
  newLabel?: string
  filters?: ReactNode
  actions?: ReactNode
  searchWrapperId?: string
  newButtonId?: string
}

// Barra padrão de busca + botão "Nuovo" usada em toda tela de listagem
function ListToolbar({
  search,
  onSearchChange,
  searchPlaceholder,
  onNewClick,
  newLabel,
  filters,
  actions,
  searchWrapperId,
  newButtonId,
}: ListToolbarProps) {
  const { t } = useTranslation('common')
  const resolvedSearchPlaceholder = searchPlaceholder ?? t('listToolbar.searchPlaceholder')
  const resolvedNewLabel = newLabel ?? t('listToolbar.newLabel')

  return (
    <div className="mb-4 flex flex-col gap-3">
      <div className="flex w-full flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
        <div id={searchWrapperId} className="w-full sm:max-w-xs">
          <FormFieldWrapper label={t('listToolbar.searchLabel')}>
            <div className="relative">
              <SearchIcon className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(event) => onSearchChange(event.target.value)}
                placeholder={resolvedSearchPlaceholder}
                className="pl-9"
              />
            </div>
          </FormFieldWrapper>
        </div>

        {filters}
      </div>

      <div className="flex items-center gap-2 sm:justify-end">
        {actions}

        {onNewClick && (
          <Button id={newButtonId} onClick={onNewClick} className="gap-1.5">
            <PlusIcon className="size-4" />
            {resolvedNewLabel}
          </Button>
        )}
      </div>
    </div>
  )
}

export default ListToolbar
