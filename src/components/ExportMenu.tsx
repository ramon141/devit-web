import { useState } from 'react'
import { DownloadIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { downloadExport, type ExportFormat } from '@/utils/downloadExport'
import { useToast } from '@/contexts/ToastContext'
import { getErrorMessageFromRequest } from '@/utils/getErrorMessageFromRequest'

type ExportMenuProps = {
  path: string
  params?: Record<string, unknown>
}

// Botão "Esporta" com menu Excel / PDF, usado nas telas de listagem.
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

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="outline" className="gap-1.5" disabled={isExporting}>
            <DownloadIcon className="size-4" />
            {t('exportMenu.label')}
          </Button>
        }
      />
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleExport('xlsx')}>
          {t('exportMenu.excel')}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport('pdf')}>
          {t('exportMenu.pdf')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default ExportMenu
