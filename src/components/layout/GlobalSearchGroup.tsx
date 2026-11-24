import { Command as CommandPrimitive } from 'cmdk'
import GlobalSearchRow from '@/components/layout/GlobalSearchRow'
import type { SearchGroup } from '@/components/layout/searchTypes'

type GlobalSearchGroupProps = {
  group: SearchGroup
  showCount: boolean
}

const HEADING_CLASS =
  'mb-2 **:[[cmdk-group-heading]]:px-6 **:[[cmdk-group-heading]]:pt-3 **:[[cmdk-group-heading]]:pb-1 **:[[cmdk-group-heading]]:text-[0.7rem] **:[[cmdk-group-heading]]:font-bold **:[[cmdk-group-heading]]:uppercase **:[[cmdk-group-heading]]:tracking-[0.08em] **:[[cmdk-group-heading]]:text-sidebar'

// Grupo de resultados com título em maiúsculas (e contagem nas buscas)
function GlobalSearchGroup({ group, showCount }: GlobalSearchGroupProps) {
  if (!group.items.length) return null

  const heading = showCount ? `${group.title} (${group.items.length})` : group.title

  return (
    <CommandPrimitive.Group heading={heading} className={HEADING_CLASS}>
      {group.items.map((row) => (
        <GlobalSearchRow key={row.id} row={row} />
      ))}
    </CommandPrimitive.Group>
  )
}

export default GlobalSearchGroup
