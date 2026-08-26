import { useState } from 'react'
import { useNavigate } from 'react-router'
import { LayoutGridIcon, TableIcon } from 'lucide-react'
import AppLayout from '@/components/layout/AppLayout'
import ListToolbar from '@/components/ListToolbar'
import TablePagination from '@/components/TablePagination'
import { Button } from '@/components/ui/button'
import { usePropertyList } from '@/pages/Imoveis/hooks/usePropertyList'
import PropertyTable from '@/pages/Imoveis/components/PropertyTable'
import PropertyCard from '@/pages/Imoveis/components/PropertyCard'
import PropertyFilters from '@/pages/Imoveis/components/PropertyFilters'

function Imoveis() {
  const navigate = useNavigate()
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table')
  const {
    properties,
    isLoading,
    totalItems,
    pageSize,
    page,
    setPage,
    search,
    onSearchChange,
    filters,
    setFilters,
  } = usePropertyList()

  return (
    <AppLayout
      title="Immobili"
      description="Gestisci il portafoglio immobiliare dell'agenzia"
      breadcrumbItems={[{ label: 'Immobili' }]}
    >
      <ListToolbar
        search={search}
        onSearchChange={onSearchChange}
        searchPlaceholder="Cerca per codice, titolo o descrizione..."
        onNewClick={() => navigate('/proprieta/nuovo')}
        newLabel="Nuovo immobile"
      />

      <PropertyFilters filters={filters} onChange={setFilters} />

      <div className="mb-3 flex justify-end gap-1">
        <Button
          variant={viewMode === 'table' ? 'secondary' : 'ghost'}
          size="icon-sm"
          onClick={() => setViewMode('table')}
        >
          <TableIcon className="size-4" />
        </Button>
        <Button
          variant={viewMode === 'cards' ? 'secondary' : 'ghost'}
          size="icon-sm"
          onClick={() => setViewMode('cards')}
        >
          <LayoutGridIcon className="size-4" />
        </Button>
      </div>

      {viewMode === 'table' ? (
        <PropertyTable properties={properties} isLoading={isLoading} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {!isLoading && properties.length === 0 && (
            <p className="col-span-full py-8 text-center text-muted-foreground">Nessun immobile trovato.</p>
          )}
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      )}

      <TablePagination
        page={page}
        pageSize={pageSize}
        totalItems={totalItems}
        onPageChange={setPage}
      />
    </AppLayout>
  )
}

export default Imoveis
