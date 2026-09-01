import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useTranslation } from 'react-i18next'
import { LayoutGridIcon, TableIcon } from 'lucide-react'
import AppLayout from '@/components/layout/AppLayout'
import ListToolbar from '@/components/ListToolbar'
import TablePagination from '@/components/TablePagination'
import { Button } from '@/components/ui/button'
import { usePropertyList } from '@/pages/Imoveis/hooks/usePropertyList'
import PropertyTable from '@/pages/Imoveis/components/PropertyTable'
import PropertyCard from '@/pages/Imoveis/components/PropertyCard'
import PropertyFilters from '@/pages/Imoveis/components/PropertyFilters'
import PropertyKindTabs from '@/pages/Imoveis/components/PropertyKindTabs'
import PropertyKindPickerModal from '@/pages/Imoveis/components/PropertyKindPickerModal'

function Imoveis() {
  const { t } = useTranslation('imoveis')
  const navigate = useNavigate()
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table')
  const [kindPickerOpen, setKindPickerOpen] = useState(false)
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
      title={t('list.pageTitle')}
      description={t('list.pageDescription')}
      breadcrumbItems={[{ label: t('list.breadcrumb') }]}
    >
      <ListToolbar
        search={search}
        onSearchChange={onSearchChange}
        searchPlaceholder={t('list.searchPlaceholder')}
        onNewClick={() => setKindPickerOpen(true)}
        newLabel={t('list.newLabel')}
      />

      <PropertyKindPickerModal
        open={kindPickerOpen}
        onOpenChange={setKindPickerOpen}
        onSelect={(categoryId) =>
          navigate(
            categoryId
              ? `/gestionale/proprieta/nuovo?categoryId=${categoryId}`
              : '/gestionale/proprieta/nuovo',
          )
        }
      />

      <PropertyKindTabs
        activeKind={filters.kind}
        onChange={(kind) => setFilters({ ...filters, kind })}
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
            <p className="col-span-full py-8 text-center text-muted-foreground">{t('list.emptyCards')}</p>
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
