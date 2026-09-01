import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'

export type CheckboxListItem = {
  id: string
  label: string
  sublabel?: string
}

type CheckboxListPickerProps = {
  items: CheckboxListItem[]
  selectedIds: string[]
  onToggle: (id: string) => void
  search: string
  onSearchChange: (value: string) => void
  searchPlaceholder: string
  emptyMessage: string
}

// Picker genérico com checkbox + busca, usado pra destinatários e imóveis
// da campanha de marketing. Sem paginação server-side — lista curta o bastante
// pra caber em memória (limit já aplicado na query que alimenta `items`).
function CheckboxListPicker({
  items,
  selectedIds,
  onToggle,
  search,
  onSearchChange,
  searchPlaceholder,
  emptyMessage,
}: CheckboxListPickerProps) {
  return (
    <div className="grid gap-2">
      <Input value={search} onChange={(event) => onSearchChange(event.target.value)} placeholder={searchPlaceholder} />

      <div className="grid max-h-56 gap-1 overflow-y-auto rounded-md border p-2">
        {items.length === 0 && <p className="py-4 text-center text-sm text-muted-foreground">{emptyMessage}</p>}

        {items.map((item) => (
          <Label key={item.id} className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-accent">
            <Checkbox checked={selectedIds.includes(item.id)} onCheckedChange={() => onToggle(item.id)} />
            <span className="min-w-0 flex-1 truncate">{item.label}</span>
            {item.sublabel && <span className="shrink-0 text-xs text-muted-foreground">{item.sublabel}</span>}
          </Label>
        ))}
      </div>
    </div>
  )
}

export default CheckboxListPicker
