import { formatCurrency } from '@/pages/Site/PropertyDetail/utils/formatters'
import type { PublicPropertyControllerFindById200 } from '@/api/generated/models'

type PropertyDetailsGridProps = {
  property: PublicPropertyControllerFindById200
}

type DetailRow = {
  label: string
  value: string | null
}

function buildRows(property: PublicPropertyControllerFindById200): DetailRow[] {
  const isRent = property.purpose === 'rent'

  return [
    { label: 'ID Proprietà', value: property.code ?? null },
    { label: 'Prezzo', value: formatCurrency(property.price) },
    { label: 'Dimensione', value: property.areaSqm ? `${property.areaSqm} m²` : null },
    { label: 'Camere', value: property.bedrooms?.toString() ?? null },
    { label: 'Bagni', value: property.bathrooms?.toString() ?? null },
    { label: 'Tipo di proprietà', value: property.category?.name ?? null },
    { label: 'Stato', value: isRent ? 'Affitto' : 'Vendita' },
  ]
}

function PropertyDetailsGrid({ property }: PropertyDetailsGridProps) {
  const rows = buildRows(property).filter((row) => row.value !== null)

  return (
    <div>
      <h2 className="font-heading text-lg font-semibold">Dettagli</h2>

      <dl className="mt-2 grid grid-cols-1 gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
        {rows.map((row) => (
          <div key={row.label} className="flex justify-between border-b py-1 sm:justify-start sm:gap-2">
            <dt className="text-muted-foreground">{row.label}</dt>
            <dd className="font-medium">{row.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

export default PropertyDetailsGrid
