import { useState } from 'react'
import { useNavigate } from 'react-router'
import { Command as CommandPrimitive } from 'cmdk'
import { Dialog as DialogPrimitive } from '@base-ui/react/dialog'
import { Loader2Icon, SearchIcon } from 'lucide-react'
import { Trans, useTranslation } from 'react-i18next'
import { Dialog, DialogOverlay, DialogPortal } from '@/components/ui/dialog'
import GlobalSearchGroup from '@/components/layout/GlobalSearchGroup'
import { useGlobalSearchGroups } from '@/components/layout/useGlobalSearchGroups'

type GlobalSearchDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

// Paleta de busca global: mesmo layout do modal de busca do agenda-time-web
function GlobalSearchDialog({ open, onOpenChange }: GlobalSearchDialogProps) {
  const { t } = useTranslation('common')
  const navigate = useNavigate()
  const [text, setText] = useState('')

  function handleOpenChange(value: boolean) {
    if (!value) setText('')
    onOpenChange(value)
  }

  function go(path: string) {
    handleOpenChange(false)
    navigate(path)
  }

  const { groups, term, isLoading, isEmpty } = useGlobalSearchGroups(open, text, go)

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogPortal>
        <DialogOverlay className="bg-black/50 supports-backdrop-filter:backdrop-blur-none" />

        <DialogPrimitive.Popup
          aria-label={t('globalSearch.placeholder')}
          className="fixed top-[15%] left-1/2 z-50 w-[calc(100%-2rem)] max-w-[560px] -translate-x-1/2 overflow-hidden rounded-xl bg-card text-foreground shadow-[0_20px_60px_rgba(0,0,0,0.15)] outline-none"
        >
          <CommandPrimitive shouldFilter={false} loop>
            <div className="flex items-center gap-3 border-b-2 border-sidebar px-5 py-4">
              <SearchIcon className="size-[22px] shrink-0 text-sidebar" />

              <CommandPrimitive.Input
                value={text}
                onValueChange={setText}
                placeholder={t('globalSearch.placeholder')}
                className="w-full bg-transparent text-[1.05rem] text-foreground outline-none placeholder:text-muted-foreground"
              />

              {isLoading && <Loader2Icon className="size-4 shrink-0 animate-spin text-sidebar" />}
            </div>

            <CommandPrimitive.List className="max-h-[420px] overflow-y-auto py-2">
              {isLoading && !groups.some((g) => g.items.length) && (
                <div className="flex flex-col items-center gap-3 py-8">
                  <Loader2Icon className="size-6 animate-spin text-sidebar" />
                  <p className="text-[0.8rem] text-muted-foreground">{t('globalSearch.loading')}</p>
                </div>
              )}

              {groups.map((group) => (
                <GlobalSearchGroup key={group.key} group={group} showCount={Boolean(term) && group.key !== 'nav'} />
              ))}

              {isEmpty && (
                <p className="py-8 text-center text-[0.875rem] text-muted-foreground">
                  {t('globalSearch.empty', { query: text.trim() })}
                </p>
              )}
            </CommandPrimitive.List>

            <div className="border-t px-6 py-2 text-[0.7rem] text-muted-foreground">
              <Trans t={t} i18nKey="globalSearch.tip" components={{ b: <strong /> }} />
            </div>
          </CommandPrimitive>
        </DialogPrimitive.Popup>
      </DialogPortal>
    </Dialog>
  )
}

export default GlobalSearchDialog
