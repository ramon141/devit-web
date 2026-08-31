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
}: ListToolbarProps) {
  const { t } = useTranslation('common')
  const resolvedSearchPlaceholder = searchPlaceholder ?? t('listToolbar.searchPlaceholder')
  const resolvedNewLabel = newLabel ?? t('listToolbar.newLabel')

  return (
    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
      <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:items-end">
        <div className="w-full sm:max-w-xs">
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

      <div className="flex items-center gap-2">
        {actions}

        {onNewClick && (
          <Button onClick={onNewClick} className="gap-1.5">
            <PlusIcon className="size-4" />
            {resolvedNewLabel}
          </Button>
        )}
      </div>
    </div>
  )
}

export default ListToolbar
