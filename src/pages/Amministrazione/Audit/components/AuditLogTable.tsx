import dayjs from 'dayjs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import type { AuditLog } from '@/api/generated/models'

const actionLabels: Record<string, string> = {
  create: 'Creazione',
  update: 'Aggiornamento',
  delete: 'Eliminazione',
  login: 'Accesso',
  logout: 'Uscita',
  export: 'Esportazione',
}

type AuditLogTableProps = {
  logs: AuditLog[]
  isLoading: boolean
}

function AuditLogTable({ logs, isLoading }: AuditLogTableProps) {
  return (
    <div className="overflow-hidden rounded-xl ring-1 ring-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Azione</TableHead>
            <TableHead>Entità</TableHead>
            <TableHead>ID entità</TableHead>
            <TableHead>Utente</TableHead>
            <TableHead>Data</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!isLoading && logs.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                Nessun log trovato.
              </TableCell>
            </TableRow>
          )}

          {logs.map((log) => (
            <TableRow key={log.id}>
              <TableCell>
                <Badge variant="secondary">{actionLabels[log.action] ?? log.action}</Badge>
              </TableCell>
              <TableCell className="font-medium">{log.entity}</TableCell>
              <TableCell className="max-w-40 truncate text-xs text-muted-foreground">
                {log.entityId ?? '—'}
              </TableCell>
              <TableCell>{log.userId ?? '—'}</TableCell>
              <TableCell>{dayjs(log.createdAt).format('DD/MM/YYYY HH:mm')}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default AuditLogTable
