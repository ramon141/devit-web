import { Command as CommandPrimitive } from 'cmdk'
import GlobalSearchPill from '@/components/layout/GlobalSearchPill'
import type { SearchRow } from '@/components/layout/searchTypes'

type GlobalSearchRowProps = {
  row: SearchRow
}

// Linha de resultado: ícone, texto e etiqueta à direita
function GlobalSearchRow({ row }: GlobalSearchRowProps) {
  return (
    <CommandPrimitive.Item
      value={row.id}
      onSelect={row.onSelect}
      className="mx-2 flex cursor-pointer items-center justify-between rounded-md px-4 py-[9.6px] outline-none transition-colors data-[selected=true]:bg-sidebar/10"
    >
      <div className="flex min-w-0 items-center gap-3">
        {row.icon && <div className="flex shrink-0 items-center text-sidebar">{row.icon}</div>}

        <div className="min-w-0">
          <p className="truncate text-[0.875rem] leading-[1.3] font-medium text-foreground">{row.label}</p>
          {row.sublabel && <p className="truncate text-[0.75rem] leading-[1.3] text-muted-foreground">{row.sublabel}</p>}
        </div>
      </div>

      {row.chip && <GlobalSearchPill>{row.chip}</GlobalSearchPill>}
    </CommandPrimitive.Item>
  )
}

export default GlobalSearchRow
