import { useTranslation } from 'react-i18next'
import dayjs from 'dayjs'
import { UserRoundIcon } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import type { PropertyWithRelations } from '@/api/generated/models'
import { getPurposeOptions, getStatusOptions } from '@/pages/Imoveis/schemas/propertySchema'
import { getOptionLabel } from '@/utils/getOptionLabel'

type PropertyCardHeaderProps = {
  property: PropertyWithRelations
}

function isNew(createdAt?: string) {
  return !!createdAt && dayjs().diff(dayjs(createdAt), 'day') <= 7
}

function PropertyCardHeader({ property }: PropertyCardHeaderProps) {
  const { t } = useTranslation('imoveis')

  return (
    <div className="flex flex-wrap items-center gap-2 border-b border-border bg-muted/40 px-3 py-2">
      <Badge className="rounded-sm uppercase">
        {getOptionLabel(getPurposeOptions(t), property.purpose)}
      </Badge>

      <p className="font-semibold">{t('card.reference', { code: property.code })}</p>

      {isNew(property.createdAt) && <Badge variant="secondary">{t('card.new')}</Badge>}

      <div className="ml-auto flex items-center gap-2">
        <Badge variant="outline">{getOptionLabel(getStatusOptions(t), property.status)}</Badge>

        <span className="flex items-center gap-1 text-sm text-muted-foreground">
          <UserRoundIcon className="size-4" />
          {property.owner?.name ?? '—'}
        </span>
      </div>
    </div>
  )
}

export default PropertyCardHeader
