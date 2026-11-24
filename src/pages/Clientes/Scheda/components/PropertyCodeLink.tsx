import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import type { PropertyWithRelations } from '@/api/generated/models'

type PropertyCodeLinkProps = {
  property: PropertyWithRelations
}

// Código do imóvel: balão com os dados principais e link para o cadastro
function PropertyCodeLink({ property }: PropertyCodeLinkProps) {
  const { t } = useTranslation('clientes')
  const region = [property.address?.city, property.address?.region].filter(Boolean).join(' - ')

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Link to={`/proprieta/${property.id}`} className="text-sm underline-offset-2 hover:underline" />
        }
      >
        {property.code} · {property.title}
      </TooltipTrigger>
      <TooltipContent className="grid gap-0.5">
        <span>{t('propertyCodeLink.code', { value: property.code })}</span>
        <span>{t('propertyCodeLink.type', { value: property.category?.name ?? '—' })}</span>
        <span>{t('propertyCodeLink.region', { value: region || '—' })}</span>
      </TooltipContent>
    </Tooltip>
  )
}

export default PropertyCodeLink
