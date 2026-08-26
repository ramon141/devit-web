import dayjs from 'dayjs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import type { RentalContractWithRelations } from '@/api/generated/models'

type RegistrazioniTableProps = {
  contracts: RentalContractWithRelations[]
  isLoading: boolean
}

function RegistrazioniTable({ contracts, isLoading }: RegistrazioniTableProps) {
  return (
    <div className="overflow-hidden rounded-xl ring-1 ring-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Numero</TableHead>
            <TableHead>Scadenza</TableHead>
            <TableHead>Stato registrazione</TableHead>
            <TableHead>Periodo</TableHead>
            <TableHead>Immobile</TableHead>
            <TableHead>Inquilino</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!isLoading && contracts.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
                Nessun contratto da registrare o rinnovare.
              </TableCell>
            </TableRow>
          )}

          {contracts.map((contract) => (
            <TableRow key={contract.id}>
              <TableCell className="font-medium">{contract.number}</TableCell>
              <TableCell>
                {contract.renewalDueDate ? dayjs(contract.renewalDueDate).format('DD/MM/YYYY') : '—'}
              </TableCell>
              <TableCell>
                <Badge variant={contract.registeredAt ? 'secondary' : 'destructive'}>
                  {contract.registeredAt ? 'Registrato' : 'Da registrare'}
                </Badge>
              </TableCell>
              <TableCell>
                {dayjs(contract.startDate).format('DD/MM/YYYY')} –{' '}
                {contract.endDate ? dayjs(contract.endDate).format('DD/MM/YYYY') : '—'}
              </TableCell>
              <TableCell>{contract.property?.code ?? '—'}</TableCell>
              <TableCell>{contract.tenant?.name ?? '—'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default RegistrazioniTable
