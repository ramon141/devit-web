import { useNavigate } from 'react-router'
import AppLayout from '@/components/layout/AppLayout'
import ListToolbar from '@/components/ListToolbar'
import TablePagination from '@/components/TablePagination'
import { usePropertyList } from '@/pages/Imoveis/hooks/usePropertyList'
import PropertyTable from '@/pages/Imoveis/components/PropertyTable'
import PropertyFilters from '@/pages/Imoveis/components/PropertyFilters'

function Imoveis() {
  const navigate = useNavigate()
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
        searchPlaceholder="Cerca per codice o titolo..."
        onNewClick={() => navigate('/proprieta/nuovo')}
        newLabel="Nuovo immobile"
      />

      <PropertyFilters filters={filters} onChange={setFilters} />

      <PropertyTable properties={properties} isLoading={isLoading} />

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
