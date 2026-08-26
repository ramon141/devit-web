import { useTranslation } from 'react-i18next'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import ComponentSection from '@/pages/Componentes/components/ComponentSection'

const properties = [
  { name: 'Villa in Parco Esclusivo', city: 'Massa Lubrense', price: '€ 835.000', status: 'disponibile' },
  { name: 'Incanto del XVII Secolo', city: 'Napoli', price: '€ 4.300.000', status: 'disponibile' },
  { name: 'Attico con Vista Mare', city: 'Sorrento', price: '€ 610.000', status: 'riservato' },
  { name: 'Casale in Collina', city: 'Positano', price: '€ 1.250.000', status: 'venduto' },
]

function statusVariantClass(status: string) {
  if (status === 'venduto') return 'bg-muted text-muted-foreground'
  if (status === 'riservato') return 'bg-accent text-primary'
  return 'bg-success/10 text-success'
}

function TableSection() {
  const { t } = useTranslation('componentes')

  const statusLabels: Record<string, string> = {
    disponibile: t('table.status.disponibile'),
    riservato: t('table.status.riservato'),
    venduto: t('table.status.venduto'),
  }

  return (
    <ComponentSection
      id="table"
      title={t('table.title')}
      description={t('table.description')}
    >
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('table.headerProperty')}</TableHead>
            <TableHead>{t('table.headerCity')}</TableHead>
            <TableHead>{t('table.headerPrice')}</TableHead>
            <TableHead className="text-right">{t('table.headerStatus')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {properties.map((property) => (
            <TableRow key={property.name}>
              <TableCell className="font-medium">{property.name}</TableCell>
              <TableCell className="text-muted-foreground">
                {property.city}
              </TableCell>
              <TableCell>{property.price}</TableCell>
              <TableCell className="text-right">
                <Badge className={statusVariantClass(property.status)}>
                  {statusLabels[property.status]}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ComponentSection>
  )
}

export default TableSection
