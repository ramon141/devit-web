import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Checkbox } from '@/components/ui/checkbox'
import type { RentalContractWithRelations } from '@/api/generated/models'

type EligibleContractsTableProps = {
  contracts: RentalContractWithRelations[]
  isLoading: boolean
  selectedIds: string[]
  onToggle: (id: string) => void
}

function formatAmount(value: number) {
  return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(value)
}

function EligibleContractsTable({ contracts, isLoading, selectedIds, onToggle }: EligibleContractsTableProps) {
  return (
    <div className="overflow-hidden rounded-xl ring-1 ring-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-10" />
            <TableHead>Numero</TableHead>
            <TableHead>Immobile</TableHead>
            <TableHead>Inquilino</TableHead>
            <TableHead>Proprietario</TableHead>
            <TableHead>Affitto attuale</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!isLoading && contracts.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
                Nessun contratto attivo trovato.
              </TableCell>
            </TableRow>
          )}

          {contracts.map((contract) => (
            <TableRow key={contract.id}>
              <TableCell>
                <Checkbox
                  checked={!!contract.id && selectedIds.includes(contract.id)}
                  onCheckedChange={() => contract.id && onToggle(contract.id)}
                />
              </TableCell>
              <TableCell className="font-medium">{contract.number}</TableCell>
              <TableCell>{contract.property?.code ?? '—'}</TableCell>
              <TableCell>{contract.tenant?.name ?? '—'}</TableCell>
              <TableCell>{contract.owner?.name ?? '—'}</TableCell>
              <TableCell>{formatAmount(contract.rentAmount)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default EligibleContractsTable
