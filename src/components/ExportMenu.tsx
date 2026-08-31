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

type ExportMenuProps = {
  path: string
  params?: Record<string, unknown>
}

// Botão "Esporta" com menu Excel / PDF, usado nas telas de listagem.
function ExportMenu({ path, params = {} }: ExportMenuProps) {
  const { t } = useTranslation('common')
  const [isExporting, setIsExporting] = useState(false)

  async function handleExport(format: ExportFormat) {
    setIsExporting(true)

    try {
      await downloadExport(path, format, params)
    } finally {
      setIsExporting(false)
    }
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
