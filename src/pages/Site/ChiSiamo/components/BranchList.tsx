import { useTranslation } from 'react-i18next'
import { usePublicBranchControllerFind } from '@/api/generated/api'
import type { BranchWithRelations } from '@/api/generated/models'

function formatAddress(branch: BranchWithRelations): string {
  const address = branch.address
  if (!address) return ''

  const street = [address.street, address.number].filter(Boolean).join(', ')
  const city = [address.postalCode, address.city].filter(Boolean).join(' ')

  return [street, city].filter(Boolean).join(' – ')
}

function BranchList() {
  const { t } = useTranslation('site')
  const { data: branches, isLoading } = usePublicBranchControllerFind()

  if (isLoading) return null
  if (!branches?.length) return null

  return (
    <div className="mt-10">
      <h2 className="text-lg font-semibold">{t('chiSiamoBranchList.title')}</h2>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {branches.map((branch) => (
          <div key={branch.id} className="rounded-lg border p-4">
            <p className="font-medium">{branch.name}</p>

            {formatAddress(branch) && (
              <p className="mt-1 text-sm text-muted-foreground">{formatAddress(branch)}</p>
            )}

            {branch.phone && (
              <a href={`tel:${branch.phone}`} className="mt-1 block text-sm underline">
                {branch.phone}
              </a>
            )}

            {branch.email && (
              <a href={`mailto:${branch.email}`} className="block text-sm underline">
                {branch.email}
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default BranchList
