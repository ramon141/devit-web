import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { useCategoryKinds, type PropertyCategoryKind } from '@/pages/Imoveis/hooks/useCategoryKinds'
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
    <div className="mb-3 flex flex-wrap gap-1.5">
      <Button
        type="button"
        size="sm"
        variant={activeKind === '' ? 'secondary' : 'ghost'}
        onClick={() => onChange('')}
      >
        {t('kindTabs.all')}
      </Button>

      {kindsPresent.map((kind) => (
        <Button
          key={kind}
          type="button"
          size="sm"
          variant={activeKind === kind ? 'secondary' : 'ghost'}
          onClick={() => onChange(kind)}
        >
          {labels[kind]}
        </Button>
      ))}
    </div>
  )
}

export default PropertyKindTabs
