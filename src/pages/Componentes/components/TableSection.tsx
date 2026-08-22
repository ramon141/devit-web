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
  { name: 'Villa in Parco Esclusivo', city: 'Massa Lubrense', price: '€ 835.000', status: 'Disponibile' },
  { name: 'Incanto del XVII Secolo', city: 'Napoli', price: '€ 4.300.000', status: 'Disponibile' },
  { name: 'Attico con Vista Mare', city: 'Sorrento', price: '€ 610.000', status: 'Riservato' },
  { name: 'Casale in Collina', city: 'Positano', price: '€ 1.250.000', status: 'Venduto' },
]

function statusVariantClass(status: string) {
  if (status === 'Venduto') return 'bg-muted text-muted-foreground'
  if (status === 'Riservato') return 'bg-accent text-primary'
  return 'bg-success/10 text-success'
}

function TableSection() {
  return (
    <ComponentSection
      id="table"
      title="Table"
      description="Elenco tabellare, qui applicato agli immobili del sistema."
    >
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Immobile</TableHead>
            <TableHead>Città</TableHead>
            <TableHead>Prezzo</TableHead>
            <TableHead className="text-right">Stato</TableHead>
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
                  {property.status}
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
