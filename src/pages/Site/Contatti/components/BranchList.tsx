import { Building2, Mail, MapPin, Phone } from 'lucide-react'
import { usePublicBranchControllerFind } from '@/api/generated/api'
import { Skeleton } from '@/components/ui/skeleton'
import type { BranchWithRelations } from '@/api/generated/models'

function formatAddress(branch: BranchWithRelations): string {
  const address = branch.address
  if (!address) return ''

  const street = [address.street, address.number].filter(Boolean).join(', ')
  const city = [address.postalCode, address.city].filter(Boolean).join(' ')

  return [street, city].filter(Boolean).join(' – ')
}

function BranchList() {
  const { data: branches, isLoading } = usePublicBranchControllerFind()

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 rounded-xl bg-card p-6 shadow-sm">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-24 w-full" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 rounded-xl bg-card p-6 shadow-sm">
      <h2 className="font-heading text-lg font-semibold">Le Nostre Agenzie</h2>

      {!branches?.length ? (
        <p className="text-sm text-muted-foreground">
          Nessuna agenzia disponibile al momento. Contattaci tramite il modulo qui accanto.
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {branches.map((branch) => (
            <div key={branch.id} className="flex flex-col gap-2 rounded-lg border border-border p-4">
              <p className="flex items-center gap-2 font-semibold">
                <Building2 className="size-4 text-primary" />
                {branch.name}
              </p>

              {formatAddress(branch) && (
                <p className="flex items-start gap-2 text-sm text-muted-foreground">
                  <MapPin className="mt-0.5 size-4 shrink-0" />
                  {formatAddress(branch)}
                </p>
              )}

              {branch.phone && (
                <a href={`tel:${branch.phone}`} className="flex items-center gap-2 text-sm hover:text-primary">
                  <Phone className="size-4" />
                  {branch.phone}
                </a>
              )}

              {branch.email && (
                <a href={`mailto:${branch.email}`} className="flex items-center gap-2 text-sm hover:text-primary">
                  <Mail className="size-4" />
                  {branch.email}
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default BranchList
