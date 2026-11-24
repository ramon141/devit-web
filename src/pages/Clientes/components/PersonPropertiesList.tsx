import { usePropertyList } from '@/pages/Imoveis/hooks/usePropertyList'
import PropertyTable from '@/pages/Imoveis/components/PropertyTable'
import TablePagination from '@/components/TablePagination'

type PersonPropertiesListProps = {
  personId: string
}

// Mesma lista da tela de imóveis, já filtrada pelo proprietário
function PersonPropertiesList({ personId }: PersonPropertiesListProps) {
  const list = usePropertyList({ initialFilters: { ownerId: personId } })

  return (
    <>
      <PropertyTable properties={list.properties} isLoading={list.isLoading} />

      <TablePagination
        page={list.page}
        pageSize={list.pageSize}
        totalItems={list.totalItems}
        onPageChange={list.setPage}
      />
    </>
  )
}

export default PersonPropertiesList
