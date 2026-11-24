import { useEffect, useState } from 'react'
import { SearchIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import GlobalSearchDialog from '@/components/layout/GlobalSearchDialog'

const SHORTCUT_KEY = 'k'
const IS_MAC = typeof navigator !== 'undefined' && navigator.platform.toLowerCase().includes('mac')
const SHORTCUT_LABEL = IS_MAC ? '⌘K' : 'Ctrl+K'

// Gatilho da busca global: abre a paleta em modal (clique ou ⌘K / Ctrl+K)
function GlobalSearch() {
  const { t } = useTranslation('common')
  const [open, setOpen] = useState(false)

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === SHORTCUT_KEY) {
        event.preventDefault()
        setOpen((value) => !value)
      }
    }

    window.addEventListener('keydown', onKeyDown)

    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  return (
    <>
      <button
        id="global-search"
        type="button"
        onClick={() => setOpen(true)}
        className="flex h-[38px] w-full max-w-md cursor-text items-center gap-2 rounded-lg border border-input bg-card px-3 text-sm text-muted-foreground transition-colors hover:border-primary"
      >
        <SearchIcon className="size-4 shrink-0" />
        <span className="flex-1 truncate text-left">{t('globalSearch.placeholder')}</span>
        <kbd className="rounded border border-input px-1 text-xs leading-5">{SHORTCUT_LABEL}</kbd>
      </button>

      <GlobalSearchDialog open={open} onOpenChange={setOpen} />
    </>
  )
}

export default GlobalSearch
