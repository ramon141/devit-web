import { LayoutGridIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { useCategoryKinds, type PropertyCategoryKind } from '@/pages/Imoveis/hooks/useCategoryKinds'
import { categoryKindIcons } from '@/pages/Imoveis/components/categoryKindIcons'
import { getCategoryKindOptions } from '@/pages/Imoveis/schemas/propertySchema'

type PropertyKindTabsProps = {
  activeKind: PropertyCategoryKind | ''
  onChange: (kind: PropertyCategoryKind | '') => void
}

// Só mostra abas dos `kind` que de fato têm categoria cadastrada — sem dado fake.
function PropertyKindTabs({ activeKind, onChange }: PropertyKindTabsProps) {
  const { t } = useTranslation('imoveis')
  const { kindsPresent } = useCategoryKinds()
  const labels = Object.fromEntries(getCategoryKindOptions(t).map((option) => [option.value, option.label]))

  if (kindsPresent.length === 0) return null

  return (
    <div id="proprieta-kind-tabs" className="mb-3 flex flex-wrap gap-1.5">
      <Button
        type="button"
        size="sm"
        variant={activeKind === '' ? 'secondary' : 'ghost'}
        onClick={() => onChange('')}
      >
        <LayoutGridIcon data-icon="inline-start" />
        {t('kindTabs.all')}
      </Button>

      {kindsPresent.map((kind) => {
        const KindIcon = categoryKindIcons[kind]

        return (
          <Button
            key={kind}
            type="button"
            size="sm"
            variant={activeKind === kind ? 'secondary' : 'ghost'}
            onClick={() => onChange(kind)}
          >
            <KindIcon data-icon="inline-start" />
            {labels[kind]}
          </Button>
        )
      })}
    </div>
  )
}

export default PropertyKindTabs
