import { useState } from 'react'
import type { CSSProperties } from 'react'
import {
  ChevronDownIcon,
  DownloadIcon,
  FileTextIcon,
  PrinterIcon,
  SheetIcon,
  type LucideIcon,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { downloadExport, printExport, type ExportFormat } from '@/utils/downloadExport'
import { useToast } from '@/contexts/ToastContext'
import { getErrorMessageFromRequest } from '@/utils/getErrorMessageFromRequest'

// Visual espelhado do ExportButton do hub-projel (amarelo = cor primária daqui)
const TRIGGER_CLASS = [
  'group/export h-10 cursor-pointer gap-2 rounded-full px-5',
  'border-[1.5px] border-primary/35 bg-primary/10',
  'font-semibold tracking-[0.2px] text-foreground shadow-none',
  'transition-all duration-200 ease-in-out',
  'hover:border-primary hover:text-primary-foreground',
  'hover:bg-[linear-gradient(135deg,#ffd633_0%,#ffbf00_100%)]',
  'hover:shadow-[0_6px_16px_rgba(255,204,0,0.4)]',
  'disabled:cursor-not-allowed disabled:border-[#e0e0e0]',
  'disabled:bg-[#f0f0f0] disabled:text-[#b0b0b0] disabled:opacity-100',
].join(' ')

const ICON_CLASS =
  'size-4 transition-transform duration-200 group-hover/export:translate-y-[2px]'

const MENU_CLASS =
  'min-w-[170px] rounded-[10px] bg-popover py-1 ring-0 ' +
  'shadow-[0_0_10px_0_#00000026,0_4px_6px_-1px_#0000001a,0_2px_4px_-2px_#0000001a]'

const ITEM_CLASS = [
  'mx-1 cursor-pointer gap-2 rounded-md py-1.5 text-base',
  'transition-colors focus:bg-primary/10 focus:text-foreground',
  'data-highlighted:bg-primary/10 data-highlighted:text-foreground',
].join(' ')

type IconBadgeProps = {
  color: string
  icon: LucideIcon
}

// O item do menu pinta todos os descendentes (inclusive os traços do svg) no hover;
// a variável com ! mantém a cor própria do ícone
function IconBadge({ color, icon: Icon }: IconBadgeProps) {
  const style = { backgroundColor: `${color}1f`, '--badge-color': color }

  return (
    <span
      className="flex size-[30px] items-center justify-center rounded-lg **:text-(--badge-color)!"
      style={style as CSSProperties}
    >
      <Icon className="size-4" />
    </span>
  )
}

type ExportMenuProps = {
  path: string
  params?: Record<string, unknown>
}

// Botão "Esporta" com menu PDF / Excel / Stampa, usado nas telas de listagem.
function ExportMenu({ path, params = {} }: ExportMenuProps) {
  const { t } = useTranslation('common')
  const { toastPromise } = useToast()
  const [isExporting, setIsExporting] = useState(false)

  function handleExport(format: ExportFormat) {
    setIsExporting(true)

    const promise = downloadExport(path, format, params).finally(() => {
      setIsExporting(false)
    })

    toastPromise(promise, {
      pending: t('exportMenu.pending'),
      success: t('exportMenu.success'),
      error: (error) => getErrorMessageFromRequest(error),
    })
  }

  function handlePrint() {
    setIsExporting(true)

    const promise = printExport(path, params).finally(() => {
      setIsExporting(false)
    })

    toastPromise(promise, {
      pending: t('exportMenu.printPending'),
      success: t('exportMenu.printSuccess'),
      error: (error) => getErrorMessageFromRequest(error),
    })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="outline"
            className={TRIGGER_CLASS}
            disabled={isExporting}
          >
            <DownloadIcon className={ICON_CLASS} />
            {t('exportMenu.label')}
            <ChevronDownIcon className={ICON_CLASS} />
          </Button>
        }
      />
      <DropdownMenuContent align="end" className={MENU_CLASS}>
        <DropdownMenuItem
          className={ITEM_CLASS}
          onClick={() => handleExport('pdf')}
        >
          <IconBadge color="#d32f2f" icon={FileTextIcon} />
          {t('exportMenu.pdf')}
        </DropdownMenuItem>
        <DropdownMenuItem
          className={ITEM_CLASS}
          onClick={() => handleExport('xlsx')}
        >
          <IconBadge color="#2e7d32" icon={SheetIcon} />
          {t('exportMenu.excel')}
        </DropdownMenuItem>
        <DropdownMenuItem className={ITEM_CLASS} onClick={handlePrint}>
          <IconBadge color="#1565c0" icon={PrinterIcon} />
          {t('exportMenu.print')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default ExportMenu
